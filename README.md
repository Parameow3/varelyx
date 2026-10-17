# Varelyx

**Know what matters. Ask what is missing. Prove what works. Then act.**

Varelyx is an evidence-driven retail continuity prototype for the Google Cloud AI Builder Cup 2026, Retail & Commerce theme.

[Open the Firebase prototype](https://varelyx-ai-builder-cup.web.app) · [Judge walkthrough](docs/JUDGE_QUICKSTART.md) · [Actual architecture](docs/ARCHITECTURE.md) · [Submission checklist](docs/SUBMISSION_READINESS_2026-10-17.md)

## Try the decision loop

Use the supplied synthetic supplier message, analyze it with live Gemini, then review the evidence and confirm **120 cases** of Thursday capacity. Compare plans, prove the balanced candidate (**PASS**), test the unsafe proposal (**BLOCK**, approval disabled), and prove balanced again (**PASS**). Explicitly approve the sandbox records, reload, and inspect the saved decision and audit.

The controlled balanced plan uses **90 transfer + 120 Supplier B + 60 emergency cases**, **BDT 186,000**, and **30 expected stockout cases** across four fixed demand scenarios, compared with a 290-case unmitigated baseline. These are simulated quantities, not observed retail outcomes. No real order is sent.

The current UI review candidate is PR #7; the public host can lag the reviewed source. Run `npm run verify:release` from the candidate checkout before asserting that it has been released. A static match is separate from live AI/save/reload verification.

The interface and demo samples support English, Bangla and Khmer. USD/BDT/KHR are display preferences; canonical proof and saved money remain BDT. Sessions are anonymous and browser-private, so a shared link does not share a decision. Proof checks run in the client; the SHA-256 receipt is not a server-authoritative procurement approval.


## Competition deployment path

The final no-card competition path is:

**Firebase Hosting (Spark) -> Firebase AI Logic -> Gemini Developer API -> Anonymous Firebase Auth -> Realtime Database**

No Vercel. No Supabase. No Blaze upgrade is required for the primary submission path.

The public web prototype uses Gemini to interpret messy Bangla/Banglish/English disruption evidence. Deterministic sensitivity analysis selects a focused evidence question. Operational quantities are computed by deterministic constrained logic, not invented by the model. An independent Proof Gate can HOLD or BLOCK unsafe plans before human approval.

## Current working flow

1. Analyze a disruption message with Gemini.
2. Separate Known / Estimated / Unknown evidence.
3. Surface the highest-value missing fact.
4. Confirm Supplier B Thursday capacity.
5. Recompute current / cheapest / balanced / maximum-availability plans.
6. Prove the balanced plan -> PASS.
7. Try an intentionally unsafe proposal -> BLOCK.
8. Prove the balanced plan again -> PASS, then approve the verified plan.
9. Persist action objects in Firebase Realtime Database.
10. Compare the response in Shadow Mode.

All impact values in the demo are controlled-simulation outputs, not observed retailer results.

## Google/Firebase stack

- Firebase Hosting — public competition web app.
- Firebase AI Logic — client integration to Gemini.
- Gemini Developer API — live generative evidence understanding.
- Firebase App Check + reCAPTCHA Enterprise — abuse protection.
- Firebase Anonymous Authentication — isolated judge/browser demo sessions.
- Firebase Realtime Database — persisted session/action state.
- Deterministic constrained solver + Proof Gate — quantities and hard-rule verification.

The repository also keeps the earlier FastAPI / OR-Tools backend prototype and Cloud Run Docker path as an optional engineering reference. It is **not required** for the no-card competition deployment.

## Firebase project

Project ID:

    varelyx-ai-builder-cup

Official public prototype URL:

    https://varelyx-ai-builder-cup.web.app

## Deploy on Windows

The project is already bound in `.firebaserc`.

Double-click:

    deploy-firebase.cmd

The helper uses `npx firebase-tools`, opens Firebase login when needed, and deploys Hosting plus Realtime Database rules.

Manual equivalent:

    npx --yes firebase-tools@latest login
    npx --yes firebase-tools@latest deploy --only hosting,database

Do **not** run `firebase init`; the repository already contains the required Firebase configuration.

## Required production verification

After deployment, verify all of these on the public URL:

- Header reports Firebase connected / Gemini ready.
- Analyze disruption returns **LIVE GEMINI VERIFIED**.
- Supplier capacity 120 resolves the critical unknown.
- Balanced plan -> PASS.
- Unsafe proposal -> BLOCK.
- Prove balanced again -> PASS, then approval creates sandbox action objects.
- Refresh preserves the session state/actions.
- Simulation values remain explicitly labelled.

See:
- `COMPETITION_RULES_LOCK.md`
- `docs/FIREBASE_NO_CARD_DEPLOY.md`
- `docs/SUBMISSION_READY.md`
- `DEPLOYMENT_STATUS.md`


## Local development

Run `npm run dev` and open http://127.0.0.1:4174. Register the private device token with Firebase App Check once, as described in [Local development](docs/LOCAL_DEVELOPMENT.md). Live AI and Firebase persistence still require project access; this server does not disable App Check.

## Cloud development

Varelyx can be developed without a local PC by opening this repository in GitHub Codespaces. The devcontainer pins Node 22 and Python 3.12, installs Python and Node dependencies, and forwards port 4173 for local preview.

Core verification commands:

```bash
npm run check:js
npm run test:node
PYTHONPATH=. pytest -q
npx playwright install --with-deps chromium
PORT=4173 STATIC_ONLY=1 node scripts/local-server.mjs
```

In a second terminal:

```bash
BASE_URL=http://127.0.0.1:4173 npm run test:e2e
npx --yes firebase-tools@latest projects:list
```

Do not store Firebase CLI login tokens, service-account JSON, or personal Google credentials in the repository. GitHub Actions preview deployment is designed to use short-lived Google Workload Identity Federation credentials.


## Controlled evaluation and release verification

```bash
npm run evaluate:demo -- --summary
npm run verify:release
```

The evaluation checks 40 synthetic capacity/route scenarios, 160 generated plans, eight unsafe proposals and three HOLD cases. It supplies extraction fixtures directly and is not a Gemini accuracy benchmark or a customer-impact study. [Evidence and scope](docs/DATA_AND_EVALUATION.md).

The release verifier compares the root document and every deployable file with this checkout. It is read-only and cannot establish App Check, AI, database or portal readiness by itself. [Release instructions and remaining submission items](docs/SUBMISSION_READINESS_2026-10-17.md).
