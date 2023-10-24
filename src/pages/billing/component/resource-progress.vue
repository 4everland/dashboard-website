<template>
  <div>
    <h3>{{ title }}</h3>

    <div class="ta-r mb-3 fz-14">Residue: {{ residueResource }}</div>
    <v-progress-linear
      :value="progressValue"
      :color="progressColor"
      height="25"
      style="border-radius: 8px"
    >
      <span class="fz-12 fw-b"> {{ usedResource }} / {{ totalResource }} </span>
    </v-progress-linear>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    usedResource: {
      type: Number,
      required: true,
    },
    totalResource: {
      type: Number,
      required: true,
    },
    progressColor: {
      type: String,
      default: () => {
        return "#ccc";
      },
    },
  },
  computed: {
    progressValue() {
      return (this.usedResource / this.totalResource).toFixed(2) * 100;
    },
    residueResource() {
      return this.totalResource - this.usedResource;
    },
  },
};
</script>

<style lang="scss" scoped>
// .v-progress-linear {
//   border-radius: 20px;
// }
</style>
