# Compact Stitch design applied locally — October 17, 2026

The approved light Stitch direction is implemented in the local web client: [design reference](https://stitch.withgoogle.com/u/1/projects/7589176509554550316?pli=1). This is a local candidate based on `673c153`, not a production release or an update already pushed to PR #7.

## Operator experience

- Focused Evidence, Plan, Verify/Approve, Saved Actions and Audit views replace the long dashboard. Workflow tabs, next-step guidance, browser back and direct hash links navigate the same underlying session.
- White navigation collapses from 224px to a 64px icon rail on desktop; this presentation preference survives reload. Mobile uses a light drawer with Escape, backdrop dismissal, focus return and keyboard focus containment. Navigation remains usable while services are unavailable.
- Cobalt primary actions, neutral surfaces, consistent 24px/32px desktop page headings, 16px/24px section headings, 14px/20px desktop body/table text, and shared panel/row spacing. Mobile keeps larger inputs and touch targets.
- Compact evidence facts, readable source editing, inline capacity errors and the existing human review dialogs. The capacity field starts empty, distinguishes unknown from zero and restores the actual confirmed value.
- Four comparison rows replace repeated strategy cards; mobile shows concise plan/cash/stockout summaries with expandable quantities. The balanced candidate remains the plan supported by the existing proof/approval workflow; other rows do not imply new approval functionality.
- Proof Gate uses compact Check / Result rows, observed constraint details in section help, single-line status labels and saved PASS/BLOCK/PASS history. Full receipt details are disclosed on demand. Observations and limits come from the actual proof engine, not illustrative Stitch copy.
- Five saved sandbox actions use a concise table/list. The audit shows actual recorded events. No invented EDI, ERP, supplier verification, SLA, dispatch, immutable ledger or compliance claims were imported from generated mockups.

## Preservation of the working flow

The core solver, proof generation, approval preparation, Firebase transport, verified read-back adapter, Firebase configuration, database rules and private App Check setup were not changed. The later multilingual sample refinement extends conservative extraction grounding with Khmer digits, hour/day/route/case units and delay/capacity terms, while rejecting Khmer negation, uncertain capacity and conflicting numeric claims. Exact source-quote grounding remains required. UI preferences persist the sidebar, language, display currency and optional custom reference rates on this device; business session state continues to load from Firebase, with no local-state fallback.

After reviewed capacity is saved, the app opens Plan; generating proof opens Verify/Approve; explicit approval opens Saved Actions. Source edits still lock review/proof/approval until reanalysis. Unverified saves retain the existing retry lock. Cancel/Escape in review dialogs do not save.

## Verification

- JavaScript syntax checks passed.
- 110 Node tests passed.
- 48 browser tests passed (44 in the full responsive run plus four corrected textarea-value assertions in the targeted sample-switch test) across 1440×900, 1280×720, 1024×768 and 390×844; 8 live/capture-gated cases skipped in the isolated suite.
- Coverage includes complete synthetic PASS/BLOCK/PASS/approval/save/reload, restored capacity including zero, stale-source locks, failed-save handling, modal cancellation, navigation collapse/reload, mobile drawer dismissal/focus, browser history, language persistence and horizontal containment.
- Isolated screenshots are retained outside Git in `/Users/chhay/Documents/Codex/varelyx-work/stitch-local-review-2026-10-17/isolated-ui/`. They use fixture service responses and are not evidence of live services.
- Fresh real Gemini/Firebase run passed in 12.4 seconds: live extraction → HOLD for missing capacity → reviewed capacity 120 → PASS → unsafe BLOCK with approval locked → PASS → explicit human approval → five sandbox action records → verified Firebase read-back → exact state restoration after reload. Final remote revision: 7. Receipt: `3594e131205187117ab524a47ff987b685dfbfeaee20ce149401cc00db70cbbe`.
- Raw pre/post-reload evidence is in `docs/evidence/2026-10-17/stitch-local/`. Live screenshots are retained outside Git in `/Users/chhay/Documents/Codex/varelyx-work/stitch-local-review-2026-10-17/live/`.
- An initial live attempt stopped during an in-progress save because the test matched the previous proof save's success message. The test now waits for the current approval's saved-actions view/read-back. The corrected complete live run passed; no persistence/security relaxation was made.
- Final Khmer/currency checks passed again at all four viewport sizes, including blank-capacity validation in Khmer, invalid exchange-rate rejection, currency conversion in the approval dialog, original source preservation, receipt stability, BDT export amounts, and preference/reload restoration.

## Khmer and currency preferences

The compact header offers English, বাংলা and ខ្មែរ, independently of USD, BDT or KHR display currency. Khmer covers navigation, decision states, evidence/capacity guidance, plan comparison, proof observations, approval dialogs, saved-action labels and common validation. Script-friendly fonts and leading preserve legibility on mobile. Source messages, quotations, AI summary/extraction, machine evidence exports and canonical receipt payloads retain their original wording; synthetic Khmer source extraction and its complete proof/save/reload flow are now verified as described below. The validator remains a conservative enumerated-unit check, not a general natural-language verifier.

All source amounts, policy ceilings and saved proof data remain in BDT. Display amounts are computed from that source on each render, never converted repeatedly or relabeled without conversion. USD uses two decimal places; BDT/KHR use whole units. Converted values are explicitly marked approximate. Switching currency/language neither changes quantities nor invalidates a current receipt.

Connection details contain editable `BDT per 1 USD` and `KHR per 1 USD` rates, positive finite validation, and a reset control. Defaults are dated reference snapshots, not a live feed: 123.45 BDT/USD from [Bangladesh Bank, October 15](https://www.bb.org.bd/en/index.php/econdata/exchangerate), and 4067 KHR/USD from [MEF figures reproduced by Cambodia Exchange, October 16](https://www.cambodiaexchange.today/). The secondary attribution is explicit; the NBC page could not be fetched. Custom rates apply only to this device's display and never modify the proof/budget engine. Local conversion preferences are distinct from business persistence, which still requires Firebase verification.

## Scope

Changes remain local for review. No remote push, merge, deployment or production security change is included. The canonical operating-standard/portfolio repository still returned HTTP 404 to this account; no relevant Linear item is accessible, so owner-side central tracking remains pending.

## Header identity and localized samples refinement

Language options now include country flags and names; currency options use explicit unchanged values with `$ USD`, `৳ BDT` and `៛ KHR` labels and a decorative banknote icon. Native selects preserve keyboard/mobile behavior. A new local SVG Varelyx monogram replaces the text placeholder and supplies the favicon; it is a proposed local brand asset, not an existing official logo. The local server now serves SVG with its correct image MIME type while retaining `nosniff` and all existing host/origin/path restrictions. Mobile reset uses a labeled icon to keep the header compact. The rates panel is constrained to the mobile viewport.

Equivalent synthetic supplier messages exist in English, Bangla and Khmer. Each states a 48-hour delay, two routes and unknown capacity. An untouched sample follows the chosen language; user-edited and analyzed/restored source evidence stays verbatim. Reset explicitly starts a fresh sample in the selected language. The selected samples remain the actual text sent to Gemini; there is no hidden English substitute.

Fresh real-service checks passed with the actual Khmer sample (13.0 seconds) and Bangla sample (12.3 seconds), each completing live Gemini extraction → HOLD → capacity 120 review → PASS/BLOCK/PASS → explicit approval → five saved sandbox actions → revision-7 Firebase read-back → exact reload restoration. Exports are retained in `docs/evidence/2026-10-17/localized-demo/{km,bn}/`; screenshots are outside Git under the review directory's `live-km` and `live-bn` folders. English real-service evidence remains in the preceding local run. Grounding tests cover Khmer digits/day conversion, unknown/negated/approximate/conflicting capacity rejection, wrong units and unsupported numbers. Localized sample-switch tests verify custom and analyzed source preservation at all four viewport sizes.

Verification: syntax, 110 Node tests and all 48 applicable responsive browser cases passed; eight gated live/capture cases were skipped in the isolated run. The new sample test initially asserted textarea text content instead of its current value; the corrected value-based assertions passed at all four sizes. No production push or deployment was performed. The canonical portfolio-standard repository still returned HTTP 404; owner-side portfolio/Linear tracking remains pending.

## Minimal workflow and contextual help — October 17 refinement

Evidence now starts with one supplier-message card and one primary Analyze action. Empty fact rows, premature capacity controls and normal prerequisite HOLD warnings are not shown before analysis. Successful analysis reveals three extracted facts and capacity review, with the source message collapsed for editing. A changed source returns to the editor and keeps reanalysis available. Errors and active saves remain visible in `operationFeedback`; technical persistence details, rate settings and the walkthrough are available from Connection.

All steps now use concise status labels, numbers and actions. Recovery plans retain a compact comparison and preliminary/reviewed state; the repeated selected-plan footer is available to assistive technology. Proof Gate uses Check/Result rows; actual observed constraint details are in its section help. Approval shows amounts, a short lock/readiness reason and an explicit approval dialog. Sandbox badges remain visible; dispatch/scope explanation is in help and the confirmation dialog. Saved Actions and Audit keep actual records on the page. Quantitative scenario data remains a collapsed disclosure.

One contextual question-mark control per relevant section opens on hover, focus, click or tap. Panels are constrained to the viewport, support keyboard scrolling, stay available while hovered/focused, and dismiss with Escape, outside click or navigation. Visible buttons keep localized accessible names and expansion state. All explanatory content remains available; the planner, evidence grounding, proof results and Firebase read-back requirements were not changed by this refinement.

Fresh checks: syntax and all 110 Node tests passed; all 52 applicable browser cases passed across 1440, 1280, 1024 and 390px widths (8 opt-in live/capture cases skipped). Coverage includes first-step progressive disclosure, complete proof/approval/reload, actual failed-save feedback, stale-source reanalysis, language/currency behavior and hover/focus/tap help with dismissal and viewport containment. The real Khmer-sample Gemini/Firebase flow passed again in 24.1 seconds, including PASS/BLOCK/PASS, explicit approval, five sandbox actions, revision-7 read-back and exact reload restoration. Raw exports: `docs/evidence/2026-10-17/minimal-help/`. Screenshots: review directory `minimal-help-ui/` and `minimal-help-live/`. Changes remain local; central standard/portfolio access still returned HTTP 404 and owner-side Linear tracking remains pending.

## Opening-page context cards — October 17 refinement

The initial Evidence page now includes a compact “Helpful details” row (delay, affected routes, confirmed capacity) and three small “What happens next” cards: review extracted facts, confirm capacity, verify/approve. These are instructions, not pre-analysis findings or completed states. Cards stack on mobile and are hidden after analysis reveals the real facts and capacity review (or return with the editor after a stale source edit). Copy is available in English, Bangla and Khmer; longer explanations remain in section help. There are no new business actions or persistence changes.

Fresh validation for this presentation-only refinement: syntax, 110 Node tests, and all 52 applicable browser cases passed across four viewport sizes (8 gated cases skipped). The existing complete isolated AI/proof/approval/save/reload flow passed; the preceding real-service run remains documented above and was not repeated for static guidance copy. Local only. The canonical operating-standard/portfolio repository still returned HTTP 404; owner-side central tracking remains pending.

## Balanced context across later steps — October 17 refinement

Plan, Verify/Approve, Saved Actions and Audit now use a short context line plus compact overview cards in the same visual family as the Evidence introduction. Plan summarizes actual confirmed capacity (including zero), the controlled policy cash ceiling, and the balanced candidate. Non-BDT ceilings are converted with the existing reference rates and marked approximate. Unreviewed or stale capacity stays “Not confirmed.”

Verification cards sit below the approval panel to use the existing column space: recorded check count, HOLD/BLOCK count, and proof-receipt availability. Stale evidence displays “Stale” instead of presenting a previous zero-blocker result as current. Approval adds one short sandbox-only line. Saved Actions shows the actual record count, last verified session read-back status, and sandbox mode. Audit shows stored decision-event count, approved receipt-archive count, and latest proof state. Its saved-event count excludes runtime-only connection/read-back timeline entries. No totals, receipt availability or verification result is invented. Longer scope, model, rule and authority explanations remain in the existing question-mark help.

New labels and context support English, Bangla and Khmer. Overview cards use compact horizontal rows on mobile; the narrow tablet approval column uses stacked cards to avoid cramped values. No solver, extraction, proof, approval or persistence semantics changed.

Fresh verification: JavaScript syntax and 110 Node checks passed; all 52 applicable responsive browser cases passed (8 live/capture cases gated off). The complete isolated PASS/BLOCK/PASS/approval/save/reload flow checks actual overview capacity, cash limit, eight checks, blocker changes, five saved actions, verified read-back, six stored workflow events, one approved receipt and stale-source labels. Desktop/tablet/mobile screenshots were visually reviewed and are retained outside Git in the review directory's `balanced-step-ui/` folder; these use isolated fixture service responses. The prior real-service run remains documented above; this rendering-only change did not add a new live-service claim. Local only; canonical portfolio/standard access still returned HTTP 404 and owner-side Linear tracking remains pending.
