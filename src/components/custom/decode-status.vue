<template>
  <div class="al-c">
    <div>
      <v-progress-circular
        v-if="status == 1"
        indeterminate
        color="purple"
        size="18"
        width="2"
      ></v-progress-circular>
      <template v-else>
        <v-icon size="18" color="#00BD9A" v-if="status == 2"
          >mdi-check-circle-outline</v-icon
        >
        <v-icon size="18" color="#FF5656" v-else
          >mdi-close-circle-outline</v-icon
        >
      </template>
    </div>
    <span class="fz-12 ml-2">{{ statusText[status] }}</span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      default: 1,
    },
    statusText: {
      type: Object,
      default: () => {
        return {
          1: "Decoding...",
          2: "Successfully",
          3: "Failure",
        };
      },
    },
  },
  computed: {
    // statusText() {
    //   if (this.status == 1) {
    //     return "Decoding...";
    //   } else if (this.status == 2) {
    //     return "Successfully";
    //   } else {
    //     return "Failure";
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>