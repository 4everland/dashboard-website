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
    background: transparent !important;
    color: #fff !important;
    font-weight: bold;
    box-shadow: none !important;
  }

  :deep .v-pagination__navigation {
    background: transparent !important;
    font-weight: bold;
    box-shadow: none !important;
    > i {
      color: #fff;
    }
  }

  :deep .v-pagination__item--active {
    background: transparent !important;
    color: #6172f3 !important;
    border: 1px solid #6172f3 !important;
  }
}
</style>
