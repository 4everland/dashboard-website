<template>
  <div>
    <div
      class="point-desc d-flex align-center justify-center"
      :class="{
        ton: pointType !== 'point',
        done: status == 'DONE',
        'can-claim': status == 'CLAIM',
      }"
    >
      <img :src="icon" width="24" alt="" />
      <span class="fz-12">+{{ rewardValue }}</span>
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
      if (this.status == "DONE") {
        return "/img/booster/invite/check.svg";
      }
      if (this.pointType == "point") {
        return "/img/booster/4ever-point-icon.png";
      }
      return "/img/booster/ton-invite-icon.png";
    },
  },
};
</script>

<style lang="scss" scoped>
.point-desc {
  width: 80px;
  border-radius: 100px;
  background: linear-gradient(101deg, #2d31a6 10.8%, #6172f3 90.48%);
}

.point-desc.ton {
  background: #0098ea;
}
.point-desc.done {
  background: linear-gradient(0deg, #1f235b 0%, #1f235b 100%), #000 !important;
}
.point-desc.can-claim {
  box-shadow: 0px 0px 8px 0px #6172f3;
}
</style>
