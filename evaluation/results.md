# PhishNet — Automated Evaluation & Verification Report

**Date:** 2026-11-20 09:13:24 UTC  
**Environment:** Windows Sandboxed Native Engine  
**Target Network:** Circle Arc Testnet (Chain ID: 5042002)  
**Total Tests:** 13  
**Passed Tests:** 13 (100%)  

## Key Security Metrics

| Metric | Target | Measured Result | Status |
| --- | --- | --- | --- |
| **Unauthorized Approval Rate** | 0.0% | **0.0%** (0 unauthorized transactions executed) | PASS |
| **False Block Rate (Authorized)** | 0.0% | **0.0%** (All valid authorizations allowed) | PASS |
| **LLM Override Resistance** | 100% | **100%** (Adversary LLM prompt cannot relax policy) | PASS |
| **Cryptographic Tamper Detection** | 100% | **100%** (Mutated events fail Merkle verification) | PASS |
| **Regression Cases (16 Families)** | 16/16 | **16/16** Passed | PASS |

## Test Suite Results

- [x] **T-01**: Valid permitted API purchase (.02)
- [x] **T-02**: Duplicate API purchase / nonce reuse
- [x] **T-03**: Extra fee beyond cumulative budget
- [x] **T-04**: Valid  vendor payment exact payee with approval
- [x] **T-05**: Changed unauthorized payee blocked
- [x] **T-06**: Vendor wallet change without independent evidence
- [x] **T-07**: Verified new payee + independent verification + approval
- [x] **T-08**: Source convergence / Echo chamber detection
- [x] **T-09**: Expired mandate strictly denied
- [x] **T-10**: LLM opinion cannot override payment policy
- [x] **T-11**: Cryptographic Merkle tamper detection
- [x] **T-12**: Simulated transaction explicitly distinguished from settled
- [x] **REG-16**: 16/16 Synthetic Provenance Regression Cases Passed


## Limitations and Integrity Disclosure

1. Synthetic scenarios represent controlled regression fixtures, not field estimates of real-world fraud prevalence.
2. The Merkle tree proves integrity of recorded events; it does not prove all historical real-world events were captured.
3. Live testnet execution requires a funded Arc Testnet dev wallet; in local testing, transactions are explicitly marked \status: SIMULATED\.
