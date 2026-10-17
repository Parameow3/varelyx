# Varelyx - Project Handoff / Single Source of Truth

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
