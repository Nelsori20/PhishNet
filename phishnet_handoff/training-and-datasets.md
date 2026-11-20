# PhishNet — Dataset Access, Training Strategy, and Evaluation Protocol

**Version:** 0.2 | **Status:** runnable training infrastructure supplied; **no actual real-dataset model weights have been trained in this package**.

## Why the distinction matters

The requested 'agent' combines (1) a language-based **risk/evidence extractor**, (2) a **provenance graph service**, (3) an independent **payment policy engine**. Fitting a text classifier on scam messages does *not* train financial authorization, chain-of-custody, or provenance reasoning. These must be implemented and evaluated separately. A useful agent system can use a pretrained LLM with structured extraction prompts and grounded retrieval before any LLM fine-tuning.

### What can be trained now vs later

| Track | Type | Data | State | Measured output |
|---|---|---|---|---|
| Historical SMS spam classifier | TF-IDF + logistic regression, *optional baseline only* | UCI SMS Spam Collection, 5,574 labelled SMS, CC BY 4.0 | Script supplied; dataset **not downloaded** here (execution environment has no external network) | spam/ham precision, recall, F1, confusion matrix; *not phishing performance* |
| Scam persuasion cue extractor | LLM structured in-context prompts / optionally fine-tuning | SCAMBENCH annotated persuasion spans, CC BY-NC 4.0; requires HF access acceptance | Not trained / no gated corpus included | Span/label agreement on untouched held-out groups |
| Adversarial agent-safety tests | Replay and benchmark (not training data by default) | AgentDojo / Agent Security Bench with terms evaluated | Test adapters planned | unauthorized tool actions, attack success rate, constraint violations |
| Interaction provenance classifier | Structured, verifiable claim graph | Real consented interaction traces + labeled synthetic controlled cases | Schema and scenarios supplied, not trained | missing-source detection, evidence attribution accuracy |
| Authorization engine | Deterministic, non-ML | Signed mandates, chain/asset/payee/amount, budget/nonce | Implementation specification | zero violations on enumerated policy tests |
| Real coding agent behavior | Retrieval, taxonomy development / workflow tests | SWE-chat (gated) | No download, requires access and careful domain shift | event extraction, causal references; never 'fraud' labels |
| Phishing page baseline | optional research-only model | original datathon CSV not in package, or PhreshPhish CC BY 4.0 | Cannot run until actual file is supplied | domain/time holdout phishing web classification |

## Data licensing and safety gates

- UCI SMS Spam Collection is CC BY 4.0 and allows attribution-compliant adaptation. Cite Almeida & Hidalgo (2011), DOI 10.24432/C5CC84. Older SMS spam detection is *not* proof that an agent payment is safe.
- SCAMBENCH is CC BY-NC 4.0 and gated; require authorized HF access; do not redistribute, mix in commercial SaaS training, or silently upload its messages to a third-party model endpoint without confirming permissions.
- SWE-chat is gated and primarily software-engineering traces. The team must accept source terms and review privacy/provenance before ingest.
- AgentDojo and Agent Security Bench contain contrived attack simulations; use them to evaluate generalization and tool robustness, not to claim real financial fraud examples.
- Original Datathon 215,440 records are not included in this package; a PDF summary cannot reconstruct the dataset or retrain the reported model. Seek the original CSVs, data dictionary, and split code from the team.
- Never auto-crawl live phishing URLs, download malware, collect real banking details, or store private keys in this dataset workspace.

## Code included

- `training/train_message_baseline.py`: prepares a TF-IDF/logistic regression SMS spam/ham **baseline** from a user-supplied original UCI file, de-duplicates normalized texts, partitions holdout records, checks minimum class presence, and writes model artifact plus metrics. No network requests, no sensitive training examples redistributed.
- `training/data_sources.json`: machine-readable source registry, access state, labels, rights, suitability, and citations.
- `training/README.md`: exact commands and reproducibility expectations.

## How to obtain permitted real data

1. Download original UCI dataset from https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip and verify the official dataset and license.
2. Extract `SMSSpamCollection` to `training/data/raw/SMSSpamCollection`. Do not commit this raw file or any derived model to a public repository without reviewing the license and privacy/attribution requirements.
3. Install packages in a clean virtual environment; run training script; inspect `metrics.json` and labels to avoid presenting spam detection as phishing.
4. For SCAMBENCH, obtain explicit gated access through Hugging Face and independently review the CC BY-NC terms. Use only with permission and in noncommercial conditions. Keep holdout with original/rewrite pairs in the same split.
5. For real multi-turn human/adversary dialog, review restricted scam corpora' research agreements. A bibliography is not data access.

## Eval design, not one-template overfit

**Unit of split:** source family / original conversation, not individual paraphrase. For scams, keep cue-removed rewrites with their original. For tool agent traces, keep all events from the same session together. Maintain truly separate scenario families for final evaluation.

**Strata:** human→agent; human→agent→agent; agent→agent; micropayment vs vendor payment; approved vs unverified recipient; changed amount; delayed identity claim; honest changed vendor; same story conveyed by multiple agents without independent evidence; genuine independent evidence; budget exhaustion; replayed intent; policy denied despite LLM reassurance.

**Experiment arms:** A = final-message-only LLM; B = complete-transcript LLM; C = provenance-structured agent review; D = structured review + independent deterministic authorization gate. Use identical held-out scenarios and pre-register thresholds.

**Metrics:** scam/legitimate precision, recall, false-positive rate by source; span extraction F1; provenance dependency precision/recall; verified-evidence hallucination rate; unauthorized-approval rate per transaction attempt; false-block rate; HOLD rate; latency and cost; Brier score/ECE only if model probabilities calibrated and collected.

**Disclose:** confidence intervals, small sample limits, distribution mismatch, selection bias, provenance incompleteness, how ground truth is established. Do not claim generically that a model 'recognizes social engineering' based on a single scenario.

## From dataset to deployable agent (proposed pathway)

1. **Knowledge base:** verified public research and taxonomy entries with citations and date scopes; retrieval returns specific evidence, not raw unsupported narratives.
2. **Extractor:** given text + structured source-event metadata, return JSON `{claims, persuasion_cues, source_event_ids, uncertain_facts, requested_action}`. Evidence IDs must be present in input.
3. **Independent verifier:** only tool or signed record results update verification status; an LLM cannot set a claim to `verified`.
4. **Policy gate:** typed code enforces authorization. No LLM tokens, prompts, or memory can override payee/amount/nonce checks.
5. **Audit:** event records with hashes, parent-event references, signatures and Merkle roots; explicit provenance missingness.
6. **Evaluation:** run source-family-disjoint tests before and after any model changes. The agent can be continuously evaluated without fine-tuning the base LLM.

## Model/agent acceptance gates

- A newly trained classifier must record dataset source+license, SHA-256 input checksum, split seed, date, hyperparameters, holdout metrics, class labels, and major limitations.
- A model must not be allowed to classify payments as `authorized`. It may only return *suspicion* and *supporting evidence*.
- Human approval must display exact bound payment fields, not model-generated text substitutes.
- Scoring on testnet and academic synthetic scenarios is NOT an independently validated live fraud system.
