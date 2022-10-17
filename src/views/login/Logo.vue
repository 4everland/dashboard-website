<template>
  <v-img :src="require('@/assets/logo.svg')" contain width="210" height="50" />
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 210,
    },
    height: {
      type: Number,
      default: 50,
    },
  },
};
</script>
