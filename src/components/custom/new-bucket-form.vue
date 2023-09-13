<template>
  <div class="mt-6">
    <div class="d-flex al-c hide-msg">
      <v-select
        v-model="isAr"
        dense
        :items="items"
        label="Type"
        class="fz-14"
      ></v-select>
    </div>
    <div class="tip-wrap mt-5" v-show="isAr">
      Free for up to 150KB, apply for reduction over 150KB.
      <a href="https://unleashar.4everland.org/" target="__blank"> Learn more</a
      >.
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
      items: [
        {
          text: "IPFS",
          value: false,
        },
        {
          text: "AR",
          value: true,
        },
      ],
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
