import { mapState } from "vuex";
import { providers } from "ethers"; //BigNumber, utils
import srccontracts from "../../plugins/pay/contracts/src-chain-contracts";
import dstcontracts from "../../plugins/pay/contracts/dst-chain-contracts";
import client from "../../plugins/pay/contracts/SGNClient";

export default {
  data() {
    return {
      payAddr: "0xF1658C608708172655A8e70a1624c29F956Ee63D",
      curContract: null,
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
      netType: (s) => s.netType,
      chainId: (s) => s.chainId,
      payBy: (s) => s.payBy,
    }),
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
    showConnect() {
      this.$setMsg({
        name: "showMetaConnect",
      });
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
      } catch (error) {
        this.$alert(error.message).then(() => {
          this.$router.push("/usage/info");
        });
      }
    },
  },
};
