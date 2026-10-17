# Bangla and Khmer interface consistency — October 17, 2026

The current local UI now translates navigation, workflow titles, comparison tables, proof checks and observations, action records, audit events, contextual help, confirmation/reset dialogs, accessible names, browser title, currency settings and operational messages in Bangla and Khmer.

## Changes

- Added missing Bangla interface phrases and replaced mixed English/Bangla sentences in the active workflow with native copy. Bangla now uses the same runtime presentation translation path as Khmer.
- Filled Khmer gaps in assumptions, receipt prefixes, table captions, setup/validation messages and dynamic save/error text.
- Translated quantities, confidence labels, revision messages, proof/audit status combinations and nested known error messages while retaining numbers, HTTP codes, hashes, currencies and PASS/BLOCK/HOLD semantics.
- Added translation markers to the footer, simulation disclosure and audit sequence. Mobile cell labels and accessible names follow the selected language.
- The visible analysis summary uses localized review status; the original normalized model summary remains available in the extraction details. Original supplier messages, quotes, machine-readable extraction, proof payloads and exported state remain verbatim. Presentation translation explicitly skips those evidence containers.
- Locale switches also re-render existing validation and failed-save feedback. Core extraction, solver, proof, authorization and server persistence rules are unchanged.

## Fresh verification

- JavaScript syntax passed; **115 Node checks passed**, including static label/accessibility coverage in both scripts and nested error/status interpolation.
- Full responsive suite: **60 passed, 8 intentionally gated live/capture cases skipped**, across 1440×900, 1280×720, 1024×768 and 390×844.
- After the final callback cleanup and stronger source-quote/dialog assertions, **16 targeted locale/failed-save cases passed** across those four viewports (8 overlap the full suite; 8 add denied-save checks). This includes exact “2 routes” quote preservation, dialog actions in the viewport, repeated English/native switching, and permission-denied feedback with approval/retries locked.
- The DOM audit inspects application text, hidden help/disclosures, table captions, browser title, accessible names and mobile cell labels through evidence review, Plan, PASS/BLOCK/PASS, both human dialogs, Saved, Audit, reload and reset cancellation. Both languages passed with zero unintended English text detected. Product/API names, currency codes, status codes, source evidence and hashes are explicitly recognized exceptions.
- Desktop and mobile Bangla/Khmer screenshots were visually reviewed. Longer labels wrap within the existing compact layout.
- **Fresh real-service Bangla run passed in 34.5 seconds**: matching native supplier sample → live Gemini → HOLD/review → PASS/BLOCK/PASS → explicit approval → five sandbox actions → revision-7 verified Firebase read-back → exact reload state and preference restoration.
- **Fresh real-service Khmer run passed in 39.4 seconds** through the same full flow. Both runs had no uncaught browser errors. Recorded failed API/Realtime Database requests: 0.

The final callback change makes the reason-list mapping explicitly pass only the reason to the translator; the broader DOM translation had already rendered those labels correctly in the live runs. The targeted full flows passed after that cleanup.

## Evidence and scope

Safe before/after exports: `docs/evidence/2026-10-17/localization-cleanup/`. Screenshots and test logs: `/Users/chhay/Documents/Codex/varelyx-work/localization-review-2026-10-17/`.

This is local work on `fix/submission-reliability`, based on `673c153ee550464657159ef82d015f653001830c` with the existing uncommitted UI work retained. No push, merge or deployment was performed. All live writes were dedicated synthetic sandbox sessions; no external orders were sent.

Names such as Firebase, Gemini and Proof Gate, currency/status codes, original source text and raw extraction JSON intentionally retain their original form. Unknown provider diagnostics remain verbatim rather than being inaccurately translated. Native editorial review can still refine wording; this report verifies coverage and functioning behavior.

The canonical operating-standard/portfolio repository again returned HTTP 404. No relevant Linear item is accessible. Local state is updated; central portfolio/Linear synchronization remains owner-side pending.
