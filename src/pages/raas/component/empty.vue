<template>
  <div class="empty-box">
    <!-- <create-select /> -->
    <div>
      <div>Create</div>
    </div>
    <div class="empty-tips mt-6">
      You haven't created a Rollup yet. (What's Raas?)
    </div>
  </div>
</template>

<script>
import createSelect from "./create-select.vue";
export default {
  components: { createSelect },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.empty-box {
  text-align: center;
  .empty-tips {
    color: #735ea1;
    font-family: "SF Pro Text";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
</style>
