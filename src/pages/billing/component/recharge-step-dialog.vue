<template>
  <v-dialog v-model="showDialog" persistent max-width="500">
    <div class="pa-6">
      <h3 class="fz-16 mb-0">Depositing LAND</h3>
      <v-stepper v-model="step" vertical :elevation="0">
        <v-stepper-step :complete="step > 1" step="1">
          <h3 class="fz-16">Approve</h3>
        </v-stepper-step>
        <v-stepper-content step="1">
          <div class="fz-12 act-tip">
            Please sign the authorization for the maximum expenditure amount in
            your wallet.
          </div>
          <!-- <div class="act-btn" @click="handleApprove">Approve</div> -->

          <v-btn
            color="primary"
            class="act-btn"
            @click="handleApprove"
            :loading="approving"
          >
            Approve</v-btn
          >
        </v-stepper-content>
        <v-stepper-step :complete="step > 2" step="2">
          <h3 class="fz-16">Payment</h3>
        </v-stepper-step>
        <v-stepper-content step="2">
          <div class="fz-12 act-tip">
            Please sign again to complete payment for your purchase.
          </div>
          <v-btn
            color="primary"
            class="act-btn"
            @click="handleConfirm"
            :loading="depositing"
          >
            Confirm</v-btn
          >
        </v-stepper-content>
        <v-stepper-step :complete="step > 3" step="3">
          <h3 class="fz-16">Wait for the LAND to be credited.</h3>
        </v-stepper-step>
      </v-stepper>
      <div class="tips my-6 fz-12 pa-2" v-if="step > 3">
        A transaction has been generated, please check
        <span
          style="text-decoration: underline"
          class="cursor-p"
          @click="$router.push('/billing/records?tab=Purchase History')"
          >here</span
        >
        to review.
      </div>

      <div class="tips my-6 fz-12 pa-2" v-else>
        Please do not leave the current page before completing the frst two
        steps, as it may result in a failed purchase.
      </div>

      <div
        class="al-c"
        style="justify-content: end"
        @click="
          () => {
            step > 3 ? handleDone() : handleClose();
          }
        "
      >
        <div class="close-btn cursor-p">{{ step > 3 ? "Done" : "Cancel" }}</div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1,
    },
    approving: {
      type: Boolean,
      default: false,
    },
    depositing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    handleApprove() {
      this.$emit("handleApprove");
    },
    handleConfirm() {
      this.$emit("handleConfirm");
    },
    handleClose() {
      this.showDialog = false;
      this.$emit("handleClose");
    },
    handleDone() {
      this.handleClose();
      this.$router.push("/billing");
    },
  },
};
</script>

<style>
.v-stepper__step__step {
  font-weight: bold !important;
}
</style>
<style lang="scss" scoped>
// .v-stepper__step {
//   align-items: flex-start;
// }

.act-btn {
  display: inline-block;
  padding: 8px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  background: #775da6;
  color: #fff;
  cursor: pointer;
}
.act-tip {
  color: #94a3b8;
}
:deep .v-stepper__content {
  padding-top: 10px !important;
}
.v-stepper {
  padding-bottom: 0 !important;
}
.tips {
  color: #735ea1;
  border-radius: 4px;
  background: #f3e8ff;
}
.close-btn {
  color: #fff;
  text-align: center;
  font-family: SF Pro Text;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px; /* 137.5% */
  padding: 8px 40px;
  border-radius: 4px;
  background: #775da6;
}
</style>
