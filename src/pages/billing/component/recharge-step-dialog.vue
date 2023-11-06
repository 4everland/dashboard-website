<template>
  <v-dialog v-model="showDialog" persistent max-width="500">
    <div class="pa-6">
      <h3 class="fz-16 mb-0">Purchasing resources</h3>
      <v-stepper v-model="step" vertical :elevation="0">
        <v-stepper-step :complete="step > 1" step="1">
          <h3 class="fz-16">Approve</h3>
        </v-stepper-step>

        <v-stepper-content step="1">
          <div class="fz-12 act-tip">
            Please sign the authorization for the maximum expenditure amount in
            your wallet.
          </div>
          <div class="act-btn" @click="handleApprove">Approve</div>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">
          <h3 class="fz-16">Payment</h3>
        </v-stepper-step>

        <v-stepper-content step="2">
          <div class="fz-12 act-tip">
            Please sign again to complete payment for your purchase.
          </div>
          <div class="act-btn" @click="handleConfirm">Confirm</div>
        </v-stepper-content>

        <v-stepper-step :complete="step > 3" step="3">
          <h3 class="fz-16">Wait for the resources to be credited.</h3>
        </v-stepper-step>
      </v-stepper>

      <div class="tips my-6 fz-12 pa-2">
        Please do not leave the current page before completing the frst two
        steps, as it may result in a failed purchase.
      </div>
      <div class="ta-r cursor-p" @click="showDialog = false">Cancel</div>
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
  },
  data() {
    return {
      showDialog: false,
      e6: 1,
    };
  },
  computed: {},
  methods: {
    handleApprove() {
      this.$emit("handleApprove");
    },
    handleConfirm() {
      this.$emit("handleConfirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.v-stepper__step {
  align-items: flex-start;
}

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
</style>
