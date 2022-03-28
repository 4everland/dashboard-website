<style lang="scss">
.small {
  .v-label {
    font-size: 14px;
    color: #999;
  }
}
</style>

<template>
  <div class="mt-5">
    <v-checkbox
      v-model="val"
      dense
      label="Don't show again"
      class="small"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    form: Object,
  },
  data() {
    return {
      val: this.form ? this.form.noShow : false,
    };
  },
  watch: {
    val() {
      this.$emit("input", {
        noShow: this.val,
      });
    },
  },
};
</script>