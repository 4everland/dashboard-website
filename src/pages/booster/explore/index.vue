<template>
  <div class="booster-overview">
    <div style="position: relative">
      <img
        :src="asMobile ? '/img/booster/mobile-bg.png' : '/img/booster/bg.png'"
        style="width: 100%; display: block"
        alt=""
      />

      <div class="point-square">
        <div style="position: relative">
          <div style="width: 10px; height: 10px"></div>
        </div>
        <div class="top-card">
          <span class="points fz-14"> 31/10000 </span>
          <img src="/img/booster/3d-square.png" width="120" alt="" />
        </div>
      </div>
    </div>

    <v-dialog
      v-model="showExploring"
      max-width="240"
      persistent
      content-class="exploring-dialog"
    >
      <div
        class="exploring-dialog-content d-flex flex-column align-center justify-center"
      >
        <dotlottie-player
          src="https://lottie.host/0fcf9393-b0fc-4f31-9d06-fa0896d3bdc6/dkjFgkEUlS.json"
          background="transparent"
          speed="1"
          style="width: 188px; height: 166px"
          loop
          autoplay
        ></dotlottie-player>
        <div class="pb-4">Exploring...</div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showExploring: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .point-square {
    left: 48% !important;
    top: 39% !important;
  }
}
.booster-overview {
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;

  .point-square {
    position: absolute;
    left: 49%;
    top: 31%;
    .top-card {
      position: absolute;
      bottom: 22%;
      left: -449%;
      .points {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
        text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.5);
      }
    }
  }
}
::v-deep .exploring-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  // backdrop-filter: blur(6.5px) !important;
}
.exploring-dialog-content {
  color: #fff;
  border-radius: 24px;
  background: rgba(35, 36, 42, 0.9);
  backdrop-filter: blur(8.649999618530273px);
}
</style>
