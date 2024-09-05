<template>
  <div>
    <div class="point-desc d-flex align-center">
      <img :src="icon" width="24" alt="" />
      <span class="ml-1 fz-14">+{{ rewardValue }}</span>
    </div>
    <div class="d-flex align-center justify-center text-center mt-1">
      <img width="16" src="/img/booster/svg/invite-user.svg" alt="" />
      <span class="fz-12">{{ inviteCount }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: "UNDO",
    },
    pointType: {
      type: String,
      default: "point",
    },
    rewardValue: {
      type: String,
      default: "+ 500",
    },
    inviteCount: {
      type: String,
      default: "1",
    },
  },
  computed: {
    icon() {
      if (this.pointType == "point") {
        return "/img/booster/4ever-point-icon.png";
      }
      return "/img/booster/4ever-point-icon.png";
    },
  },
};
</script>

<style lang="scss" scoped>
.point-desc {
  padding: 2px 4px;
  border-radius: 100px;
  background: linear-gradient(101deg, #2d31a6 10.8%, #6172f3 90.48%);
}
</style>
