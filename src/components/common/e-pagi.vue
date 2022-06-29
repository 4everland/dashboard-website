<template>
  <div v-show="pageLen > 1">
    <v-pagination
      v-model="page"
      :length="pageLen"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      :total-visible="visible"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: Number,
    limit: Number,
    value: Number,
    length: Number,
    visible: {
      type: Number,
      default: 7,
    },
  },
  data() {
    return {
      page: this.value,
    };
  },
  computed: {
    pageLen() {
      if (this.length) return this.length;
      return Math.max(1, Math.ceil(this.total / this.limit));
    },
  },
  watch: {
    value(val) {
      this.page = val;
    },
    page(val) {
      this.$emit("input", val);
    },
  },
};
</script>