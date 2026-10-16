# Submission reliability candidate — October 16, 2026

Branch: `fix/submission-reliability` from upstream main `485d34c` (see Git history for the exact parent).
Status: prepared for team review; no production deployment or live-service mutation performed for these changes.

## Changes

- Unknown capacity starts blank. Analysis/reset clears previous input; reload restores the actual saved confirmation, including zero. Extracted capacity and its quote appear as an unconfirmed suggestion, separately from operator confirmation.
- Edited source takes precedence over historical PASS in both header and proof outcome. Approval stays disabled while stale or BLOCKed.
- Evidence-only saves no longer tell the operator a decision was saved. Approved receipts complete the Action stage, show the saved state, route to the audit trail and disable duplicate approval. Existing records for a different receipt do not imply current approval.
- Newly analyzed numeric evidence requires field/unit agreement: delay in hours/days with delay context, affected route quantities, and capacity in cases with capacity context. Common quoted uncertainty, negation, multiple conflicting quantities, wrong units and day/hour mismatches are rejected. The Gemini prompt requests complete supporting clauses.
- Historical saved extractions remain readable using the previous release's validation contract; new analyses are stamped with `extractionValidationVersion: 1` and receive stricter validation on reload. This avoids locking operators out of prior sessions on deployment.
- Demo instructions explicitly use PASS → BLOCK → balanced PASS → approval → reload. Submission copy distinguishes Gemini extraction, deterministic question ranking, feasibility constraints and simulation outcomes.

## Verification

- JavaScript syntax checks passed.
- Node: 97 tests passed, including 9 new behavior regressions.
- Python 3.12 / pinned OR-Tools 9.14: 13 tests passed (dependency deprecation warnings only).
- Local browser suite: 18 passed, 6 gated live/capture tests skipped. Viewports: 1440, 1280 and 390 pixels.
- The six new browser cases use isolated Gemini/Auth/App Check responses and an in-memory Firebase envelope, exercising the real UI, planner, proof and write/read-back adapter. They cover evidence-save wording, PASS/BLOCK/PASS, approval locks, receipt restoration, edited-source freshness, clearing capacity, suggestions and zero-capacity reload.
- This is local/isolated evidence, not proof of a live Gemini response or Firebase write on the candidate deployment.

## Limits and joint release gate

Field/unit validation is a conservative pattern check, not semantic verification of arbitrary multilingual evidence. A truncated quote can still omit context. An operator must review the full supplier message; unsupported phrasing requires clarification. Proof Gate still checks the listed feasibility constraints, not every predicted outcome metric. Historical sessions have not been retroactively revalidated against the new unit rules.

Before deploying, Saidur and Chhay should review the diff, coordinate overlapping changes, and run the candidate with synthetic supplier evidence through live Gemini → review → PASS → BLOCK (approval disabled) → balanced PASS → approval → verified Firebase save → reload. Confirm the saved capacity, receipt and action state, then follow the team's production release procedure. No merge or production deploy has been performed here.

The recording target remains provisional until the organizer dashboard confirms duration, template, uptime and exact cutoff requirements. This patch does not certify competition compliance.

## Repository operating-standard follow-up

The referenced `Saidur-droid/global-hackathon-opportunity-tracking` repository and operating-standard file returned GitHub HTTP 404 for Chhay's account. Its standard and central `PORTFOLIO_STATE.md` could not be read or updated. No relevant Linear item was accessible in this session. Saidur should supply access/links or perform those updates after reviewing this candidate. Local handoff, project mode and deployment status have been updated without replacing historical production evidence.
