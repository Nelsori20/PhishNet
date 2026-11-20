# PhishNet — Product Requirements Document

**Version:** 0.2.0 (research-extended hackathon build specification)  
**Prepared:** 2026-11-20  
**Status:** Proposed and build-ready for the bounded MVP; validation checkpoints remain open  
**Main track recommendation:** Agentic Payments and AI (one required)  
**Chain-award recommendation:** Best use of Arc (optional, select only one chain award)  
**Target network:** Arc Testnet; adapter-based design permits future Solana support  
**Primary audience:** AI-agent developers and financial service providers; consumer-facing advisory UX is included  
**Source of official rules:** https://ubc-hackathon-2026.devpost.com/ and https://ubc-hackathon-2026.devpost.com/rules  
**Unverified source:** full Google guide at https://docs.google.com/document/d/1QaySCo7u3VxMVNdk3C5Ab3ewc2E46AuLntti-Uzx5EY/edit?tab=t.0 could not be inspected; confirm any track-specific requirements with organizers.

## 1. Executive summary

PhishNet is a provenance-aware social-engineering risk analyzer and pre-transaction authorization verifier for financial AI agents. Its core differentiator is evaluating *how a proposed action arose across multiple interactions*, rather than categorizing only the last message or URL. PhishNet preserves actor, message, claim, evidence, and authorization relationships; detects unsupported claims and manipulation patterns; and helps prevent unauthorized payments through a separate, deterministic policy gate.

One analytical core serves two product modes:
- **Consumer advisory:** A human reviews an agent's suggested payment, the supporting evidence timeline, and outstanding verification concerns. PhishNet advises but has no power to move money or prevent an external payment in software it does not control.
- **Enterprise enforcement (SaaS integration):** Financial service operators call a preflight API before signing a transaction. A standalone, non-LLM policy gate denies transactions violating signed intent, permitted recipients, chain/asset, amounts, or budget rules. Risk-analysis output is advisory and can lead to escalation under configured policy.

The hackathon MVP demonstrates: a multi-step human/agent/agent interaction; a real structured provenance graph; an LLM risk reviewer with a strictly typed output; independent policy evaluation; consumer-friendly evidence and payment-approval UI; and at least one demonstrable Arc Testnet USDC transaction *if technically available*, with clearly marked simulator fallback. A legitimate control and an unauthorized request must receive different outcomes for reasons other than surface wording.

### Principle
**Authenticated message ≠ trustworthy claim ≠ authorized transaction.**

## 2. Problem and motivation

Agentic workflows can turn lower-trust input (web content, email, external agents, vendor claims) into high-confidence financial recommendations. A user may approve a payment because their own assistant says it was verified, even though the underlying proof traces to a single unverified source. An agent may also attempt a low-value API payment or larger vendor transfer that exceeds its delegated authority. One isolated phishing score cannot reconstruct who first made a claim or whether another agent independently verified it.

The design tests the hypothesis: **provenance-aware risk analysis plus independently enforced payment policy reduces unsupported or unauthorized payment approvals relative to message-only assessment, without unacceptably blocking legitimate cases.** This is a hypothesis to evaluate, not a proven result.

## 3. User roles and jobs to be done

| Persona | Job | Product mode |
| --- | --- | --- |
| Consumer using an AI assistant | Understand whether an agent's payment recommendation is justified; see sources; choose a safe next step | Advisory |
| Financial-agent developer | Invoke a deterministic allow/hold/deny preflight API; receive machine-readable explanation and evidence references | Enforcement |
| Security analyst | Replay suspicious interaction chains, inspect trust boundaries, review reason codes and audit evidence | Investigation |
| Auditor | Verify that a specific signed event was included in an anchored history; see what is and is not cryptographically proven | Verifier |

## 4. Scope boundaries

### MVP MUST
1. Render a responsive React/TypeScript web app with a *scenario browser*, interactive chronological event timeline, claims/evidence relationships, transaction approval panel, and audit/verification panel.
2. Load structured fixtures for >= 3 scenario families: (a) vendor payment recipient substitution, (b) agent API micropayment / extra fee, (c) legitimately verified recipient update; each with >= 4 phases and at least one human and two agents where relevant.
3. Support at least two financial scales: micropayment (~$0.02) and larger payment (e.g. $250+), with configurable policy and no assumption that a specific numeric threshold is industry-standard.
4. Persist immutable-style event records in SQLite or PostgreSQL with canonical IDs, parent links, actor identity, content references, trust labels, and provenance edges.
5. Extract claims, requested actions, cited evidence, manipulation cues, and uncertainty via an LLM *or* deterministic fallback. Structured schema validation must reject unexpected responses; the LLM is not authorized to control the wallet.
6. Separate a **deterministic policy engine** from agent reasoning: check authorized payee, amount, currency, chain ID, expiry, nonce, service purpose/allowlist, and cumulative spend. Mismatches MUST prevent the server-controlled signer from authorizing payment.
7. Consumer mode displays narrative risk advisory, explicit verified / unverified / conflicting claims, evidence links, original intent, proposed exact transaction terms, and a clear 'not proven fraudulent' distinction.
8. SaaS mode exposes `POST /v1/preflight` with idempotency and JSON reason codes. Fail closed for invalid/missing authorization on enforcement routes.
9. Create signed event commitments / event hash chain and an off-chain Merkle root (minimum); a chain anchoring demonstration is a stretch goal if testnet integration is completed. No raw conversations on-chain.
10. Supply test coverage for correct allow, hold, deny outcomes, changed recipient, changed amount, budget exhaustion, replayed nonce, expired authorization, one-source repeated as multiple sources, legitimate update, and malformed LLM output.
11. Include public repository, reproducible README, architecture overview, automated test command, working demo, and 2–3-minute video plan.

### SHOULD
- Include switchable 'message-only' and 'provenance-aware' assessment views to demonstrate the research hypothesis.
- Use a real Arc Testnet USDC payment in a controlled dev wallet, display explorer URL/transaction hash, and store evidence link; do not require real funds.
- Show EIP-712 typed authorization signing with wallet UI on testnet; if infeasible, use an explicitly labeled mock and mark incomplete.
- Export redacted decision trace and inclusion proof.
- Provide a minimal publicly accessible deployment with read-only demo mode and no secrets.

### NOT IN MVP
- Universal browser/email/mobile monitoring, live interception of third-party agents, real bank connections, mainnet assets, public bounty marketplace, crowdsourced allegations, production fraud verdicts, custody for customer money, auto-submission of suspicious links, broad multi-chain bridge, model fine-tuning, financial advice, autonomous unrestricted agents, proof that all historical events were captured.

## 5. Functional requirements and acceptance tests

| ID | Requirement | Observable acceptance criterion |
| --- | --- | --- |
| FR-01 | Reproducible scenario playback | User advances through >= 4 timestamped phases and can inspect actor, claim, and source at each phase |
| FR-02 | Provenance graph | Every claim links to event origin; repeated claims from same source do not count as independent corroboration |
| FR-03 | Provenance-aware extraction | Analyzer returns schema-validated structured claims with source refs and confidence/uncertainty, never just risk score |
| FR-04 | User mandate | Approved action binds full recipient, amount, asset, chain, expiry, nonce, and optional purpose |
| FR-05 | Financial gate | Unauthorized recipient, amount, asset, chain, or exhausted budget returns DENY or HOLD and never calls signer |
| FR-06 | Human verification | HOLD can only be resolved by an independent verification + new valid authorization when policy requires it |
| FR-07 | Micropayment | Shows service discovery, price, cumulative budget and duplicate billing prevention; valid low-value transaction can pass |
| FR-08 | Larger payment | Shows invoice/vendor context, identity assertions, exact recipient mismatch and human approval flow |
| FR-09 | Honest explanation | UI labels 'unverified' or 'insufficient evidence', not 'fraud confirmed', unless a truly verified claim supports that designation |
| FR-10 | Privacy | Personal messages remain off-chain and are absent from browser logs and exported public artifacts by default |
| FR-11 | Audit proof | Locally tampering with a committed event fails verification against a stored root |
| FR-12 | Network integration | Live Arc testnet tx shown with chain ID/transaction hash **only if** successfully broadcast; otherwise clear simulator label |
| FR-13 | Developer experience | `README.md` run instructions reproduce demo and tests on a clean machine |
| FR-14 | Experiment | Holdout evaluation includes benign and adversarial scenario families and reports confusion matrix + false block rate |

## 6. Two AI roles plus a non-AI gate

**Business/financial agent:** Interacts with marketplace/other agents; prepares action and supporting claims. This agent can propose but never execute unrestricted payment actions.  
**PhishNet risk agent:** Reads permitted trace and sources, extracts persuasion or trust-boundary cues, reports evidence sufficiency, and recommends allow/review/deny *without having enforcement authority*.  
**Policy + signing gate:** Code outside both agents. Verifies payment intent and wallet rules. Performs signing only for explicitly authorized actions. A 'safe' answer from an LLM cannot supersede this gate.

### Trust boundaries
- External messages and agent outputs are untrusted content; treat prompts and tool responses as data.
- A digital signature authenticates a message relative to a key, not the truth of its claims.
- An authenticated external agent has no payment authority unless a valid mandate grants it.
- Approval text MUST be derived from the canonical transaction payload, never an LLM description.
- The signer has its own secrets and enforces authorization immediately before signing (prevent time-of-check/time-of-use gaps).

## 7. Product experience

### Navigation
- **Scenarios:** three replayable cases + compare variants; selection resets state.
- **Timeline:** ordered events, speaker, channel, trust origin, source labels, and changes in assertions.
- **Evidence graph:** drill-down from recommendation to underlying claim and its original source; verify actual independent corroboration.
- **Approval:** amount, full destination, chain, currency, authorized mandate, policy reasons, status (ALLOW / HOLD / DENY), human approval where applicable.
- **Audit:** event digest, signed records, Merkle root and proof-verification demo, testnet transaction receipt if applicable.
- **Research:** case outcomes, methodology, baseline comparison and limitations.

### States
`DRAFT -> REQUESTED -> ANALYZING -> PRE_FLIGHT -> (ALLOW | HOLD | DENY) -> APPROVED -> EXECUTED` (HOLD requires a *new* authorization or verified evidence; DENY cannot be silently bypassed). UI must never imply payment executed unless transaction receipt confirms it.

### Accessibility and UX
- Keyboard navigation, visible focus, accessible labels, responsive view, sufficient contrast.
- Do not use green 'safe' badge for 'unknown'. Display source-of-truth vs agent claims separately.
- Present exact destination and token/chain details and never hide material transaction data behind 'AI approved'.

## 8. Data model

Entities: `Actor`, `Session`, `Event`, `Claim`, `ClaimDependency`, `Evidence`, `Authorization`, `PaymentProposal`, `PolicyDecision`, `ExecutionReceipt`, `MerkleBatch`.

Relationships: `SENT_BY`, `RECEIVED_BY`, `DERIVED_FROM`, `CLAIMS`, `SUPPORTS`, `CONTRADICTS`, `REQUESTS`, `AUTHORIZES`, `REVIEWS`, `EXECUTES`, `INCLUDED_IN`.

See `architecture.md` and `schemas.md` for operational details. All records require schema versions, immutable event IDs, UTC timestamps, and separate *reported*, *observed*, and *verified* classifications.

## 9. Core risk analysis design

The risk engine should output evidence-grounded features, not a universal single deception score. Suggested taxonomy:
- authority impersonation / role ambiguity;
- relationship and urgency pressure;
- prompt-injection attempt / instruction laundering;
- context laundering / unsupported repeated claim;
- external agent authority confusion;
- financial intent mutation: payee, amount, asset, chain, purpose;
- unknown provenance / missing verification;
- compromised or outdated approval mandate;
- legitimate independent verification / approved authorization update.

**Never infer crime solely from these features.** Provide reason codes and outstanding evidence requirements. Model-output confidence must not be interpreted as calibrated probability without validation.

## 10. Scenario and evaluation strategy

Produce >= 3 families with 3-6 variants each, including benign counterfactuals. Distinctively vary sender/receiver counts, phase ordering, channel, wording, payment type, whether claim was independently verified, and which actor signs. Preserve scenario family IDs and don't split near-identical variants across train/test. On first MVP, there is no requirement to train a new model; evaluate an LLM extractor and rules against independently labeled fixtures.

Primary metrics: unauthorized-approval rate (must be 0 for known deterministic policy violations in tests); false-block rate on authorized cases; HOLD rate; claim/actor/source extraction accuracy; evidence attribution precision; signed-event integrity check; payment gate bypass attempts; latency, cost. Report sample size and denominator, and avoid extrapolating from tiny synthetic samples.

## 11. Security and privacy

- Default to fabricated participants and testnet-only wallets, never import student/user private keys.
- Never execute untrusted URLs or attachments. Prohibit automatic external link traversal in scenario analysis.
- API validation, size/rate limits, tenant scoping, auth, RBAC, CORS allowlists, secret handling, no production key in client.
- LLM outputs cannot write policies, authorize or broadcast payments, exfiltrate messages or call unrestricted tools.
- Do not publish raw personal messages, PII, wallet-related private metadata, or unsalted hashes of guessable sensitive text.
- Use canonical serialization, domain-separated SHA-256 event commitments, signed event envelopes, stable parent references, root inclusion proofs. Note that hashes prove integrity of *recorded* evidence, not honesty/completeness of observations.
- Don't make a production safety guarantee; disclose limitations and no bank-level certification.

## 12. Blockchain design decisions

Arc Testnet selected as default for USDC-centric demo and EVM ecosystem tooling; build a `PaymentAdapter` so Solana can follow after hackathon. Blockchain is responsible for settlement where used and anchoring commitments (optional); agent dialogue and private proofs stay off-chain. Chain award selection is exclusive; don't claim both Solana and Arc eligibility.

A testnet payment can satisfy chain use even without a newly deployed contract, per the public Devpost rules. If using a custom anchor contract, document deployment address, chain ID, contract code and explorer URL; *do not falsely imply that anchoring an event proves it happened or was true*.

## 13. Suggested implementation stack

Monorepo: TypeScript; Vite + React for UI; Fastify/Node or lightweight API routes for server; Zod validation; SQLite for local MVP; Vitest for unit/contract tests; Playwright optional for E2E; viem / ethers for EVM wallet and signing; a sandboxed AI API for extraction with deterministic fixture fallback. No agent framework required for initial simulation. Shared domain modules implement schemas/policy and are imported by server/UI as appropriate.

## 14. Operational readiness / deployment

Demo must work with no external secrets through fixture mode. Live testnet mode needs RPC URL, funded dev wallet, appropriate chain config, and private backend signer. Do not log private keys. Documentation includes `.env.example`, commands, supported browsers, architecture, tests, known limitations, and screenshots/video.

## 15. Milestones prioritized for the deadline

- **P0:** Scaffold app; fixture replay; approval UI; deterministic policy decisions and tests; README.
- **P1:** Provenance graph + claim tracing; model extraction with safe fallback; redacted decision export.
- **P2:** Arc Testnet payment + receipt; signed event + proof verification.
- **P3:** Merkle root blockchain anchor, baseline evaluation dashboard, SaaS auth/tenant hardening.

If under deadline pressure, ship P0 plus the smallest P1/P2 demonstration rather than a polished but nonfunctional dashboard. Freeze features before video capture.

## 16. Submission deliverables and governance

See `submission-gap-audit.md`, `agent-handoff.md`, `architecture.md`, `schemas.md`, `evaluation-plan.md`, `demo-script.md`.

Do not reuse pre-hackathon code in the submitted application unless organizers approve; earlier research/dataset findings can be cited as inspiration rather than presented as code created during the event. Existing dashboard repository may predate the event; confirm when *repository and code* were created and use a compliant public repo. Team size 1-4. All code submitted must have been created during the hackathon period per published rules. Humans retain responsibility for AI-generated code.

## 17. Open decisions

- Is the separate PhishNet application repository already created during the eligible window?
- Which Arc Testnet wallet provider and testnet USDC token deployment is available right now?
- Does the Google guide prescribe specific 'Agentic Payments' on-chain requirements beyond Devpost's summary?
- Which team members (max four) will submit and who owns video, deployment, integrations?
- Can the team obtain eligible public user-facing deployment by deadline?
- Do we need an actual second autonomous agent, or do structured deterministic external-agent fixtures satisfy a complete demo? Preferred: one real LLM risk agent plus repeatable replay and controlled 'business agent' state machine.

## 18. Source links

- Official Devpost requirements: https://ubc-hackathon-2026.devpost.com/
- Official Devpost rules: https://ubc-hackathon-2026.devpost.com/rules
- Official event: https://www.universityblockchain.org/programs/hackathon
- Official guide (unreadable here; needs owner confirmation): https://docs.google.com/document/d/1QaySCo7u3VxMVNdk3C5Ab3ewc2E46AuLntti-Uzx5EY/edit?tab=t.0
- W3C PROV: https://www.w3.org/TR/prov-o/
- RFC 9162: https://www.rfc-editor.org/rfc/rfc9162.html
- EIP-712: https://eips.ethereum.org/EIPS/eip-712
- OWASP Agentic Security: https://genai.owasp.org/


## Research and training package — mandatory companion docs

Read `research-background.md` for the measured historic motivation, source-specific numerators and limitations, and `training-and-datasets.md` for licensing-gated training and evaluation strategy. Do not confuse model training with financial authorization enforcement. `training/` contains a reproducible baseline script which requires separately acquired original dataset files; it has **not** trained on an absent corpus. The preliminary presentation `PhishNet_Preliminary_Pitch.pptx` is a concept deck, not evidence of built features.
