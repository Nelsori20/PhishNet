# PhishNet — Evaluation and Data Provenance Plan

## Goal
Evaluate whether source-aware multi-turn trace analysis adds information beyond individual message classification, and test whether deterministic financial policies enforce intent under both micropayment and larger-payment conditions.

## Data sources and constraints

| Source | Type | Potential use | Constraint |
| --- | --- | --- | --- |
| Project's PhishNet datathon (215,440 cleaned websites) | Real website-feature records | URL/page-signal research | Not a conversation or agent-payment dataset; distribution biased toward homepage benign URLs |
| SCAMBENCH 2026 (1,836 scam + 1,834 non-scam) | Real victim-reported scam text curated with human-AI labels | Persuasion taxonomy and hard negatives | CC BY-NC; check access rights and do not redistribute in commercial application |
| SWE-chat | Logged human coding-agent sessions | Agent event schema, tool-call/provenance concepts | Not financial fraud; access/license must be checked |
| AgentDojo, Agent Security Bench | Research-generated agent scenarios | Controlled prompt-injection robustness | Lab benchmarks; do not report as real-world financial incidents |
| Chainabuse reported address/domain intelligence | User-reported threat records | Illustrative corroboration | Reports are allegations, API license and false positives matter |
| Elliptic2 | Real chain transaction subgraph data | Research on transaction patterns | No underlying social/agent messages, restricted licensing |
| Team fixtures | Purpose-built controlled conversation sequences | Authorization and counterfactual testing | Synthetic, not evidence of prevalence |

Do not use public fraud narratives as if they were full original message transcripts. Do not train on any restricted dataset without checking permitted purpose and redistribution/training rights.

## Fixture generation matrix

Scenario families:
1. Vendor recipient substitution across human/agent/agent.
2. API marketplace purchase with introduced late fee and cumulative budget violation.
3. Legitimate independently verified vendor update with renewed signed mandate.
4. Invoice impersonation with plausible previous business relationship.
5. Repeated claim passing through multiple agents without independent corroboration.
6. Benign unusual-but-authorized low-value or larger payment.

Vary independently: number of actors (2–5), turns (4–15), channels (chat/email/tool/A2A), paraphrased wording, delayed-stage reveal, legitimate vs unsupported claim, claim origin location, amount and token, key ownership, budget, nonce and expiration. Use at least one case with no linguistic urgency/obvious phishing cue.

### Gold labels
Annotate `isAuthorizedByCurrentMandate`, `independentRecipientEvidence`, `paymentPolicyOutcome` (ALLOW/HOLD/DENY), `reasonCodes`, and `claimProvenanceSourceIds` **before** testing agents. Two reviewers reconcile ambiguous cases if possible. UNKNOWN must be supported when no reliable determination is possible.

### Comparison arms
- **A: Message only:** last proposed payment + final agent recommendation.
- **B: Full transcript:** all ordered text messages, no structured provenance graph.
- **C: PhishNet:** structured claims/evidence lineage + mandate and policy engine.

Avoid apples-to-oranges inference: C has enforceable policy controls that A/B lack. Report separate `analysis-only` and `policy-enforced` metrics so improvement is attributed correctly.

## Metrics
- Unauthorized approval rate = unauthorized executed/approved proposals / all known-unauthorized proposals.
- False block rate = denied authorized proposals / all known-authorized proposals.
- Hold rate and mean number of follow-up steps to resolve holds.
- Claim extraction precision/recall; independent-source attribution precision.
- False assertion-of-verification rate.
- Policy test suite: wrong recipient/chain/asset/amount, replayed nonce, expired mandate, duplicate charge, unauthorized updated mandate, valid updated mandate.
- Cryptographic integrity tests: mutate signed event bytes; mutate parent ref; change inclusion proof; verify rejection.
- Network result: number of actual successful Arc Testnet receipts, with hash and explorer link if any.

## Holdouts and leakage prevention
- Keep complete family and paraphrases in same data partition; do not split near-duplicates.
- Reserve at least one novel scenario family from development. No tuning after inspecting final holdout failures; report as exploratory if violated.
- Make a reproducible seed for fixture generation.
- State that a small test suite is not an estimated field failure rate.

## Minimum demo test suite

| Test ID | Expected |
| --- | --- |
| T-01 valid permitted API purchase $0.02 | ALLOW, if mandate verified |
| T-02 duplicate API purchase/nonce reuse | DENY |
| T-03 extra fee beyond budget | DENY |
| T-04 valid $250 vendor payment exact payee | ALLOW with required approval |
| T-05 same amount, changed unauthorized payee | DENY |
| T-06 vendor wallet change without independent evidence | HOLD or DENY per hard rule; never direct signer |
| T-07 verified new payee + newly signed mandate | ALLOW with required approval |
| T-08 false reassurance repeated through 2 agents | Identify source convergence; no proof from repetition |
| T-09 missing transcript source | Mark visibility incomplete, not 'verified' |
| T-10 malformed model JSON / timeout | Fail safely; enforcement unaffected |
| T-11 tampered event digest/signature | Cryptographic verification fails |
| T-12 testnet receipt missing | UI stays pending/simulated, never 'settled' |

## Baseline documentation
Report model name/version, prompts and parser schema, evidence the model was shown, run IDs, date, test cases, results (counts and percentages), uncertainty, latency and dollar cost if known. Provide a `results.json` with raw denominators and a concise `results.md` summary.
