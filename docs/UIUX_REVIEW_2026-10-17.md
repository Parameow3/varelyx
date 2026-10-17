# Decision workspace refinement — October 17, 2026

The submission candidate keeps the existing dark/mint visual identity and controlled retail scenario, while making the operator's current task easier to understand and complete.

## Operator experience

- Compact incident summary, larger supporting text, clearer metric labels, and improved desktop/tablet/mobile spacing.
- A current-step guide stays visible while working. The primary action advances to evidence review, proof, approval or the saved audit trail. Source edits return the operator to analysis.
- Stage links, active section navigation and a keyboard skip link make the long workflow navigable. Next-step links focus the relevant input or action.
- The walkthrough is available on demand; technical extraction JSON is behind a disclosure, with a readable analysis summary in the main flow.
- Outcome metrics remain unassessed until the current evidence is reviewed. Preliminary strategy calculations remain explicitly labelled as a controlled scenario.

## Retail workflow and proof

- In-app dialogs show the supplier facts and confirmed capacity together, or the proven action quantities, cash and receipt before approval. The supplier message can be inspected in the review dialog.
- Cancel and Escape do not save; focus returns to the workflow. Invalid capacity is explained beside its field.
- Edited evidence disables confirmation and proof as well as approval, preventing the operator from progressing on an outdated message.
- Transfer, purchase-draft, supplier-follow-up and manager-review records use human-readable descriptions rather than raw JSON. Sandbox status and the no-dispatch boundary remain explicit.
- Saved PASS/BLOCK/PASS events persist in the audit and proof history across reload. A BLOCK is reflected in the decision banner and approval remains locked until balanced PASS is restored.
- An unverified save stays visible in the current-step guide; the existing persistence adapter continues to lock retries until reload reconciliation. No success fallback has been added.

## Verification and limits

- JavaScript syntax and 102 Node checks passed.
- Browser coverage includes 1440×900, 1280×720, 1024×768 and 390×844: 36 local tests passed; 8 live/capture cases remain gated.
- Browser assertions cover the existing smoke/language behavior, full isolated PASS/BLOCK/PASS/approval/save/reload, saved proof history, dialog contents and visible controls, cancel/Escape, inline input errors, focus navigation, stale-evidence locks, unverified saves, and horizontal containment after approval.
- Captured UI examples use isolated service fixtures and synthetic supplier text. Any “LIVE GEMINI VERIFIED” or “FIREBASE SAVE VERIFIED” label in those examples is a fixture-driven UI state, not evidence of live service execution.

After owner registration of the private App Check token, the local candidate passed a separate real-service test: live Gemini → HOLD → review → PASS → BLOCK (approval locked) → PASS → approval → verified Firebase save → reload. The complete exported state, capacity, receipt, actions and proof history matched after reload. See [live QA evidence](LIVE_QA_2026-10-17.md). Production security settings, database rules, solver policy, and deployment remain unchanged. Owner review is required before merge/deployment; this local live run does not verify the candidate on production Hosting.

The referenced central operating-standard/portfolio repository still returns 404 to this account; no relevant Linear item is accessible here. Owner-side central tracking remains pending.
