<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div
        class="easter-egg-overlay d-flex flex-column align-center justify-center"
      >
        <img
          class="close-btn"
          @click="$store.commit('SET_EASTER_EGG_DIALOG', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />

        <div
          class="py-2 d-flex flex-column align-center justify-center"
          style="width: 100%; gap: 8px"
        >
          <img src="/img/booster/easter-egg.png" width="94" alt="" />
          <div class="easter-egg-title">Mystery Code Surprise</div>
          <div class="easter-egg-desc">
            Enter your code to access exclusive rewards.
          </div>
          <div class="easter-egg-input mt-2">
            <input type="text" v-model="code" placeholder="Enter the code" />
          </div>
          <v-btn
            class="start-boost-btn mt-4"
            height="40"
            :disabled="!code"
            :loading="loading"
            @click="handleConfrim"
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
            @click="$store.commit('SET_EASTER_EGG_DIALOG', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />
          <img
            src="/img/booster/easter-egg.png"
            width="84"
            alt=""
            class="easter-egg-icon"
          />
          <div class="easter-egg-title">Mystery Code Surprise</div>
          <div class="easter-egg-desc">
            Enter your code to access exclusive rewards.
          </div>
          <div class="easter-egg-input">
            <input type="text" v-model="code" placeholder="Enter the code" />
          </div>
          <div class="mt-2">
            <v-btn
              class="start-boost-btn"
              height="40"
              :disabled="!code"
              :loading="loading"
              @click="handleConfrim"
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
import { onEasterEgg } from "@/api/booster";
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

  methods: {
    async handleConfrim() {
      try {
        this.loading = true;
        const { code, message } = await onEasterEgg(this.code);
        console.log(data);
        if (code == 200) {
          this.$store.dispatch("getBoosterUserInfo");
          this.$toast(message, "success");
        } else {
          this.$toast(message, "error");
        }
        this.$emit("input", false);
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
.easter-egg-overlay {
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
  background: url("/img/booster/svg/easter-egg-overlay-bg.svg") no-repeat;
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
}
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
.easter-egg-icon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -50px;
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
  color: #fff !important;
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
