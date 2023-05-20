<template>
  <v-dialog v-model="showEverPay" class="dialog-everpay" max-width="600">
    <div class="pt-10 pb-5 px-8 pos-r">
      <div class="close-btn pos-a"></div>
      <div class="fz-18 title">Balance on everPay</div>
      <div class="al-c justify-space-between mt-5">
        <div>
          <span class="fw-b fz-40">0.00</span>
          <span class="text ml-3">USD</span>
        </div>
        <v-btn color="primary">Deposit</v-btn>
      </div>
      <div class="mt-5 mb-2 fz-18 title">Choose Token</div>

      <template v-for="item in everPaySymbolList">
        <div :key="item.symbol" class="everpay-symbol-item py-4 al-c">
          <img height="60" :src="item.img" alt="" />
          <div class="ml-3">
            <div>
              <span class="fw-b fz-18">{{ item.title }}</span>
              <span class="ml-2 fz-12 symbol">{{ item.symbol }}</span>
            </div>
            <p class="fz-14 mt-1 text">{{ item.chainName }}</p>
          </div>
          <div class="ml-auto">
            <p class="fw-b fz-18">{{ item.num }}</p>
            <p class="text fz-14">{{ item.balance }}</p>
          </div>
        </div>
      </template>

      <div class="fz-18 mt-6 ta-c">
        Powered by <span>everPay</span> protocol
      </div>
    </div>
  </v-dialog>
</template>

<script>
import Everpay from "everpay";
// console.log(Everpay);
// console.log(window.Everpay.default);
import { mapState } from "vuex";
export default {
  data() {
    return {
      showEverPay: false,
      everPaySymbolList: [
        {
          img: "/img/svg/pay/usdc.svg",
          title: "USDC Coin",
          symbol: "USDC",
          num: 0,
          balance: "$0.00",
          chainName: "Ethereum",
        },
        {
          img: "/img/svg/pay/usdt.svg",
          title: "Tether USD",
          symbol: "USDT",
          num: 0,
          balance: "$0.00",
          chainName: "Ethereum",
        },
        {
          img: "/img/svg/pay/dai.svg",
          title: "Dai Stablecoin",
          symbol: "DAI",
          num: 0,
          balance: "$0.00",
          chainName: "Ethereum",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      payBy: (s) => s.payBy,
      chainId: (s) => s.chainId,
    }),
  },

  created() {
    this.initEverPay();
  },
  methods: {
    async initEverPay() {
      // const everpay = new Everpay();
      const everPay = new window.Everpay.default();
      console.log(everPay);
      const data = await everPay.balances({
        account: "0x1D773A644b4dC6e1B3b11D69F30d27101bF2F85e",
      });
      console.log(data);
      // const
    },
  },
  watch: {
    payBy: {
      handler(val) {
        if (val == "everPay" && (this.chainId == 1 || this.chainId == 5)) {
          this.showEverPay = true;
        }
      },
      immediate: true,
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
}
.title {
  color: #0e0e2c;
  font-weight: normal;
}
</style>