<template>
  <div class="hide-msg">
    <e-kv label="Account Balance" min-width="120px" center>
      <span class="fz-18">{{ balance === null ? "--" : balance }}</span>
      <span class="gray-6 fz-13 ml-1">USD</span>
    </e-kv>
    <e-kv2 class="mt-7" label="Deposit Account">
      <div class="d-ib bd-1 bdc-c1 bdrs-2">
        <input
          class="pa-2"
          v-model="amount"
          type="number"
          style="width: 240px"
        />
        <span class="fz-14 ml-1 mr-2">USD</span>
      </div>
    </e-kv2>
    <e-kv2 class="mt-7" label="Network">
      <pay-network :allow="['Polygon']" />
    </e-kv2>

    <div class="mt-8 fz-14 gray">
      <p>Tips:</p>
      <p class="mt-2">
        When free or purchased resources are consumed, the cost of any overused
        resources will be deducted from your wallet balance. Therefore, it is
        recommended that you deposit in advance to prevent service suspension.
      </p>
    </div>

    <div style="height: 10vh"></div>
    <pay-confirm
      :price="amount || 0"
      text="Deposit"
      @submit="onSubmit"
    ></pay-confirm>
  </div>
</template>

<script>
import mixin from "@/components/pay/mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      amount: "",
    };
  },
  mounted() {
    this.getBalance();
  },
  watch: {
    amount(val) {
      if (val > 0) {
        if (val % 0.01 > 0) this.amount = this.$utils.cutFixed(val, 4);
      } else this.amount = "";
    },
  },
  methods: {
    async onSubmit() {
      let num = this.amount;
      if (num === "") {
        return this.$toast(`Deposit amount required`);
      }
      if (num < 1) {
        return this.$alert(
          "The minimum deposit amount cannot be less than $1."
        );
      }
      console.log("num", num);
      try {
        await this.checkAccount();
        let balance = await this.curContract.FundPool.balanceOf(
          this.providerAddr,
          this.uuid
        );
        console.log("balance1", balance.toString());
        const tx = await this.curContract.FundPool.recharge(
          this.providerAddr,
          this.uuid,
          num * 1e6
        );
        const receipt = await tx.wait();
        console.log("receipt", receipt);
        this.addHash(tx, num, "Deposit");
        balance = await this.curContract.FundPool.balanceOf(
          this.providerAddr,
          this.uuid
        );
        console.log("balance2", balance.toString());
        await this.$alert("Deposit successfully");
        this.$navTo("/resource");
      } catch (error) {
        this.onErr(error);
      }
    },
  },
};
</script>