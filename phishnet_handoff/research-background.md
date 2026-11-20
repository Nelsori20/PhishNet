# PhishNet — Research Background, Statistics, and Origin Story

**Version:** 0.2 | **Prepared:** 2026-11-20 | **Use:** Source-controlled project context for builders, judges, and coding-agent retrieval.

> **Evidence handling convention:** Each number below has a scope, denominator, date, and source. Project/datathon findings are labelled team-reported and should not be promoted to production validation. Public network metrics are observations, not proof of autonomous intent, commercial revenue or agent spending authorizations. Research hypotheses are not findings.

## A. How the project evolved

1. **Datathon origin (November 13, 2026):** Team Data Operators framed malicious URLs as one observable point in a varied phishing funnel (work accounts, delivery, jobs, shopping, investing, banking, software support). The original deck proposed a PhishNet malicious URL detection/reporting browser extension. It could inspect page attributes, but lacked preceding conversations and user behavior.
2. **Grammarly-style assistance:** Rather than only labeling URLs, PhishNet would annotate suspicious phrases, explain social-engineering techniques, and offer a privacy-preserving reporting flow. Consumer protection should be approachable and free at point of use.
3. **Agentic-economy research:** x402/MPP enables machine-to-machine payments for inference, data and tools. Trading volume and transaction count are not proof of profit, independent demand or unlimited delegation. Existing wallet providers support explicit policy budgets; published average spending authority is not established.
4. **Agent safety incidents and studies:** Agents can be manipulated through tool outputs, external webpages and inter-agent communications. Threats include prompt injection, authority laundering, context poisoning, approval overreliance and payments inconsistent with user intent.
5. **Systems-level insight:** In a multi-stage scam, an agent may repeat an unsupported claim through multiple authenticated participants, then deliver an unjustifiably reassuring payment recommendation to a person. The last message can look benign while the provenance and payment proposal reveal a failure.
6. **Current proposal:** A provenance-aware human/agent interaction graph, evidence-grounded social-engineering analysis, a human-facing approval review and an independent deterministic financial policy gate. One core: consumer advisory; optional SaaS enforcement. Two scales: x402-like micropayments and vendor transfers. Arc Testnet proposed for settlement/attestation proof of concept; chain-agnostic core.

## B. First-party datathon evidence (team presentation, 13 November 2026)

**Exact source:** `Phish-Net-Official.pdf` supplied with project, 'Datathon at The Beach' presentation; its measured quantities are the team's claims, not independently reproduced here.

| Reported statistic | Definition / method | Appropriate use and caution |
|---|---|---|
| 215,440 websites | After cleaning 228,178 original rows: 12,383 blanks + 355 duplicates removed | Static webpage-classification corpus, not live message or agent traces |
| 91,945 phishing / 123,495 legitimate | 42.7% labelled phishing | Case/control composition is not real-world base rate |
| 60 source columns to 13 kept page features | Leak-prone features, identifying text and URL shapes removed or demoted; retained binary title, assets, password/form, social/copyright/bank/pay/crypto cues | Model is webpage-specific; URL indicators were not sufficiently representative |
| 95.8% accuracy; 95.0% phishing recall; 95.2% precision; 0.993 AUC | Logistic regression, five-fold grouped cross-validation by domain | Retrospective within this sample. Do NOT claim production performance or generalized multi-agent protection |
| 49.1% of phishing websites used HTTPS | Within team's phishing subset | Padlock alone is not identity authentication |
| 72.8% of phishing caught by two page checks | With 159 false alarms among the 123,495 sampled legitimate sites | Legitimate records were all bare `https://www` homepages; expected real-world false alarm behavior is unknown |
| 13.0% flagged for human triage; 98.8% blocked or reviewed | Team's illustrative triage prototype thresholds | Modeled workload, not measured operational results |
| 0 observed user messages/clicks | Dataset has page properties, not user behavior | Motivates move from URL-only detection to interaction provenance |

**Original key limitation:** The team noted that every legitimate URL in the supplied corpus was a bare HTTPS www homepage; it explicitly warned that false alarms on everyday links would be higher. Maintain this warning on slides and in evaluation claims.

## C. External evidence: scale of scams

- **FBI IC3 2025:** 191,561 phishing/spoofing complaints; this is a complaint count, not a percentage of all scams and not a proof that agents were involved. Source: https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf , printed p.7.
- **FBI IC3 2025:** reported business-email-compromise losses were about $3.05 billion; investment-fraud losses about $8.65 billion. Different complaint categories and loss mechanisms; these are not PhishNet's directly addressable market. Source: same report and team's presentation appendix; verify exact reporting format before publication.
- **SCAMBENCH (Li et al., EMNLP 2026):** 1,836 curated authentic scam messages and 1,834 non-scam messages; annotations include persuasion strategies, red flags and severity with evidence spans. Five evaluated LLM detectors performed worse on cue-removed rewrites. Paper: https://aclanthology.org/2026.findings-emnlp.404/ . Dataset: https://huggingface.co/datasets/Shouninger/ScamBench (gated acceptance; CC BY-NC 4.0). **Not a multi-agent payment authorization dataset.**
- **SWE-chat 2026 v2:** 17,819 real coding-agent sessions, 229,909 human prompts, 2,028,951 agent tool calls over 707 public repositories; content is coding operations rather than financial approvals. Access is gated. Source: https://github.com/SALT-NLP/SWE-chat .

## D. External evidence: agent adoption and payment activity

- **Bank of England + FCA (26 Oct 2026):** 86% of 196 responding UK regulated financial firms said they used AI; **80% of full-survey agent respondents** reported deploying agents; of those reporting agent autonomy categories, 80% decision support, 46% constrained execution, 22% conditional autonomy, 2% broad autonomy. Categories are overlapping and percentages must not be summated. No more than 9% of respondents expected current/planned agents for particular sensitive outcomes including payment execution within 12 months. Source: https://www.bankofengland.co.uk/report/2026/artificial-intelligence-in-uk-financial-services-2026 ; be careful about full vs short-form survey denominator.
- **Visa Onchain Analytics, accessed 20 Nov 2026:** all-window tracked x402+MPP dashboard ~298.9M transactions, ~$58.6M unadjusted USD payment volume, ~$34.8M estimated 'organic' adjusted volume, median transaction ~$0.009997, ~1.1M buyer wallet addresses, ~394.6k merchant wallets. These are tracked addresses and payment events, not unique humans, standalone economic agents, or vetted businesses. Dashboard: https://www.visaonchainanalytics.com/agentic-payments . Snapshot values change.
- **Visa on-chain category mix:** AI inference 80.8% / data 6.3% / gaming 7.9% **among labeled volume, last 30 days only**, not across all transactions, and not stable across dates. Source: same dashboard. **Do not infer most companies are using agent wallets.**
- **Delegated authority caveat:** No sound industry-wide published estimate of average agent spending permission was found. A growing count of micropayments does NOT establish that the per-agent delegated wallet limit is growing.

## E. The actual opportunity and what's still unproven

**Supported problem:** (1) agent workflows are deployed; (2) machine payments are observable; (3) scam language and prompt injection can evade naive filters; (4) transaction authorization can be checked deterministically; (5) current public datasets often omit complete user-to-agent-to-agent financial decision chains.

**Hypotheses requiring evaluation:** explicit claim/source provenance improves detection of unsupported financial recommendations relative to text-only baselines; a clear evidence review decreases user overreliance; integrating deterministic transaction policy reduces unauthorized executions without excessive false blocks; commercial customers will pay for agent preflight.

**Common inferential traps:** never equate a ledger transaction with autonomous agent intention; use actual signed mandate and signer receipts to prove enforcement; do not label alleged scam wallets as confirmed criminals; do not invent ROI, addressable market or production precision; do not claim that merkle hashes prove the underlying claim truthful or that they guarantee collection completeness.

## F. Source priority / reference library

1. First-party datathon `Phish-Net-Official.pdf` (historical experiment, dated Nov 13, 2026)
2. FBI IC3 2025 report: https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf
3. SCAMBENCH official paper: https://aclanthology.org/2026.findings-emnlp.404/
4. SCAMBENCH dataset gate/license: https://huggingface.co/datasets/Shouninger/ScamBench
5. UK financial firm survey: https://www.bankofengland.co.uk/report/2026/artificial-intelligence-in-uk-financial-services-2026
6. Visa Onchain Analytics: https://www.visaonchainanalytics.com/agentic-payments
7. SWE-chat original project: https://github.com/SALT-NLP/SWE-chat
8. UCI SMS Spam Collection (CC BY 4.0): https://archive.ics.uci.edu/dataset/228/sms+spam+collection
9. AgentDojo: https://github.com/ethz-spylab/agentdojo
10. Agent Security Bench: https://github.com/agiresearch/ASB
11. W3C PROV-O: https://www.w3.org/TR/prov-o/
12. Certificate Transparency RFC 9162: https://www.rfc-editor.org/rfc/rfc9162.html
13. EIP-712: https://eips.ethereum.org/EIPS/eip-712
14. AP2 authorization: https://ap2-protocol.org/ap2/agent_authorization/
15. Devpost eligibility: https://ubc-hackathon-2026.devpost.com/rules
16. Google hackathon technical guide: https://docs.google.com/document/d/1QaySCo7u3VxMVNdk3C5Ab3ewc2E46AuLntti-Uzx5EY/edit?tab=t.0 (inaccessible from this workspace, must verify manually)
