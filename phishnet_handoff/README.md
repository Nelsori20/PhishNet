# PhishNet — UBC 2026 Build Handoff (Documentation Only)

This is a planning package, **not the implemented or submitted hackathon application**.

## Start here
1. `submission-gap-audit.md` — official requirements, deadline and missing work.
2. `prd.md` — product intent, functional scope, acceptance criteria.
3. `architecture.md` — modules, data flow, trust boundaries and controls.
4. `schemas.md` — event, claim, payment and risk-analysis contracts.
5. `evaluation-plan.md` — data limitations, fixture families, baselines and tests.
6. `agent-handoff.md` — build instructions and copyable coding-agent prompt.
7. `demo-script.md` — 2–3-minute demonstration shot list.
8. `submission-copy.md` — Devpost answer template with explicit unverified placeholders.

## Status and critical limitations
- Official public rules confirmed at https://ubc-hackathon-2026.devpost.com/ and https://ubc-hackathon-2026.devpost.com/rules.
- Google Docs guide could not be opened and may contain additional track-specific technical requirements.
- Public existing `ubc-agent-dashboard` repository currently contains a research PhishNet dashboard, not a verified functional security product. Do not overwrite `main` or copy pre-event code into submitted code unless eligible per rules.
- The deadline is November 20, 2026 at 12:00 PM CST. Confirm the exact current clock before submission.
- No deployment, Devpost submission, wallet transaction, or source code modification was made as part of generating this documentation package.

## Intended product
One source-aware financial-agent security engine with (1) consumer advisory and (2) enterprise enforcement modes, backed by an independently enforced payment policy and an optionally blockchain-anchored interaction history.

## New: background, training, and presentation

- `research-background.md`: project origin, verified contemporary figures, exact first-party experiment limits.
- `training-and-datasets.md`: dataset matrix, rights/access, training vs deterministic policy, leakage-aware evaluation.
- `training/`: runnable **optional** UCI SMS spam/ham baseline, NOT proof of agent-fraud model training.
- `PhishNet_Preliminary_Pitch.pptx`: preliminary team pitch with source notes.

**Data access:** This runtime cannot fetch external raw datasets and SCAMBENCH/SWE-chat require gated access. No trained real-data model is included.

## Presentation review

Open `PhishNet_Preliminary_Pitch.pptx` to edit the 19-slide conceptual pitch (also `.pdf` for quick reading). Speaker notes include source blocks. The presentation is **not** a functional product demonstration, nor the required final hackathon video. See `presentation-guide.md`.
