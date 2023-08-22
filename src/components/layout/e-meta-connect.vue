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
            custom settings.
          </div>
          <div class="mt-5 d-flex al-c">
            <img src="/img/svg/settings/m-metamask.svg" style="height: 25px" />
            <b class="ml-4">MetaMask</b>
            <span class="gray fz-13 ml-5">{{ connectAddr.cutStr(4, 4) }}</span>
            <v-btn
              :color="isConnect ? '' : 'primary'"
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
      <v-img src="/img/icon/u-wallet.svg" width="22"></v-img>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Web3 from "web3";

export default {
  data() {
    return {
      showPop: false,
      isConnect: false,
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      connectAddr: (s) => s.connectAddr,
      payBy: (s) => s.payBy,
      chainId: (s) => s.chainId,
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["walletObj"]),
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "showMetaConnect") {
        this.onConnect();
      }
    },
    async isConnect(val) {
      // this.onConnect();
      try {
        let connectAddr = "";
        if (val) {
          this.showPop = false;
          const accounts = await window.web3.eth.getAccounts();
          connectAddr = accounts[0];
          await this.checkNet();
          this.walletObj.on("chainChanged", (networkId) => {
            console.log("chainChanged", networkId);
            location.reload();
          });
          this.walletObj.on("accountsChanged", (accounts) => {
            console.log("accountsChanged", accounts);
            location.reload();
          });
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
      } catch (error) {
        console.log("get_wallet_account error", error.message);
        this.isConnect = false;
        this.showPop = true;
      }
    },
  },
  created() {
    // this.getAddr();
  },
  methods: {
    async onConnect() {
      try {
        if (!this.isConnect) {
          const isOk = await this.connectMetaMask();
          this.isConnect = isOk;
          if (!isOk) this.showPop = true;
          else localStorage.isConnectMeta = "1";
        } else {
          this.isConnect = false;
        }
      } catch (error) {
        console.log("connect_wallet error", error);
        this.showPop = true;
      }
    },
    getPayBy(id) {
      if ([5, 1].includes(id) && localStorage.payBy == "everPay")
        return "everPay";
      if ([5, 1].includes(id)) return "Ethereum";
      if ([97, 56].includes(id)) return "BSC";
      if ([42161].includes(id)) return "Arbitrum";
      if ([280, 324].includes(id)) return "zkSync";
      if ([5611, 204].includes(id)) return "OpBNB";
      if ([1442, 1101].includes(id)) return "PolygonZkEVM";
      if ([59140, 59144].includes(id)) return "Linea";
      return "Polygon";
    },
    async checkNet() {
      let err = null;
      let times = 0;
      let chainId = null;
      this.$loading("Connect Wallet...");
      setTimeout(() => {
        if (!chainId) {
          this.$loading.close();
          console.log("close loading for chainid");
        }
      }, 3000);
      while (times < 3 && !chainId) {
        try {
          console.log("get wallet net...", times);
          times += 1;
          chainId = await window.web3.eth.net.getId();
          let netType = "d"; //await window.web3.eth.net.getNetworkType();
          if (chainId == 5) netType = "goerli";
          else if (chainId == 1) netType = "main";
          const payBy = this.getPayBy(chainId);
          localStorage.payBy = payBy;
          console.log(netType, chainId, payBy);
          this.$setState({
            netType,
            chainId,
            payBy,
          });
          this.$loading.close();
        } catch (error) {
          err = error;
          // console.log(err);
          // break;
        }
      }
      if (!chainId && err) {
        this.$alert(error.message);
        console.log(err.message, "check net err");
        throw err;
      }
    },
    async connectMetaMask() {
      console.log(this.walletObj);
      if (this.walletObj) {
        window.web3 = new Web3(this.walletObj);
        // await this.walletObj.enable();
        try {
          await this.walletObj.request({ method: "eth_requestAccounts" });
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
