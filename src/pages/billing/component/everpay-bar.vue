<template>
  <div>
    <div class="mt-6 al-c space-btw">
      <h2 class="fz-16">Choose Token</h2>
      <div class="fz-14">
        Powered by
        <span
          class="cursor-p primary--text"
          @click="handleOpenLink('https://everpay.io/')"
          >everPay</span
        >
        protocol
      </div>
    </div>
    <div class="everpay-coin-choose">
      <div
        v-for="item in everPaySymbolList"
        :key="item.symbol"
        class="everpay-symbol-item py-2 px-3 al-c cursor-p mt-4"
        :class="{
          trigger: selected == item.symbol,
        }"
        @click="onSelect(item)"
      >
        <v-icon size="16" :color="selected == item.symbol ? $color1 : '#555'"
          >mdi-{{
            selected == item.symbol
              ? "circle-slice-8"
              : "checkbox-blank-circle-outline"
          }}</v-icon
        >
        <img width="40" :src="item.img" alt="" />
        <div class="ml-3 mr-10">
          <div>
            <span class="fw-b fz-14">{{ item.title }}</span>
            <span class="ml-2 fz-12 symbol">{{ item.symbol }}</span>
          </div>
          <div class="fz-12 text">{{ item.chainType }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    payAmounts: {
      type: Object,
    },
  },
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
      selected: "USDC",
    };
  },
  computed: {
    ...mapGetters(["walletObj"]),
    ...mapState({
      payBy: (s) => s.payBy,
      chainId: (s) => s.chainId,
    }),
  },
  created() {
    this.initEverPay();
    this.walletObj.on("accountsChanged", (val) => {
      this.initEverPay();
    });
  },
  methods: {
    async initEverPay() {
      try {
        const everPay = new window.Everpay.default();
        const accounts = await this.walletObj.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        const data = await everPay.balances({
          account,
        });
        console.log(data);

        this.everPaySymbolList = this.everPaySymbolList.map((it) => {
          let everPayItem = {};
          for (const item of data) {
            if (item.symbol == it.symbol && item.chainType == "ethereum") {
              everPayItem = {
                ...it,
                ...item,
                balance: parseFloat(item.balance),
              };
              break;
            }
          }
          return everPayItem;
        });

        this.onSelect(this.everPaySymbolList[0]);
      } catch (err) {
        if (err.code && err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          this.$alert(err.message);
        }
      }
    },
    async onSelect(item) {
      this.selected = item.symbol;
      this.$emit("onEverpay", item);
    },
    handleOpenLink(url) {
      window.open(url);
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .everpay-coin-choose {
    padding-bottom: 150px;
  }
}
.everpay-symbol-item {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  background: #fff;
  .symbol {
    color: #4d4d67;
  }
}

.everpay-symbol-item.trigger {
  font-weight: bold;
  border: 1px solid var(--v-primary-base);
}
.everpay-coin-choose {
  height: calc(100% - 168px);
  overflow: auto;
}

.deposite-btn {
  padding: 16px 10px;
  font-weight: bold;
  color: #fff;
  border-radius: 4px;
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
