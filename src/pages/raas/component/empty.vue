<template>
  <div class="empty-box">
    <!-- <create-select /> -->
    <div v-if="!onChain" style="margin-bottom:300px;">
      <div class="pa-3 mt-5 ta-c">
        <img src="/img/svg/gateway/lock.svg" width="180" />
      </div>
      <div class="d-flex f-center">
        <div style="max-width: 550px">
          Activate your account to unlock the RaaS.
        </div>
      </div>
      <div
        class="ta-c mt-8"
        :class="{
          hidden:
            teamInfo.isMember && teamInfo.access?.indexOf('RESOURCE') == -1,
        }"
      >
        <v-btn color="primary" width="120" @click="handleUpgrad"
          >Activate</v-btn
        >
      </div>
    </div>
    <div v-else>
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
          class="primary--text"
          rel="noopener noreferrer"
          >What's RaaS?</a
        >
        )
      </div>
    </div>
  </div>
</template>

<script>
import createSelect from "./create-select.vue";
import { bus } from "@/utils/bus";
import { mapState, mapGetters } from "vuex";

export default {
  components: { createSelect },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["teamInfo"]),
    ...mapState({
      onChain: (s) => s.onChain,
    }),
  },
  methods: {
    handleUpgrad() {
      bus.$emit("showDialog");
    },
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
