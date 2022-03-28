<template>
  <div class="mt-6">
    <div class="d-flex al-c hide-msg">
      <p class="black-6 fz-14 mr-auto">Arweave</p>
      <v-switch v-model="isAr"></v-switch>
    </div>
    <div class="tip-wrap mt-5" v-show="isAr">
      The start Arweave storage space is 100MB, and files stored on Arweave
      network can't be deleted.
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
