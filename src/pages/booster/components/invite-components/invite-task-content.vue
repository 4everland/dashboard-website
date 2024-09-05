<template>
  <div class="d-flex flex-column" style="padding-right: 16px">
    <div class="d-flex align-center justify-center">
      <div
        :class="{
          trigger: curIdx == 0,
          'mobile-tab': asMobile,
          tab: !asMobile,
        }"
        @click="curIdx = 0"
      >
        Invite Detail
      </div>
      <div
        :class="{
          trigger: curIdx == 1,
          'mobile-tab': asMobile,
          tab: !asMobile,
        }"
        @click="curIdx = 1"
      >
        Invite List
      </div>
    </div>
    <component :is="cpm" class="mt-4 flex-1"></component>
  </div>
</template>

<script>
import InviteDetail from "./invite-detail.vue";
import InviteList from "./invite-list.vue";
export default {
  data() {
    return {
      curIdx: 0,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    cpm() {
      if (this.curIdx == 1) {
        return InviteList;
      }
      return InviteDetail;
    },
  },
  components: {
    InviteDetail,
    InviteList,
  },
};
</script>

<style lang="scss" scoped>
.tab {
  width: 263px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  background: url("/img/booster/invite/tab-bg.svg") no-repeat;
  cursor: pointer;
}

.tab.trigger {
  background: url("/img/booster/invite/tab-bg-active.svg") no-repeat;
}

.mobile-tab {
  width: 172px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: url("/img/booster/invite/mobile-tab-bg.svg") no-repeat;
  cursor: pointer;
}
.mobile-tab.trigger {
  background: url("/img/booster/invite/mobile-tab-bg-active.svg") no-repeat;
}
</style>
