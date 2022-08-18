<template>
  <div class="hide-msg">
    <e-kv label="Account Balance" min-width="120px" center>
      <span class="fz-18">{{ balance === null ? "--" : balance }}</span>
      <span class="gray-6 fz-13 ml-1">USD</span>
    </e-kv>
    <e-kv2 class="mt-7" label="Withdraw Account">
      <div class="d-ib bd-1 bdc-c1 bdrs-2">
        <input
          class="pa-2"
          v-model="amount"
          type="number"
          :max="balance"
          style="width: 240px"
        />
        <span class="fz-14 ml-1 mr-2">USD</span>
      </div>
    </e-kv2>
    <e-kv2 class="mt-7" label="Address">
      <v-text-field
        v-model="address"
        outlined
        dense
        style="max-width: 500px"
      ></v-text-field>
    </e-kv2>
    <e-kv2 class="mt-7" label="Network">
      <pay-network :allow="['Polygon']" />
    </e-kv2>
    <div class="mt-8 fz-14 gray">
      <p>Tips:</p>
      <p class="mt-2">
        When the withdrawal is confirmed, the system will automatically settle
        the gas fee. The exact withdrawal amount is determined based on the
        actual result.
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
      address: "",
    };
  },
  mounted() {
    this.getBalance();
    if (this.connectAddr) this.address = this.connectAddr;
  },
  watch: {
    connectAddr(val) {
      if (!this.address) this.address = val;
    },
    address(val) {
      console.log(val);
    },
    amount(val) {
      if (val > 0) {
        if (val > this.balance) this.amount = this.balance;
        else if (val % 0.01 > 0) this.amount = this.$utils.cutFixed(val, 4);
      } else this.amount = "";
    },
  },
  methods: {
    async onSubmit() {
      let num = this.amount;
      if (num === "") {
        return this.$toast(`Withdraw amount required`);
      }
      try {
        if (!this.isPolygon) {
          return this.switchPolygon();
        }
        if (!this.curContract) {
          this.showConnect();
          return;
        }
        // if (this.maxNum == 0) throw new Error(tip1);
        this.$loading();
        const { data } = await this.$http.post("$v3/bill/generate/order", {
          amount: num,
        });
        console.log(data);
        const {
          billSign,
          timeoutTimestamp: timeout,
          billEncode: bills,
          orderId,
        } = data;
        const params = [
          this.providerAddr,
          this.uuid,
          bills,
          timeout,
          orderId,
          billSign,
          this.connectAddr,
          num * 1e6,
        ];
        console.log(params);
        await this.onWithdraw(params);
        this.$loading.close();
        await this.$alert("Withdraw successfully");
        this.$navTo("/resource");
      } catch (error) {
        this.onErr(error);
      }
    },
    async onWithdraw(params) {
      const walletExists =
        await this.curContract.ProviderController.walletExists(
          this.providerAddr,
          this.uuid
        );
      console.log("walletExists", walletExists);
      let tx;
      if (!walletExists) {
        const { data: sign } = await this.$http.post(
          "$v3/common/sign/" + this.connectAddr
        );
        console.log(sign);
        params.splice(2, 0, sign);
        tx = await this.curContract.FundPool.initWalletAndWithdraw(...params);
      } else {
        console.log("signed");
        tx = await this.curContract.FundPool.withdraw(...params);
      }
      console.log("tx", tx);
      const receipt = await tx.wait();
      this.addHash(tx, "Withdraw");
      console.log("receipt", receipt);
    },
  },
};
</script>