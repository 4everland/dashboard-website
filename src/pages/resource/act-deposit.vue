<template>
  <div class="hide-msg">
    <e-kv label="Account Balance" min-width="120px" center>
      <span class="fz-18">{{ balance === null ? "--" : balance }}</span>
      <span class="gray-6 fz-13 ml-1">USDC</span>
    </e-kv>
    <e-kv2 class="mt-7" label="Deposit Amount">
      <div class="d-ib bd-1 bdc-c1 bdrs-2">
        <input class="pa-2" v-model="amount" type="text" style="width: 240px" />
        <!-- <span class="pa-2 fz-14 fw-b color-1">Max</span> -->
        <v-btn
          text
          small
          @click="onMax"
          v-if="!walletBalance || curAmount < walletBalance"
          >Max</v-btn
        >
        <span class="fz-14 ml-1 mr-2">USDC</span>
      </div>
    </e-kv2>
    <e-kv2 class="mt-7" label="Network" v-if="onChain != null">
      <pay-network :allow="allowNetwork" />
    </e-kv2>

    <div class="mt-8 fz-14 gray">
      <p class="mt-2">
        <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>
        When free or purchased resources are consumed, the cost of any overused
        resources will be deducted from your wallet balance. Therefore, it is
        recommended that you deposit in advance to prevent service suspension.
      </p>
    </div>

    <div style="height: 30vh"></div>
    <pay-confirm
      :price="curAmount"
      :text="isApproved ? 'Deposit' : 'Approve'"
      :loading="approving"
      @submit="onSubmit"
    ></pay-confirm>
  </div>
</template>

<script>
import PayNetwork from "@/views/pay/pay-network";
import PayConfirm from "@/views/pay/pay-confirm";
import mixin from "@/views/pay/mixin";
import { ethers } from "ethers";
import { mapState } from "vuex";

export default {
  mixins: [mixin],
  data() {
    return {
      amount: "",
      needCheckApprove: true,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      onChain: (s) => s.onChain,
    }),
    curAmount() {
      return this.$utils.cutFixed(this.amount || 0, 4);
    },
    allowNetwork() {
      // if (this.onChain) return ["Polygon", "Ethereum", "BSC"];
      return ["Polygon"];
    },
  },
  mounted() {
    this.getBalance();
  },
  watch: {
    amount(val) {
      // console.log(val);
      if (val >= 0) {
        if (this.walletBalance && val > this.walletBalance) {
          this.amount = this.walletBalance;
        }
        if (/\.\d/.test(val)) this.amount = this.$utils.cutFixed(val, 4);
      } else {
        this.amount = parseInt(val) || "";
      }
    },
    curContract(val) {
      if (val && this.needSubmit) {
        this.onSubmit();
        this.needSubmit = false;
      }
    },
  },
  methods: {
    async onMax() {
      if (!this.curContract) {
        this.showConnect();
        return;
      }
      await this.getWalletBalance();
      if (!this.walletBalance) this.$alert("Insufficient balance");
      else this.amount = this.walletBalance;
    },
    async onSubmit() {
      let num = this.curAmount;
      let msg = "";
      if (num === "") {
        msg = "Deposit amount required";
      } else if (num < 0.1) {
        msg = "The minimum deposit amount cannot be less than $0.1.";
      }
      if (msg) {
        return this.$alert(msg);
      }
      try {
        if (!this.curContract) {
          this.needSubmit = true;
          this.showConnect();
          return;
        }
        const target =
          this.usdcKey == "MumbaiUSDC"
            ? this.curContract.FundPool
            : this.curContract.SrcChainRecharge;
        console.log(target);
        let curAmountDecimals = await this.curContract[this.usdcKey].decimals();
        console.log(curAmountDecimals);
        curAmountDecimals = parseInt(curAmountDecimals);
        const nonce = Date.now();
        const maxSlippage = this.isPolygon
          ? ""
          : this.getMaxSlippage(curAmountDecimals);
        if (!target) {
          return this.onConnect();
        }
        if (!this.isApproved) {
          return this.onApprove();
        }
        this.$loading();
        let tx = null;
        const accountExists = await this.checkAccount();
        console.log(accountExists, "accountExists");
        if (this.usdcKey == "MumbaiUSDC") {
          if (accountExists) {
            tx = await target.recharge(
              this.providerAddr,
              this.uuid,
              num * Math.pow(10, curAmountDecimals)
            );
          } else {
            const { sign } = await this.getSignAddress();
            tx = await target.rechargeWithRegistration(
              this.providerAddr,
              this.uuid,
              num * Math.pow(10, curAmountDecimals),
              sign
            );
          }
        } else {
          const fee = await target.calcFee(this.providerAddr, this.uuid);
          const token = await target.token();
          let minAmount = await this.curContract.Bridge.minSend(token);
          console.log(curAmountDecimals);
          minAmount = minAmount / 10 ** curAmountDecimals;

          console.log(minAmount);
          if (num <= minAmount) {
            this.$loading.close();
            let isEthOrBsc = "";
            if (this.isEth) {
              isEthOrBsc = "Eth";
            } else if (this.isBSC) {
              isEthOrBsc = "BSC";
            }
            return this.$alert(
              `Your deposit amount cannot be less than ${minAmount} USDC due to the ${isEthOrBsc} network restrictions.`
            );
          }
          const amount = ethers.utils.parseUnits(
            num.toString(),
            curAmountDecimals
          );
          console.log(amount, amount.toString(), "amount");
          let gas = await target.estimateGas.recharge(
            this.providerAddr,
            this.uuid,
            amount,
            nonce,
            maxSlippage,
            { value: fee }
          );
          console.log("gas", gas);
          let gasPrice = await this.curContract.provider.getGasPrice();
          tx = await target.recharge(
            this.providerAddr,
            this.uuid,
            amount,
            nonce,
            maxSlippage,
            {
              value: fee,
              gasLimit: gas.mul(15).div(10),
              gasPrice: gasPrice.mul(12).div(10),
            }
          );
        }

        const receipt = await tx.wait();
        console.log("receipt", receipt);

        this.addHash(tx, num, "Deposit");

        if (!accountExists) {
          await this.registerSuccess();
        }
        this.$loading.close();
        await this.$alert(
          "Successful transaction! The arrival time of the amount is subject to the transaction on-chain data."
        );
        this.$router.replace({
          path: "/resource/bills",
          query: {
            typeIdx: this.isPolygon ? 0 : 1,
          },
        });
      } catch (error) {
        console.log(error);
        this.onErr(error);
      }
    },
    async getMaxSlippage(curAmountDecimals) {
      try {
        if (this.$inDev) {
          return 40000;
        }
        const { data } = await this.$http.post(
          "$hosting/api/celer/estimate/amount",
          {
            src_chain_id: this.isEth ? "1" : "56",
            dst_chain_id: "137",
            token_symbol: "USDC",
            amount: this.curAmount * Math.pow(10, curAmountDecimals),
            addr: this.connectAddr,
            slippage_tolerance: 3000,
          }
        );
        // console.log(data);
        console.log(data);

        if (data.err) {
          throw new Error(data.err.message);
        }
        return data.max_slippage;
      } catch (error) {
        console.log(error, "======");
      }
    },
    async getSignAddress() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-sign-from-server"
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    PayNetwork,
    PayConfirm,
  },
};
</script>
