<template>
  <div
    class="d-flex fz-14"
    :class="{
      'al-c': center,
    }"
  >
    <slot name="pre"></slot>
    <label
      class="gray-6 shrink-0"
      :class="labelClass"
      :style="{
        'min-width': minWidth,
        color: labelColor,
      }"
    >
      <span>{{ label }}</span>
      <slot name="sub"></slot>
    </label>
    <div class="ml-3 flex-1" :class="valueClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    labelClass: null,
    valueClass: null,
    center: Boolean,
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