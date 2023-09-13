<template>
  <div class="mt-6">
    <div class="fz-13">Type</div>
    <div class="hide-msg mt-3">
      <v-btn-toggle v-model="isAr" borderless active-class="toggle-btn">
        <v-btn :value="false" width="100">
          <span :class="{ 'fw-b': !isAr }">IPFS</span>
        </v-btn>

        <v-btn :value="true" width="100">
          <span :class="{ 'fw-b': isAr }">Arweave</span>
        </v-btn>
      </v-btn-toggle>

      <div class="tip-wrap mt-5" v-show="isAr">
        Free for up to 150KB, apply for reduction over 150KB.
        <a href="https://unleashar.4everland.org/" target="__blank">
          Learn more</a
        >.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: Object,
  },
  data() {
    return {
      isAr: false,
    };
  },
  watch: {
    isAr() {
      this.$emit("input", {
        isAr: this.isAr,
      });
    },
  },
};
</script>

<style lang="scss">
.toggle-btn {
  background: #775da6 !important;
  color: #fff !important;
}
</style>
