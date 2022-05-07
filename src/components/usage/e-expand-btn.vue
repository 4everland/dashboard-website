<style lang="scss">
.e-expand-btn {
  &.open {
    .v-btn {
      border-bottom-color: #fff;
      z-index: 10;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    .v-icon {
      transform: rotate(180deg);
    }
  }
  .con {
    top: -1px;
    border: 1px solid #7e8ea8;
  }
}
</style>

<template>
  <div
    class="e-expand-btn"
    :class="{
      open: show,
    }"
  >
    <v-btn color="#7E8EA8" outlined small @click="show = !show">
      <span>Change</span>
      <v-icon>mdi-menu-down</v-icon>
    </v-btn>
    <div class="pa-5 pos-r con" :class="show ? 'd-b' : 'd-n'">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
};
</script>