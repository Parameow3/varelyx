# Data and evaluation · submission evidence

## Current evidence, not a dataset claim

The web prototype uses synthetic supplier messages, fixed policy constants and four demand levels: 380, 420, 460 and 500 cases. No external retail dataset is loaded into the submitted runtime, and no real retailer pilot or broad Gemini accuracy benchmark is claimed.

The real-service English/Bangla/Khmer demo samples have separate live Gemini/Firebase evidence in `TRILINGUAL_LIVE_QA_2026-10-17.md` and `LOCALIZATION_QA_2026-10-17.md`. Those tests establish the supplied examples and persistence flow, not arbitrary-language accuracy or predicted business benefit.

## Fresh controlled constraint evaluation

Run:

```bash
npm run evaluate:demo -- --summary
```

[Generated evidence](evidence/2026-10-17/submission/controlled-evaluation.json) records the current core SHA-256, time and policy version. The evaluator supplies synthetic extraction fixtures directly; it makes **no Gemini request**.

- 40 capacity/route combinations: capacity 0, 49, 50, 60, 119, 120, 180 and 10,000; affected routes 0, 2, 3, 5 and 100.
- 160 generated plans checked independently for nonnegative integral/pack quantities, MOQ, supplier/donor/route/emergency limits and cash recomputation/ceiling. Every plan also passed its eight Proof Gate checks.
- Eight unsafe proposals returned BLOCK: aggressive values, cash mismatch, capacity excess, fractional quantity, pack violation, donor limit, emergency limit and below-MOQ supplier quantity.
- Three incomplete-evidence fixtures returned HOLD: no capacity review, low confidence, and no evidence.

This is a bounded synthetic constraint evaluation. It is not evidence of zero failures outside these cases, fraud resistance, general semantic correctness or a trusted server authorization boundary.

## Example to explain in the deck

With capacity 120 and two affected routes, the balanced solution is 90 transfer + 120 Supplier B + 60 emergency cases. It requires BDT 186,000 and has expected simulated stockout of 30 cases across the four fixed demand levels. Baseline inaction gives 290 cases under the same assumptions. These quantities are reproducible model outputs, not measured stockouts prevented at a retailer.

## Further validation after the competition

A real deployment needs separately sourced and licensed demand, inventory, lead-time and stockout data; documented train/test/time splits; honest baselines; and empirical checks of forecast calibration, AI grounding errors, feasible-plan rates and operator outcomes. Earlier mentions of FreshRetailNet-50K, Bangladesh geography and DataCo are research directions, not completed integrations or achieved benchmark scores. Verify their original sources/licenses before use; do not join unrelated datasets into a supposed single retailer.
