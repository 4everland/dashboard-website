// import {
//   EstimateAmtRequest,
//   // TransferHistoryRequest,
//   // GetTransferStatusRequest,
//   // WithdrawLiquidityRequest,
//   // WithdrawMethodType,
//   // InitWithdrawRequest,
// } from "./sgn/ts-proto/gateway/gateway_pb";
// import { WebClient } from "./sgn/ts-proto/gateway/GatewayServiceClientPb";
// import { clientRpc } from "./contracts-addr";

import axios from "axios";

class SGNClient {
  client = null;

  constructor() {
    this.client = new WebClient(clientRpc, null, null);
  }

  async estimate(address, value, src, dst, token) {
    // const estimateRequest = new EstimateAmtRequest();
    // estimateRequest.setSrcChainId(src || 5);
    // estimateRequest.setDstChainId(dst || 80001);
    // estimateRequest.setTokenSymbol(token || "USDC");
    // estimateRequest.setUsrAddr(address);
    // estimateRequest.setSlippageTolerance(3000);
    // estimateRequest.setAmt(value);
    // return this.client.estimateAmt(estimateRequest, null);
    const { data } = await axios.post(
      "https://wed.foreverland.xyz/api/celer/estimate/amount",
      {
        src_chain_id: src || 5,
        dst_chain_id: dst || 80001,
        token_symbol: token || "USDC",
        amount: value,
        addr: address,
        slippage_tolerance: 3000,
      }
    );
    if (data.err) throw new Error(data.err.msg);
    return data;
  }
}

const client = new SGNClient();
export default client;
