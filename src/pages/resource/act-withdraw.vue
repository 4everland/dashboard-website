<template>
  <div class="hide-msg">
    <e-kv label="Account Balance" min-width="120px" center>
      <span class="fz-18">{{ balance === null ? "--" : balance }}</span>
      <span class="gray-6 fz-13 ml-1">USDC</span>
    </e-kv>
    <e-kv2 class="mt-7" label="Withdraw Amount">
      <div class="d-ib bd-1 bdc-c1 bdrs-2">
        <input
          class="pa-2"
          v-model="amount"
          type="text"
          :max="balance"
          style="width: 240px"
        />
        <v-btn
          text
          small
          @click="amount = balance"
          v-if="balance && curAmount < balance"
          >Max</v-btn
        >
        <span class="fz-14 ml-1 mr-2">USDC</span>
      </div>
    </e-kv2>
    <e-kv2 class="mt-7" label="Address">
      <v-text-field
        v-model.trim="address"
        outlined
        dense
        style="max-width: 500px"
      ></v-text-field>
    </e-kv2>
    <e-kv2 class="mt-7" label="Network">
      <pay-network :allow="['Polygon']" />
    </e-kv2>
    <div class="mt-8 fz-14 gray">
      <p class="mt-2">
        <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>
        When the withdrawal is confirmed, the system will automatically settle
        the gas fee. The exact withdrawal amount is determined based on the
        actual result.
      </p>
    </div>

    <div style="height: 10vh"></div>
    <pay-confirm
      :price="curAmount"
      text="Withdraw"
      @submit="onSubmit"
    ></pay-confirm>
  </div>
</template>

<script>
import PayNetwork from "@/views/pay/pay-network";
import PayConfirm from "@/views/pay/pay-confirm";
import mixin from "@/views/pay/mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      amount: "",
      address: "",
    };
  },
  computed: {
    curAmount() {
      return this.$utils.cutFixed(this.amount || 0, 4);
    },
  },
  mounted() {
    this.getBalance();
    this.setAddr();
  },
  watch: {
    userInfo() {
      this.setAddr();
    },
    connectAddr() {
      this.setAddr();
    },
    address(val) {
      console.log(val);
    },
    amount(val) {
      if (val >= 0) {
        if (val > this.balance) this.amount = this.balance;
        if (/\.\d/.test(val) && val > 0)
          this.amount = this.$utils.cutFixed(val, 4);
      } else {
        this.amount = parseInt(val) || "";
      }
    },
    curContract(val) {
      console.log(val);
      if (val && this.needSubmit) {
        this.onSubmit();
        this.needSubmit = false;
      }
    },
  },
  methods: {
    setAddr() {
      const { wallet } = this.userInfo;
      if (wallet) this.address = wallet.address;
      else if (this.connectAddr) this.address = this.connectAddr;
    },
    async onSubmit() {
      let num = this.curAmount;
      const addr = (this.address = this.address.trim());
      let msg = "";
      if (!num) {
        msg = "Withdraw amount required";
      } else if (num < 0.1) {
        msg = "The minimum withdraw amount cannot be less than $0.1.";
      } else if (!addr) {
        msg = "Withdraw address required";
      } else if (!/^0x[0-9a-f]{40}$/i.test(addr)) {
        msg = "Withdraw address not correct";
      }
      if (msg) return this.$alert(msg);
      try {
        if (!this.isPolygon) {
          return this.switchPolygon();
        }
        if (!this.curContract) {
          this.needSubmit = true;
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
          addr,
          num * 1e6,
        ];
        console.log(params);
        await this.onWithdraw(params);
        this.$loading.close();
        await this.$alert("Your withdrawal was successful.");
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
  components: {
    PayNetwork,
    PayConfirm,
  },
};
</script>