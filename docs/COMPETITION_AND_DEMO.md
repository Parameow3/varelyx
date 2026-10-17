# Competition positioning · current implementation

As of October 17, Saidur owns the final video and prescribed-template deck. Engineering focus is submission completeness, a stable released prototype, source access, accurate documentation and verified links. [Submission readiness](SUBMISSION_READINESS_2026-10-17.md) is the current handoff.

## Product story

Varelyx turns incomplete supplier evidence into a reviewed retail recovery decision. Gemini structures supported facts; deterministic sensitivity identifies the critical missing input; constrained planning compares responses; a separate Proof Gate can block a plan; a human approves sandbox records that persist and restore.

This is a retail operations continuity prototype, aligned to **Retail & Commerce: Intelligent Customer and Business Experiences**.

## Judging evidence

The official [criteria](https://aibuildercup.com/themes.html) allocate 40% technical/GenAI, 25% problem/impact, 25% innovation and 10% UX. Show the actual implementation rather than adding an architectural component only for the pitch.

| Criterion | Demonstrable evidence |
|---|---|
| Technical / GenAI | Real Gemini extraction with source quotes; typed validation; deterministic planner; separate constraint checks; real Firebase write/read-back/reload. |
| Problem / impact | Supplier delay and unknown replacement capacity affect an operator's decision. Show supply/cash/stockout trade-offs under disclosed synthetic inputs. |
| Innovation | Resolve a decision-critical missing fact before allowing a constrained plan through proof and human review. |
| UX | Clear starting/resume guidance, compact comparisons, explicit review dialogs, accessible contextual help and responsive translated samples. |

## Demonstration beats

Supplier evidence → live AI → unknown capacity → human confirms 120 → compare plans → balanced PASS → unsafe BLOCK → balanced PASS → explicit approval → five saved records → reload. Keep labels and quantities readable. Use [judge instructions](JUDGE_QUICKSTART.md), [actual architecture](ARCHITECTURE.md) and [controlled evaluation](DATA_AND_EVALUATION.md) to support the final video/deck.

The 2:58 local review video already shared with Saidur is a draft, not proof of a public final video URL or a production release. He will prepare the final video/deck. The actual form requires video 3–4 minutes, prescribed PDF up to 5 MB and description up to 1024 characters; see `SUBMISSION_FORM_VALUES.md`. Record the approved public build after normal-browser AI/save/reload checks.

## Claims boundary

No customer, pilot, revenue, measured retailer impact, imported demand benchmark, ADK orchestration, BigQuery forecasting, Firestore approvals, store/SKU network optimization or external dispatch is demonstrated by the current web build. The optional Python reference must not be presented as the runtime behind the Firebase app. All scenario outcomes are simulations. The proof receipt is client-side, not an authoritative procurement approval.
