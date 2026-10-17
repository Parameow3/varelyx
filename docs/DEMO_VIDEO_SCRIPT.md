# Varelyx - 3 Minute Demo Video Script

Working recording target: **under 3 minutes**. Confirm the final duration and other requirements in the organizer dashboard before recording; this script is not evidence of the official limit.

## 0:00-0:18 - Problem

**Voiceover:**  
"Retail disruption decisions arrive as messy evidence: supplier messages, uncertain capacity, inventory constraints, and urgent deadlines. A fluent AI answer is not enough if the resulting plan violates a hard operational rule."

Show the Varelyx live app and the disruption scenario.

## 0:18-0:42 - Varelyx thesis

**Voiceover:**  
"Varelyx turns that uncertainty into a governed decision loop: Know what is supported by evidence, Ask for the most valuable missing fact, Prove a plan against constraints, then Act only with human approval."

Show the **Evidence → Plan → Verify → Approve** workflow tabs. Explain the Know / Ask / Prove / Act method in narration.

## 0:42-1:15 - Live Gemini

In Evidence, open **Supplier message** if collapsed and click **Analyze disruption**.

**Voiceover:**  
"Gemini structures the disruption evidence. Deterministic sensitivity analysis selects the missing fact most likely to change this controlled decision. The model helps understand evidence; it does not get authority to invent executable order quantities."

Show the readable live analysis, extracted facts, unknown capacity and the critical question. Full extraction/source quotes remain available in the disclosure.

## 1:15-1:35 - Resolve uncertainty

Enter Supplier B Thursday capacity as **120 cases**. Open **Review & confirm**, inspect the facts and supplier source in the in-app dialog, then confirm the reviewed evidence.

**Voiceover:**  
"Once the operator confirms supplier capacity, Varelyx recomputes feasible strategies using deterministic constraints."

The app opens Plan. Show the compact comparison table and the balanced demo candidate.

## 1:35-2:05 - Proof Gate differentiation

Run the balanced plan and show **PASS**. Then run the intentionally unsafe proposal and show **BLOCK**, with approval disabled. **Prove the balanced candidate again and show PASS before proceeding to approval.**

**Voiceover:**  
"This is the key difference. The Proof Gate independently checks the listed hard constraints; it does not verify every predicted outcome metric. A balanced plan passes; an unsafe proposal is blocked even if an AI could describe it persuasively."

## 2:05-2:28 - Human approval + persistence

In Verify/Approve, open the approval dialog, show the quantities, cash and receipt, then approve the sandbox actions. The app opens Saved Actions. Refresh to show restoration, then visit Evidence to show restored capacity and Verify to show the saved PASS/BLOCK/PASS history.

**Voiceover:**  
"Execution stays human-controlled. Approved sandbox action records are saved in Firebase and survive reload. No real purchase or transfer is sent."

## 2:28-2:52 - Architecture + impact

Show a concise architecture view or the app footer/stack.

**Voiceover:**  
"Varelyx combines Gemini through Firebase AI Logic, Firebase Hosting, Anonymous Authentication, App Check, and Realtime Database. It is designed to help retail teams make faster continuity decisions without confusing model confidence with operational proof."

## 2:52-2:58 - Close

**Voiceover:**  
"Varelyx: know what matters, ask what is missing, prove what works, then act."

End on product name + live URL.

## Recording rules

- Record the live deployed product.
- Keep the final export under 3 minutes.
- Use English narration/captions for submission.
- Do not claim real customers, pilots, revenue, or measured impact unless independently evidenced.
- Keep controlled-simulation values labelled.
- Make **LIVE GEMINI VERIFIED**, **PASS**, and **BLOCK** readable on screen.
- Test the final public video link while signed out.


## Local design and locale review (October 17)

The compact UI is local only, with Khmer added alongside English/Bangla and independent USD/BDT/KHR display preferences. Use Connection details to inspect or adjust dated reference rates. Converted values are indicative; proof/export amounts remain BDT. Do not imply a Cambodian retailer deployment or broad natural-language validation from the translated interface. The supplied Khmer and Bangla synthetic samples now pass live extraction and the full saved flow; custom evidence still requires conservative quote/unit checks and human review. The fresh local real-service flow passed; see `docs/STITCH_LOCAL_IMPLEMENTATION_2026-10-17.md`.


## Minimal workflow UI refinement

The Evidence screen initially shows only the supplier message and Analyze action. Analysis reveals facts and the capacity review. Use section “?” controls for explanations (hover, keyboard focus or tap); main screens emphasize values and actions. Proof observations and authority limits remain available through Proof Gate help; approval still requires the explicit confirmation dialog. Persistence read-back details and the walkthrough are in Connection. The final compact UI passed a fresh real Khmer-sample AI/proof/approval/save/reload run; see the minimal-help evidence above.
