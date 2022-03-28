<template>
  <div class="d-flex al-c">
    <img :src="`img/icon/nav-${icon}.svg`" height="14" class="d-b mr-2" />
    <span><slot></slot></span>
    <span class="gray fz-14 ml-1">{{ unit }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "ic-list",
    },
    unit: String,
  },
};
</script>