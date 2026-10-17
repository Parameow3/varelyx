# AI Builder Cup 2026 - Candidate submission content

October 17 update: [current readiness/ownership](SUBMISSION_READINESS_2026-10-17.md), [paste-ready description](SUBMISSION_PORTAL_COPY.md), [judge walkthrough](JUDGE_QUICKSTART.md), and [actual architecture](ARCHITECTURE.md). The entry is not complete: latest Hosting release, final public video/deck and portal acceptance remain pending. Saidur owns the final video and prescribed-template deck.

## Theme
Retail & Commerce: Intelligent Customer and Business Experiences

## Product
Varelyx - evidence-driven retail continuity intelligence.

## One-line pitch
When a retail operating plan breaks, Varelyx identifies the evidence that matters, asks for the missing fact most likely to change the decision, computes feasible responses, proves them against hard rules, and only then turns a verified plan into sandbox action records.

## Why GenAI is necessary
Operational disruptions arrive as messy language and ambiguous supplier messages. Gemini converts that evidence into structured operational state. Deterministic sensitivity analysis ranks missing facts and selects the focused evidence question. Gemini does **not** invent order quantities. Deterministic constrained logic computes quantities and an independent Proof Gate verifies hard rules before action.

## Google stack used by the submitted web prototype
- Firebase Hosting on the Spark plan.
- Firebase AI Logic.
- Gemini Developer API.
- Firebase App Check with reCAPTCHA Enterprise.
- Firebase Anonymous Authentication.
- Firebase Realtime Database.
- Deterministic constrained solver and independent Proof Gate.

The older FastAPI / OR-Tools / Cloud Run implementation remains an optional engineering reference in the repository, but it is not the primary no-card competition deployment.

## Differentiation
1. Explicit Known / Estimated / Unknown evidence state.
2. Next Best Question focused on decision value.
3. Multiple response strategies instead of one confident recommendation.
4. Deterministic quantities and feasibility.
5. Independent Proof Gate that can reject an AI-style unsafe proposal.
6. Human approval before action objects.
7. Persistent execution objects and audit state.
8. Shadow Mode comparison with simulation labels.

## Product walkthrough for the final 3–4 minute portal video
1. Show one controlled retail disruption. The current planner uses aggregate case quantities and fixed demand scenarios; do not present it as store-by-SKU network optimization.
2. Analyze the Bangla/Banglish disruption with **live Gemini**.
3. Point out DECISION NOT READY and the missing Supplier B Thursday capacity.
4. Confirm capacity = 120 cases.
5. Compare current, cheapest, balanced, and maximum-availability strategies.
6. Prove balanced plan -> PASS.
7. Prove the unsafe aggressive proposal -> BLOCK and show violated constraints.
8. Prove the balanced plan again -> PASS, then approve it -> persistent Firebase sandbox action objects appear.
9. Refresh to show persistence.
10. Show Shadow Mode and explicitly state that the numbers are controlled simulation.

## Claims discipline
Do not claim observed retailer impact, customers, pilots, or production results unless independently verified. Current impact metrics are controlled simulation outputs.

## Final owner-side submission actions
- Maintain an eligible 2-4 person team before the official team deadline.
- Deploy the public Firebase Hosting build.
- Verify a real Gemini response in production.
- Record and publish the 3–4 minute video required by the actual portal; the older public FAQ conflicts.
- Prepare/upload the required prescribed-template PDF, up to 5 MB.
- Confirm the exact Retail & Commerce problem/category in the live portal.
- Submit the live prototype URL before the official deadline.
