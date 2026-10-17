# Varelyx Deployment Status

## October 17, 2026: submission-first handoff

Saidur owns final video/deck and requested submission focus. Current readiness is in `docs/SUBMISSION_READINESS_2026-10-17.md`: public source confirmed, judge guide/accurate architecture/description prepared, stale architecture/benchmark claims corrected, official rules rechecked, controlled evaluation added to CI, and the release controller now requires exact reviewed-asset matching. All 134 Node, 13 Python and 72 browser cases passed (8 existing gated skips), plus a fresh 15.0-second real Gemini/Firebase full flow.

**Release is pending:** current public Hosting differs in 14/18 assets; normal-browser App Check and live AI passed, while headless attestation was denied. This Firebase identity receives Hosting HTTP 403. PR #7 still needs owner review/release and final production QA. After loading, the actual form and template are accessible: video 3–4 minutes, PDF up to 5 MB, description up to 1024 characters. The initial empty-round message was transient. See `docs/SUBMISSION_FORM_VALUES.md`. Final public video/deck and portal acceptance remain pending. Earlier dated notes below are historical snapshots.

No new product features, merge/deploy, security relaxation, organizer/team message or final submission was performed. Central portfolio/Linear synchronization remains owner-side pending (standard HTTP 404).


## October 17, 2026: mobile help race repaired

Reproduced a queued-scroll dismissal after focus/tap. Help now repositions on scroll/resize; mobile coverage uses touch emulation and checks scroll/resize persistence and containment. Syntax, 128 Node, 13 Python, 72 browser cases (8 existing gated skips), and a fresh 14.4-second real-service full flow passed. See `docs/MOBILE_HELP_QA_2026-10-17.md`. PR #7 commit `13cf08be14daf9f1451a62508424a575b99f7224` passed all three remote checks (web-contracts, python-reference, browser-smoke) in [run 39010685250](https://github.com/Saidur-droid/varelyx/actions/runs/39010685250); previous failure notes below describe the prior candidate. No merge/release. Central portfolio/Linear tracking remains owner-side pending (standard HTTP 404).

## October 17, 2026: three-minute local review demo

Prepared timed English narration/captions and recorded a fresh real-service full flow: live Gemini, capacity review, PASS/BLOCK/PASS, explicit sandbox approval, five saved actions, revision-7 read-back, exact reload restore and root-link resume. Video export/review evidence is tracked in `docs/DEMO_REVIEW_2026-10-17.md`. Latest UI is still local/pending owner release; shared decisions remain deferred.

PR #7 is published. Remote GitHub run 39009548089 passed web contracts/Python but failed one mobile context-help test; it remains pending investigation despite earlier local passes. Do not treat CI as all green or release the candidate without resolving/reviewing this result. Central portfolio/Linear tracking remains owner-side pending (standard repository HTTP 404).


## October 17, 2026: final compact UI review candidate

The light compact workspace, English/Bangla/Khmer copy, USD/BDT/KHR display and start/resume guidance are prepared for PR #7 review. Fresh preflight passed syntax, 128 Node tests, 13 Python reference tests and 72 responsive browser cases (8 gated cases skipped). The separate CI-equivalent static Node-server run also passed all 72 applicable browser cases; it avoids reproduced parallel module-download resets from the Python test server and never creates/serves an App Check token. Review screenshots and scope are in `docs/PR7_UI_REVIEW_2026-10-17.md`. Production remains unchanged; merge/release and fresh production-host QA require owner review. Shared decisions remain postponed. Central portfolio/Linear tracking is owner-side pending (standard repository HTTP 404).

## October 17, 2026: clear starting point and saved-session resume (local)

Added compact state-aware guidance in English, Bangla and Khmer, a clear new-user starting action, root-link resume at the next verified stage, and Saved/Audit/New decision choices for completed work. New decision preserves receipts through the existing explicit confirmation flow. Browser-private demo scope is explained. Syntax, 127 Node checks, 68 existing responsive cases and four final new/resume cases passed. A fresh real Gemini/Firebase full flow plus exact reload and root-link resume passed in 14.1 seconds. See `docs/JOURNEY_UX_QA_2026-10-17.md` for evidence and corrected test timing/navigation assertions. No push, merge or deployment; central portfolio/Linear synchronization remains owner-side pending (standard repository HTTP 404).

## October 17, 2026: Bangla/Khmer labels made consistent (local)

Filled missing Bangla and Khmer copy across navigation, tables, proof, actions, audit, help, dialogs, accessible labels, currency controls and known runtime statuses/errors. Original supplier text, quotes and canonical saved data are preserved. Syntax, 115 Node checks, the 60-case responsive suite (8 gated cases skipped) and 16 targeted locale/error cases passed. Fresh native-input Bangla and Khmer live Gemini → proof → approval → five saved actions → revision-7 read-back → exact reload restoration passed. See `docs/LOCALIZATION_QA_2026-10-17.md`. Earlier notes about Bangla fallback labels describe the preceding snapshot. Local only; central tracking remains owner-side pending (standard repository HTTP 404).

## October 17, 2026: full live demo with three selected UI languages (local)

Fresh independent sessions with English/USD, Bangla/BDT and Khmer/KHR UI and matching supplier samples each passed real Gemini → HOLD/review → PASS/BLOCK/PASS → human approval → five sandbox actions → revision-7 Firebase read-back → exact reload restoration, retaining language/currency preferences. Actual Plan, Proof, Saved and Audit summaries were checked. Syntax and 110 Node checks passed. The initial English reload had a network failure; a diagnostic rerun passed without product changes. A Khmer test-label expectation was corrected. Some Bangla labels remain English fallbacks. See `docs/TRILINGUAL_LIVE_QA_2026-10-17.md` and its raw exports. No push, merge or deployment. Central portfolio/Linear synchronization remains owner-side pending (standard repository HTTP 404).

## October 17, 2026: balanced summaries on later steps (local)

Plan, Verify/Approve, Saved Actions and Audit now combine short context with real state/policy summary cards. Longer explanations remain in question-mark help. Summaries distinguish unknown/zero/stale capacity, current blockers, approved receipt counts and verified session read-back. All three languages and responsive layouts are retained. Syntax, 110 Node checks and 52 responsive browser cases passed, including full isolated approval/save/reload and summary-state assertions. See `docs/STITCH_LOCAL_IMPLEMENTATION_2026-10-17.md`. No push, merge or deployment.

## October 17, 2026: opening-page guidance cards (local)

Added a concise input-tip row and three “What happens next” cards to balance the minimal Evidence screen. These instructions are translated into all three languages, stack on mobile and give way to real facts/capacity review after analysis. Longer explanations remain behind question icons. Syntax, 110 Node and 52 responsive browser checks passed; business logic and saving were unchanged. See `docs/STITCH_LOCAL_IMPLEMENTATION_2026-10-17.md`. No push, merge or deployment.

## October 17, 2026: minimal steps with contextual help (local)

Evidence begins with a single editor and Analyze action; extracted facts and capacity review appear after analysis. All steps reduce repeated explanations to section question-mark help, available by hover, keyboard focus and tap. Actions, amounts, proof results, short blocker labels and save/error feedback remain visible. Syntax, 110 Node and 52 applicable responsive browser checks passed. The fresh real Khmer-sample Gemini → proof → approval → verified save → exact reload run passed in 24.1 seconds (five actions, revision 7). Evidence and scope: `docs/STITCH_LOCAL_IMPLEMENTATION_2026-10-17.md`, `docs/evidence/2026-10-17/minimal-help/`. Local only; no push, merge or deployment.

## October 17, 2026: local header and multilingual demo refinement

Language flags, currency symbols/icon, a proposed SVG Varelyx logo/favicon, and equivalent English/Bangla/Khmer sample messages are implemented locally. Untouched samples follow the locale; custom and analyzed evidence is preserved. SVG serving and the mobile rates-panel layout are corrected. Syntax, 110 Node tests and 48 applicable responsive browser cases passed. Fresh real-service Khmer and Bangla samples each passed AI → HOLD/review → PASS/BLOCK/PASS → approval → five saved actions → revision-7 Firebase read-back → exact reload restoration. See `docs/STITCH_LOCAL_IMPLEMENTATION_2026-10-17.md` and `docs/evidence/2026-10-17/localized-demo/`. No push, merge or deployment.

## October 17, 2026: compact Stitch implementation in local review

The light/cobalt design now uses focused workflow views, a collapsible white sidebar/mobile drawer, compact plan/proof/action tables and consistent type/spacing. Khmer UI and USD/BDT/KHR display currency are included, with editable dated reference rates and original BDT proof amounts preserved. Syntax, 105 Node and 44 responsive browser checks passed. The fresh real Gemini/Firebase flow passed: PASS/BLOCK/PASS, explicit approval, five sandbox actions, verified revision-7 saving and exact reload restoration. See `docs/STITCH_LOCAL_IMPLEMENTATION_2026-10-17.md`. This implementation remains local; PR #7 still contains the previously pushed candidate. No merge or deployment was performed.

## October 17, 2026: local candidate live-service verification passed

The project owner registered the private local App Check token. The candidate based on `2499f48`, served locally against real Gemini/Firebase, passed HOLD → review → PASS → BLOCK (approval disabled) → PASS → human approval → verified save → reload. Exact exported state, capacity 120, receipt, five sandbox actions, audit and proof history matched after reload. See `docs/LIVE_QA_2026-10-17.md` for fresh evidence and exports. PR #7 awaits owner review; no merge or production deployment was performed. Earlier registration/live-pending notes below are historical.

## October 17, 2026: UI/UX and operator workflow candidate

The decision workspace now has clearer current-step navigation, in-app evidence/approval dialogs, readable retail action records, and saved PASS/BLOCK history. Local fixture-based verification is documented in `docs/UIUX_REVIEW_2026-10-17.md`. Live Firebase/Gemini verification and production release remain pending; the older production evidence below is historical.


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
- final 3–4 minute public demo video per the October 17 actual portal instructions
- final proposal/PDF claims reconciled to observed behavior
- public repo/demo links as required by the competition
- eligible 2-4 person team and profile/activity/eligibility checks
- logged-out testing of every submitted link
- portal fields, final submission and saved receipt/confirmation

Do not claim the competition submission itself is complete until those submission gates are closed.
