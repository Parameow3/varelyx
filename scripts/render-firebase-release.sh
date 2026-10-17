#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${FIREBASE_PROJECT_ID:-varelyx-ai-builder-cup}"
PRODUCTION_URL="${PRODUCTION_URL:-https://varelyx-ai-builder-cup.web.app}"
FIREBASE_APP_ID="${FIREBASE_APP_ID:-1:32966208347:web:1bef3397bac296973b087e}"
CREDENTIAL_JSON="${GCP_SERVICE_ACCOUNT_JSON:-}"

if [ -z "$CREDENTIAL_JSON" ]; then
  echo "GCP_SERVICE_ACCOUNT_JSON is not configured; refusing unauthenticated Firebase deploy." >&2
  exit 78
fi

cleanup() {
  rm -f /tmp/varelyx-gcp-key.json /tmp/appcheck-debug-registration.json
}
trap cleanup EXIT

printf '%s' "$CREDENTIAL_JSON" > /tmp/varelyx-gcp-key.json
chmod 600 /tmp/varelyx-gcp-key.json
export GOOGLE_APPLICATION_CREDENTIALS=/tmp/varelyx-gcp-key.json

echo "=== VERIFY SOURCE ==="
npm install --ignore-scripts --no-audit --no-fund
npm run check:js
npm run test:node

if command -v python3 >/dev/null 2>&1; then
  python3 -m pip install -r requirements.txt >/dev/null
  PYTHONPATH=. python3 -m pytest -q
elif command -v python >/dev/null 2>&1; then
  python -m pip install -r requirements.txt >/dev/null
  PYTHONPATH=. python -m pytest -q
else
  echo "Python runtime unavailable on Render; skipping Python reference tests in this controller." >&2
fi

echo "=== DEPLOY FIREBASE HOSTING ==="
npx --yes firebase-tools@latest deploy \
  --only hosting \
  --project "$PROJECT_ID" \
  --non-interactive

echo "=== WAIT FOR OFFICIAL HOST TO SERVE LATEST UI ==="
ready=0
for attempt in $(seq 1 24); do
  if node scripts/verify-public-release.mjs --url "$PRODUCTION_URL" > /tmp/varelyx-public-release.json; then
    ready=1
    echo "Official Firebase host exactly matches every reviewed public asset."
    break
  fi
  echo "Attempt $attempt/24: waiting for Firebase Hosting propagation..."
  sleep 5
done
if [ "$ready" -ne 1 ]; then
  echo "Official Firebase host did not match the reviewed public assets after deploy." >&2
  cat /tmp/varelyx-public-release.json
  exit 1
fi

echo "=== REGISTER PRIVATE CI APP CHECK TOKEN ==="
DEBUG_TOKEN="$(node -e "process.stdout.write(require('node:crypto').randomUUID())")"
set +e
npx --yes firebase-tools@latest appcheck:debugtokens:create "$DEBUG_TOKEN" \
  --app "$FIREBASE_APP_ID" \
  --display-name "Render Release QA" \
  --force \
  --project "$PROJECT_ID" \
  --non-interactive \
  --json > /tmp/appcheck-debug-registration.json 2>&1
APP_CHECK_STATUS=$?
set -e
if [ "$APP_CHECK_STATUS" -ne 0 ]; then
  echo "App Check debug-token registration failed."
  python3 - <<'PY'
import json
from pathlib import Path
p=Path('/tmp/appcheck-debug-registration.json')
text=p.read_text(errors='replace') if p.exists() else ''
try:
    data=json.loads(text)
    err=data.get('error', data)
    if isinstance(err, dict):
        print('code:', err.get('status') or err.get('code') or 'unknown')
        print('message:', err.get('message') or 'unknown')
    else:
        print(str(err)[:1200])
except Exception:
    safe='\n'.join(line for line in text.splitlines() if 'Token:' not in line and 'debugToken' not in line)
    print(safe[:1200])
PY
  exit "$APP_CHECK_STATUS"
fi
export FIREBASE_APPCHECK_DEBUG_TOKEN="$DEBUG_TOKEN"

echo "=== INSTALL BROWSER ==="
npx playwright install chromium

echo "=== LIVE PRODUCTION QA ==="
LIVE_JUDGE_FLOW=1 \
EVIDENCE_CAPTURE=1 \
BASE_URL="$PRODUCTION_URL" \
npm run test:e2e -- --workers=1

echo "=== SUCCESS: FIREBASE RELEASE VERIFIED ==="
echo "Project: $PROJECT_ID"
echo "Production: $PRODUCTION_URL"
