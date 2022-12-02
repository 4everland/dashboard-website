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

    <e-kv2 class="mt-6" label="Network">
      <pay-network />
    </e-kv2>

    <div class="mt-8 gray fz-14">
      To complete the transaction with ETH and BSC payments, the platform will
      automatically cross-chain to Polygon. To prevent insufficient gas fees,
      maintaining a minimum payment amount of 20U is required.
    </div>
    <h3 class="mt-10">Redeem a gift vouche</h3>
    <v-row>
      <v-col sm="8" cols="12" class="d-flex al-start">
        <div class="flex-1">
          <v-text-field
            class="post-input hide-msg"
            persistent-placeholder
            v-model="voucherCode"
            outlined
            dense
            placeholder="Enter the voucher code"
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
          :disabled="disabled"
          tile
          @click="handleCommit"
          >Commit</v-btn
        >
      </v-col>
    </v-row>
    <div style="height: 20vh"></div>
    <pay-confirm
      label="Configuration costs"
      :price="totalPrice"
      :text="isApproved ? 'Confirm' : 'Approve'"
      :loading="approving"
      @submit="onSubmit"
    >
      <template #detail v-if="AmountofDeduction">
        <div>
          <span class="fz-14 gray-6 label">Gift Voucher:</span>
          <b class="black fz-25 ml-3">-{{ AmountofDeduction }}</b>
          <span class="gray-6 ml-2 fz-15">USDC</span>
        </div>
        <div>
          <span class="fz-14 gray-6 label">Total:</span>
          <b class="red-1 fz-25 ml-3">{{
            totalPrice - AmountofDeduction >= 0
              ? totalPrice - AmountofDeduction
              : "0.00"
          }}</b>
          <span class="gray-6 ml-2 fz-15">USDC</span>
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
        3: "Unavailable！This voucher has expired.",
      },
      validStatus: 1,
      AmountofDeduction: 0,
    };
  },
  computed: {
    ...mapState({
      totalPrice: (s) => s.orderInfo.totalPrice,
      list: (s) => s.orderInfo.list,
      orderInfo: (s) => s.orderInfo,
    }),
  },
  created() {
    console.log(this.orderInfo);
    if (!this.list) this.$router.replace("/resource/subscribe");
  },
  methods: {
    async onSubmit(isPreview) {
      try {
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
        console.log(payloads);
        this.$loading();
        const params = [this.providerAddr, this.uuid, payloads];
        if (!this.isPolygon) {
          if (this.chainId != 56) {
            totalFee = totalFee.div(1e12);
          }
          console.log("totalFee", totalFee.toString());
          const feeMsg = await target.calcFeeV2(...params);
          // console.log("feeMsg", feeMsg.toString());
          // params.push(maxSlippage);
          params.push({
            value: feeMsg,
          });
          this.ethFeeInfo = {
            msgFee: this.$utils.cutFixed(feeMsg.toString() / 1e18, 4),
            unit: this.isBSC ? "BNB" : "ETH",
          };
          console.log(this.ethFeeInfo);
          if (isPreview) {
            return;
          }
        }
        console.log("pay", params, this.curContract[this.chainKey]);
        let tx = await target.payV2(...params);
        console.log("tx", tx);
        const receipt = await tx.wait(1);
        this.addHash(tx, this.totalPrice);
        console.log("receipt", receipt);
        this.$loading.close();
        await this.$alert("Purchased successfully");
        this.$router.replace("/resource/bills");
        localStorage.orderInfo = "";
      } catch (error) {
        console.log("pay submit error");
        this.onErr(error);
      }
    },
    async handleCommit() {
      try {
        if (!this.voucherCode) return;
        this.validStatus = 1;
        this.showDecode = true;
        const { data } = await this.$http(
          `$resource/voucher/verify/${this.voucherCode}`,
          {
            noTip: 1,
          }
        );
        console.log(data, JSON.parse(data.voucherLimit).USDC);
        this.AmountofDeduction = JSON.parse(data.voucherLimit).USDC;
        this.validStatus = 2;
      } catch (error) {
        //
        console.log(error);
        this.validStatus = 3;
      }
    },
  },
  components: {
    PayNetwork,
    PayConfirm,
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