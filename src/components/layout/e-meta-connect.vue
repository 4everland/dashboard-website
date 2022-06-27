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
            custom settings. Please select the
            {{ payBy }} network.
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
      payBy: (s) => s.payBy,
    }),
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "showMetaConnect") {
        if (localStorage.isConnectMeta) {
          this.onConnect();
        } else this.showPop = true;
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
          window.ethereum.on("chainChanged", (networkId) => {
            console.log("chainChanged", networkId);
            location.reload();
          });
          window.ethereum.on("accountsChanged", (accounts) => {
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
    async getAddr() {
      const { data } = await this.$http2.get("/activity/ethAddress");
      this.ethAddr = data;
    },
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
    async checkNet() {
      console.log("get wallet net...");
      const netType = await window.web3.eth.net.getNetworkType();
      const chainId = await window.web3.eth.net.getId();
      // const payBy = [5, 1].includes(this.chainId) ? "Ethereum" : "Polygon";
      // localStorage.payBy = payBy;
      console.log(netType);
      this.$setState({
        netType,
        chainId,
        // payBy,
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