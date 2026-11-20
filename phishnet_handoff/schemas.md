# PhishNet — Data Contracts and Example Fixtures

All examples are fictional. Use precise decimal-safe units rather than JavaScript floating-point for monetary amounts.

## 1. Typed event envelope

```ts
type ActorKind = 'human' | 'agent' | 'service';
type Channel = 'chat' | 'email' | 'agent_a2a' | 'tool' | 'wallet' | 'policy';
type TrustLevel = 'untrusted' | 'authenticated' | 'authorized' | 'verified_external';
type EventType = 'message' | 'tool_result' | 'claim' | 'authorization' |
  'payment_proposal' | 'verification' | 'policy_decision' | 'payment_receipt';
interface EventEnvelope {
  schemaVersion: '1';
  eventId: string;
  sessionId: string;
  timestamp: string; // ISO UTC
  actorId: string;
  actorKind: ActorKind;
  channel: Channel;
  eventType: EventType;
  sourceTrust: TrustLevel;
  payload: Record<string, unknown>;
  parentEventIds: string[]; // DAG edges, all referenced IDs must exist in tenant
  contentDigest?: string; // sha256 with domain separation
  signerKeyId?: string;
  signature?: string;
}
```

## 2. Example interaction graph

```json
{
  "sessionId": "session-vendor-01",
  "actors": [
    {"actorId":"owner","kind":"human"},
    {"actorId":"vendor-agent","kind":"agent"},
    {"actorId":"research-agent","kind":"agent"},
    {"actorId":"financial-agent","kind":"agent"}
  ],
  "events": [
    {"eventId":"evt-01","eventType":"authorization","actorId":"owner","parentEventIds":[],"payload":{"intentId":"m-01","amountMinor":"250000000","asset":"USDC","recipient":"0x1111111111111111111111111111111111111111"}},
    {"eventId":"evt-02","eventType":"message","actorId":"vendor-agent","parentEventIds":[],"payload":{"claim":"vendor wallet changed","recipient":"0x2222222222222222222222222222222222222222"}},
    {"eventId":"evt-03","eventType":"claim","actorId":"research-agent","parentEventIds":["evt-02"],"payload":{"claim":"new wallet is verified","verificationEvidence":[]}},
    {"eventId":"evt-04","eventType":"payment_proposal","actorId":"financial-agent","parentEventIds":["evt-01","evt-03"],"payload":{"amountMinor":"250000000","asset":"USDC","recipient":"0x2222222222222222222222222222222222222222"}}
  ]
}
```

The same underlying origin is referenced by multiple messages. Apparent multi-agent agreement is not equivalent to independent corroboration.

## 3. Payment mandate

```ts
interface PaymentMandate {
  mandateId: string;
  authorizerKeyId: string;
  chainId: string;
  assetContract: string; // verified contract address
  allowedRecipient: string; // exact case-normalized address
  amountMaxBaseUnits: string;
  cumulativeBudgetBaseUnits: string;
  purposeCode: string;
  validAfter: string;
  validUntil: string;
  nonce: string;
  allowedMethods?: string[];
  typedSignature?: string;
  verificationState: 'mock' | 'verified';
}
```

For EIP-712 binding, also specify application domain, version, chain ID, verifying contract (when applicable), and unique nonce; maintain server-side nonce consumption/replay protection.

## 4. Payment request / decision

```ts
interface PaymentProposal {
  requestId: string;
  sessionId: string;
  mandateId: string;
  chainId: string;
  assetContract: string;
  amountBaseUnits: string;
  recipient: string;
  purposeCode: string;
  sourceEventIds: string[];
}
type ReasonCode =
  | 'RECIPIENT_MISMATCH' | 'AMOUNT_EXCEEDS_LIMIT' | 'BUDGET_EXHAUSTED'
  | 'CHAIN_NOT_ALLOWED' | 'ASSET_NOT_ALLOWED' | 'EXPIRED_MANDATE'
  | 'INVALID_SIGNATURE' | 'REPLAY_NONCE' | 'NEW_PAYEE_UNVERIFIED'
  | 'UNSUPPORTED_AGENT_CLAIM' | 'MISSING_REQUIRED_APPROVAL'
  | 'AUTHORIZED_AND_VERIFIED' | 'ANALYSIS_UNAVAILABLE';
interface PreflightDecision {
  requestId: string;
  decisionId: string;
  decision: 'ALLOW' | 'HOLD' | 'DENY';
  reasonCodes: ReasonCode[];
  policyVersion: string;
  claimIds: string[];
  evidenceIds: string[];
  issuedAt: string;
}
```

## 5. Risk analysis output schema

```ts
interface RiskAnalysis {
  sessionId: string;
  modelId: string;
  observedEventIds: string[];
  claims: Array<{
    claimId: string;
    quotedSpan: string;
    originatingEventId: string;
    repeatedByEventIds: string[];
    evidenceIds: string[];
    verification: 'verified' | 'unverified' | 'conflicting' | 'unknown';
  }>;
  manipulationIndicators: Array<{
    type: 'authority_claim' | 'urgency' | 'relationship_pressure' |
      'instruction_laundering' | 'source_convergence' |
      'payment_detail_change' | 'other';
    evidenceEventIds: string[];
    explanation: string;
  }>;
  missingInformation: string[];
  recommendation: 'ADVISORY_CLEAR' | 'REVIEW' | 'ESCALATE';
}
```

`recommendation` does not grant payment authority. AI may not output `policyDecision: ALLOW` as a trusted control signal.

## 6. Example API requests/responses

**Request**
```json
{
  "requestId":"preflight-0001",
  "sessionId":"session-vendor-01",
  "mandateId":"m-01",
  "chainId":"arc-testnet-example-id",
  "assetContract":"verified-arc-testnet-usdc-address-required",
  "amountBaseUnits":"250000000",
  "recipient":"0x2222222222222222222222222222222222222222",
  "purposeCode":"vendor_invoice",
  "sourceEventIds":["evt-03","evt-04"]
}
```

**Response**
```json
{
  "requestId":"preflight-0001",
  "decisionId":"decision-001",
  "decision":"DENY",
  "reasonCodes":["RECIPIENT_MISMATCH"],
  "policyVersion":"mvp-1",
  "claimIds":[],
  "evidenceIds":["evt-01","evt-02","evt-03"],
  "issuedAt":"2026-11-20T08:00:00Z"
}
```

Note: chain ID and contract address are intentionally placeholders. A build agent MUST fetch and verify live Arc Testnet settings from official Circle documentation before enabling execution.

## 7. Cross-record consistency rules

- Unique event ID per tenant and session; retry with same payload allowed, different payload rejected.
- Every `parentEventId` must exist and precede child in recorded event order, unless delayed external import is explicitly supported and marked incomplete.
- A repeated claim references its source instead of creating 'new independent evidence'.
- Every payment proposal must bind an immutable mandate and complete canonical transaction.
- Reported or LLM-extracted verification != independently authenticated verification.
- The only payment signer is a trusted server/wallet gate with explicit testnet mode; the web client cannot supply authorization outcome.
- The UI must never show 'executed' until a receipt exists and is checked.
