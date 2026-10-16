# Varelyx Deployment Status

## October 16, 2026: local App Check setup

A loopback-only development server now configures a private App Check device token before Firebase initializes. Local startup configuration is verified, but token registration returned HTTP 403 for Chhay's account. Live local Gemini and Firebase saving remain pending project-owner registration/access. See `docs/LOCAL_DEVELOPMENT.md`. Production enforcement and deployment are unchanged.

## October 16, 2026: candidate fixes awaiting review

Submission reliability fixes are prepared on `fix/submission-reliability`. They have local unit, Python/OR-Tools, and isolated browser verification; they have **not** been deployed or verified against live Gemini/Firebase. The production evidence below is historical. See `docs/SUBMISSION_FIXES_2026-10-16.md` for scope, limitations and the joint release gate.


Last updated: 2026-09-30

## Official production

- Firebase project: `varelyx-ai-builder-cup`
- Official Hosting URL: https://varelyx-ai-builder-cup.web.app
- Final merged main commit verified: `cedcd678eb8a3caeb043aeb8a9d27d8e95ab041e`
- Realtime Database rules: deployed
- Firebase Anonymous Authentication: enabled
- Firebase AI Logic / Gemini: enabled
- Firebase App Check: enabled with reCAPTCHA Enterprise
- Production release controller: `varelyx-firebase-release-controller`

## Final technical release gate

Verified from the merged `main` commit through the Render release controller:

- Node/source verification: **85/85 passed**
- Python reference verification: **13/13 passed**
- Firebase Hosting deploy: **passed**
- Official host served the latest Decision Command Center
- App Check CI registration: **passed**
- Live production Playwright QA: **7 passed, 2 intentionally skipped, 0 failed**
- Release log ended with **FIREBASE RELEASE VERIFIED**

The live judge flow proved:
1. Firebase server read verified.
2. Real Gemini analysis -> **LIVE GEMINI VERIFIED**.
3. Missing evidence -> **HOLD**.
4. Human-reviewed supplier capacity resolves the critical unknown.
5. Balanced candidate -> **PASS**.
6. Unsafe candidate -> **BLOCK**.
7. Balanced candidate -> **PASS** again.
8. Human approval creates sandbox-only actions.
9. Firebase write/read-back -> **FIREBASE SAVE VERIFIED**.
10. Reload restores server state/actions.

Negative persistence/transport tests cover permission denied, network failure, read-back mismatch, concurrent revision conflict, timeout, missing ETag and anonymous UID isolation.

## Render service interpretation

Authoritative release gate:
- `varelyx-firebase-release-controller`

Supporting preview gates:
- `varelyx-preview-qa`
- `varelyx-browser-qa`

Legacy services `varelyx-firebase-live-qa` and `varelyx-firebase-postrelease-qa` may still display historical failed-deploy badges. They are not the authoritative final release gate and should not be used to judge current production health.

## Technical status

**Coding/release phase: complete.**

PR #1 was merged to `main`; the merged main commit was deployed to official Firebase and the final production verification gate passed.

## Remaining work is submission-side only

- final judge-flow browser walkthrough / presentation QA
- final <=3-minute public demo video
- final proposal/PDF claims reconciled to observed behavior
- public repo/demo links as required by the competition
- eligible 2-4 person team and profile/activity/eligibility checks
- logged-out testing of every submitted link
- portal fields, final submission and saved receipt/confirmation

Do not claim the competition submission itself is complete until those submission gates are closed.
