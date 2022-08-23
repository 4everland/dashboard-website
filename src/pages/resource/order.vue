<template>
  <div>
    <div class="al-end d-flex fz-14 gray">
      <span class="gray-6 fz-14">Pending order</span>
      <!-- <span class="ml-auto">Total:</span> -->
      <!-- <span class="fz-16 color-1 ml-2 mr-1">{{ totalPrice }}</span>
      <span class="gray">USD</span> -->
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
            <td>Purchase</td>
            <td>{{ it.label }}</td>
            <td>{{ it.value }}</td>
            <td>{{ $utils.cutFixed(it.price, 4) }} USD</td>
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

    <div style="height: 20vh"></div>
    <pay-confirm
      label="Configuration costs"
      :price="totalPrice"
      :text="isApproved ? 'Confirm' : 'Approve'"
      :loading="approving"
      @submit="onSubmit"
    >
    </pay-confirm>
  </div>
</template>

<script>
import mixin from "@/components/pay/mixin";
import { mapState } from "vuex";
import { BigNumber } from "@ethersproject/bignumber";

export default {
  mixins: [mixin],
  data() {
    return {
      isSubscribe: true,
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
          const feeMsg = await this.curContract[this.chainKey].calcFeeV2(
            ...params
          );
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
        let target = this.curContract[this.chainKey];
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
  },
};
</script>