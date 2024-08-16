<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="unlock d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />
        <div class="unlock-overlay">
          <div class="mobile-unlock-stage-title text-center">
            {{ stageTitle }}
          </div>
          <div class="unlock-stage-desc">
            <div class="text-center">Unlock with 1,000,000 LAND to enjoy:</div>
            <ul class="list">
              <li class="mt-2">Base Rate: +100 pts/h</li>
              <li class="mt-2">Capacity: +2,500</li>
            </ul>
          </div>

          <div
            class="d-flex align-center justify-center"
            style="gap: 16px; margin-top: 114px"
          >
            <v-btn
              class="cancel-btn"
              width="148px"
              height="50px"
              outlined
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              class="unlock-btn"
              width="148px"
              height="50px"
              outlined
              @click="handleUnlock"
              :loading="unlockLoading"
              >Unlock</v-btn
            >
          </div>
        </div>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="592px"
      :value="value"
      persistent
      content-class="unlock-v-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="unlock-module-dialog">
        <div class="unlock-dialog">
          <div class="unlock-stage-title text-center">{{ stageTitle }}</div>
          <div class="unlock-stage-desc">
            <div class="text-center">Unlock with 1,000,000 LAND to enjoy:</div>
            <ul class="list">
              <li class="mt-2">Base Rate: +100 pts/h</li>
              <li class="mt-2">Capacity: +2,500</li>
            </ul>
          </div>

          <div
            class="d-flex align-center justify-center mt-4"
            style="gap: 16px"
          >
            <v-btn
              class="cancel-btn"
              width="148px"
              height="50px"
              outlined
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              class="unlock-btn"
              width="148px"
              height="50px"
              outlined
              @click="handleUnlock"
              :loading="unlockLoading"
              >Unlock</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
import { unlockStage } from "@/api/booster";
import { mapState } from "vuex";
export default {
  props: {
    value: Boolean,
    unlockStage: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      unlockLoading: false,
    };
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    stageTitle() {
      switch (this.unlockStage) {
        case 0:
          return "STORAGE BOOST";
        case 1:
          return "COMPUTING BOOST";
        case 2:
          return "NETWORK BOOST";
        default:
          return "";
      }
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  methods: {
    async handleUnlock() {
      if (this.isTgMiniApp) {
        // window.open("https://dashboard.4everland.org/boost");
        return this.$toast2(
          "This feature is coming soon for the bot. Stay tuned!",
          "success"
        );
      }

      this.unlockLoading = true;
      try {
        const data = await unlockStage(this.unlockStage);
        if (data.code == 10002) {
          this.$toast2(data.message, "error");
          bus.$emit("showDepositDialog", { land: data.data.land });
        } else {
          this.$store.dispatch("getBalance");
          await this.$store.dispatch("getBoosterUserInfo");
        }
      } catch (error) {
        console.log(error);
      }
      this.unlockLoading = false;

      this.$emit("input", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.unlock {
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
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}

::v-deep .unlock-v-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.unlock-module-dialog {
  padding: 13px;
  height: 298px;
  background: url("/img/booster/svg/unlock-dialog-bg.svg") no-repeat;
  background-size: contain;
}
.unlock-dialog {
  position: relative;
  height: 100%;
  padding: 16px 8px;
  color: #fff;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
}
.unlock-stage-title {
  margin: 0 auto;
  width: 270px;
  padding: 8px;
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.25);
  font-size: 24px;
  background: rgba(0, 129, 248, 0.1);
}

.mobile-unlock-stage-title {
  margin: 0 12px;
  padding: 8px;
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.25);
  font-size: 24px;
  background: rgba(0, 129, 248, 0.1);
}
.unlock-stage-desc {
  margin-top: 24px;
  font-size: 16px;

  .list {
    margin: 0 auto;
    width: 200px;
    color: #0fe1f8;
  }
}

.cancel-btn {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
.unlock-btn {
  color: #fff !important;
  text-shadow: 0px 0px 8px #6172f3;
  font-size: 20px;
  letter-spacing: 0;
  font-weight: 500;
  line-height: normal;
  border-radius: 4px;
  border: 1px solid #0e6cc6;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
  box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
    0px 4px 8px 0px rgba(0, 133, 195, 0.25);
}

ul,
li {
  list-style: outside;
}
</style>
