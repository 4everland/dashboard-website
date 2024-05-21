<template>
  <div class="empty-box">
    <!-- <create-select /> -->
    <div class="create-box" @click="toCreate">
      <v-img
        max-height="80"
        max-width="80"
        src="@/assets/imgs/raas/empty_create.png"
      ></v-img>
      <div>Create</div>
    </div>
    <div class="empty-tips mt-6">
      You haven't created a Rollup yet. (
      <a
        href="https://docs.4everland.org/raas-beta/whats-rollups"
        target="_blank"
        rel="noopener noreferrer"
        >What's RaaS?</a
      >
      )
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
  methods: {
    toCreate() {
      this.$emit("onCreate");
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-box {
  text-align: center;
  .create-box {
    width: 236px;
    height: 96px;
    display: flex;
    padding: 8px 40px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid rgba(115, 94, 161, 0.25);
    background: #fff;
    margin: 0 auto;
    cursor: pointer;
  }
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
