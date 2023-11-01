<template>
  <div class="main-wrap">
    <h2 class="fz-16">Purchase</h2>
    <div class="deposite-section mt-4">
      <div class="al-c deposite-control">
        <input
          class="deposite-input flex-1"
          :value="landAmount"
          @input="handleInput"
          type="text"
        />

        <span class="num">,000,000</span>
        <span class="d-ib deposite-btn">LAND</span>
      </div>
      <p class="mt-1 fz-12">1,000,000LAND=1U</p>
    </div>

    <h2 class="fz-16 mt-6">Network</h2>
    <pay-network class="mt-4" :allow="allowNetwork" ref="payNetwork" />

    <h2 class="mt-6 fz-16">Redeem a Credit</h2>
    <redeem-credit class="mt-4"></redeem-credit>

    <resouce-counter></resouce-counter>
  </div>
</template>

<script>
import { mapState } from "vuex";
import payNetwork from "../../views/pay/pay-network.vue";
import redeemCredit from "./component/redeem-credit.vue";
import resouceCounter from "./component/resouce-counter.vue";
export default {
  components: {
    payNetwork,
    redeemCredit,
    resouceCounter,
  },
  data() {
    return {
      landAmount: "0",
    };
  },
  computed: {
    ...mapState({
      onChain: (s) => s.onChain,
    }),
    allowNetwork() {
      if (this.onChain) {
        // return ["Polygon", "Ethereum", "BSC"];
        if (this.$inDev) {
          return ["Polygon", "Ethereum", "BSC", "zkSync", "everPay"];
        }
        return ["Polygon", "Ethereum", "BSC", "Arbitrum", "zkSync", "everPay"];
      } else {
        return ["Polygon"];
      }
    },
  },
  methods: {
    handleInput(e) {
      let value = e.target.value;
      value = value.replace(/[^\d]/g, "");
      if (this.landAmount == "0") {
        this.landAmount = "";
      }
      if (value == "") {
        this.landAmount = "0";
      }
      // this.landAmount = this.toThousands(value);
    },
    toThousands(num) {
      num = (num || 0).toString();
      let number = 0,
        floatNum = "",
        intNum = "";
      if (num.indexOf(".") > 0) {
        number = num.indexOf(".");
        floatNum = num.substr(number);
        intNum = num.substring(0, number);
      } else {
        intNum = num;
      }
      let result = [],
        counter = 0;
      intNum = intNum.split("");
      for (let i = intNum.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(intNum[i]);
        if (!(counter % 3) && i != 0) {
          result.unshift(",");
        }
      }
      return result.join("") + floatNum || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.deposite-control {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}
.deposite-input {
  background: #fff;
  padding: 13px 0;
  text-indent: 20px;
  text-align: right;
  font-size: 20px;
  border-radius: 4px 0 0 4px;
  font-family: "DIN Alternate";
}
.num {
  font-family: "DIN Alternate";
  font-size: 20px;
  padding: 16px 10px 16px 0;
  color: #64748b;
}
.deposite-btn {
  padding: 16px 41px;
  background: #f1f5f9;
  border-radius: 0 4px 4px 0;
}
</style>
