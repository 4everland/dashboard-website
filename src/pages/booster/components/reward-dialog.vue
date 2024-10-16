<template>
  <v-dialog
    max-width="375"
    persistent
    content-class="reward-dialog"
    v-model="value"
    overlay-opacity="0.5"
    overlay-color="#000"
  >
    <div class="reward-content text-center">
      <img src="/img/booster/reward/reward-header.png" width="239" alt="" />
      <img src="/img/booster/reward/lightning.png" width="200" alt="" />
      <div class="reward-desc fz-14">
        {{ reward }}
      </div>
      <slot></slot>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    reward: {
      type: String,
      default: "Boost Rate +20 pts/h",
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .reward-dialog {
  // background: transparent !important;
  // box-shadow: none !important;

  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}

.reward-content {
  width: 375px;
  height: 375px;
  background: url("/img/booster/reward/sunny.png") no-repeat;
  background-size: 100%;

  .reward-desc {
    display: inline-flex;
    padding: 8px 32px;
    color: #fff;
    align-items: center;
    gap: 4px;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      rgba(3, 156, 255, 0) 0%,
      #039cff 36.5%,
      #039cff 67.5%,
      rgba(3, 156, 255, 0) 100%
    );
  }
}
</style>
