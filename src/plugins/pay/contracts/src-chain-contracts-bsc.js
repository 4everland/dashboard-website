import { providers } from "ethers";
import Contracts from "./contracts";

import {
  IERC20__factory,
  SrcChainPaymentV2__factory,
  DstChainPaymentV2__factory,
  ResourcePriceAdaptor__factory,
  ARStorageController__factory,
  BandwidthController__factory,
  BuildingTimeController__factory,
  IPFSStorageController__factory,
  ProviderController__factory,
  SrcChainRecharge__factory,
} from "@4everland/service-contracts";
import { Bridge__factory } from "./sgn/contract/typechain";
import {
  GoerliRpc,
  ChapelBridge,
  ChapelSrcChainPayment,
  ChapelUSDC,
  ChapelRecharge,
  MumbaiProviderController,
  MumbaiDstChainPayment,
  MumbaiResourcePriceAdaptor,
  MumbaiARStorageController,
  MumbaiBandwidthController,
  MumbaiBuildingTimeController,
  MumbaiIPFSStorageController,
} from "./contracts-addr";

// import {  } from "./addr-dev";

class SrcChainContracts extends Contracts {
  dstProvider = null;

  constructor() {
    super();
    // mumbai rpc
    this.dstProvider = new providers.JsonRpcProvider(GoerliRpc);
  }

  get GoerliUSDC() {
    return IERC20__factory.connect(ChapelUSDC, this.signer);
  }

  IERC20(addr) {
    return IERC20__factory.connect(addr, this.signer);
  }

  get Bridge() {
    return Bridge__factory.connect(ChapelBridge, this.signer);
  }

  get SrcChainPayment() {
    return SrcChainPaymentV2__factory.connect(
      ChapelSrcChainPayment,
      this.signer
    );
  }
  get SrcChainRecharge() {
    return SrcChainRecharge__factory.connect(ChapelRecharge, this.signer);
  }

  get ProviderController() {
    return ProviderController__factory.connect(
      MumbaiProviderController,
      this.dstProvider
    );
  }

  get ResourcePriceAdaptor() {
    return ResourcePriceAdaptor__factory.connect(
      MumbaiResourcePriceAdaptor,
      this.dstProvider
    );
  }

  get DstChainPayment() {
    return DstChainPaymentV2__factory.connect(
      MumbaiDstChainPayment,
      this.dstProvider
    );
  }

  get ARStorageController() {
    return ARStorageController__factory.connect(
      MumbaiARStorageController,
      this.dstProvider
    );
  }

  get BandwidthController() {
    return BandwidthController__factory.connect(
      MumbaiBandwidthController,
      this.dstProvider
    );
  }

  get BuildingTimeController() {
    return BuildingTimeController__factory.connect(
      MumbaiBuildingTimeController,
      this.dstProvider
    );
  }

  get IPFSStorageController() {
    return IPFSStorageController__factory.connect(
      MumbaiIPFSStorageController,
      this.dstProvider
    );
  }
}

const contracts = new SrcChainContracts();

export default contracts;
