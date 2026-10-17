# AI Builder Cup 2026 — Competition Rules Lock

Last verified: 2026-10-17 (Asia/Phnom_Penh), official public pages and authenticated dashboard.

This is the repository-level competition guardrail for Varelyx.

## Authority

- Official AI Builder Cup / Hack2skill pages and the live submission portal are authoritative.
- If repository assumptions conflict with an official rule, the official rule wins immediately.
- If public pages are internally inconsistent, do not guess. Use the live portal fields and request organizer clarification if the conflict is material.

Official public sources:
- https://aibuildercup.com/
- https://aibuildercup.com/themes.html
- https://aibuildercup.com/Faqs.html
- https://hack2skill.com/event/aibuildercup2026/dashboard/submissions

## Eligibility lock

- JAPAC.
- Age 21+.
- Team size 2–4.
- Working professionals only; students are not eligible.
- Team formation: the current portal banner says extended to 2026-10-17, 11:59 PM IST; older public FAQ still says October 14. Portal announcements take precedence.
- Prototype submission deadline: 2026-10-18, 11:59 PM IST, per the organizer reminder forwarded October 17. This is October 19, 01:29 in Phnom Penh.
- Organizer recommended completion target: October 18, 18:00 IST / 19:30 Phnom Penh. Recheck the portal before submission.

These are participant/account requirements and cannot be proven by repository code.

## Theme lock

Primary theme:
**Retail & Commerce: Intelligent Customer and Business Experiences**

Varelyx must remain clearly aligned to retail operational efficiency, inventory/demand continuity, and business decision-making.

The official themes page contains an inconsistent lower "Category Specification" block with older social-impact wording. At final submission, the exact live portal category/problem options are authoritative.

## Mandatory technical requirements

The final submission must be a working prototype, not only a pitch deck or mockup.

It must:
- meaningfully use Google AI such as Gemini/Gemma or an accepted Google agentic platform;
- be deployed on Google Cloud via Cloud Run or Firebase;
- be functional, user-friendly, reasonably accessible, and technically coherent;
- demonstrate feasibility and scalability potential.

## Locked no-card architecture

The primary competition deployment path is now:

**Firebase Hosting (Spark, no billing) → Firebase AI Logic → Gemini Developer API free tier → Anonymous Firebase Auth → Realtime Database Spark quota**

This path is chosen because:
- Firebase Spark can be started without a payment method;
- Firebase Hosting has a no-cost Spark tier;
- Firebase AI Logic supports the Gemini Developer API free tier without linking a Cloud Billing account;
- the competition explicitly allows Firebase deployment.

Rules:
- Do not require Cloud Run for the final submission.
- Do not require Vertex AI / Agent Platform Gemini API for the final submission.
- Do not require Vercel or Supabase.
- Cloud Run and Vertex AI remain optional future upgrades only.
- The submitted live prototype must show a **real successful Gemini call**. A deterministic fallback alone is not final-compliant.
- Use a current free-tier Gemini model supported by Firebase AI Logic; current implementation targets `gemini-3.5-flash-lite`.
- App Check must be configured for the public web app when required by Firebase AI Logic.
- Never commit private credentials or service-account keys.

## Varelyx product integrity

- Gemini interprets messy language/evidence with quoted numeric fields.
- Deterministic sensitivity logic ranks missing facts and selects a focused evidence question.
- Deterministic math computes operational quantities and feasibility.
- Proof Gate verifies hard constraints.
- Human approval remains required before dispatch.
- Controlled simulation must always be labelled as simulation.
- No fake customers, pilots, metrics, or observed impact.
- No fake critical buttons.
- No LLM-invented order quantities.

## Mandatory submission package

Before final submission:
- Live Firebase-hosted working prototype.
- Live Gemini integration verified in the deployed app.
- PDF proposal/deck using the prescribed portal template.
- Public <=3-minute demo video (YouTube, Vimeo, or public Google Drive).
- Public GitHub repository and brief description.
- Exact theme/problem selected in portal.
- All submission-facing code/docs/presentation in English.
- Eligible 2–4 person team registered before the team deadline.

## Judging weights

- Technical Merit & Gen AI Implementation — 40%
- Problem Alignment & Impact — 25%
- Innovation & Creativity — 25%
- User Experience & Solution Design — 10%

## 100% completion rule

Do not claim "100% competition compliant" until both repository work and owner/account-bound work are verified:
- eligible team complete;
- Firebase project created;
- live Firebase Hosting URL deployed;
- Firebase AI Logic configured;
- a real Gemini response succeeds in production;
- App Check works in production;
- final PDF ready;
- public <=3-minute video ready;
- portal category confirmed;
- final submission accepted before deadline.

## Change control

Every future code/demo/deck/submission change must preserve this lock. If official rules change, update this file, `competition_rules.json`, affected tests, and product behavior in the same change.
