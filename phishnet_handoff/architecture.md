# PhishNet — Technical Architecture and Threat Model

**Status:** proposed MVP system design. All addresses, keys, credentials, and receipts in examples are illustrative.

## 1. Context and deployment

```
Scenario fixtures / external-agent messages / user approval
               |
       [Ingestion boundary]
               |
     Schema validation + event writer --------------------------+
               |                                                |
     Provenance graph store (SQLite)                           |
               |                                                |
         Risk analyzer (LLM)                                    |
               |                                                |
       Typed risk findings                                      |
               v                                                v
        Deterministic preflight <--- signed mandate + wallet policy
               |
       ALLOW / HOLD / DENY + reason codes
               |
        Human approval (if required)
               |
       Isolated server-side signing adapter
               |
           Arc Testnet
               |
       Transaction receipt -> event log -> Merkle proof
```

The risk analyzer is not a payment approver. Its conclusions must be accompanied by structured references to observed evidence. Policy controls such as recipient and budget checks are always enforced in ordinary code, not delegated to LLMs. If an LLM is unavailable, the simulator and policy engine must still work.

## 2. Modules and ownership

- `web`: React/Vite pages for replay, claim lineage, payment comparison, authorization flow, audit verification. Read-only unless mode explicitly permits a safe user action.
- `api`: Fastify server; fixture/session loading, messages, analysis, preflight, decisions, receipts, proof export.
- `core`: Zod schemas; canonical amount handling (integer minor units / arbitrary precision); policy engine, event validation, reason codes.
- `provenance`: event append, refs, signatures, SHA-256 digests, Merkle root and proof routines. Use canonical JSON encoding with stable byte-level serialization rules and schema versioning.
- `model`: narrow LLM extraction adapter; structured output; timeout, bounded tool access, local fixture fallback. Model's 'verified' assertion must never satisfy independent verification without separately validated evidence.
- `chain`: Arc Testnet adapter via viem/ethers; transaction build/simulate/broadcast/receipt; strict allowlist for token and chain ID. No mainnet or unrestricted transfers.
- `eval`: scenario fixtures, ground truth, holdout tests, false-block/unauthorized-approval statistics.

## 3. Contract between modules

### Ingest
`POST /v1/sessions/{sessionId}/events` accepts event envelope after auth + schema validation; returns event ID and digest; reject duplicate `event_id` with different payload.

### Analyze
`POST /v1/sessions/{sessionId}/analyze` returns `Claim[]`, `BehaviorFinding[]`, `EvidenceRef[]`, `CoverageWarning[]` with extraction model/version and sources. Never returns an authoritative boolean 'safe'.

### Preflight
`POST /v1/preflight` accepts signed mandate reference and canonical proposed transaction; returns `decision: ALLOW | HOLD | DENY`, `reasonCodes`, `verifications`, `policyVersion`, `auditEventId`. Evaluation must be idempotent for identical request ID.

### Execute
`POST /v1/payments/{paymentId}/execute` independently rechecks mandate, exact proposed transaction payload, expiry/nonce, remaining budget, required human approval, and preflight decision before isolated signing. Only executable for ALLOW and any required confirmation. Must never trust a client-supplied decision status.

### Audit
`GET /v1/audit/{eventId}/proof` returns canonical event digest, inclusion path, committed root, batch ID, optional chain anchor/receipt. Verify locally and expose audit result.

## 4. Core entities

- **Actor:** key ID, display name (non-authoritative), human/agent/service, claims of role, verified role metadata, allowed actions.
- **Event:** immutable ID, session ID, timestamp, event type, actor, channel, typed content, references to earlier events, optional signature, attachment digest.
- **Claim:** statement and span reference, originating event, repeated-by event refs, classification `asserted|verified|disputed|unknown`, verification method/source.
- **Mandate:** signer, authorized chain ID, asset contract, exact or capped amount, permitted payee(s), scope/purpose, expiry, nonce, spending window, signature.
- **PaymentIntent:** canonical on-chain action, recipient, token, amount (base units), chain ID, caller, purpose, contract calldata if applicable.
- **PolicyDecision:** reasons, conclusion, policy version, known evidence, decision maker = code module, source event refs.
- **ExecutionReceipt:** chain ID, tx hash, block number, status, effective asset/recipient/amount, signed intent ID.
- **MerkleBatch:** leaf/event IDs, root, tree algorithm, signed operator statement, optional chain commit address/tx hash.

## 5. Provenance verification algorithms

1. Canonicalize event excluding signature field; include `schemaVersion`, `domain: phishnet.event.v1`, `eventId`, event type and parent ID digests.
2. Compute `SHA256(domain || canonicalBytes)` with distinct domain labels for event, leaf, node, signed decision.
3. Validate signatures on claimed signer events using public keys; validate key-to-role relationship via explicit enrollment, not display name.
4. Insert event and parent edges in an append-only transaction; reject cycles, missing parents when strict chain, or cross-tenant reference.
5. Derive leaf hash from event digest and sequence index; build deterministic binary Merkle tree; record root and proof path.
6. Verify root matches a trusted signed checkpoint, and optionally independent Arc chain commitment.
7. Never claim inclusion proof establishes completeness. Reconcile events at mandatory tool/payment boundaries to reduce missing-record risk.

Use existing audited serialization and Merkle packages if available; do not improvise cryptographic primitives for production. On-chain anchoring is optional to MVP; if omitted, root verification only proves consistency relative to locally trusted checkpoint.

## 6. Policy design and key assumptions

Decision precedence:
1. **DENY:** unknown chain/asset, tampered mandate, invalid signer, wrong recipient, exceeds hard spending limits, reused nonce, malformed transaction, forbidden contract action. No execution.
2. **HOLD:** missing corroboration for newly changed payee, missing required second approver, independent confirmation not yet completed, insufficient source provenance. Requires new evidence or re-authorization.
3. **ALLOW:** only if all hard constraints passed and required corroboration and user consents are present. ALLOW is *eligible*; it is not evidence of payment settlement.

Do not convert an LLM 'low risk' result into an execution override. Optional risk policy can escalate ALLOW to HOLD but must never relax hard rules.

Authorization objects must bind full wallet address (never truncated representation), network, contract/asset, amount, scope, nonce and expiration. For x402 micropayments also bind service resource, advertised price and cumulative budget, track attempts and idempotency keys.

## 7. Threats and mitigations

| Threat | Mitigation | Residual risk |
| --- | --- | --- |
| Prompt injection in third-party messages | Untrusted text isolation; tool allowlists; structured extraction; no autonomous payment tools for risk LLM | LLM still misclassifies or omits manipulation |
| User manipulated into approval | Exact canonical payload, independent provenance, separate trusted approval path, friction for risky recipient changes | Humans can still authorize deception if restrictions permit |
| Agent impersonation | Signed envelopes; key registration and scoped mandates; verify key rotation | Keys may be stolen or delegated incorrectly |
| Context laundering | Graph lineage and source-convergence checks | Missing history can hide common source |
| Replay of authorization | Nonce, expiry, consumed-budget ledger, idempotency, signed intent | Concurrent race conditions without atomic accounting |
| Time-of-check/time-of-use | Revalidate signed transaction and policy inside signer boundary | Chain state can change before confirmation |
| Privacy leak | Off-chain private store; no raw text in anchored commits; tenant isolation and retention | Guessing attacks possible against naive hashes |
| False positives | Verified benign counterfactuals, HOLD not blanket denial, outcome calibration | Incomplete real-world ground truth |
| Tampering with event database | Cryptographic signing, append-only log, Merkle roots, external anchor | Missing events never logged, malicious signer |
| Testnet faucet abuse | Bounded wallet, circuit breaker, no mainnet, per-action caps | Testnet rate limits, RPC availability |
| Third-party data-license breach | Source audit, do not redistribute restricted real corpora | Licenses may change |

## 8. Reliability expectations

- One-click reset deterministic simulator; fixture mode works with zero API keys.
- Server errors never permit signing. Fail closed.
- Model API timeout returns `analysis_unavailable` and never claims 'verified'.
- Use structured logs with request IDs but avoid raw message bodies and secrets.
- Integrate input validation, property-based policy tests if time, and E2E tests for at least 3 scenarios.
- Display chain transaction only if queried receipt supports executed status.

## 9. Deployment

- Dev: `pnpm install`; `pnpm dev`; `pnpm test`; optional `pnpm eval`.
- Preview: static SPA + managed or local API; do not publish dev credentials.
- `.env.example`: `MODEL_API_KEY`, `ARC_TESTNET_RPC_URL`, `ARC_TESTNET_CHAIN_ID`, `TEST_WALLET_PRIVATE_KEY`, `USDC_TESTNET_ADDRESS`, `ALLOW_LIVE_TESTNET=false`; *placeholders*, obtain verified chain-specific values from official Circle docs, never hard-code speculative addresses.
- CI: formatting, lint, type-check, tests, dependency audit. Explicit operator toggle for any testnet signing.

## 10. On-chain adapter fallback

If Arc integration fails by the deadline, keep a clearly labeled **simulator** with deterministic receipts and add real testnet integration only after verified transactions can be shown. Never claim the simulator fulfills the chain-award requirement. Without demonstrated usage of Arc, select chain award `None` or update submission to match actual chain use. Check full official guide for requirements.
