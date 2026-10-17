# Submission copy · Varelyx

Prepared October 17, 2026 after the actual form loaded. [Exact fields, template and limits](SUBMISSION_FORM_VALUES.md): brief description 1024 characters, PDF up to 5 MB, and video 3–4 minutes. The initial empty-round message was a temporary loading state. The form is accessible; no values were entered or submitted.

## Product and theme

**Varelyx** · **Retail & Commerce: Intelligent Customer and Business Experiences**

## One sentence

Varelyx turns incomplete retail disruption evidence into constrained, proof-checked and human-approved recovery decisions using Gemini and Firebase.

## Brief description (855 / 1024 characters)

Varelyx helps retail operators respond to supplier delays when replacement capacity is still unknown. Gemini, through Firebase AI Logic, extracts structured facts and source quotes from supplier messages. Deterministic sensitivity identifies the missing fact to review, and a constrained planner compares supply, cash and stockout trade-offs. An independent client-side Proof Gate checks eight rules before explicit human approval. Firebase Hosting serves the app; Anonymous Authentication isolates browser sessions; App Check protects service calls; and Realtime Database persists sandbox actions with verified server read-back and reload restoration. The English, Bangla and Khmer demo uses synthetic retail scenarios. No real order is sent. Current proof is client-side, and business-impact metrics are simulated rather than measured retailer outcomes.

## Google AI and architecture

Firebase Hosting serves the web prototype. Firebase AI Logic connects to Gemini for schema-based evidence extraction; conservative numeric/quote checks and human review preserve uncertainty. Deterministic logic owns the evidence-question ranking, plan quantities and constraint checks. Firebase Anonymous Authentication and App Check protect the existing browser-private session; Realtime Database uses conditional writes and server read-back. The optional FastAPI/OR-Tools reference is not the primary submitted runtime. See `ARCHITECTURE.md`.

## Differentiation and value

A plausible AI answer is not treated as permission to act. The prototype asks for missing supplier capacity, compares supply/cash/stockout trade-offs, deliberately demonstrates an unsafe BLOCK, and requires a newly passing candidate plus human approval. It provides a traceable evidence/proof/action history and exact reload restoration. Intended value is faster, more reviewable continuity decisions; observed business impact has not been measured.

## Evaluation and scope

The controlled evaluation covers 40 synthetic capacity/route combinations and 160 feasible plans, eight deliberately unsafe proposals and three HOLD fixtures. It supplies extraction fixtures directly and is not a Gemini accuracy benchmark. The supplied English/Bangla/Khmer examples have separate live-service end-to-end checks. The current planner uses aggregate cases and fixed policy/demand scenarios, with client-side proof and sandbox actions. Team sharing, SKU-level forecasting, trusted server procurement approval and external integrations are future work.

## Links to enter

- Live prototype: https://varelyx-ai-builder-cup.web.app — release/final AI/save/reload verification still needs the approved candidate.
- Public source: https://github.com/Saidur-droid/varelyx — verified public while signed out; PR #7 is not merged yet.
- Demo video: **pending Saidur's final public 3–4 minute video URL**. The emailed 2:58 attachment is a local review draft, not an accessible submission URL.
- Proposal/deck: **pending Saidur's PDF, up to 5 MB, using the [prescribed template](https://docs.google.com/presentation/d/13rg7vW43mEH6DkpuusAE6fdoEylSFz8waNpE4RLzoUg/edit?slide=id.p#slide=id.p/export/pptx)**. The actual submission round and template are accessible after loading.

## Deadline handoff

The form labels its ending date October 19, 01:29 AM IST, which conflicts with the reminder. Use the earlier working cutoff until clarified. The October 17 organizer reminder gives October 18, 23:59 IST (October 19, 01:29 Phnom Penh) as the cutoff and recommends submitting by October 18, 18:00 IST (19:30 Phnom Penh). Recheck the portal. Final acceptance, declarations, team eligibility and required file/link fields must be confirmed in the captain's account; repository tests cannot establish these.
