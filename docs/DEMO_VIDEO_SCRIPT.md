# Varelyx · three-minute review demo

This is the earlier 2:58 review draft, not a final submission-length video. The actual loaded form requires 3–4 minutes; older public FAQ wording conflicts. Saidur now owns the final video/deck; use the approved public build and the current submission checklist for final recording.

Duration: 178.0 seconds. English system narration. Recorded local UI with real Gemini and Firebase, using a synthetic scenario. Edited for pace; not a production release or measured customer outcome.

## 00:00:00–00:00:13 · THE RETAIL PROBLEM

A supplier is delayed. Stock is running low, and replacement capacity is unknown. Varelyx helps a retail operator turn that uncertainty into a decision they can review, verify, and approve.

## 00:00:13–00:00:29 · LIVE GEMINI ANALYSIS

We begin with a realistic, synthetic supplier message. It describes a forty-eight-hour delay affecting two distribution routes. Analyze disruption sends this evidence to live Gemini through Firebase AI Logic.

## 00:00:29–00:00:46 · SUPPORTED FACTS & MISSING CAPACITY

Gemini structures the supported facts and preserves source quotes. Notice what stays unknown: supplier capacity. Varelyx asks the operator for the missing fact instead of letting the model invent a purchasing quantity.

## 00:00:46–00:01:02 · HUMAN EVIDENCE REVIEW

For this controlled scenario, the operator confirms one hundred and twenty cases. The review dialog brings the extracted facts and original message together, so confirmation is an explicit human action.

## 00:01:02–00:01:20 · COMPARE RECOVERY PLANS

The plan comparison makes the trade-off visible. The balanced candidate combines ninety transfer cases, one hundred and twenty supplier cases, and sixty emergency cases. Its simulated stockout is thirty cases, with cash of one hundred and eighty-six thousand taka.

## 00:01:20–00:01:34 · PROOF GATE: PASS

Now the independent, deterministic Proof Gate checks the listed constraints. The balanced candidate passes all eight checks. The receipt binds this evidence, these quantities, and these check results.

## 00:01:34–00:01:49 · NEGATIVE TEST: BLOCK

Next, we deliberately test an unsafe proposal. The Proof Gate returns BLOCK, and approval is disabled. A persuasive explanation cannot override a failed constraint. This is a controlled negative test.

## 00:01:49–00:01:59 · RE-CHECK: PASS

We restore the balanced candidate and check it again. PASS, BLOCK, PASS remains visible in the proof history. Human approval is available again.

## 00:01:59–00:02:15 · EXPLICIT HUMAN APPROVAL

Before saving, the operator reviews the transfer, supplier draft, emergency draft, and cash requirement. Approval creates sandbox records only. No purchase order or transfer is sent to a supplier or external system.

## 00:02:15–00:02:29 · VERIFIED FIREBASE SAVE

Five approved action records are now saved. Firebase read-back verifies persistence. The decision includes the reviewed capacity, proof history, and approval receipt, ready for inspection or export.

## 00:02:29–00:02:44 · RELOAD & RESUME

Reloading restores the same decision directly from Firebase. Opening the app again returns to saved actions with a clear next step. This continuity currently belongs to the same browser; team sharing is deferred.

## 00:02:44–00:02:58 · VARELYX · EVIDENCE BEFORE ACTION

Varelyx: understand the evidence, ask what is missing, prove the constraints, and keep people in control. This is a local review build using real Gemini and Firebase services, with synthetic retail data.

## Review and release notes

This local review draft uses real services and synthetic data. The latest UI is pending owner release. Confirm current organizer duration, language and hosting requirements before submission, then re-record the approved production build. No claim of official compliance or measured retail outcomes is made.

Demo evidence and pending items: `DEMO_REVIEW_2026-10-17.md`.
