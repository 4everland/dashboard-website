import { mapState } from "vuex";
import { providers, BigNumber } from "ethers"; //, utils
import srccontracts from "../../plugins/pay/contracts/src-chain-contracts";
import dstcontracts from "../../plugins/pay/contracts/dst-chain-contracts";
import client from "../../plugins/pay/contracts/SGNClient";
import { MumbaiFundPool } from "../../plugins/pay/contracts/addr-dev";

const uint256Max = BigNumber.from("1").shl(256).sub(1);

export default {
  data() {
    return {
      curContract: null,
      isApproved: false,
      approving: false,
      providerAddr: "0xdec55a51ac7c77f505eff03bee9ddff9edb1ead6",
      client,
      walletBalance: 0,
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
      netType: (s) => s.netType,
      chainId: (s) => s.chainId,
      payBy: (s) => s.payBy,
      userInfo: (s) => s.userInfo,
    }),
    uuid() {
      return this.userInfo.euid;
    },
    isPolygon() {
      return this.payBy == "Polygon";
    },
    payChainId() {
      return this.getChainId(this.isPolygon);
    },
    usdcKey() {
      return this.isPolygon ? "MumbaiUSDC" : "GoerliUSDC";
    },
    chainKey() {
      return this.isPolygon ? "DstChainPayment" : "SrcChainPayment";
    },
    payAddr() {
      if (!this.curContract) return "";
      return this.curContract[this.chainKey].address;
    },
  },
  watch: {
    connectAddr(val) {
      if (val) this.onConnect();
    },
    payChainId() {
      this.onConnect();
    },
  },
  mounted() {
    if (this.connectAddr) {
      this.onConnect();
    } else {
      this.showConnect();
    }
  },
  methods: {
    onErr(err) {
      console.log(err);
      return this.$alert(err.message);
    },
    async getWalletBalance() {
      this.$loading();
      const num = await this.curContract.MumbaiUSDC.balanceOf(this.connectAddr);
      this.walletBalance = (num / 1e6).toFixed(2);
      console.log(this.walletBalance);
      this.$loading.close();
    },
    async checkAccount() {
      console.log("check account...");
      const uuidRegistered =
        await this.curContract.ProviderController.accountExists(
          this.providerAddr,
          this.uuid
        );
      console.log("account uuidRegistered", uuidRegistered);
      if (!uuidRegistered) {
        throw new Error("Account Not Registered");
      }
    },
    async checkApprove(isBuy) {
      try {
        console.log("check approve");
        const allowance = await this.curContract[this.usdcKey].allowance(
          this.connectAddr,
          isBuy ? this.payAddr : MumbaiFundPool
        );
        const minAllowance = uint256Max.shr(1);
        this.isApproved = !allowance.lt(minAllowance);
        console.log("isApproved", this.isApproved, allowance);
      } catch (error) {
        this.onErr(error);
      }
    },
    async onApprove(isBuy) {
      try {
        this.approving = true;
        const addr = isBuy ? this.payAddr : MumbaiFundPool;
        console.log("approve", addr, this.usdcKey);
        const tx = await this.curContract[this.usdcKey].approve(
          addr,
          uint256Max
        );
        console.log("tx", tx);
        const receipt = await tx.wait();
        console.log(receipt);
        this.isApproved = true;
      } catch (error) {
        this.onErr(error);
      }
      this.approving = false;
    },
    formatToken(value, fixed = 2, decimals = 18) {
      const v = value.div(
        BigNumber.from((10 ** (decimals - fixed)).toString())
      );
      return (v.toNumber() / 10 ** fixed).toFixed(fixed);
    },
    showConnect() {
      this.$setMsg({
        name: "showMetaConnect",
      });
    },
    async getSign() {
      try {
        const { data } = await this.$http.post(
          "$v3/common/sign/" + this.connectAddr
        );
        console.log("sign", data);
      } catch (error) {
        console.log(error);
      }
    },
    getChainId(isPolygon) {
      if (isPolygon) return this.$inDev ? 80001 : 137;
      return this.$inDev ? 5 : 1;
    },
    switchNet(id) {
      return window.web3.currentProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + id.toString(16) }],
      });
    },
    async onConnect() {
      console.log(this.chainId);
      try {
        if (this.chainId != this.payChainId) {
          const dev = this.$inDev
            ? `(dev-${this.Polygon ? "Mumbai" : "Goerli"})`
            : "";
          await this.$alert(`Please switch to ${this.payBy}${dev} Network`);
          await this.switchNet(this.payChainId);
          return;
        }
        const provider = new providers.Web3Provider(window.ethereum);
        if (this.isPolygon) {
          dstcontracts.setProvider(provider);
          this.curContract = dstcontracts;
        } else {
          srccontracts.setProvider(provider);
          this.curContract = srccontracts;
        }
        console.log(this.payBy, this.curContract);
        // this.getSign();
        this.checkApprove(this.isBuy);
      } catch (error) {
        this.$alert(error.message).then(() => {
          this.$router.push("/usage/info");
        });
      }
    },
  },
};
