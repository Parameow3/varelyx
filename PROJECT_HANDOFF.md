# Varelyx - Project Handoff / Single Source of Truth

## October 17, 2026: local candidate live-service verification passed

The project owner registered the private local App Check token. The candidate based on `2499f48`, served locally against real Gemini/Firebase, passed HOLD → review → PASS → BLOCK (approval disabled) → PASS → human approval → verified save → reload. Exact exported state, capacity 120, receipt, five sandbox actions, audit and proof history matched after reload. See `docs/LIVE_QA_2026-10-17.md` for fresh evidence and exports. PR #7 awaits owner review; no merge or production deployment was performed. Earlier registration/live-pending notes below are historical.

## October 17, 2026: UI/UX and operator workflow candidate

The decision workspace now has clearer current-step navigation, in-app evidence/approval dialogs, readable retail action records, and saved PASS/BLOCK history. Local fixture-based verification is documented in `docs/UIUX_REVIEW_2026-10-17.md`. Live Firebase/Gemini verification and production release remain pending; the older production evidence below is historical.


## October 16, 2026: candidate fixes awaiting review

Submission reliability fixes are prepared on `fix/submission-reliability`. They have local unit, Python/OR-Tools, and isolated browser verification; they have **not** been deployed or verified against live Gemini/Firebase. The production evidence below is historical. See `docs/SUBMISSION_FIXES_2026-10-16.md` for scope, limitations and the joint release gate.


Last updated: 2026-09-30
Competition: Google Cloud AI Builder Cup 2026, powered by Hack2skill
Theme: Retail & Commerce - Intelligent Customer and Business Experiences
Official production: https://varelyx-ai-builder-cup.web.app
Firebase project: `varelyx-ai-builder-cup`

## Current state

The technical/coding release phase is complete.

PR #1, **Fix Firebase persistence verification, evidence-driven planning and Proof Gate reliability**, was merged to `main` as commit `cedcd678eb8a3caeb043aeb8a9d27d8e95ab041e`.

The merged main application was deployed to official Firebase Hosting and verified through the production release controller.

## Verified production evidence

Release controller: `varelyx-firebase-release-controller`

Observed final gate:
- Node: **85/85 passed**
- Python: **13/13 passed**
- Firebase Hosting deploy: passed
- official host served the latest Decision Command Center
- private CI App Check debug-token registration: passed
- live production Playwright: **7 passed, 2 intentionally skipped, 0 failed**
- terminal release marker: **FIREBASE RELEASE VERIFIED**

Verified live flow:
- Firebase server read
- real Gemini -> **LIVE GEMINI VERIFIED**
- missing evidence -> HOLD
- human-reviewed capacity -> DECISION READY
- balanced candidate -> PASS
- unsafe candidate -> BLOCK
- balanced candidate -> PASS
- human authorization
- sandbox-only action persistence
- **FIREBASE SAVE VERIFIED**
- reload -> server state/actions restored

Negative transport/persistence coverage includes permission denied, network failure, read-back mismatch, concurrent revision conflict, timeout, missing ETag and anonymous-user UID isolation.

## Product boundary

Varelyx remains a controlled simulation. AI interprets evidence and proposes; deterministic logic verifies hard constraints; humans authorize; stored actions are sandbox-only. Do not claim real purchasing, real customers, pilots, revenue or observed business impact without external evidence.

## Render infrastructure

Authoritative final release service:
- `varelyx-firebase-release-controller`

Supporting preview/browser services:
- `varelyx-preview-qa`
- `varelyx-browser-qa`

Historical services `varelyx-firebase-live-qa` and `varelyx-firebase-postrelease-qa` can show old failed badges. They are legacy/non-authoritative and do not represent current production health.

## Coding/release status

No new product feature work is required before submission unless submission QA exposes a real defect.

The release branch has been reconciled with main history, PR #1 is merged, and the official Firebase production path has passed the live gate.

## Remaining work: submission phase only

1. Final judge browser walkthrough and presentation QA.
2. Record/publish a public demo video within the competition time limit.
3. Reconcile the proposal/PDF to only claims supported by the verified production behavior.
4. Confirm required repository/demo visibility and public links.
5. Confirm eligible 2-4 person team, profiles, activity/journal and competition eligibility.
6. Test all submission links while logged out.
7. Fill final portal fields, submit before the deadline, and save the receipt/confirmation.

Do not call the competition submission 100% complete until those gates are closed.

## Competition timing note

Before final submission, re-check the official AI Builder Cup site/portal for current deadlines and requirements. Where public pages conflict, use the controlling official terms or organizer clarification.

## Stable production rule

After submission preparation begins, avoid nonessential product changes. Any code change after this point must repeat the production release gate before it is treated as submission-safe.
