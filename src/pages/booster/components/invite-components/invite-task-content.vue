<template>
  <div class="d-flex flex-column" style="padding-right: 16px">
    <div class="d-flex align-center justify-space-between">
      <div class="tab" :class="{ trigger: curIdx == 0 }" @click="curIdx = 0">
        Invite Detail
      </div>
      <div class="tab" :class="{ trigger: curIdx == 1 }" @click="curIdx = 1">
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
  padding: 12px 0;
  background: #131428;
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  background: url("/img/booster/invite/tab-bg.svg") no-repeat;
  background-size: 100%;
  cursor: pointer;
}

.tab.trigger {
  background: url("/img/booster/invite/tab-bg-active.svg") no-repeat;
  background-size: 100%;
}
</style>
