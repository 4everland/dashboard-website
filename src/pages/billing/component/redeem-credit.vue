<template>
  <div>
    <v-row>
      <v-col sm="8" cols="12" class="d-flex al-start">
        <div class="flex-1">
          <input
            class="post-input d-b py-3"
            type="text"
            v-model="voucherCode"
            dense
            :disabled="AmountofDeduction > 0"
            placeholder="Enter the credit code"
          />
          <decode-status
            v-if="showDecode"
            :statusText="statusText"
            :status="validStatus"
            class="mt-3"
          />
        </div>
        <div
          class="search-btn fw-b ml-2 cursor-p"
          @click="AmountofDeduction ? handleCancelVoucher() : handleCommit()"
        >
          {{ AmountofDeduction ? "Cancel" : "Confrim" }}
        </div>
      </v-col>
    </v-row>

    <div class="al-c flex-wrap">
      <div
        class="reward-voucher mr-6 mt-5"
        v-for="item in rewardVoucherList"
        :key="item.code"
      >
        <div class="left fz-12">
          You have an unclaimed
          <p class="my-0 fw-b">{{ item.remark }}</p>
          voucher.
        </div>
        <div class="right">
          <v-btn
            small
            color="primary"
            elevation="0"
            @click="handleClaimVoucher(item)"
            >Claim</v-btn
          >
        </div>
      </div>
    </div>
    <v-dialog
      v-model="showPop"
      max-width="550"
      v-if="rewardVoucherInfo"
      persistent
    >
      <div class="pa-6">
        <h3>{{ rewardVoucherInfo.remark }}</h3>
        <div class="pa-4">
          Please save your voucher information carefully, as this message will
          not appear again after claimed.
        </div>
        <ul class="voucher-info fz-14 pl-0">
          <li>
            <div class="voucher-label gray">Voucher Type</div>
            <div>Gift Voucher</div>
          </li>
          <li>
            <div class="voucher-label gray">Expiry Date</div>
            <div>
              {{ new Date(rewardVoucherInfo.expiredAt).format("date") }}
            </div>
          </li>
          <li>
            <div class="voucher-label gray">Voucher Amount</div>
            <div>{{ rewardVoucherInfo.amount }} USDC</div>
          </li>
          <li>
            <div class="voucher-label gray">Voucher Code</div>
            <div>{{ rewardVoucherInfo.code }}</div>
          </li>
        </ul>
        <div class="al-c justify-center mt-8">
          <v-btn class="mx-auto" @click="showPop = false">Cancel</v-btn>
          <v-btn color="primary" class="mx-auto" @click="handleCopy"
            >Copy and claim</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDecode: false,
      voucherCode: "",
      rewardVoucherList: [],
      AmountofDeduction: 0,
      disabled: false,
      statusText: {
        1: "Checking availability...",
        2: "Available!",
        3: "Unavailable！",
      },
      validStatus: 1,
      rewardVoucherInfo: null,
      showPop: false,
    };
  },
  methods: {
    async handleClaimVoucher(item) {
      this.rewardVoucherInfo = item;
      this.showPop = true;
    },
    handleCancelVoucher() {
      this.showDecode = false;
      this.validStatus = 1;
      this.voucherCode = "";
      this.AmountofDeduction = 0;
      this.resourceResource = null;
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
  },
};
</script>

<style lang="scss" scoped>
.post-input {
  width: 100%;
  text-indent: 20px;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}

.search-btn {
  border-radius: 4px;
  color: #735ea1;
  padding: 10px 28px;
  border: 1.5px solid #735ea1;
}
</style>
