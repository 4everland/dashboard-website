<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="buy-card d-flex flex-column align-center justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />

        <div class="py-2" style="width: 100%">
          <div class="easter-egg-title">EasterEgg</div>
          <div class="invite-content mt-2" style="width: 50%">
            <input
              class="invite-input"
              type="text"
              v-model="code"
              placeholder="Enter the code"
            />
          </div>
          <v-btn
            class="start-boost-btn"
            height="40"
            :disabled="!code"
            :loading="loading"
          >
            Confirm
          </v-btn>
        </div>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="592px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none"
    >
      <div class="booster-module-dialog">
        <div
          class="easter-egg-dialog d-flex flex-column align-center justify-center"
        >
          <img
            class="close-btn"
            @click="$emit('input', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />
          <div class="easter-egg-title">Debug Node</div>
          <div class="easter-egg-desc">23232323</div>
          <div class="easter-egg-input">
            <input type="text" v-model="code" />
          </div>
          <div class="mt-4">
            <v-btn
              class="start-boost-btn"
              height="40"
              :disabled="!code"
              :loading="loading"
            >
              Confirm
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      code: "",
      loading: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
}
.buy-card {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 273px;
  background: url("/img/booster/svg/buy-card-bg.svg") no-repeat;
  background-size: contain;
  background-position: center;
}

.easter-egg-dialog {
  height: 100%;
  color: #fff;
  gap: 8px;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  .easter-egg-title {
    font-size: 24px;
    font-weight: 600;
    text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.25);
  }
  .easter-egg-input {
    background: url("/img/booster/svg/fringe-bg.svg");
    width: 100%;
    padding: 8px 24px;
    text-align: center;

    input {
      width: 300px;
      padding: 8px 0px;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      border: 1px solid #0fe1f8;
      background: rgba(49, 49, 49, 0.9);
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
    }
  }
}

.invite-content {
  padding: 8px;
  border-radius: 4px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(49, 49, 49, 0.9);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
  .invite-input {
    width: 100%;
    color: #fff;
  }
}
.start-boost-btn {
  padding: 16px 24px;
  border-radius: 4px;
  color: #fff !important;
  text-shadow: 0px 0px 8px #6172f3;
  border: 1px solid #0e6cc6;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
  box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
    0px 4px 8px 0px rgba(0, 133, 195, 0.25);
}
.start-boost-btn.v-btn--disabled {
  color: #fff;
  opacity: 0.5;
  border: 1px solid rgba(217, 217, 217, 0.25);
  background: linear-gradient(0deg, #00070c 0%, #00070c 100%);
  box-shadow: none;
}
// .easter-egg-title {
//   padding: 8px;
//   font-size: 20px;
//   text-shadow: 0px 0px 8px #6172f3;
//   text-align: center;
//   background: rgba(0, 129, 248, 0.1);
// }
</style>
