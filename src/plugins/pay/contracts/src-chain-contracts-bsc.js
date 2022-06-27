import { providers } from "ethers";
import Contracts from "./contracts";

import {
  IERC20__factory,
  SrcChainPayment__factory,
  DstChainPayment__factory,
  ResourcePriceAdaptor__factory,
  ARStorageController__factory,
  BandwidthController__factory,
  BuildingTimeController__factory,
  IPFSStorageController__factory,
  ProviderController__factory,
} from "4everland-contracts";
import { Bridge__factory } from "./sgn/contract/typechain";
import {
  ChapelSrcChainPayment,
  ChapelUSDC,
  MumbaiProviderController,
  MumbaiDstChainPayment,
  MumbaiResourcePriceAdaptor,
  MumbaiARStorageController,
  MumbaiBandwidthController,
  MumbaiBuildingTimeController,
  MumbaiIPFSStorageController,
} from "./contracts-addr";
import { ChapelBridge } from "./addr-dev";

class SrcChainContracts extends Contracts {
  dstProvider = null;

  constructor() {
    super();
    // mumbai rpc
    this.dstProvider = new providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/MGcgBRN-uuuG6x1qaI-xchQMpebh_aN6"
    );
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
    return SrcChainPayment__factory.connect(ChapelSrcChainPayment, this.signer);
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
    return DstChainPayment__factory.connect(
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
