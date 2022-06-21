import { mapState } from "vuex";
import { providers, BigNumber } from "ethers"; //, utils
import srccontracts from "../../plugins/pay/contracts/src-chain-contracts";
import dstcontracts from "../../plugins/pay/contracts/dst-chain-contracts";
import client from "../../plugins/pay/contracts/SGNClient";

const uint256Max = BigNumber.from("1").shl(256).sub(1);

export default {
  data() {
    return {
      payAddr: "0xF1658C608708172655A8e70a1624c29F956Ee63D",
      curContract: null,
      isApproved: false,
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
      const { uid } = this.userInfo;
      if (!uid) return;
      return "0x" + uid.replace("0x", "").padStart(64, "0");
    },
    isPolygon() {
      return this.payBy == "Polygon";
    },
    payChainId() {
      if (this.isPolygon) return this.$inDev ? 80001 : 137;
      return this.$inDev ? 5 : 1;
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
    async onApprove() {
      try {
        this.$loading("Approving");
        const tx = await this.curContract[
          this.isPolygon ? "MumbaiUSDC" : "GoerliUSDC"
        ].approve(
          this.curContract[
            this.isPolygon ? "DstChainPayment" : "SrcChainPayment"
          ].address,
          uint256Max
        );
        console.log("tx", tx);
        const receipt = await tx.wait();
        console.log(receipt);
        this.isApproved = true;
        this.$loading.close();
      } catch (error) {
        console.log(error);
        this.$alert(error.message);
      }
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
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async onConnect() {
      console.log(this.chainId, client);
      try {
        if (this.chainId != this.payChainId) {
          const dev = this.$inDev
            ? `(dev-${this.Polygon ? "Mumbai" : "Goerli"})`
            : "";
          await this.$alert(`Please switch to ${this.payBy}${dev} Network`);
          await window.web3.currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + this.payChainId.toString(16) }],
          });
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
        this.getSign();
      } catch (error) {
        this.$alert(error.message).then(() => {
          this.$router.push("/usage/info");
        });
      }
    },
  },
};
