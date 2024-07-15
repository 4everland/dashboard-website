<template>
  <div class="booster-pagination">
    <v-pagination
      :value="value"
      @input="(e) => $emit('input', e)"
      v-bind="$attrs"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
  },
};
</script>

<style lang="scss" scoped>
.booster-pagination {
  :deep .v-pagination__item {
    background: transparent;
    color: #6172f3;
    border: 1px solid #6172f3;
    border-radius: 0;
    font-weight: bold;
  }

  :deep .v-pagination__navigation {
    background: transparent;
    border: 1px solid #6172f3;
    border-radius: 0;
    font-weight: bold;
    > i {
      color: #6172f3;
    }
  }

  :deep .v-pagination__item--active {
    background: #6172f3 !important;
    color: #fff;
    border: none;
  }
}
</style>
