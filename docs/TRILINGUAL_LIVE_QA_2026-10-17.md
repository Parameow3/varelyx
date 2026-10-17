# Live demo verification — English, Bangla and Khmer

Follow-up: remaining Bangla/Khmer interface copy was completed and reverified later the same day; see `LOCALIZATION_QA_2026-10-17.md`. The observations below describe the preceding UI snapshot.

Date: October 17, 2026. Target: http://127.0.0.1:4174/ running the current uncommitted compact UI on `fix/submission-reliability`, based on commit `673c153ee550464657159ef82d015f653001830c`.

Three independent anonymous browser sessions used real Firebase Auth, registered local App Check, Firebase AI Logic (`gemini-3.5-flash-lite`) and Realtime Database. Each selected the actual UI language and used its corresponding untouched demo supplier message. No English signal substitution or mocked service responses were used.

| UI and sample language | Display currency | Full flow | Revision | Saved actions | Reloaded state | Runner time |
|---|---|---|---|---|---|---|
| en | USD | PASS | 7 | 5 | Exact match | 22.1s |
| bn | BDT | PASS | 7 | 5 | Exact match | 24.2s |
| km | KHR | PASS | 7 | 5 | Exact match | 26.1s |

## Verified boundaries

1. Firebase server read succeeds before analysis.
2. The language selector changes the document language and the default supplier sample. USD / BDT / KHR were exercised alongside English / Bangla / Khmer respectively.
3. Real Gemini extracts a 48-hour delay and 2 affected routes from each source. Unconfirmed supplier capacity remains null; approval stays disabled under HOLD.
4. Explicit operator confirmation sets capacity to 120 and opens Plan. Actual context cards reflect this quantity.
5. Balanced proof PASS → unsafe BLOCK with approval disabled → balanced PASS. Each PASS displays eight checks and zero blockers.
6. Explicit approval creates exactly five sandbox records and one approved receipt. Firebase conditional writes and matching server read-backs reach revision 7. Saved/Audit summary cards match five records, six workflow events and one approved receipt.
7. Reload restores the server state exactly, including original-language source, extraction and quotes, confirmation, proofs, receipt archive, action IDs and audit events. Language and currency selections also survive. Approval remains disabled after approval, preventing duplication.
8. Currency presentation preserves the canonical BDT plan: transfer 90, Supplier B 120, emergency 60, BDT 186,000 cash and 30 simulated expected stockout cases in all three sessions.

All three completed runs had no uncaught browser errors and no failed Google API/Realtime Database requests. JavaScript syntax and 110 Node checks also passed fresh. Earlier responsive fixture coverage is documented separately; this live run used a 1440×900 desktop viewport.

## Exceptions and limitations

- The first English attempt saved successfully, then failed its reload because a Firebase network request failed or timed out. A diagnostic rerun, with no product change and retries disabled, passed the entire flow in 22.1 seconds with no failed service requests. The original failure is retained; its underlying network cause was not established. This is evidence of a transient observed failure, not a claim that intermittent network failures have been fixed.
- The first Khmer test stopped after saving because the test expected the English word “Verified” instead of the correctly rendered Khmer value. The expectation was corrected; the complete rerun passed. No application change was needed.
- Bangla still has English fallback text in some navigation, table labels and operational messages. Functionality passed; full translation completeness/native-language editorial quality is not claimed. Gemini's normalized summary and supplier name intentionally remain English while source messages and quotes retain their original language.
- Synthetic controlled simulation only. No external supplier/ERP orders, production deployment, push, merge or messages to teammates were performed.

## Evidence

Safe exports and machine-readable summary: `docs/evidence/2026-10-17/trilingual-ui/`. Each language has before-reload and after-reload JSON plus a sanitized network-failure list. No credentials, auth query strings or browser storage state are included.

Screenshots and runner logs: `/Users/chhay/Documents/Codex/varelyx-work/live-trilingual-2026-10-17/` (`en`, `bn`, `km`; separately retained initial failure/test-expectation attempts).

Approved receipt hashes:

- en: `0b617cf46bf7ef4c84a5fb918d1e760f396ff12fefecc17bfc877982579ae524`
- bn: `ca5450140e2573c6d4b8a60cf380fd9e3b535bef1568ee13a26cb7fd3d6b1db8`
- km: `26db2274626d311c42d85b3b78d6da58c0223f8bb3a00df018360a6a8282ffe3`

Reproduce one authorized synthetic session (choose `en`, `bn` or `km`):

```sh
BASE_URL=http://127.0.0.1:4174 LIVE_JUDGE_FLOW=1 LIVE_DEMO_LOCALE=km EVIDENCE_CAPTURE=1 npx playwright test tests/e2e/live-judge-flow.spec.mjs --project=desktop-1440 --workers=1 --trace=off
```

The canonical operating-standard/portfolio repository returned HTTP 404 to the current account again. No relevant Linear item is accessible. Local status is updated; owner-side central portfolio/Linear synchronization remains pending.
