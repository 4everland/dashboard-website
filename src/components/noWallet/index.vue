<template>
  <div v-show="dialogFormVisible" id="NoWallet" @click="onCancel">
    <div class="noWallet-con" @click.stop>
      <img class="wallet-icon" :src="walletObj[wallet].icon" alt="" />
      <p class="wallet-name">{{ walletObj[wallet].name }}</p>
      <p class="wallet-tips">
        {{ walletObj[wallet].tips }}
      </p>
      <div class="btn-box">
        <button class="btn-install" @click="onInstall(walletObj[wallet].link)">
          Install
        </button>
        <button class="btn-cancel" @click="onCancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      wallet: "metamask",
      walletObj: {
        metamask: {
          icon: require("@/assets/imgs/metamask.svg"),
          name: "Matamask Wallet",
          tips: "Your key to blockchain applications",
          link: "https://metamask.io/download.html",
        },
        okx: {
          icon: require("@/assets/imgs/okx.svg"),
          name: "OKX Wallet",
          tips: "One interoperable wallet for all your Web3 needs",
          link: "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
        },
        phantom: {
          icon: require("@/assets/imgs/phantom.svg"),
          name: "Phantom Wallet",
          tips: "A friendly crypto wallet for web3",
          link: "https://phantom.app/",
        },
        lilico: {
          icon: require("@/assets/imgs/lilico.svg"),
          name: "Lilico Wallet",
          tips: "A Flow Wallet lived in your Browser",
          link: "",
        },
        petra: {
          icon: require("@/assets/imgs/petra.svg"),
          name: "Petra Aptos Wallet",
          tips: "A crypto wallet on Aptos",
          link: "https://petra.app/",
        },
        coinbase: {
          icon: require("@/assets/imgs/coinbase.png"),
          name: "CoinBase Wallet",
          tips: "A crypto wallet on CoinBase",
          link: "https://www.coinbase.com/",
        },
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    getnoWallet(wallet) {
      this.wallet = wallet;
      this.dialogFormVisible = true;
    },
    onInstall(link) {
      window.open(link);
      this.onCancel();
    },
    onCancel() {
      this.dialogFormVisible = false;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
#NoWallet {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99999999;
  background-color: rgba(33, 33, 33, 0.45);
  .noWallet-con {
    max-width: 440px;
    max-height: 300px;
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: -60px;
    bottom: 0;
    margin: auto;
    padding: 40px 26px 24px 26px;
    border-radius: 10px;
    text-align: center;
    .wallet-icon {
      width: 95px;
    }
    .wallet-name {
      font-size: 20px;
      font-weight: bold;
      color: #495667;
      margin-top: 12px;
    }
    .wallet-tips {
      font-size: 16px;
      color: #495667;
      margin-top: 10px;
    }
    .btn-box {
      margin-top: 20px;
      button {
        width: 180px;
        height: 40px;
        margin: 0 5px;
      }
      .btn-install {
        background-color: #775da6;
        color: #fff;
      }
      .btn-cancel {
        border: 1px solid #6c7789;
        color: #6c7789;
      }
    }
  }
}
</style>
