# Optional training baseline — not an agent-fraud model

The research corpus is NOT bundled here. This environment has no outbound access to UCI's raw dataset; no real-dataset weights or metrics are claimed.

## Steps

1. Review `../training-and-datasets.md` and `data_sources.json` first.
2. Download the original dataset at https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip (CC BY 4.0). Extract `SMSSpamCollection` and save as `training/data/raw/SMSSpamCollection`.
3. From project root in a venv: `pip install scikit-learn==1.8.0 joblib==1.5.3 numpy` (versions shown were available during authoring; pin in lockfile on actual build).
4. Run `python training/train_message_baseline.py --data training/data/raw/SMSSpamCollection --out training/output`.
5. Inspect `training/output/metrics.json` for reproducibility and accuracy/precision/recall/FPR. Never call spam/ham classification a phishing or agent-authorization measurement.
6. Use the policy gate from the main app for authorization. The trained classifier must never sign or approve a payment.

`output/` and `data/raw/` should be ignored by Git. Rerun with source checksum and data split seed recorded. No automatic network fetch or controlled-site visits occur.

## Agent provenance regression fixtures

`provenance_eval_cases.jsonl` contains **16 synthetic controlled scenarios** labeled ALLOW/HOLD/DENY with reason codes. They are intended as regression tests and counterfactual checks, not as real interaction histories or performance-validating external test sets. Keep related `family_id` entries together when evaluating generalization. Never tune and test on the same case family.

## Research-grounded knowledge

`research_knowledge.jsonl` contains 19 atomic, source-linked background claims and caveats. It is an agent **retrieval/grounding** corpus; it is **not** an LLM fine-tuning dataset. See `grounding-instructions.md`.

**Technical validation:** The training script was smoke-tested with a temporary *purely synthetic* dataset to verify it executes. Those metrics have no scientific or deployment meaning and are not included as a trained artifact. A genuine real-data training run remains pending.
