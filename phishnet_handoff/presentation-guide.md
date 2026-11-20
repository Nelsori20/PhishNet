# Preliminary pitch deck guide

**Deck:** `PhishNet_Preliminary_Pitch.pptx` (19 slides, 16:9, editable), also exported to PDF. Each slide includes presenter notes and a `[Sources]` block for significant external claims. Slide claims are dated through November 20, 2026.

## Audience and uses

- This is a **research-backed preliminary deck** for aligning the hackathon team and discussing architecture; it is not the final 2–3-minute working-app demonstration video.
- Speaker notes contain source links and epistemic limitations. The primary factual library is `research-background.md`.
- Slides 3–8 give the measured motivation, 9–14 explain attack mechanism and architecture, 15–17 focus on deployment and evaluation, 18 audits remaining submission needs.

## Suggested short video sequence when the app exists

1. **0:00–0:20** explain risk: a signed payment can be technically valid while the human or agent relied on a socially engineered claim.
2. **0:20–0:40** show multi-stage human-agent/agent-agent timeline and provenance.
3. **0:40–1:20** show first test: plausible agent recommendation for a $250 vendor payment with mismatched signed recipient; PhishNet HOLD/DENY.
4. **1:20–1:45** show benign counterfactual: vendor independently verified, fresh signed mandate, eligible payment.
5. **1:45–2:10** show service micropayment authorization and the deterministic budget check.
6. **2:10–2:30** show actual Arc Testnet receipt and/or cryptographically verified Merkle inclusion proof **only if implemented**.
7. **2:30–2:50** show source repo, tests, known limitations and close.

Do not narrate unbuilt features as complete, show unaudited accuracy estimates, claim users are protected on other platforms, or confuse a simulated wallet transaction with settlement.

## Research-to-product claims to preserve

- The datathon's 215,440 examples are **websites**, not chat interactions or agent fraud cases.
- The 95.8% accuracy and 95% recall are *team-reported retrospective* measures, not new PhishNet agent performance.
- The UCI SMS training script is a *separate text-baseline exercise*, not training the financial policy gate or a multi-agent social engineering model.
- Fraud-loss figures describe legacy scams, not agent-caused fraud.
- Visa totals are traced payment events, not independent authentic spenders or rising average agent budgets.
- Financial-institution survey proportions apply to the UK respondent sample, not the world.
- Blockchains authenticate signed transactions and commitments, not truth of external claims.

## Source/technical blockers

- Google hackathon guide document remains unreadable from current tool connection. The public Devpost requirements are separately documented in `submission-gap-audit.md`.
- To update Visa snapshot, revisit the dashboard and record the full source timestamp.
- If project claims actual model training, include source data license/checksum and held-out results in the final deck.
