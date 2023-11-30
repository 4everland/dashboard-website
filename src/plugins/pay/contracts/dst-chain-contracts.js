import Contracts from "./contracts";
import { Registration__factory } from "@4everland/registration";
import {
  Router__factory,
  Billing__factory,
  FundPoolRegistration__factory,
  Governance__factory,
  DstChainPaymentV2Registration__factory,
  ProviderControllerV2Registration__factory,
  ProviderRegistry__factory,
  IERC20__factory,
  ResourcePriceAdaptor__factory,
  ARStorageController__factory,
  BandwidthController__factory,
  BuildingTimeController__factory,
  IPFSStorageController__factory,
  SafeWallet__factory,
} from "@4everland/service-contracts";
import { Land__factory } from "@4everland-contracts";
import {
  MumbaiRouter,
  MumbaiUSDC,
  MumbaiDstChainPayment,
  MumbaiResourcePriceAdaptor,
  MumbaiARStorageController,
  MumbaiBandwidthController,
  MumbaiBuildingTimeController,
  MumbaiIPFSStorageController,
  MumbaiGovernance,
  MumbaiProviderRegistry,
  MumbaiProviderController,
  MumbaiFundPool,
  MumbaiBilling,
  MumbaiSafeWallet,
  MumbaiLandRecharge,
  MumbaiRegister,
} from "./contracts-addr";

class DstChainContracts extends Contracts {
  get Register() {
    return Registration__factory.connect(MumbaiRegister, this.signer);
  }
  get LandRecharge() {
    return Land__factory.connect(MumbaiLandRecharge, this.signer);
  }
  get Router() {
    return Router__factory.connect(MumbaiRouter, this.signer);
  }

  get Governance() {
    return Governance__factory.connect(MumbaiGovernance, this.signer);
  }

  get MumbaiUSDC() {
    return IERC20__factory.connect(MumbaiUSDC, this.signer);
  }

  get FundPool() {
    return FundPoolRegistration__factory.connect(MumbaiFundPool, this.signer);
  }

  get Billing() {
    return Billing__factory.connect(MumbaiBilling, this.signer);
  }

  get ProviderController() {
    return ProviderControllerV2Registration__factory.connect(
      MumbaiProviderController,
      this.signer
    );
  }

  get ProviderRegistry() {
    return ProviderRegistry__factory.connect(
      MumbaiProviderRegistry,
      this.signer
    );
  }

  get SafeWallet() {
    return SafeWallet__factory.connect(MumbaiSafeWallet, this.signer);
  }

  get ResourcePriceAdaptor() {
    return ResourcePriceAdaptor__factory.connect(
      MumbaiResourcePriceAdaptor,
      this.signer
    );
  }

  get DstChainPayment() {
    return DstChainPaymentV2Registration__factory.connect(
      MumbaiDstChainPayment,
      this.signer
    );
  }

  get ARStorageController() {
    return ARStorageController__factory.connect(
      MumbaiARStorageController,
      this.signer
    );
  }

  get BandwidthController() {
    return BandwidthController__factory.connect(
      MumbaiBandwidthController,
      this.signer
    );
  }

  get BuildingTimeController() {
    return BuildingTimeController__factory.connect(
      MumbaiBuildingTimeController,
      this.signer
    );
  }

  get IPFSStorageController() {
    return IPFSStorageController__factory.connect(
      MumbaiIPFSStorageController,
      this.signer
    );
  }
}

const contracts = new DstChainContracts();

export default contracts;
