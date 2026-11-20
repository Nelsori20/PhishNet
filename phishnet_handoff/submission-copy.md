# PhishNet — Draft Devpost Submission Answers (VERIFY BEFORE PUBLISHING)

**Status: Draft only; do not submit unverified claims.**

## Name
PhishNet — Trust Provenance for Agentic Payments

## Tagline
Trace the claims behind AI payment recommendations before money moves.

## What did you build?
We built [FILL IN ACTUAL SHIPPED FEATURES] for reviewing multi-stage human/AI-agent interactions that lead to financial proposals. Our [CONFIRM] prototype represents each recommendation as a traceable chain of events, claims, verification evidence, and payment authorization. Users can inspect where a claim originated and whether independent evidence supports it. [CONFIRM] Optional enterprise preflight validates transaction details against signed spending restrictions before a wallet action is permitted.

## What problem does it solve?
As humans delegate financial decisions to AI agents, social-engineering claims can pass through multiple conversations and appear trustworthy because another agent repeated them. Standard URL classifiers may miss deceptive workflows without links, and an LLM's confident assessment cannot replace cryptographic authorization. PhishNet exposes the original evidence and separates risk advice from enforceable payment rules.

## How does it work?
[CONFIRM] The UI replays structured interaction histories; a provenance graph links claims to origin events. A risk reviewer identifies manipulation cues and unsupported assertions, and an independent policy engine evaluates actual payment chain, asset, recipient, amount, budget, nonce, and authorization. The system returns `ALLOW`, `HOLD`, or `DENY` plus explanations. For on-chain features: [INSERT VERIFIED ARCTESTNET HASH / CODE / EXPLORER LINK OR REMOVE].

## What is unique?
PhishNet focuses on *claim lineage and trust-boundary crossings* over multi-stage interactions, not only the final suspicious phrase. It explicitly distinguishes authenticated agent identity, trustworthy underlying evidence, and transaction authorization. The consumer advisory and developer enforcement modes share one engine while preserving separate permissions.

## What next?
Expand real-world, consented trace ingestion and dataset evaluation; integrate third-party payment agents; harden enterprise authentication and independent merchant verification; add verifiable event checkpoints and a privacy-preserving evidence export; conduct user research into whether evidence-first approvals reduce false reassurance.

## Technologies
[LIST ONLY ACTUALLY USED: e.g. TypeScript, React, Node, LLM vendor/version, Zod, SQLite, Arc Testnet, USDC, viem/ethers, etc.]

## Track / award
- Main track: **Agentic Payments and AI** (recommended, needs team confirmation).
- Chain award: **Best use of Arc** (ONLY if actual Arc usage is verified), else None.
- Optional bounties: none by default. Select only if mandatory bounty implementation works and is demonstrated.

## Links and data to fill
- Team members (1–4): [NAMES]
- Public eligible source repo: [URL]
- README architecture and run commands: [URL]
- Live working app: [URL]
- 2–3-minute video: [URL]
- Testnet tx receipt/chain ID/contract: [URL or NOT IMPLEMENTED]
- Demo date and tests passed: [FACTUAL RESULTS]
- Source licenses and third-party acknowledgments: [LIST]
