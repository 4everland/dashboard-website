<template>
  <div class="statistics-container">
    <div class="tips">
      If you refresh or close the page when the folder is being deleted, the
      displayed number of deleted files may be inaccurate.
    </div>
    <div class="buckets-charts-container"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.statistics-container {
  .tips {
    padding: 10px 0;
    font-size: 14px;
    color: #ff6960;
    line-height: 20px;
    background: #fff2f2;
    border-radius: 6px;
  }
}
</style>