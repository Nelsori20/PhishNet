/**
 * PhishNet Payment Adapter Interface and Execution Controller
 */

import { ExecutionReceipt, PaymentProposal, PreflightDecision } from '../../core/src/schemas';

export interface PaymentAdapter {
  chainId: string;
  networkName: string;
  isSimulated: boolean;

  executePayment(
    proposal: PaymentProposal,
    preflight: PreflightDecision
  ): Promise<ExecutionReceipt>;
}
