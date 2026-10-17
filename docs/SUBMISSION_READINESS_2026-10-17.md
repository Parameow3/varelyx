# Submission readiness · October 17, 2026

**Focus:** complete the competition entry. Saidur's latest handoff assigns him the final video and prescribed-template slide deck; engineering owns the prototype, public source, accurate description/docs, verification and link checks. Submission is **not complete** until the portal confirms acceptance.

## The five required items

| Item | Current evidence / remaining work | Owner |
|---|---|---|
| Live prototype | Official Firebase URL returns HTTP 200; a normal browser completed App Check, live Gemini extraction and revision-2 evidence save. The current host differs from the reviewed candidate in **14 of 18 public assets**, so latest UI release and final full-flow production QA remain required. | Project owner deploys; engineering verifies |
| Demo video | The 2:58 narrated/captioned local review MP4 was emailed. A final public **3–4 minute** video URL showing the approved public build is still pending, per the actual form. | Saidur |
| Prescribed deck PDF | Pending. Use the organizer's template; the [prescribed template](https://docs.google.com/presentation/d/13rg7vW43mEH6DkpuusAE6fdoEylSFz8waNpE4RLzoUg/edit?slide=id.p#slide=id.p/export/pptx) is linked in the actual form. PDF limit: **5 MB**. | Saidur |
| Public GitHub | `Saidur-droid/varelyx` verified public via a signed-out web request. PR #7 is open, with no review/merge yet at audit time. | Owner review; engineering source/tests |
| Brief description | Ready-to-paste copy, actual architecture, reproducible bounded evaluation and judge walkthrough are prepared in the linked documents below. Match the captain's live field limits. | Engineering prepares; captain submits |

- [Official prototype](https://varelyx-ai-builder-cup.web.app/)
- [Public repository](https://github.com/Saidur-droid/varelyx)
- [PR #7](https://github.com/Saidur-droid/varelyx/pull/7)
- [Portal copy](SUBMISSION_PORTAL_COPY.md), [judge walkthrough](JUDGE_QUICKSTART.md), [architecture](ARCHITECTURE.md), [evaluation](DATA_AND_EVALUATION.md)

## Account and portal findings

The authenticated member dashboard shows **Varelyx | Commerce Cortex** with four member links. This is not proof of each person's eligibility. The captain must confirm the official age, professional status, region and participation requirements without relying on repository tests.

The actual [Prototype Submission round](https://hack2skill.com/event/aibuildercup2026/dashboard/submissions/6a5da99a444e4f43e5657a85) and its required form are accessible after loading. The initial empty-round message was temporary; it is **not a confirmed access blocker**. The form exposes the theme, prototype URL, PDF upload (up to 5 MB), public repository URL, video URL (3–4 minutes), a 1024-character description, and Submit. The prescribed 16-slide deck template is linked there. [Exact prepared field values](SUBMISSION_FORM_VALUES.md). No fields were entered, saved or submitted during this audit, and no acceptance receipt has been observed.

The latest loaded portal banner extends team formation to **October 17, 23:59 IST**, while the older public FAQ says October 14. The portal announcement takes precedence; confirm the captain's latest view. The October 17 organizer reminder forwarded by the team leader sets:

| Milestone | IST | Phnom Penh |
|---|---|---|
| Organizer's recommended submission target | October 18, 18:00 | **October 18, 19:30** |
| Final cutoff | October 18, 23:59 | **October 19, 01:29** |

The reminder says all five items are required. The official [requirements](https://aibuildercup.com/themes.html) and [FAQ](https://aibuildercup.com/Faqs.html) require a functional Google-AI/Google-Cloud prototype, public source, English materials and a deck/video. **The actual form says video 3–4 minutes**, conflicting with the older FAQ's under-three-minute wording; current portal instructions take precedence. The old 2:58 video is a review draft. The form displays **19 October, 01:29 AM (IST)** as its ending date, conflicting with the reminder's October 18, 23:59 IST. Keep the earlier reminder cutoff as the working limit until clarified. The current theme selector explicitly includes Retail & Commerce; use that exact option.

## Release handoff

The current GitHub account has push/triage access, not admin access. Firebase project listing did not include `varelyx-ai-builder-cup`; the explicit Hosting sites request returned HTTP 403, “The caller does not have permission.” We cannot publish using this Firebase identity. The working local App Check token does not grant deployment access.

After reviewing/merging the approved candidate, the owner should deploy **that exact source**. From its checkout:

```bash
npm install --ignore-scripts --no-audit --no-fund
npm run check:js
npm run test:node
npm run evaluate:demo -- --summary
npx --yes firebase-tools deploy --only hosting --project varelyx-ai-builder-cup
npm run verify:release
```

Run browser/Python checks as documented in the repository before release. The Hosting-only command does not change database rules or App Check configuration. Keep private `.local/` files and device tokens out of Hosting, Git, screenshots and submission material.

The new read-only release check compares the root document and every deployable asset with the checkout. It caught the current 14/18 mismatch and passed against an identical private-token-free static server. The release controller now requires this byte match instead of accepting the old `#commandCenter` marker. Static matching does not prove AI/storage readiness.

After deployment, use a normal browser without a debug token: verify live Gemini, reviewed capacity 120, balanced PASS → unsafe BLOCK with approval disabled → balanced PASS, explicit approval, five sandbox actions, verified database read-back, exact reload and root-link resume. Then re-record the final video and test all final public links while signed out. Do not place device tokens in public instructions.

## Browser-access evidence scope

Fresh automated public visits received App Check HTTP 403, “App attestation failed.” A normal in-app browser **passed** App Check and live Gemini without an injected debug token. The automated denial alone is not a general judge-access failure. The normal-browser evidence-confirmation interaction later hit a browser-control timeout; that public approval/save/reload path is **not counted as verified** in this audit. Fresh full-flow candidate verification remains separate and must be repeated on the released public build.

## Claims and handoff integrity

Architecture and submission copy now describe Firebase Hosting/AI Logic/Anonymous Auth/App Check/Realtime Database, schema/quote validation, deterministic sensitivity/planning and client-side proof. Earlier ADK/BigQuery/Firestore/Cloud Run, SKU-network, external-dispatch and real-benchmark statements were design aspirations, not implemented web capabilities.

The new controlled evaluation checks 40 synthetic scenarios, 160 plans, eight unsafe proposals and three HOLD fixtures. It does not measure Gemini accuracy or retailer outcomes. Shared cross-device decisions remain deferred. No merge, production deployment, rule relaxation, final video/deck publication, organizer message or final submission has been performed.

Central portfolio/Linear synchronization remains owner-side pending: the canonical standard repository returns HTTP 404 and no relevant Linear connector is available.


## Fresh candidate checks

Syntax and release-script shell syntax passed, as did **134 Node tests**, **13 Python tests** (four existing dependency deprecation warnings), and **72 responsive browser cases** with eight existing opt-in skips, no retries, in 24.9 seconds. A separate **15.0-second real Gemini/Firebase flow** passed capacity review, PASS/BLOCK/PASS, human approval, five saved actions, revision-7 read-back, exact reload and root resume. [Local live summary](evidence/2026-10-17/submission/local-live-summary.json).

The read-only release verifier passed all 18 assets against an identical static server and rejected the current public build: [production mismatch snapshot](evidence/2026-10-17/submission/production-asset-match-before-release.json). Its six regression cases cover stale root/modules, rewritten missing files, HTTP/network failures, invalid URLs and the public-file inventory. The evaluation is also part of CI. The pushed candidate's remote result is shown in PR #7 checks.
