import { providers } from "ethers"; //, utils
import polygonContract from "../../plugins/pay/contracts/dst-chain-contracts";
import ethContract from "../../plugins/pay/contracts/src-chain-contracts";
import bscContract from "../../plugins/pay/contracts/src-chain-contracts-bsc";
import { providerAddr } from "../../plugins/pay/contracts/contracts-addr";
export default {
  data() {
    return {
      curContract: null,
      isRegister: true,
    };
  },
  computed: {
    uuid() {
      return this.userInfo.euid;
    },
    chainNet() {
      let addrList = [
        { addr: "ETH", chainIdArr: [1, 5] },
        { addr: "Polygon", chainIdArr: [137, 80001] },
        { addr: "BSC", chainIdArr: [56, 97] },
      ];
      let chainId = window.ethereum.chainId;
      chainId = parseInt(chainId);
      console.log(chainId);
      const addrItem = addrList.find((it) => it.chainIdArr.includes(chainId));
      console.log(addrItem);
      return addrItem.addr;
    },
    registerOverThreeDays() {
      return (
        (new Date().getTime() - this.userInfo.createAt) / 1000 / 3600 / 24 > 3
      );
    },
  },
  // watch: {
  //   uuid() {
  //     this.registerForNew();
  //   },
  // },
  // created() {
  //   this.registerForNew();
  // },
  methods: {
    async registerForNew() {
      if (this.registerOverThreeDays) return;
      if (!this.uuid) return;
      const provider = new providers.Web3Provider(window.ethereum);
      console.log(this.chainNet);
      if (this.chainNet == "polygon") {
        console.log("polygon");
        polygonContract.setProvider(provider);
        this.curContract = polygonContract;
      } else if (this.chainNet == "BSC") {
        bscContract.setProvider(provider);
        this.curContract = bscContract;
      } else {
        ethContract.setProvider(provider);
        this.curContract = ethContract;
      }
      try {
        this.isRegister =
          await this.curContract.ProviderController.accountExists(
            providerAddr,
            this.uuid
          );
      } catch (error) {
        console.log(error);
        this.isRegister = false;
      }
    },
  },
};
