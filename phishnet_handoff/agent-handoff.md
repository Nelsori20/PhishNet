# PhishNet — Coding-Agent Handoff

Read `prd.md`, `architecture.md`, `schemas.md`, `evaluation-plan.md`, and `submission-gap-audit.md` in full before editing code. This is an original hackathon build; do not copy pre-event application code from earlier research dashboards. No modifications to the existing `ubc-agent-dashboard` main branch without explicit approval.

## Objective
Build a working, tested, public demo of **multi-stage agent social-engineering provenance + financial authorization**. A consumer can inspect advice; a developer can enforce a `preflight` policy against small x402-like API payments and larger USDC vendor payments. Default to Arc Testnet; only claim on-chain functionality when actual receipts exist. Single security engine, two UX modes.

## Required first response from coding agent
1. Inventory workspace files and identify newly created vs pre-existing material.
2. Confirm the project's eligible coding window against official rules; flag any possible pre-event code.
3. Produce short proposed file tree, implementation sequence and major technical risks.
4. Identify any unavailable API keys/RPC or missing guide content. Continue building fixture mode without waiting for secrets.

## Do not do
- Do not push, deploy, submit to Devpost, or replace a GitHub Pages source without human approval.
- Do not send cryptocurrency on mainnet or import real user wallets.
- Do not use production credentials, collect user messages, or publish private conversations.
- Do not hard-code a chain ID or USDC testnet contract address unless verified from official Arc docs.
- Do not let the risk LLM sign, execute, or override a hard policy decision.
- Do not call fake results 'real on-chain transactions'.
- Do not tune only for one scripted attacker message. Include benign counterfactuals.

## Suggested repository layout

```text
phishnet/
  README.md
  package.json
  pnpm-workspace.yaml
  .env.example
  apps/
    web/src/{App.tsx,components/,pages/,hooks/}
    api/src/{server.ts,routes/,middleware/}
  packages/
    core/src/{schemas.ts,policy.ts,amount.ts,errors.ts}
    provenance/src/{graph.ts,hash.ts,merkle.ts,verify.ts}
    agent/src/{extractor.ts,fixtures.ts,model-adapter.ts}
    chain/src/{payment-adapter.ts,arc.ts,simulator.ts}
  data/fixtures/{vendor,api-fee,verified-update}/
  tests/{policy.test.ts,graph.test.ts,merkle.test.ts,api.test.ts}
  docs/ (copy handoff docs)
```

Simplify this structure if setup overhead threatens delivery; preserve separation between policy enforcement and LLM inference.

## Ordered implementation tasks

### Sprint A: standalone product
- Scaffold Vite/React UI, API, shared Zod schemas, fixture loader.
- Implement scenario timeline, linked sources/claims, authorization/payment panels; three scenarios including one legitimate variant.
- Implement deterministic policy engine in pure functions, with tests. Require strict amount/recipient/chain matching and idempotent nonce accounting.
- Add mode switch for Advisory vs Enforcement. Advisory never claims it blocks an external payment; Enforcement blocks access to server-controlled signer.
- Ensure demo works entirely in fixture mode.

### Sprint B: system analysis
- Implement event DAG with typed provenance edges.
- Add risk LLM adapter returning structured fields and evidence IDs; fail safe with deterministic fixture labels on timeout; never treat model statements as verified facts.
- Add `POST /v1/preflight` and audit trace export; show unsupported-claim convergence across agents.
- Add separate examples for x402-style micropayment (budget + duplicate control) and larger vendor transfer (recipient authorization + human review).

### Sprint C: cryptographic demonstration
- Sign selected event envelope; compute canonical hash and Merkle proof; write verification tests including tampering.
- Integrate Arc Testnet USDC transfer and receipt if viable, with server-side isolated dev signer and verified chain configuration.
- Optional testnet anchor root if full payment flow already works.

### Sprint D: completion
- README, `.env.example`, tests, architecture diagram, deployed preview, screenshots, evaluation results, video and Devpost answer drafts.
- Manually verify all URLs in private/incognito browser and all test cases.

## Completion contract

Only report feature as COMPLETE when you supply evidence:
- application boots (command + actual output),
- tests run (test command, counts, failure status),
- browser click-through executed for all three scenarios,
- receipt hash/explorer link for any claimed testnet payment,
- source repository URL and commit SHA,
- published demo URL when actually live,
- known shortcomings and unsupported functionality.

## Critical test cases

1. Unauthorized payee repeated by two agents -> claim provenance identifies one unverified source; signer denied or held.
2. Same payment amount to exact authorized payee -> eligible, approval required if policy says so.
3. Valid vendor update with independently authenticated verification and fresh signed mandate -> eligible.
4. $0.02 authorized service request -> eligible within budget.
5. Additional unapproved API fee and cumulative budget limit -> denied.
6. LLM produces 'SAFE' but policy recipient mismatch -> denied anyway.
7. Malformed model output / API timeout -> cannot grant payment.
8. Replayed expired mandate -> denied.
9. Tampered event/proof -> cryptographic verification fails.
10. No receipt -> UI must not show completed on-chain settlement.

## Suggested initial agent prompt

> Build the original PhishNet hackathon MVP from the attached `prd.md`, `architecture.md`, `schemas.md`, and `evaluation-plan.md`. Start by inspecting the workspace and providing an architecture plan. Prioritize a working multi-stage interaction UI and independent payment policy gate before AI integrations or blockchain polish. Use TypeScript, Vite/React, Zod, a small Node API, Vitest, and a fixture fallback. Implement three scenario families with benign controls, full provenance links, two payment scales, and redacted evidence exports. Add Arc Testnet receipt flow only with verified official chain parameters and funded testnet wallet. Never permit LLM output to override signing policies. Show the exact commands and proof for every completed feature, and never deploy/push without approval. Treat the Devpost deadline and eligible-code rule as hard constraints.

## Delivery priority
Functional product > verified payment flow > provenance graph > model explanation > event proof > extra dashboards. A compelling three-minute demo beats a feature-rich but unreliable prototype.

## Research evidence and training implementation

Before coding, read `research-background.md` and `training-and-datasets.md`. Load `training/data_sources.json` as a registry, not as raw samples. Use the structured claim extractor and policy separation described in the training strategy. Do NOT state that SCAMBENCH, SWE-chat, or the original 215,440-record datathon CSV have been ingested unless you actually obtained permitted files and tracked run metadata. The included training script is for an OPTIONAL UCI SMS spam/ham research baseline only; it does not train multi-agent fraud detection. Obtain access consent and document license; never silently fine-tune or call an external LLM on nonpublic messages. Provide commands and measured results for any genuine training run.
