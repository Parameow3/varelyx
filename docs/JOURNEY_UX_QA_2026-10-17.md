# First-use and returning-user guidance — October 17, 2026

## Result

The compact workspace now has a state-aware guide with a short explanation and a single next-step navigation action. It supports English, Bangla and Khmer.

- New or empty sessions show **Start here**, identify the supplier message as the starting point, and offer a button that opens/focuses the editor. Analysis remains an explicit user action.
- After analysis, the guide points to supplier evidence/capacity confirmation. Ambiguous or missing facts send the user back to clarify the message.
- Reviewed evidence points to plan comparison; a blocked proof points to the balanced-plan check; a current PASS points to explicit human approval.
- A saved decision shows **Welcome back**, the actual saved action count, links to Saved/Audit, and **New decision**. That button uses the existing confirmation dialog. Cancel retains the decision; confirmation archives current sandbox actions and retains approved receipts.
- Opening the app root without a specific fragment resumes the next meaningful stage after verified server restore. Completed decisions open Saved. Explicit links to Evidence, Plan, Verify, Saved or Audit remain respected; the guide still offers the next useful destination.
- An unconfirmed save shows a reload/reconciliation action and prevents starting another decision while saving is blocked.
- Guidance help explains the four steps and the scope of the browser's demo session.

Saved sessions use the existing anonymous Firebase user scope. Another browser/device opens its own demo; team-wide shared decision history is not implemented. No database access rules, authentication scope, solver, proof or authorization requirements were changed.

## Verification

- JavaScript syntax and **127 Node checks passed**. Guidance tests cover initial, analyzed, reviewed, missing-fact, blocked, PASS, approved, stale and failed-save states, with native-copy coverage for Bangla and Khmer.
- **68 existing responsive browser cases passed**, including full proof/approval/save/reload, locale coverage and failed-save behavior. Eight real-service/capture tests remained intentionally gated in that batch.
- **Four dedicated journey cases passed** at 1440×900, 1280×720, 1024×768 and 390×844 after the final alignment/test corrections. They verify editor/capacity/proof/approval focus, root resume at every stage, explicit Evidence links, saved-action count, reset cancellation, confirmed new decision, zero current actions and retained approved receipts after reload.
- The new journey test initially navigated away before the confirmation's verified save completed; it now waits for the next screen. It also initially treated same-document fragment navigation as a reload; it now reloads explicitly for that assertion. These were test-timing/navigation corrections. The full batch had those four test failures; its other 68 checks passed, and the corrected four-case focused run passed in 9.1 seconds.
- Fresh real Gemini/Firebase full flow passed in **14.1 seconds**, including HOLD → capacity review → PASS/BLOCK/PASS → explicit approval → five sandbox actions → verified revision-7 write/read-back → exact reload restore → reopening `/` into Saved. State and revision matched exactly across all three exports. No uncaught browser errors or failed service requests were recorded.
- New-user and saved-user screenshots were visually reviewed on desktop and mobile. The opening guide aligns with the editor; saved guidance aligns with the saved workspace.

## Evidence and scope

Safe live exports: `docs/evidence/2026-10-17/journey/`.
Screenshots/logs: `/Users/chhay/Documents/Codex/varelyx-work/onboarding-review-2026-10-17/` (the `resume-responsive` folder contains the final new/returning-user screenshots).
Receipt: `94f95377e4d94a9bc442568933bff6e089f1bbe79951bc70d236f1b0e59df7f6`.

Work remains local on `fix/submission-reliability`, based on `673c153ee550464657159ef82d015f653001830c` with the existing uncommitted UI work preserved. No push, merge, deployment or teammate message was performed. Live writes used an independent synthetic sandbox session.

The canonical standard/portfolio repository again returned HTTP 404 for this account; no relevant Linear item is accessible. Local state is updated; owner-side central tracking remains pending.
