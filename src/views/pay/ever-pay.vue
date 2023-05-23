<template>
  <v-dialog v-model="showEverPay" class="dialog-everpay" max-width="600">
    <div class="pt-8 pb-5 px-8 pos-r">
      <!-- <div class="close-btn pos-a cursor-p" @click="showEverPay = false"></div> -->

      <div class="d-flex align-start justify-space-between mb-5">
        <div class="fz-20 title">Choose Token</div>
        <v-btn color="primary">Deposit</v-btn>
      </div>
      <template v-for="item in everPaySymbolList">
        <div
          :key="item.symbol"
          class="everpay-symbol-item py-4 al-c cursor-p"
          @click="paymentChannel(item)"
        >
          <img height="60" :src="item.img" alt="" />
          <div class="ml-3">
            <div>
              <span class="fw-b fz-18">{{ item.title }}</span>
              <span class="ml-2 fz-12 symbol">{{ item.symbol }}</span>
            </div>
            <p class="fz-14 mt-1 text">{{ item.chainType }}</p>
          </div>
          <div class="ml-auto">
            <p class="fw-b fz-18">{{ item.balance.toFixed(7) }}</p>
            <p class="text fz-14">${{ item.balance.toFixed(2) }}</p>
          </div>
        </div>
      </template>

      <div class="fz-16 mt-6 ta-c">
        Powered by <span>everPay</span> protocol
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { bus } from "../../utils/bus";

export default {
  data() {
    return {
      showEverPay: false,
      everPaySymbolList: [
        {
          img: "/img/svg/pay/usdc.svg",
          title: "USDC Coin",
          symbol: "USDC",
          balance: 0,
          chainType: "Ethereum",
        },
        {
          img: "/img/svg/pay/usdt.svg",
          title: "Tether USD",
          symbol: "USDT",
          balance: 0,
          chainType: "Ethereum",
        },
        {
          img: "/img/svg/pay/dai.svg",
          title: "Dai Stablecoin",
          symbol: "DAI",
          balance: 0,
          chainType: "Ethereum",
        },
      ],
      curToken: "",
      allowPay: false,
    };
  },
  computed: {
    ...mapState({
      payBy: (s) => s.payBy,
      chainId: (s) => s.chainId,
    }),
  },

  // created() {
  // },
  methods: {
    async initEverPay() {
      // const everpay = new Everpay();
      const everPay = new window.Everpay.default();
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");
      }
      const accounts = await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
      const account = accounts[0];
      const data = await everPay.balances({
        account,
      });
      data.forEach((it) => {
        // return it.symbol == 'USDC' || it.symbol == 'USDT' || it.symbol == 'DAI'
        it.balance = parseFloat(it.balance);
        if (it.symbol == "USDC") {
          this.everPaySymbolList[0] = Object.assign(
            this.everPaySymbolList[0],
            it
          );
        }
        if (it.symbol == "USDT") {
          this.everPaySymbolList[1] = Object.assign(
            this.everPaySymbolList[1],
            it
          );
        }
        if (it.symbol == "DAI") {
          this.everPaySymbolList[2] = Object.assign(
            this.everPaySymbolList[2],
            it
          );
        }
      });
    },
    async paymentChannel(item) {
      bus.$emit("everPayChannel", item);
      this.curToken = item.symbol;
    },
  },
  watch: {
    payBy: {
      handler(val) {
        if (val == "everPay" && (this.chainId == 1 || this.chainId == 5)) {
          this.showEverPay = true;
          this.initEverPay();
        }
      },
      immediate: true,
    },
    showEverPay(val) {
      if (!val && !this.allowPay) {
        this.$setState({
          payBy: null,
        });
        localStorage.payBy = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .close-btn {
  right: 20px;
  top: 20px;
  width: 40px;
  height: 40px;
  padding: 10px;
  border: 1px solid rgba(140, 140, 161, 0.25);
  border-radius: 50%;
}
.close-btn::after {
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url("/img/svg/close_icon.svg") no-repeat;
  background-size: 100%;
  width: 16px;
  height: 16px;
}
.everpay-symbol-item {
  .symbol {
    color: #0e0e2c;
  }
}
.everpay-symbol-item + .everpay-symbol-item {
  border-top: 1px solid #8c8ca140;
}
.text {
  color: #8c8ca1;
  text-transform: capitalize;
}
.title {
  color: #0e0e2c;
  font-weight: normal;
}
</style>