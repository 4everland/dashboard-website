<template>
  <div>
    <div class="al-c ov-a pb-1">
      <e-tooltip top>
        <v-icon color="#6e7787" size="18" slot="ref" class="mr-2"
          >mdi-alert-circle</v-icon
        >
        <span
          >We will settle the account in time, there may be a slight
          delay.</span
        >
      </e-tooltip>
      <span class="gray-7 mr-3">Total balance:</span>
      <b class="fz-20 red-1">{{ balance }}</b>
      <span class="gray-6 fz-12 ml-2 mt-1">USDC</span>
      <v-btn color="primary" rounded class="ml-8" @click="onShow(1)"
        >Recharge</v-btn
      >
      <v-btn outlined rounded class="ml-4" @click="onShow(2)">Withdraw</v-btn>
      <a class="ml-auto al-c" href="#/usage/billing/deduction">
        <img src="img/svg/billing/usage-list.svg" width="14" />
        <span class="ml-2 fz-14">Deduction details</span>
      </a>
    </div>

    <v-dialog
      :persistent="approving || posting"
      v-model="showPop"
      max-width="500"
    >
      <e-dialog-close @click="showPop = false" />
      <div class="pa-4 pos-r">
        <h3>{{ title }}</h3>
        <div class="mt-3 bd-1 bg-f8a pa-5 bdrs-8 d-flex al-start">
          <v-icon color="#ff8843" size="22">mdi-alert-circle</v-icon>
          <div class="ml-2">
            <p class="fz-15">
              <template v-if="isRecharge">
                Recharge will lock your funds. <br />
                When the account resource over used, the excess quantities will
                be deducted. <br />
                You can withdraw your balance at any time.
              </template>
              <template v-else>
                Please pay attention to check the wallet balance
              </template>
            </p>
            <div class="mt-4 gray-7 fz-13 lh-11">
              <p>
                * Currently, racharge are only supported on the Polygon network.
              </p>
              <p class="mt-2" v-if="isRecharge">
                * Only supports USDC recharge.
              </p>
            </div>
          </div>
        </div>
        <div class="mt-4 al-c gray-7">
          <span class="ml-2">Total Balance:</span>
          <b class="fz-20 red-1 mr-1 ml-2">{{ balance }}</b>
          <span class="fz-13 mt-1">USD</span>
          <span class="ml-auto" v-if="isRecharge">
            Wallet Banace: {{ walletBalance }} <span class="fz-13">USDC</span>
          </span>
        </div>
        <div class="bd-1 mt-3 al-c bdrs-5">
          <div class="al-c bdr-1 pr-4 pl-2">
            <img src="img/svg/billing/ic-polygon.svg" width="26" />
            <span class="ml-2 fz-14">Polygon</span>
          </div>
          <input
            v-model="formNum"
            @blur="onNumBlur"
            type="tel"
            class="input-1 flex- shrink-1 fz-18 pa-2 pl-4"
            :placeholder="isRecharge ? 'minimum 10' : ''"
            style="width: auto"
          />
          <img src="img/svg/settings/c-usdc.svg" height="24" />
          <span class="ml-2 mr-2 fz-14">USDC</span>
          <v-btn color="primary" small class="mr-2" @click="onMax">MAX</v-btn>
        </div>
        <div class="fz-14 mt-2 ml-2 gray-7">
          <!-- <span v-if="isRecharge"></span> -->
          <span
            class="red-1"
            v-if="
              (isRecharge && walletBalance < 100) || (!isRecharge && !balance)
            "
            >（Insufficient balance）</span
          >
        </div>
        <div class="mt-4 pa-3">
          <v-btn
            color="primary"
            :disabled="isApproved"
            :loading="approving"
            v-if="isRecharge"
            rounded
            block
            depressed
            @click="onApprove()"
            >{{ isApproved ? "Approved" : "Approve" }}</v-btn
          >
          <v-btn
            color="primary"
            :disabled="!isApproved"
            :loading="posting"
            class="mt-5"
            rounded
            block
            @click="onConfirm"
            >Confirm</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import mixin from "../../pages/usage/mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      balance: 0,
      showPop: false,
      isRecharge: true,
      formNum: "",
      posting: false,
    };
  },
  computed: {
    title() {
      return this.isRecharge ? "Recharge" : "Withdraw";
    },
    maxNum() {
      if (this.isRecharge) {
        return this.walletBalance;
      }
      return this.balance;
    },
  },
  mounted() {
    this.getBalance();
  },
  methods: {
    onNumBlur() {
      const val = this.formNum;
      let num = Math.min(this.maxNum, Math.max(0, val));
      if (!num) num = "0";
      else num = this.$utils.cutFixed(num, 4);
      if (val > 0 && !this.maxNum) {
        num = "";
        this.$toast("Insufficient balance");
      }
      if (num != val) this.formNum = num;
    },
    async onRecharge() {
      let num = this.formNum;
      num *= 1e6;
      console.log("num", num);
      let balance = await this.curContract.FundPool.balanceOf(
        this.providerAddr,
        this.uuid
      );
      console.log("balance1", balance.toString());
      const tx = await this.curContract.FundPool.recharge(
        this.providerAddr,
        this.uuid,
        num
      );
      const receipt = await tx.wait();
      console.log("receipt", receipt);
      balance = await this.curContract.FundPool.balanceOf(
        this.providerAddr,
        this.uuid
      );
      console.log("balance2", balance.toString());
    },
    async onWithdraw() {
      let num = this.formNum;
      const { data } = await this.$http.post("$v3/bill/generate/order", {
        amount: num,
      });
      console.log(data);
      await this.getBalance();
      if (num > this.balance) {
        throw new Error("Insufficient balance");
      }
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
      const tx = await this.curContract.FundPool.withdraw(...params);
      console.log("tx", tx);
      const receipt = await tx.wait();
      console.log("receipt", receipt);
    },
    async onConfirm() {
      if (!(this.formNum > 0)) {
        return this.$alert("Insufficient balance");
      }
      if (this.isRecharge) {
        if (this.formNum < 10)
          return this.$alert(
            "The minimum recharge amount cannot be less than $20."
          );
      }
      try {
        this.posting = true;
        if (this.isRecharge) {
          await this.onRecharge();
          this.$toast("Recharge successfully");
        } else {
          await this.onWithdraw();
          this.$toast("Withdraw successfully");
        }
        this.showPop = false;
        this.getBalance();
        this.$emit("update");
      } catch (error) {
        this.onErr(error);
      }
      this.posting = false;
    },
    async signWallet() {
      this.$loading("Check Wallet...");
      const walletExists =
        await this.curContract.ProviderController.walletExists(
          this.providerAddr,
          this.uuid
        );
      console.log("walletExists", walletExists);
      if (!walletExists) {
        const { data: sign } = await this.$http.post(
          "$v3/common/sign/" + this.connectAddr
        );
        console.log(sign);
        const tx = await this.curContract.ProviderController.initWallet(
          this.providerAddr,
          this.uuid,
          this.connectAddr,
          sign
        );
        console.log("tx", tx);
        const receipt = await tx.wait();
        console.log("receipt", receipt);
      }
      this.$loading.close();
    },
    async onShow(type) {
      this.isRecharge = type == 1;
      if (!this.isPolygon) {
        let html = `Currently, deposits and withdrawals are only supported on the polygon network. `;
        html += "<p>Would you like to switch to the polygon network?</p>";
        try {
          await this.$confirm(html, this.title, {
            confirmText: "Switch Network",
          });
          const payBy = (localStorage.payBy = "Polygon");
          const id = this.getChainId(payBy);
          await this.switchNet(id);
        } catch (error) {
          //
        }
        return;
      }
      try {
        if (!this.connectAddr) {
          this.showConnect();
          return;
        }
        await this.getWalletBalance();
        if (!this.walletSigned) {
          await this.signWallet();
          this.walletSigned = true;
        }
        this.formNum = "";
        this.showPop = true;
      } catch (error) {
        this.onErr(error);
      }
    },
    async getBalance() {
      try {
        const { data } = await this.$http.get("$v3/account/balance");
        this.balance = this.$utils.cutFixed(data.balance, 2);
        // if (this.$inDev) this.balance = 10;
      } catch (error) {
        //
      }
    },
    onMax() {
      let num = this.maxNum;
      if (num == 0) {
        return this.$toast("Insufficient balance");
      }
      this.formNum = num;
    },
  },
};
</script>