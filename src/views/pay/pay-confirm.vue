<template>
  <div
    class="mt-2 pos-s btm-0 pa-3 bdrs-6 shadow-2"
    style="background: #fff5eb"
  >
    <div class="al-c">
      <div>
        <div>
          <span class="fz-14 gray-6 label">{{ label }}:</span>
          <slot></slot>
          <b class="red-1 fz-25 ml-3">{{ price }}</b>
          <span class="gray-6 ml-2 fz-15">USDC</span>
        </div>
        <slot name="detail"></slot>
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
</style>
