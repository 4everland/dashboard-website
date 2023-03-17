<template>
  <div class="mt-6">
    <div class="d-flex al-c hide-msg">
      <p class="black-6 fz-14 mr-auto">Sync to AR</p>
      <v-switch v-model="isAr"></v-switch>
    </div>
    <div class="tip-wrap mt-5" v-show="isAr">
      All data on the Arweave network cannot be deleted, and there is 100MB of
      free AR storage.
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
