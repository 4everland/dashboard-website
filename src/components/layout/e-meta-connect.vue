<template>
  <div>
    <v-dialog v-model="showPop" max-width="500">
      <e-dialog-close @click="showPop = false"></e-dialog-close>
      <div class="pd-15-20">
        <div class="ta-c">
          <h3>Connect Wallet</h3>
        </div>
        <div class="pd-20">
          <div class="gray fz-15">
            After connecting to your wallet, you'll be able to make changes in
            custom settings. Please select the Ethereum Mainnet network.
          </div>
          <div class="mt-5 d-flex al-c">
            <img src="img/svg/settings/m-metamask.svg" style="height: 25px" />
            <b class="ml-4">MetaMask</b>
            <span class="gray fz-13 ml-5">{{ connectAddr.cutStr(4, 4) }}</span>
            <v-btn
              :color="isConnect ? '' : 'primary'"
              rounded
              class="ml-auto"
              @click="onConnect"
              >{{ isConnect ? "Disconnect" : "Connect" }}</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
    <!-- <div
      @click="showPop = true"
      v-ripple
      :class="{ 'filter-gray': !isConnect }"
      class="bdrs-3 ml-5 hover-1"
    >
      <v-img src="img/icon/u-wallet.svg" width="22"></v-img>
    </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Web3 from "web3";
// import actAbi from "../../plugins/pay/abi";

export default {
  data() {
    return {
      showPop: false,
      ethAddr: "",
      isConnect: false,
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      connectAddr: (s) => s.connectAddr,
    }),
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "showMetaConnect") {
        this.showPop = true;
      }
    },
    async isConnect(val) {
      localStorage.isConnectMeta = val ? "1" : "";
      // this.onConnect();
      let connectAddr = "";
      if (val) {
        this.showPop = false;
        // window.ethContract = new window.web3.eth.Contract(
        //   actAbi.abi,
        //   actAbi.address
        // );
        const accounts = await window.web3.eth.getAccounts();
        connectAddr = accounts[0];
        window.ethereum.on("chainChanged", (networkId) => {
          console.log("chainChanged", networkId);
          location.reload();
        });
        window.ethereum.on("accountsChanged", (accounts) => {
          console.log("accountsChanged", accounts);
          location.reload();
        });
        this.checkNet();
      }
      this.$setState({
        noticeMsg: {
          name: "walletConnect",
          data: {
            isConnect: val,
          },
        },
        connectAddr,
      });
    },
  },
  created() {
    // this.getAddr();
    if (localStorage.isConnectMeta) {
      this.onConnect();
    }
  },
  methods: {
    async getAddr() {
      const { data } = await this.$http2.get("/activity/ethAddress");
      this.ethAddr = data;
    },
    async onConnect() {
      if (!this.isConnect) {
        const isOk = await this.connectMetaMask();
        this.isConnect = isOk;
        if (!isOk) this.showPop = true;
      } else {
        this.isConnect = false;
      }
    },
    async checkNet() {
      const netType = await window.web3.eth.net.getNetworkType();
      let msg = "";
      if (this.$inDev) {
        if (netType != "rinkeby") msg = "Dev: please connect to rinkeby";
      } else {
        if (netType != "main")
          msg = "Wrong network, please connect to Ethereum mainnet";
      }
      console.log("netType", netType, msg);
      this.$setState({
        netType,
        walletTip: msg,
      });
    },
    async connectMetaMask() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        // await window.ethereum.enable();
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          return true;
        } catch (error) {
          this.$alert("Failed to connect wallet" + ": " + error.message);
          return false;
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        return true;
      } else {
        this.$confirm("Metamask is not installed", "Tip", {
          confirmText: "Install",
        }).then(() => {
          window.open(
            "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
          );
        });
        return false;
      }
    },
  },
};
</script>