<template>
  <div>
    <div class="d-flex flex-wrap">
      <div
        @click="onSelect(it.label)"
        class="bd-1 al-c pa-3 pl-7 pr-7 mr-5 bdrs-2 cursor-p mt-4"
        :class="{
          'bdc-c1': payBy == it.label,
        }"
        v-for="(it, i) in payList"
        :key="i"
      >
        <v-icon size="16" :color="payBy == it.label ? $color1 : '#555'"
          >mdi-{{
            payBy == it.label
              ? "circle-slice-8"
              : "checkbox-blank-circle-outline"
          }}</v-icon
        >
        <span
          class="ml-2"
          style="width: 90px"
          :class="{
            'color-1': payBy == it.label,
          }"
          >{{ it.name }}</span
        >
        <img :src="it.img" height="20" />
      </div>
    </div>
    <!-- 
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
    </v-dialog> -->
    <ever-pay></ever-pay>
  </div>
</template>

<script>
import everPay from "./ever-pay.vue";
import { mapState } from "vuex";

export default {
  components: {
    everPay,
  },
  props: {
    allow: Array,
  },
  computed: {
    ...mapState({
      payBy: (s) => s.payBy,
      chainId: (s) => s.chainId,
    }),
    payList() {
      if (!this.allow) return this.list;
      return this.list.filter((it) => this.allow.includes(it.label));
    },
  },
  data() {
    return {
      list: [
        {
          label: "Polygon",
          name: "Polygon",
          img: "/img/svg/billing/ic-polygon-0.svg",
        },
        {
          label: "Ethereum",
          name: "Ethereum",
          img: "/img/svg/billing/ic-ethereum.svg",
        },
        {
          label: "BSC",
          name: "BSC",
          img: "/img/svg/billing/ic-bsc.png",
        },
        {
          label: "Arbitrum",
          name: "Arbitrum",
          img: "/img/svg/billing/ic-arbitrum.png",
        },
        {
          label: "zkSync",
          name: "zkSync Era",
          img: "/img/svg/logo-no-letters.svg",
        },
        {
          label: "everPay",
          name: "everPay",
          img: "/img/svg/logo-no-letters.svg",
        },
      ],
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
  created() {
    console.log(this.allow);
    if (this.allow && !this.allow.includes(this.payBy)) {
      this.onSelect(this.allow[0]);
    }
  },
  methods: {
    onSelect(payBy) {
      this.$setState({
        payBy,
      });
      localStorage.payBy = payBy;
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