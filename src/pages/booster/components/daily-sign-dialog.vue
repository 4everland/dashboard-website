<template>
  <v-dialog
    max-width="400"
    persistent
    content-class="daily-boost-dialog"
    v-model="value"
  >
    <div class="daily-boost">
      <div class="daily-boost-title">Daily Boost</div>
      <div class="sign-content">
        <div class="sign-item pa-1" v-for="it in 7" :key="it"></div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      list: [],
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .daily-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}

.daily-boost {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  background: url("/img/booster/daily-boost/bg.png") no-repeat;
  background-size: 100%;

  .daily-boost-title {
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 245px;
    position: absolute;
    color: #fff;
    text-shadow: 0px 0px 8px #6172f3;
    font-family: Inter;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; /* 116.667% */
    text-transform: capitalize;
    border-radius: 4px 4px 32px 32px;
    background: linear-gradient(
        99deg,
        rgba(211, 212, 213, 0.15) 12.86%,
        rgba(139, 145, 147, 0.15) 15.34%,
        rgba(87, 95, 99, 0.15) 17.82%,
        rgba(55, 65, 69, 0.15) 18.64%,
        rgba(43, 54, 58, 0.15) 19.47%,
        rgba(52, 62, 66, 0.15) 22.77%,
        rgba(77, 85, 89, 0.15) 26.9%,
        rgba(117, 123, 126, 0.15) 32.68%,
        rgba(173, 176, 177, 0.15) 38.46%,
        rgba(205, 205, 206, 0.15) 41.76%,
        rgba(198, 199, 200, 0.15) 43.41%,
        rgba(180, 182, 184, 0.15) 45.06%,
        rgba(151, 156, 158, 0.15) 46.71%,
        rgba(111, 118, 122, 0.15) 49.19%,
        rgba(72, 83, 87, 0.15) 50.84%,
        rgba(76, 86, 90, 0.15) 52.49%,
        rgba(89, 98, 102, 0.15) 54.97%,
        rgba(112, 117, 120, 0.15) 57.45%,
        rgba(143, 144, 146, 0.15) 59.1%,
        rgba(152, 152, 154, 0.15) 59.92%,
        rgba(165, 165, 166, 0.15) 63.23%,
        rgba(199, 199, 200, 0.15) 70.66%,
        rgba(255, 255, 255, 0.15) 78.91%,
        rgba(209, 209, 210, 0.15) 81.39%,
        rgba(79, 79, 83, 0.15) 87.17%,
        rgba(27, 27, 32, 0.15) 90.47%,
        rgba(49, 49, 54, 0.15) 91.3%,
        rgba(77, 77, 81, 0.15) 92.12%,
        rgba(116, 116, 118, 0.15) 92.95%,
        rgba(165, 165, 167, 0.15) 94.6%,
        rgba(233, 233, 233, 0.15) 95.43%
      ),
      linear-gradient(0deg, #6172f3 0%, #6172f3 100%), #e8e8e8;
    background-blend-mode: hard-light, normal, normal;
  }

  .sign-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 16px;
    background: #121536;

    .sign-item {
      border-radius: 12px;
      background: rgba(45, 50, 130, 0.5);
      box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.15) inset;
    }
  }
}
</style>
