<template>
  <div>
    <div class="al-end d-flex fz-14 gray">
      <span class="gray-6 fz-14">Pending order</span>
      <!-- <span class="ml-auto">Total:</span> -->
      <!-- <span class="fz-16 color-1 ml-2 mr-1">{{ totalPrice }}</span>
      <span class="gray">USDC</span> -->
    </div>
    <div class="ov-a">
      <table class="w100p e-table-1 mt-4 fz-14">
        <thead class="bg-f7 gray-6">
          <tr>
            <td>#</td>
            <td>Type</td>
            <td>Resource</td>
            <td>Specification</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody v-if="list">
          <tr v-for="(it, i) in list" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ it.type }}</td>
            <td>{{ it.label }}</td>
            <td>{{ it.value }}</td>
            <td>{{ $utils.cutFixed(it.price, 4) }} USDC</td>
          </tr>
        </tbody>
      </table>
    </div>

    <e-kv2 class="mt-6" label="Network" v-if="onChain != null">
      <pay-network :allow="allowNetwork" ref="payNetwork" />
    </e-kv2>

    <div class="mt-8 gray fz-14">
      To complete the transaction with ETH and BSC payments, the platform will
      automatically cross-chain to Polygon. To prevent insufficient gas fees,
      maintaining a minimum payment amount of 20U is required.
    </div>
    <h3 class="mt-10">Redeem a Credit</h3>
    <v-row>
      <v-col sm="8" cols="12" class="d-flex al-start">
        <div class="flex-1">
          <v-text-field
            class="post-input hide-msg"
            persistent-placeholder
            v-model="voucherCode"
            outlined
            dense
            :disabled="AmountofDeduction > 0"
            placeholder="Enter the credit code"
          >
          </v-text-field>
          <decode-status
            v-if="showDecode"
            :statusText="statusText"
            :status="validStatus"
            class="mt-3"
          />
        </div>
        <v-btn
          color="primary"
          class="ml-7"
          width="140"
          v-if="!AmountofDeduction"
          :disabled="disabled"
          tile
          @click="handleCommit"
          >Confirm</v-btn
        >
        <v-btn
          v-else
          outlined
          class="ml-7"
          width="140"
          tile
          @click="handleCancelVoucher"
          >Cancel</v-btn
        >
      </v-col>
    </v-row>
    <div style="height: 20vh"></div>
    <pay-confirm
      label="Configuration costs"
      :price="totalPrice"
      :text="isApproved ? 'Confirm' : 'Approve'"
      :loading="approving"
      :symbol="symbol"
      @submit="onSubmit"
    >
      <template #detail v-if="AmountofDeduction">
        <div>
          <span class="fz-14 gray-6 label">Credit:</span>
          <span class="black-1 fz-25 ml-3">-{{ AmountofDeduction }}</span>
          <span class="gray-6 ml-2 fz-15">{{ symbol }}</span>
        </div>
        <div>
          <span class="fz-14 gray-6 label">Total:</span>
          <span class="red-1 fz-25 ml-3">{{ finalPrice }}</span>
          <span class="gray-6 ml-2 fz-15">{{ symbol }}</span>
        </div>
      </template>
    </pay-confirm>
  </div>
</template>

<script>
import PayNetwork from "@/views/pay/pay-network";
import PayConfirm from "@/views/pay/pay-confirm";
import mixin from "@/views/pay/mixin";
import { mapState } from "vuex";
import { BigNumber } from "@ethersproject/bignumber";
import { bus } from "../../utils/bus";
import { getProvider } from "@/plugins/ens";
import { utils } from "ethers";
export default {
  mixins: [mixin],
  data() {
    return {
      isSubscribe: true,
      voucherCode: "",
      disabled: false,
      showDecode: false,
      statusText: {
        1: "Checking availability...",
        2: "Available!",
        3: "Unavailable！",
      },
      validStatus: 1,
      AmountofDeduction: 0,
      resourceResource: null,
      needCheckApprove: true,
      symbol: "USDC",
      curEveypayChannel: null,
    };
  },
  computed: {
    ...mapState({
      totalPrice: (s) => s.orderInfo.totalPrice,
      list: (s) => s.orderInfo.list,
      orderInfo: (s) => s.orderInfo,
      userInfo: (s) => s.userInfo,
      onChain: (s) => s.onChain,
      payBy: (s) => s.payBy,
    }),
    finalPrice() {
      return this.totalPrice - this.AmountofDeduction >= 0
        ? (this.totalPrice - this.AmountofDeduction).toFixed(4)
        : "0.00";
    },
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
  created() {
    console.log(this.orderInfo);
    if (!this.list) this.$router.replace("/resource/subscribe");

    bus.$on("everPayChannel", async (curEveypayChannel) => {
      this.curEveypayChannel = curEveypayChannel;
      const balance = curEveypayChannel.balance;
      if (balance < parseFloat(this.finalPrice)) {
        await this.$alert(
          "Insufficient balance, please deposit and try again.",
          "alert"
        );
      } else {
        // /
        this.$refs.payNetwork.$refs.everPay.showEverPay = false;
        this.$refs.payNetwork.$refs.everPay.allowPay = true;
        this.symbol = curEveypayChannel.symbol;
      }
    });
  },
  methods: {
    async onSubmit(isPreview) {
      try {
        if (!this.checkPayBy()) return;
        if (this.payBy == "everPay") {
          return await this.everPaySubmit();
        }

        const target = this.curContract[this.chainKey];
        if (!target) {
          return this.onConnect();
        }
        if (!this.isApproved) {
          return this.onApprove(true);
        }
        const form = this.orderInfo.feeForm;
        const payloads = [];
        let totalFee = null;
        for (const key in form) {
          let val = form[key];
          if (!val) continue;
          const values = Array.isArray(val)
            ? val.map((it) => BigNumber.from(it))
            : [BigNumber.from(val)];
          for (const fee of values) {
            totalFee = totalFee ? totalFee.add(fee) : fee;
          }
          payloads.push({
            resourceType: key,
            values,
          });
        }
        if (!totalFee) {
          throw new Error("No Fee");
        }
        this.ethFeeInfo = null;
        this.$loading();
        let params = [this.providerAddr, this.uuid, payloads];
        const nonce = this.resourceResource ? this.resourceResource.nonce : 0;
        const amount = this.resourceResource
          ? this.resourceResource.voucherAmount
          : 0;
        const signature = this.resourceResource
          ? this.resourceResource.sign
          : "0x";
        let resourceParams = [nonce, amount, signature];
        params = params.concat(resourceParams);
        if (!this.isPolygon) {
          if (this.chainId != 56) {
            totalFee = totalFee.div(1e12);
          }
          console.log("totalFee", totalFee.toString());
          console.log(params, "calcFee params");
          if (this.isZk) {
            let gas = await target.estimateGas.pay(...params);
            console.log("gas", gas);
            let gasPrice = await this.curContract.provider.getGasPrice();
            params.push({
              gasLimit: gas.mul(15).div(10),
              gasPrice: gasPrice.mul(12).div(10),
            });
          } else {
            const feeMsg = await target.calcFee(...params);
            console.log("feeMsg", feeMsg.toString());
            let gas = await target.estimateGas.pay(...params, {
              value: feeMsg,
            });
            console.log("gas", gas);
            let gasPrice = await this.curContract.provider.getGasPrice();
            params.push({
              value: feeMsg,
              gasLimit: gas.mul(15).div(10),
              gasPrice: gasPrice.mul(12).div(10),
            });
            this.ethFeeInfo = {
              msgFee: this.$utils.cutFixed(feeMsg.toString() / 1e18, 4),
              unit: this.isBSC ? "BNB" : "ETH",
            };
            console.log(this.ethFeeInfo);
          }
          if (isPreview) {
            return;
          }
        }
        console.log("pay", params, this.curContract[this.chainKey]);
        const accountExists =
          await this.curContract.ProviderController.accountExists(
            this.providerAddr,
            this.uuid
          );
        console.log(accountExists, "accountExists");
        let tx = null;
        if (accountExists) {
          tx = await target.pay(...params);
        } else {
          const { sign } = await this.getSignAddress();
          tx = await target.payWithRegistration(...params, sign);
        }
        console.log("tx", tx);
        const receipt = await tx.wait(1);
        this.addHash(tx, this.totalPrice);
        console.log("receipt", receipt);
        if (!accountExists) {
          await this.registerSuccess();
        }
        this.$loading.close();
        await this.$alert(
          "Successful transaction! The resource release time is based on on-chain data."
        );
        this.$router.replace({
          path: "/resource/bills",
          query: {
            typeIdx: this.isPolygon ? 0 : 1,
          },
        });
        localStorage.orderInfo = "";
      } catch (error) {
        console.log("pay submit error");
        this.$loading.close();
        this.onErr(error);
      }
    },

    async everPaySubmit() {
      try {
        this.$loading();
        const provider = getProvider();
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        const nonce = this.resourceResource ? this.resourceResource.nonce : "";
        const voucherAmount = this.resourceResource
          ? this.resourceResource.voucherAmount
          : "";
        const signature = this.resourceResource
          ? this.resourceResource.sign
          : "";
        const jsonData = {
          account: this.userInfo.uid,
          nonce,
          signature,
          voucherAmount,
          payloads: this.orderInfo.mapList,
          resourceAmounts: [],
        };
        const form = this.orderInfo.feeForm;
        const values = [];
        let totalFee = null;
        for (const key in form) {
          let val = form[key];
          if (!val) continue;
          Array.isArray(val)
            ? val.forEach((it) => values.push(BigNumber.from(it)))
            : values.push(BigNumber.from(val));
        }
        console.log(values, "values");
        for (const fee of values) {
          jsonData.resourceAmounts.push(fee.toString());
          totalFee = totalFee ? totalFee.add(fee) : fee;
        }

        console.log(totalFee, "totalfee", totalFee.toString());
        let finalPrice = null;
        if (voucherAmount != "") {
          const voucherAmountFee = BigNumber.from(voucherAmount);
          finalPrice = totalFee.sub(voucherAmountFee).isNegative()
            ? BigNumber.from("0")
            : totalFee.sub(voucherAmountFee);
        } else {
          finalPrice = totalFee;
        }
        if (this.symbol == "DAI") {
          finalPrice = utils.formatEther(finalPrice);
        } else {
          finalPrice = utils.formatUnits(finalPrice.div(10 ** 12), 6);
        }

        console.log(finalPrice, "finalprice");
        // return false;
        const everpay = new window.Everpay.default({
          account,
          chainType: "ethereum",
          ethConnectedSigner: signer,
        });
        const data = await everpay.transfer({
          tag: this.curEveypayChannel.tag,
          amount: finalPrice,
          to: this.$inDev ? "0xd8b38301655FaeE94C43f7121189E3E0f8973dd0" : "",
          data: jsonData,
        });

        this.$loading.close();
        await this.$alert(
          "Successful transaction! The resource release time is based on on-chain data."
        );
        this.$router.replace({
          path: "/resource/bills",
          query: {
            typeIdx: this.isPolygon ? 0 : 1,
          },
        });
        localStorage.orderInfo = "";
        console.log(data);
      } catch (error) {
        console.log("pay submit error");
        this.$loading.close();
        this.onErr(error);
      }
    },
    async handleCommit() {
      try {
        if (!this.voucherCode) return;
        this.disabled = true;
        this.validStatus = 1;
        this.showDecode = true;
        const { data } = await this.$http(
          `$resource/rewardhub/voucher/verify/${this.voucherCode}`,
          {
            noTip: 1,
          }
        );
        this.AmountofDeduction = JSON.parse(data.voucherLimit).USDC;
        if (data.voucherType == 1) {
          throw new Error(
            "Unavailable! This is a resource voucher, please enter a credit code."
          );
        }
        this.resourceResource = data;
        this.validStatus = 2;
        this.statusText[2] = `Available! Expires: ${new Date(
          data.expiredTime * 1000
        ).format("date")}`;
      } catch (error) {
        // console.log(error);
        this.validStatus = 3;
        this.statusText[3] = error.message;
      }
      this.disabled = false;
    },
    async handleCancelVoucher() {
      this.showDecode = false;
      this.validStatus = 1;
      this.voucherCode = "";
      this.AmountofDeduction = 0;
      this.resourceResource = null;
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
  watch: {
    payBy(val) {
      if (val != "everPay") {
        this.symbol = "USDC";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.label {
  display: inline-block;
  min-width: 130px;
  text-align: right;
}
</style>