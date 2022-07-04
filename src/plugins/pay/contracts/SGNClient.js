import {
  EstimateAmtRequest,
  // TransferHistoryRequest,
  // GetTransferStatusRequest,
  // WithdrawLiquidityRequest,
  // WithdrawMethodType,
  // InitWithdrawRequest,
} from "./sgn/ts-proto/gateway/gateway_pb";
import { WebClient } from "./sgn/ts-proto/gateway/GatewayServiceClientPb";
import { clientRpc } from "./contracts-addr";

class SGNClient {
  client = null;

  constructor() {
    this.client = new WebClient(clientRpc, null, null);
  }

  async estimate(address, value, src, dst, token) {
    const estimateRequest = new EstimateAmtRequest();
    estimateRequest.setSrcChainId(src || 5);
    estimateRequest.setDstChainId(dst || 80001);
    estimateRequest.setTokenSymbol(token || "USDC");
    estimateRequest.setUsrAddr(address);
    estimateRequest.setSlippageTolerance(3000);
    estimateRequest.setAmt(value);
    return this.client.estimateAmt(estimateRequest, null);
  }
}

const client = new SGNClient();
export default client;
