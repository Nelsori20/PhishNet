/**
 * PhishNet Core Schemas and Contracts
 * Version: 1.0.0
 */

export type ActorKind = 'human' | 'agent' | 'service';
export type Channel = 'chat' | 'email' | 'agent_a2a' | 'tool' | 'wallet' | 'policy';
export type TrustLevel = 'untrusted' | 'authenticated' | 'authorized' | 'verified_external';
export type EventType =
  | 'message'
  | 'tool_result'
  | 'claim'
  | 'authorization'
  | 'payment_proposal'
  | 'verification'
  | 'policy_decision'
  | 'payment_receipt';

export interface Actor {
  actorId: string;
  kind: ActorKind;
  displayName?: string;
  verifiedIdentity?: string;
  publicKey?: string;
}

export interface EventEnvelope {
  schemaVersion: '1';
  eventId: string;
  sessionId: string;
  timestamp: string; // ISO 8601 UTC
  actorId: string;
  actorKind: ActorKind;
  channel: Channel;
  eventType: EventType;
  sourceTrust: TrustLevel;
  payload: Record<string, unknown>;
  parentEventIds: string[]; // DAG edges
  contentDigest?: string; // SHA-256 domain-separated
  signerKeyId?: string;
  signature?: string;
}

export interface PaymentMandate {
  mandateId: string;
  authorizerKeyId: string;
  authorizerKind: ActorKind;
  chainId: string;
  assetContract: string; // e.g. "USDC" or token address
  allowedRecipient: string; // case-normalized address
  amountMaxBaseUnits: string; // minor units as string (e.g. "250000000" for 250 USDC)
  cumulativeBudgetBaseUnits: string;
  consumedBudgetBaseUnits?: string;
  purposeCode: string;
  validAfter: string; // ISO UTC
  validUntil: string; // ISO UTC
  nonce: string;
  allowedMethods?: string[];
  typedSignature?: string;
  verificationState: 'mock' | 'verified';
}

export interface PaymentProposal {
  requestId: string;
  sessionId: string;
  mandateId: string;
  chainId: string;
  assetContract: string;
  amountBaseUnits: string;
  recipient: string;
  purposeCode: string;
  nonce?: string;
  sourceEventIds: string[];
}

export type ReasonCode =
  | 'RECIPIENT_MISMATCH'
  | 'AMOUNT_EXCEEDS_LIMIT'
  | 'BUDGET_EXHAUSTED'
  | 'CHAIN_NOT_ALLOWED'
  | 'ASSET_NOT_ALLOWED'
  | 'EXPIRED_MANDATE'
  | 'MANDATE_NOT_YET_VALID'
  | 'INVALID_SIGNATURE'
  | 'REPLAY_NONCE'
  | 'NEW_PAYEE_UNVERIFIED'
  | 'UNSUPPORTED_AGENT_CLAIM'
  | 'MISSING_REQUIRED_APPROVAL'
  | 'AUTHORIZED_AND_VERIFIED'
  | 'PURPOSE_AND_AMOUNT_OUTSIDE_SCOPE'
  | 'EVIDENCE_DEPENDENCY_SINGLE_SOURCE'
  | 'SIGNATURE_NOT_VERIFIABLE'
  | 'ANALYSIS_UNAVAILABLE';

export interface PreflightDecision {
  requestId: string;
  decisionId: string;
  decision: 'ALLOW' | 'HOLD' | 'DENY';
  reasonCodes: ReasonCode[];
  policyVersion: string;
  claimIds: string[];
  evidenceIds: string[];
  issuedAt: string;
  authoritativeDetails: {
    recipient: string;
    amountBaseUnits: string;
    asset: string;
    chainId: string;
    humanApprovalRequired: boolean;
    humanApprovalGranted?: boolean;
  };
}

export interface Claim {
  claimId: string;
  quotedSpan: string;
  originatingEventId: string;
  repeatedByEventIds: string[];
  evidenceIds: string[];
  verification: 'verified' | 'unverified' | 'conflicting' | 'unknown';
  attributedActorId: string;
}

export interface ManipulationIndicator {
  type:
    | 'authority_claim'
    | 'urgency'
    | 'relationship_pressure'
    | 'instruction_laundering'
    | 'source_convergence'
    | 'payment_detail_change'
    | 'other';
  evidenceEventIds: string[];
  explanation: string;
}

export interface RiskAnalysis {
  sessionId: string;
  modelId: string;
  observedEventIds: string[];
  claims: Claim[];
  manipulationIndicators: ManipulationIndicator[];
  missingInformation: string[];
  recommendation: 'ADVISORY_CLEAR' | 'REVIEW' | 'ESCALATE';
  sourceConvergenceDetected: boolean;
  convergenceDetails?: string;
}

export interface ExecutionReceipt {
  receiptId: string;
  requestId: string;
  chainId: string;
  txHash: string;
  blockNumber: number;
  status: 'SETTLED' | 'SIMULATED' | 'FAILED';
  asset: string;
  recipient: string;
  amountBaseUnits: string;
  executedAt: string;
  explorerUrl?: string;
  isSimulated: boolean;
}

export interface MerkleProof {
  eventId: string;
  leafHash: string;
  rootHash: string;
  proofPath: Array<{ position: 'left' | 'right'; hash: string }>;
  verified: boolean;
}
