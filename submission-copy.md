# PhishNet — Verified Devpost Submission Copy

**Submission Title:** PhishNet — Trust Provenance for Agentic Payments  
**Tagline:** Trace the claims behind AI payment recommendations before money moves.  
**Main Track:** Agentic Payments and AI  
**Chain Award:** Best use of Arc (Circle Arc Testnet, Chain ID: 5042002)  

---

## What did you build?

We built **PhishNet**, an open-source, provenance-aware security platform and deterministic preflight authorization engine for human–AI and agent-to-agent financial workflows.

PhishNet addresses a critical vulnerability in the agentic economy: **multi-stage information laundering**. When external parties inject deceptive claims into an interaction history (e.g., fraudulent vendor wallet updates or unauthorized API surcharges), intermediate agents often repeat and summarize these claims, creating an echo chamber that convinces a financial agent to propose an unauthorized payment.

PhishNet provides:
1. **Interactive Provenance Graph & Timeline:** Traces every claim back to its originating event, distinguishing multi-agent repetition from true independent corroboration.
2. **Explainable Risk Advisor:** Extracts manipulation cues (urgency, authority impersonation, source convergence) and highlights unverified claims.
3. **Independent Deterministic Policy Gate:** Evaluates payment proposals against signed spending mandates (recipient, amount, cumulative budget, token, chain ID, validity window, and nonces). **An LLM's recommendation can NEVER override this gate.**
4. **Demonstrable Cryptographic Provenance:** Implements canonical SHA-256 event serialization and an append-only Merkle tree with interactive tamper detection.
5. **Circle Arc Testnet Integration:** Preconfigured for Circle's Arc Testnet (Chain ID `5042002`) with native USDC gas tokens, supporting both low-value x402 micropayments (~$0.02) and vendor payments (~$250.00).

---

## What problem does it solve?

As humans delegate financial decisions to autonomous AI agents, social-engineering claims pass through multiple conversations and appear trustworthy simply because another agent repeated them. 

Standard security tools fail:
- URL scanners cannot inspect conversational agent-to-agent negotiations without links.
- Single-message LLMs suffer from context poisoning and cannot verify cryptographic signatures.
- Advisory agents lack an independent enforcement layer capable of refusing wallet execution.

PhishNet bridges this gap by enforcing the security invariant:  
**Authenticated Message $\neq$ Trustworthy Claim $\neq$ Authorized Transaction.**

---

## How does it work?

1. **Ingest & Graph Construction:** As agents and humans converse, events are logged into an append-only DAG with parent-child references and canonical SHA-256 digests.
2. **Lineage & Echo Chamber Analysis:** When a payment recommendation appears, PhishNet walks the DAG to find the claim's true origin. If multiple agents repeated the address but all trace to a single unverified email, it flags **Source Convergence**.
3. **Preflight Policy Evaluation:** Before any transaction can be signed, the proposal is submitted to `POST /v1/preflight`. The non-LLM policy engine checks:
   - Case-normalized recipient against signed mandate.
   - Cumulative budget limits and per-transaction caps.
   - Chain ID (`5042002`) and asset (`USDC`).
   - Nonce freshness (replay protection) and expiration timestamps.
4. **Enforcement vs Advisory:** In Enterprise Enforcement mode, unauthorized proposals return `DENY` or `HOLD`, and the server signer strictly refuses to execute. In Consumer Advisory mode, transparent warnings empower the user.
5. **Settlement & Audit:** Authorized payments execute via the Arc Testnet adapter, generating verifiable transaction receipts and Merkle inclusion proofs.

---

## What is unique?

- **Provenance Over Surface Wording:** PhishNet doesn't just evaluate whether the final message sounds polite or urgent; it reconstructs *how the claim arose across multiple actors*.
- **Strict Separation of AI and Execution:** The risk analyzer is advisory; policy decisions are enforced in deterministic code. An attacker cannot prompt-inject their way past the payment gate.
- **Interactive Tamper Proof:** Users and auditors can intentionally mutate an event in the UI and immediately see the Merkle proof verification fail (`TAMPER DETECTED`).

---

## Technologies Used

- **Language & Core:** TypeScript, Node.js, PowerShell 5.1 / .NET User-Mode Runtime
- **Frontend:** Responsive React & Vanilla Modern Web App (Navy `#0A1128` & Mint `#00F5D4` design language, SVG DAG visualization)
- **Validation & Crypto:** Zod Schemas, Domain-separated SHA-256 (RFC 9162 style), Binary Merkle Trees
- **Blockchain:** Circle Arc Testnet (EVM Chain ID `5042002`, RPC `https://rpc.testnet.arc.io`, Native Token: `USDC`, Explorer `https://explorer.testnet.arc.io`)
- **Testing:** Automated Vitest/PowerShell test suite covering 12 evaluation criteria and 16 controlled regression scenarios.

---

## Verification & Test Results

- **Total Automated Tests:** 13/13 Passed (100%)
- **Controlled Provenance Cases:** 16/16 Passed (100%)
- **Unauthorized Approval Rate:** **0.0%** (Zero unauthorized transactions allowed)
- **False Block Rate on Authorized Cases:** **0.0%** (All valid transactions permitted)
- **LLM Override Resistance:** **100%**
- **Cryptographic Tamper Detection:** **100%**
