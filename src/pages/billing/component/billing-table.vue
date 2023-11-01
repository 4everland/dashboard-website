<template>
  <v-simple-table class="monthly-billing-table" v-bind="$attrs">
    <slot></slot>
  </v-simple-table>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.monthly-billing-table {
  :deep table {
    border-spacing: 0 16px !important;
  }

  :deep th {
    border: none !important;
    font-size: 14px !important;
  }
  :deep tr:hover {
    background: #f3e8ff !important;
  }

  :deep td {
    padding: 16px !important;
    border-top: 1px solid #cbd5e1 !important;
    border-bottom: 1px solid #cbd5e1 !important;
    margin: 10px 0 !important;
  }

  :deep tr td:first-child {
    border-left: 1px solid #cbd5e1 !important;
    border-right: none !important;
    border-radius: 8px 0 0 8px;
  }
  :deep tr td:last-child {
    border-right: 1px solid #cbd5e1 !important;
    border-left: none !important;
    border-radius: 0 8px 8px 0;
  }
}
</style>
