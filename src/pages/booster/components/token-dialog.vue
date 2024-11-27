<template>
  <div>
    <div class="trigger-icon token-dialog-icon" @click="showTokenDialog = true">
      <img src="/img/booster/4ever-token-icon.gif" width="48" alt="" />
      <div class="trigger-text fz-12 fw-b text-center">$4EVER</div>
    </div>
    <v-dialog
      persistent
      v-model="showTokenDialog"
      content-class="token-dialog"
      width="327"
      overlay-opacity="0.5"
    >
      <div class="token-dialog-content px-4 py-9">
        <img
          class="pos-a"
          style="top: -20%; right: -20%"
          src="/img/booster/4ever-token-coin.png"
          width="250"
          alt=""
        />
        <div class="token-title">$4EVER token</div>
        <ul>
          <li>
            Over 3 years development, 2 round of financing, $4EVER is coming.
          </li>
          <li>Grab $4EVER points and harvest $4EVER token.</li>
          <li>Stay tuned, won't be long.</li>
        </ul>

        <div class="partner-container pos-r">
          <img src="/img/booster/svg/token-banner.svg" width="100%" alt="" />

          <div class="pos-a fw-b" style="width: 100%; left: 19px; top: 5px">
            ⭐ Partner
          </div>
          <div class="pos-a" style="width: 100%; left: 0; top: 32px">
            <v-carousel
              :show-arrows="false"
              height="auto"
              vertical
              interval="5000"
              cycle
              hide-delimiters
            >
              <v-carousel-item
                v-for="(item, i) in items"
                :key="i"
                :src="item.src"
              ></v-carousel-item>
            </v-carousel>
          </div>
        </div>

        <div class="progress-container mt-2 mb-6 fz-14 fw-b">
          <div class="d-flex align-center justify-space-between">
            <div>🔥 TGE</div>
            <div class="comming-soon">Coming Soon</div>
          </div>

          <div class="progress-content mt-8">
            <div class="progress">
              <img
                style="border-radius: 12px"
                class="d-b"
                width="100%"
                src="/img/booster/4ever-token-progress-mask.png"
                height="12"
                alt=""
              />
              <div class="zebra-stripe-content"></div>

              <img
                class="hot-icon"
                src="/img/booster/progress-hot.png"
                height="26"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="boost-btn" @click="handleClick">
          <img src="/img/booster/svg/lightning.svg" width="20" alt="" />
          <span>Boost your earn</span>
        </div>
      </div>

      <img
        class="close-btn"
        @click="showTokenDialog = false"
        src="/img/booster/svg/close.svg"
        alt=""
      />
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTokenDialog: false,
      items: [
        {
          src: "/img/booster/banner-1.png",
        },
        {
          src: "/img/booster/banner-2.png",
        },
        {
          src: "/img/booster/banner-3.png",
        },
        {
          src: "/img/booster/banner-4.png",
        },
      ],
    };
  },
  methods: {
    handleClick() {
      this.showTokenDialog = false;
      this.$store.dispatch("TaskDrawerState", { state: true });
    },
  },
};
</script>

<style>
.v-dialog__content--active:has(> .token-dialog) {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
}
.token-dialog {
  background: transparent !important;
  overflow: initial;
}
.partner-banner-item > .v-carousel__item {
  height: initial !important;
}
</style>
<style lang="scss" scoped>
.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 18px !important;
  cursor: pointer;
}
.trigger-icon {
  position: relative;
  cursor: pointer;
  .trigger-text {
    position: absolute;
    left: 0;
    bottom: 15%;
    width: 52px;
    height: 20px;
    line-height: 20px;
    background: url("/img/booster/svg/4ever-token-text-bg.svg");
    backdrop-filter: blur(2px);
  }
}
.token-dialog-content {
  position: relative;
  color: #fff;
  border-radius: 16px;
  border: 1px solid #1aa6ff;
  background: linear-gradient(
      180deg,
      rgba(17, 2, 252, 0.15) 28.41%,
      rgba(15, 225, 248, 0) 100%
    ),
    linear-gradient(180deg, #000a10 8.53%, #003e70 99.59%), rgba(5, 5, 5, 0.8);

  .token-title {
    margin-bottom: 32px;
    font-style: italic;
    font-size: 24px;
    font-weight: 700;
  }

  ul {
    padding-left: 16px;
  }
  ul,
  li {
    font-size: 12px;
    list-style: disc;
    color: #0fe1f8;
    font-weight: 500;
  }
  .partner-container {
    position: relative;
    margin-top: 13px;
    width: 100%;
  }

  .comming-soon {
    display: inline-flex;
    padding: 2px 4px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
    background: linear-gradient(100deg, #dc33d6 0%, #ff3821 100%);
  }
  .progress-content {
    position: relative;
    height: 20px;
    border-radius: 12px;
    border: 4px solid #041f44;
    background: #17191d;
    .progress {
      position: absolute;
      width: 97%;

      .zebra-stripe-content {
        left: 0;
        top: 0;
        width: 100%;
        height: 12px;
        border-radius: 12px;
        position: absolute;
        background-image: url("/img/booster/zebra-stripe.png");
        background-repeat: repeat;
        animation: run 6s infinite linear;
      }

      .hot-icon {
        position: absolute;
        right: -1%;
        top: -87%;
      }
    }
  }

  .boost-btn {
    display: flex;
    padding: 12px 24px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-weight: bold;
    border-radius: 16px;
    background: linear-gradient(100deg, #dc33d6 0%, #ff3821 100%),
      linear-gradient(129deg, #0fe1f8 2.4%, #1102fc 69.3%),
      linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    cursor: pointer;
  }
  @keyframes run {
    from {
      background-position-x: -100px;
    }

    to {
      /*left:500px;*/
    }
  }
}
</style>
