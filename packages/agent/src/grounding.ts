/**
 * PhishNet Agent Grounding Knowledge Base
 *
 * Provides research citations, verified metrics, caveats, and product invariants
 * as structured context for the Risk Analysis Agent.
 *
 * NOTE: This is grounding retrieval, NOT fine-tuning weights.
 */

export interface GroundingRecord {
  id: string;
  claim: string;
  type: string;
  source: string;
  caveat: string;
  training_role: string;
}

export const RESEARCH_KNOWLEDGE: GroundingRecord[] = [
  {
    id: 'AUTH-001',
    claim: 'A verified cryptographic signature proves key control over a signed message, not truthfulness of its claim.',
    type: 'security-principle',
    source: 'https://eips.ethereum.org/EIPS/eip-712',
    caveat: 'Signatures need recipient/chain/amount/expiry/nonce binding and trusted identity records.',
    training_role: 'retrieval_grounding_only'
  },
  {
    id: 'PAY-001',
    claim: 'Never permit language model risk judgments to override deterministic authorization policy.',
    type: 'product-invariant',
    source: 'prd.md',
    caveat: 'Must be tested at tool and signer boundary.',
    training_role: 'retrieval_grounding_only'
  },
  {
    id: 'PAY-002',
    claim: 'If an agent says verified but only copies a single unverified source, the claim remains unverified.',
    type: 'product-invariant',
    source: 'architecture.md',
    caveat: 'Source multiplication is not independent evidence.',
    training_role: 'retrieval_grounding_only'
  },
  {
    id: 'PAY-003',
    claim: 'Consumer advisory mode does not claim control of external payments it cannot enforce.',
    type: 'product-invariant',
    source: 'prd.md',
    caveat: 'Keep advisor and SaaS enforcement separate.',
    training_role: 'retrieval_grounding_only'
  },
  {
    id: 'PAY-004',
    claim: 'A new vendor recipient with independent authenticated verification and fresh signed intent can be legitimate.',
    type: 'product-invariant',
    source: 'evaluation-plan.md',
    caveat: 'Avoid blocking all changed recipients.',
    training_role: 'retrieval_grounding_only'
  },
  {
    id: 'PROV-001',
    claim: 'Merkle inclusion proofs show an event commitment belongs to a root; they do not prove all events were collected.',
    type: 'security-principle',
    source: 'https://www.rfc-editor.org/rfc/rfc9162.html',
    caveat: 'Preserve privacy and chain of custody.',
    training_role: 'retrieval_grounding_only'
  },
  {
    id: 'VISA-001',
    claim: 'Visa Onchain Analytics observed 298.9 million x402+MPP transactions and 58.6 million USD unadjusted tracked volume.',
    type: 'observational-dashboard',
    source: 'https://www.visaonchainanalytics.com/agentic-payments',
    caveat: 'Dynamic snapshot; not verified autonomous or revenue.',
    training_role: 'retrieval_grounding_only'
  },
  {
    id: 'SCAM-002',
    claim: 'LLM-based detectors performed worse on scam examples reworded to remove obvious urgency cues.',
    type: 'research',
    source: 'https://aclanthology.org/2026.findings-emnlp.404/',
    caveat: 'No single wording detector can guarantee safety.',
    training_role: 'retrieval_grounding_only'
  }
];

export function getGroundingContext(topic?: string): GroundingRecord[] {
  if (!topic) return RESEARCH_KNOWLEDGE;
  return RESEARCH_KNOWLEDGE.filter(
    (k) =>
      k.claim.toLowerCase().includes(topic.toLowerCase()) ||
      k.type.toLowerCase().includes(topic.toLowerCase())
  );
}
