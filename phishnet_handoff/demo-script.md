# PhishNet — 2–3 Minute Demo Script and Shot List

**Duration target:** 2:30. Narration template must be revised to match *actually working features*. Do not show simulated payments as real.

| Time | Shot | Narration guide / evidence |
| --- | --- | --- |
| 0:00–0:20 | Human and two agents, incoming payment request | 'A malicious or unreliable claim can move through multiple agents and become a confident payment recommendation.' |
| 0:20–0:45 | Replay vendor interaction stages | Show original authorization and subsequent changed wallet claim. Point out where the source first appears. |
| 0:45–1:10 | Expand provenance relationship panel | 'Two agents repeated the claim, but both trace back to the same unverified source.' Use real graph references. |
| 1:10–1:35 | Transaction screen | Show exact amount/recipient and original signed intent. PhishNet marks unsupported claim and recipient mismatch. |
| 1:35–1:55 | Enforced preflight | Show deterministic `DENY` or `HOLD` with reasons. Verify no signer call occurred; LLM opinion cannot override. |
| 1:55–2:15 | Benign counterfactual or micropayment | Show legitimate verified update or authorized small API purchase pass. Demonstrate not everything gets blocked. |
| 2:15–2:35 | Arc Testnet/explorer or testnet mode | Display **actual** tx hash/receipt if verified; otherwise identify simulator and omit chain-award claim. |
| 2:35–2:50 | Architecture and scope | 'One advisory engine for users, optional enforcement for financial services, auditable off-chain interaction records.' |

## Recording checklist

- App in fullscreen at readable zoom; cursor visible; no browser error console or secret keys.
- Show 2 scenarios with visibly different legitimate/unauthorized outcomes.
- Show one concrete policy rule and one source-to-claim relationship; avoid vague AI magic.
- Show exact on-chain transaction hash and chain ID ONLY if successful.
- Public accessible YouTube/Drive video, permissions checked in incognito browser.
- Video title, problem, stack, team, license/citation notes and link in Devpost/README.
- Keep <=3 minutes per official Devpost guidance.
