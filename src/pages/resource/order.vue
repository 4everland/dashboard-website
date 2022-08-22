<template>
  <div>
    <div class="al-end d-flex fz-14 gray">
      <span class="gray-6 fz-14">Pending order</span>
      <span class="ml-auto">Total:</span>
      <span class="fz-16 color-1 ml-2 mr-1">10</span>
      <span class="gray">USD</span>
    </div>
    <div class="ov-a">
      <table class="w100p e-table-1 mt-4 fz-14">
        <thead class="bg-f7 gray-6">
          <tr>
            <td>#</td>
            <td>Type</td>
            <td>Resource</td>
            <td>Specification</td>
            <td>Created At</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
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
      @submit="onSubmit"
    >
    </pay-confirm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSubscribe: true,
      totalPrice: 0,
    };
  },
  methods: {
    async onSubmit(isPreview) {
      try {
        const form = this.feeForm;
        const payloads = [];
        let totalFee = null;
        for (const key in form) {
          const val = form[key];
          if (!val) continue;
          const values = key == ResourceType.IPFSStorage ? val : [val];
          for (const fee of values) {
            totalFee = totalFee ? totalFee.add(fee) : fee;
            console.log(key, totalFee);
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
        this.paying = true;
        const nonce = Math.floor(Date.now() / 1000);
        const params = [this.providerAddr, nonce, this.uuid, payloads];
        if (!this.isPolygon) {
          if (isPreview) {
            this.paying = false;
          }
          if (this.chainId != 56) {
            totalFee = totalFee.div(1e12);
          }
          console.log("totalFee", totalFee.toString());
          // const chainId = this.curContract[this.chainKey].provider.getChainId();
          const minSend = await this.curContract.Bridge.minSend(
            this.curContract.GoerliUSDC.address
          );
          console.log("minSend", minSend.toString());
          // if (totalFee.lt(minSend)) {
          //   throw new Error(
          //     "Minimun " + minSend.div(this.chainId == 56 ? 1e18 : 1e6) + " USD"
          //   );
          // }
          const { data } = await this.$http2.post(
            "/api/celer/estimate/amount",
            {
              src_chain_id: this.$inDev ? 1 : this.chainId,
              dst_chain_id: 137,
              token_symbol: "USDC",
              amount: totalFee.toString(),
              addr: this.connectAddr,
              slippage_tolerance: 3000,
            }
          );
          if (data.err) throw new Error(data.err.msg);
          console.log(data);
          const maxSlippage = data.max_slippage;
          console.log("maxSlippage", maxSlippage);
          console.log("calcFee", params);
          const feeMsg = await this.curContract[this.chainKey].calcFee(
            ...params
          );
          console.log("feeMsg", feeMsg.toString());
          params.push(maxSlippage);
          params.push({
            value: feeMsg,
          });
          this.ethFeeInfo = {
            msgFee: this.$utils.cutFixed(feeMsg.toString() / 1e18, 4),
            slipFee: this.$utils.cutFixed(
              (maxSlippage / 1e6) * this.totalPrice,
              4
            ),
            arrival: this.$utils.cutFixed(data.estimated_receive_amt / 1e6, 4),
            unit: this.isBSC ? "BNB" : "ETH",
          };
          if (isPreview) {
            return;
          }
        }
        console.log("pay", params, this.curContract[this.chainKey]);
        let target = this.curContract[this.chainKey];
        let tx;
        if (this.isPolygon) {
          tx = await target.pay(params);
        } else {
          tx = await target.pay(...params);
        }
        console.log("tx", tx);
        const receipt = await tx.wait(1);
        this.addHash(tx, this.totalPrice);
        console.log("receipt", receipt);
        this.showOrder = false;
        await this.$alert("Purchased successfully");
        this.$router.replace("/resource");
      } catch (error) {
        console.log("pay submit error");
        this.onErr(error);
      }
      this.paying = false;
    },
  },
};
</script>