import { providers } from "ethers";
import Contracts from "./contracts";

import {
  IERC20__factory,
  ProviderControllerV2__factory,
} from "@4everland/service-contracts";
import { Registration__factory } from "@4everland/registration";
import {
  GoerliRpc,
  zetaRegister,
  MumbaiProviderController,
} from "./contracts-addr";

class SrcChainContracts extends Contracts {
  dst = null;

  get dstProvider() {
    if (this.dst) return this.dst;
    this.dst = new providers.JsonRpcProvider(GoerliRpc);
    return this.dst;
  }

  IERC20(addr) {
    return IERC20__factory.connect(addr, this.signer);
  }
  get Register() {
    return Registration__factory.connect(zetaRegister, this.signer);
  }
  get ProviderController() {
    return ProviderControllerV2__factory.connect(
      MumbaiProviderController,
      this.dstProvider
    );
  }
}

const contracts = new SrcChainContracts();

export default contracts;
