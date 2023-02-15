<template>
  <div @click="$emit('click')">
    <v-avatar v-if="imgSrc" color="primary" :size="size" style="display: block">
      <img :src="imgSrc"
    /></v-avatar>
    <e-avatar v-else :address="uid" :diameter="size"></e-avatar>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    hash: String,
    uid: String,
    size: {
      type: Number,
      default: 80,
    },
  },
  computed: {
    imgSrc() {
      if (this.src) return this.src;
      if (this.hash) return this.$authApi + "/media/" + this.hash;
      return null;
    },
  },
};
</script>