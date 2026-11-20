# UBC 2026 Hackathon — Submission Gap Audit

**Audit date:** 2026-11-20 (time-sensitive; verify official page at submission).  
**Official public sources:** https://ubc-hackathon-2026.devpost.com/ and https://ubc-hackathon-2026.devpost.com/rules.  
**Full Google guide:** https://docs.google.com/document/d/1QaySCo7u3VxMVNdk3C5Ab3ewc2E46AuLntti-Uzx5EY/edit?tab=t.0 — could not be accessed from this environment; guide-specific technical requirements are **not verified**.  
**Actual current application status:** We inspected GitHub repository metadata and directory listings, not a full test run. `phishnet/README.md` explicitly describes the branch as a static research dashboard, not a live detector or operational crypto-payment app.

## A. Confirmed official submission requirements

| Requirement | Verified rule | Evidence / current status | Priority |
| --- | --- | --- | --- |
| Deadline | **Friday Nov 20, 2026, 12:00 PM CST** | Confirmed official Devpost; submit before this time | BLOCKER |
| Main track | Select **exactly one**: Agentic Payments and AI / DeFi and Onchain / Consumer | **Recommended:** Agentic Payments and AI; team selection not verified | BLOCKER |
| Chain award | Optional, choose Best use of **Solana OR Arc**, never both | **Recommended:** Arc only if working Arc testnet usage is demonstrated | HIGH |
| Bounties | Optional; may enter any qualifying sponsored bounties | None selected; verify criteria individually before opting in | OPTIONAL |
| Eligibility | 1–4 members; in-person finalist attendance required for prizes; Devpost detailed eligibility language varies across pages | Team roster and eligibility not verified | BLOCKER |
| Built during event | All submitted code must be original and made during hackathon, per rules (event kickoff Nov 12; detailed rule says work before Nov 13 not allowed) | Existing research dashboard and repository may predate code window; don't submit reused code until validated | BLOCKER |
| AI assistance | AI tools allowed; people remain primary builders | Confirm team reviews and owns submissions | HIGH |
| Public repository | Public GitHub repo **created during hackathon**, working source | Existing `watsoncsulahack/ubc-agent-dashboard` is public, but creation date/compliance and app implementation not established | BLOCKER |
| README | Technical docs + architecture overview | Research branch has research README, not application build/install/API docs | BLOCKER |
| Working demo | Working deployed app or demonstrable functional build | Research dashboard exists, but functionality of financial engine unverified / no evidence of real payment | BLOCKER |
| Video | 2–3 minute demo video, accessible via YouTube or Drive | No video URL verified | BLOCKER |
| Written answers | What built/problem/how unique/next steps; technology/sponsor tools | Draft file `submission-copy.md` generated; needs factual completion and team review | BLOCKER |
| Track-specific details | Addresses/contract or program IDs if applicable; finer requirements in official Google guide | Guide not accessible and testnet implementation not verified | BLOCKER |
| Prize opt-ins | Select matching track/chain/bounties on form | Not verified | HIGH |

## B. Existing assets, not a verified submission

- Public GitHub repo: https://github.com/watsoncsulahack/ubc-agent-dashboard (`main` hosts a research dashboard).
- Development branch: https://github.com/watsoncsulahack/ubc-agent-dashboard/tree/feat/phishnet-research-dashboard contains `phishnet/index.html`, `phishnet/unified/index.html` and `phishnet/README.md`.
- `phishnet/README.md` says: *This is a research/architecture dashboard, not a live phishing detector or an operational crypto-payment application.*
- This ChatGPT session includes a conceptual interactive prototype; it does not count as deployed production code.
- Prior PhishNet datathon study/figures, SCAMBENCH, agent security research and dashboard are useful references but do not demonstrate completed hackathon work.
- PRD/handoff docs in this package are freshly authored planning artifacts; **they are not a tested implementation or submitted project**.

## C. Urgent missing artifacts to produce

1. **Compliant source repo with timestamp provenance**: new original PhishNet project repo created within allowed period, or organizers explicitly approve current repo and provenance. Do not change existing dashboard's Pages configuration without team consent.
2. **Runnable product**: UI with multi-stage trace, source lineage, payment proposal, security reviewer and deterministic financial policy gate; local fixture mode.
3. **Real blockchain proof**: Arc Testnet USDC transaction(s) with receipt link, or honest alternate chain use if Arc unavailable. Award choice must match implemented chain.
4. **Tests**: malicious recipient blocked; valid changed recipient with updated authorization allowed; micropayment budget exhausted denied; forged/expired mandate denied; no LLM override.
5. **Hosted working demo**: public URL, screenshot, no private key leaks.
6. **Video**: 2–3 minutes covering threat, interaction graph, differing outcomes, on-chain proof, and architecture.
7. **Complete README**: installation, environment, architecture, API, model, test data, safe limitations, exact chain contract IDs.
8. **Submission fields**: title, concise problem/uniqueness answers, up to four member identities, track, chain award, sponsor tools actually used, code URL, live demo URL, video URL, chain addresses.
9. **Google guide review**: confirm main-track-specific technical criteria and prize details not fully captured on Devpost.
10. **Proof of completed Devpost submission**: confirmation page or email, verified by a team member.

## D. Suggested action order under time pressure

**Next 30–60 minutes:** verify member roster, repo eligibility, guide-specific requirements, choose Arc vs Solana; scaffold working fixture demo and deterministic gate.  
**Next coding block:** claim provenance, LLM extraction, robust test cases, Arc Testnet integration if viable.  
**Before video:** lock functionality, run all tests, check mobile and desktop UI, collect actual receipt/hash if available.  
**Before deadline:** publish repo and runnable app, record and upload video, fill form, verify public access from an incognito browser, submit, save confirmation.

**Caution:** These are action priorities, not a promised completion schedule. Do not assume time available; official deadline is absolute and should be checked against current Austin/CST local time.

## E. Guide/source caveats

The linked Google Doc returned an access failure. Devpost's public rules and overview were directly available and are the authoritative basis of the items above. Where pages disagree on event start vs code eligibility, follow the stricter rule or seek organizer clarification. Devpost describes kickoff Nov 12 at 6 PM CST while the detailed rules explicitly disallow work created before Nov 13. Do not silently resolve that contradiction by assuming older code is eligible.

## F. Link register

- Official event https://ubc-hackathon-2026.devpost.com/
- Rules https://ubc-hackathon-2026.devpost.com/rules
- Dates https://ubc-hackathon-2026.devpost.com/details/dates
- Organizer overview https://www.universityblockchain.org/programs/hackathon
- Google guide (needs manual review) https://docs.google.com/document/d/1QaySCo7u3VxMVNdk3C5Ab3ewc2E46AuLntti-Uzx5EY/edit?tab=t.0

## Context and training additions (Nov 20, 2026)

- [x] Historical evidence library, primary-source distinctions and source-level caveats documented (`research-background.md`).
- [x] Preliminary research/pitch slide deck prepared, not the required 2–3-minute *working-app* video (`PhishNet_Preliminary_Pitch.pptx`).
- [x] Agent grounding records and runnable optional UCI SMS training script prepared (`training/`).
- [ ] Obtain original datathon raw CSV if using it to train a page classifier; the PDF is not the training corpus.
- [ ] Accept SCAMBENCH gated terms and check CC BY-NC requirements before noncommercial experimentation; commercial training must not use it without permission.
- [ ] Obtain allowed real multi-turn traces with consent, source provenance and licensing.
- [ ] Run and document any claimed real-dataset training with checksum and held-out metrics (NOT completed here).
- [ ] Verify all final deck numbers against stable copies and update the dynamic Visa dashboard snapshot timestamp.
- [ ] Confirm the inaccessible official Google track guide and amend requirements when available.
