<template>
  <div class="d-flex fz-14">
    <label
      class="gray shrink-0"
      :style="{
        'min-width': minWidth,
        color: labelColor,
      }"
      >{{ label }}</label
    >
    <div class="ml-3">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    minWidth: {
      type: String,
      default: "100px",
    },
    labelColor: {
      type: String,
    },
  },
};
</script>