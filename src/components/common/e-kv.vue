<template>
  <div
    class="d-flex fz-14"
    :class="{
      'al-c': center,
    }"
  >
    <slot name="pre"></slot>
    <label
      class="gray shrink-0"
      :class="labelClass"
      :style="{
        'min-width': minWidth,
      }"
      >{{ label }}</label
    >
    <div class="ml-3 flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    labelClass: null,
    center: Boolean,
    minWidth: {
      type: String,
      default: "100px",
    },
  },
};
</script>