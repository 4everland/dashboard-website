<template>
  <div>
    <v-alert text type="error" dense>
      If you refresh or close the page when the folder is being deleted, the
      displayed number of deleted files may be inaccurate.
    </v-alert>
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