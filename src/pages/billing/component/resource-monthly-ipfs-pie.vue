<template>
  <div class="al-c h-flex space-center mt-6">
    <h3>{{ name }}</h3>
    <pie :id="name" :data="formatData"></pie>
  </div>
</template>

<script>
import pie from "./pie.vue";
export default {
  components: {
    pie,
  },
  props: {
    name: {
      type: String,
      default: "IPFS",
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    formatData() {
      const arr = [];
      for (const key in this.data) {
        arr.push({ name: key, value: Number(this.data[key]) });
      }
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped></style>
