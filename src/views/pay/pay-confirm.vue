<template>
  <div class="mt-2 pos-s btm-0 bdrs-6">
    <div class="pa-3 shadow-2" style="background: #fff5eb">
      <slot name="evepay"></slot>
      <div class="al-c">
        <div class="amount-content">
          <div class="detail">
            <slot name="detail"></slot>
          </div>
          <div class="al-c amount">
            <span class="fz-14 gray-6 label">{{ label }}:</span>
            <slot></slot>
            <span class="fz-25 ml-3">{{ price }}</span>
            <span class="gray-6 ml-2 fz-15">{{ symbol }}</span>
          </div>
        </div>
        <v-btn
          color="error"
          depressed
          class="ml-auto"
          :to="to"
          :loading="loading"
          @click="$emit('submit')"
          >{{ text }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    price: null,
    label: {
      type: String,
      default: "Amount",
    },
    text: {
      type: String,
      default: "Confirm",
    },
    symbol: {
      type: String,
      default: "USDC",
    },
    to: String,
    loading: Boolean,
  },
};
</script>
<style lang="scss" scoped>
.label {
  display: inline-block;
  min-width: 130px;
  text-align: right;
}
.amount-content {
  display: flex;
  flex-direction: column-reverse;
}
.amount {
  color: #000;
}
.detail:empty + .amount {
  color: #ff6960 !important;
}
</style>
