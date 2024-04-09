import { providers } from "ethers";
import Contracts from "./contracts";

import {
  IERC20__factory,
  DstChainPaymentV2__factory,
  ResourcePriceAdaptor__factory,
  ARStorageController__factory,
  BandwidthController__factory,
  BuildingTimeController__factory,
  IPFSStorageController__factory,
  ProviderControllerV2__factory,
} from "@4everland/service-contracts";
import { RegistrationV2__factory } from "@4everland/zksync-era-payment";
import {
  GoerliRpc,
  zkSyncUSDC,
  zkRegister,
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
  dst = null;

  get dstProvider() {
    if (this.dst) return this.dst;
    this.dst = new providers.JsonRpcProvider(GoerliRpc);
    return this.dst;
  }
  get GoerliUSDC() {
    return IERC20__factory.connect(zkSyncUSDC, this.signer);
  }

  IERC20(addr) {
    return IERC20__factory.connect(addr, this.signer);
  }

  get Register() {
    return RegistrationV2__factory.connect(zkRegister, this.signer);
  }

  get ProviderController() {
    return ProviderControllerV2__factory.connect(
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
