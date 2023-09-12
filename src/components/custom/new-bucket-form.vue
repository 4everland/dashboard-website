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
