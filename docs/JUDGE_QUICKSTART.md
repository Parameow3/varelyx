# Varelyx · judge walkthrough

Open [the Firebase prototype](https://varelyx-ai-builder-cup.web.app). No product account is required: Firebase creates a private anonymous session. Use a normal supported browser with JavaScript/network access. App Check verifies the browser before AI and database requests. The latest reviewed UI must be released before final recording; see the submission checklist for current deployment evidence.

## One end-to-end decision

1. **Evidence:** use the supplied Supplier B message and select **Analyze disruption**. A real Gemini call extracts the 48-hour delay and two affected routes. Capacity stays unknown. Source quotes are available in the evidence disclosure.
2. **Human review:** obtain capacity from supplier information. For this synthetic demonstration enter **120 cases**, open **Review & confirm**, and explicitly confirm the facts/source. AI has not verified that capacity.
3. **Plan:** compare supply, cash and simulated stockout. Balanced uses transfer 90, Supplier B 120 and emergency 60 cases; cash BDT 186,000; expected stockout 30 cases.
4. **Verify:** prove balanced → **PASS**. Test unsafe → **BLOCK** and disabled approval. Prove balanced again → **PASS**. The unsafe test intentionally exceeds encoded limits.
5. **Approve:** inspect the confirmation dialog and approve once. Five sandbox action records are saved and verified by a Firebase read-back. No supplier or external ordering system is contacted.
6. **Resume:** reload, then reopen the root link in the same browser. The current candidate returns to Saved with the same capacity, receipt and PASS/BLOCK/PASS history. Audit and JSON export are available.

Long explanations sit behind question-mark controls, usable by hover, focus or tap. The mobile help remains open while scrolling/resizing. Language and display-currency controls are independent.

## What to assess

- **Google AI:** Gemini converts unstructured evidence into quoted, typed fields. It does not produce executable quantities or authorize purchases.
- **Differentiation:** deterministic sensitivity ranks the missing fact; an independently implemented constraint gate can reject a candidate before explicit human approval.
- **Operational integrity:** unknown capacity differs from zero; edits make proof stale; failed saves cannot claim success; duplicate approval is disabled.
- **Persistence:** Firebase reads back writes and preserves state on reload. It uses existing anonymous-user isolation and conditional writes.

## Scope and limits

This is a controlled Supplier B, aggregate-case retail scenario with four fixed demand levels. It is not a deployed ERP, SKU-level demand model or general natural-language verifier. The eight client-side checks cover reviewed evidence, integer quantities, cash, supplier capacity, donor limit, route limit, emergency limit and MOQ/pack size. Predicted stockout/robustness are not all independently proven by those checks. The receipt is a reproducible client-side fingerprint, not a server procurement attestation.

Custom supplier evidence is checked conservatively and still needs human review. The translated samples have live-flow evidence; that is not a broad multilingual accuracy benchmark. Shared cross-device decisions, external ordering, enterprise roles and real-retailer impact validation are future work.

## If the flow stops

Read the visible connection/save error. Do not interpret a disabled button as a successful step. If a save is not verified, reload and reconcile the session before retrying; do not duplicate approval. A fresh browser starts a separate private decision. App Check throttling in automation must be distinguished from normal-browser behavior; keep enforcement enabled and never expose a device token to judges.
