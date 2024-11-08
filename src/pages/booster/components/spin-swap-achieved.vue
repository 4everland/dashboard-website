<template>
  <div>
    <v-dialog
      v-model="value"
      fullscreen
      hide-overlay
      persistent
    >
      <v-card class="swap-success">
        <div class="swap-content">
          <div class="success-text">
            <div>Points quota collected!</div>
          </div>
          <div>
            <img
              class="lightning"
              src="/img/booster/spin/spin-light.png"
              width="320"
              alt=""
            />
            <div class="success-img">
              <img src="/img/booster/spin/success.png" width="300" alt="" />
              <v-chip class="swap-chip d-flex justify-center align-center">
                <div class="d-flex justify-center align-center">
                  <img
                    src="/img/booster/spin/spin-icon.png"
                    width="24"
                    alt=""
                  />
                  <div class="chip-text">{{ spinStartInfo.duration }}</div>
                </div>
                <img
                  src="/img/booster/spin/arrows-left.png"
                  width="12"
                  alt=""
                />
                <div class="chip-text2">${{spinStartInfo.cashValue}}</div>
              </v-chip>
            </div>
          </div>
          <v-btn class="reward-btn" style="width: 80%" height="44"
            @click="handleSwap"
          >
            <div class="btn-text">Withdraw</div>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { onNext } from "@/api/booster";
import { bus } from "@/utils/bus";
import RewardDialog from "./reward-dialog.vue";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
    };
  },

  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      dailySign: (s) => s.moduleBooster.dailySign,
      spinStartInfo: (s) => s.moduleBooster.spinStartInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    handleSwap() {
      this.$emit("input", false);
      this.$emit("openSwapDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.swap-success {
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  .swap-content {
    position: relative;
    width: 100%;
    top: 138px;
    text-align: center;
    .success-text {
      font-size: 28px;
      line-height: 34px;
      text-align: center;
      font-weight: 700;
       text-shadow: 0 0 4px #ffde7f, 0 0 24px #ffad08; 
    }
    .lightning {
      margin-top: 10px;
      animation: rotate 5s linear infinite;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .success-img {
      width: 100%;
      position: absolute;
      top: 90px;
      left: 0;
      z-index: 1;
    }
    .swap-chip {
      text-align: center;
      position: absolute;
      top: 174px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      min-width: 128px;
      height: 28px;
      background: linear-gradient(
        180deg,
        rgba(57, 59, 62, 0.25) 25.52%,
        rgba(36, 39, 42, 0.25) 100%
      );
      background-blend-mode: overlay;
      .chip-text {
        font-size: 14px;
        font-weight: 700;
        line-height: 16px;
        color: #fff;
      }
      .chip-text2 {
        font-size: 20px;
        font-style: italic;
        font-weight: 700;
        line-height: 24px;
        color: #ffde7f;
      }
    }
    .reward-btn {
      position: relative;
      color: #fff !important;
      padding: 0 !important;
      letter-spacing: 0;
      backdrop-filter: blur(2px);
      border-radius: 12px;
      background: linear-gradient(
          180deg,
          #ffa927 0%,
          rgba(255, 169, 39, 0) 59.56%
        ),
        linear-gradient(270deg, rgba(255, 114, 114, 0) 27%, #ff7272 100%),
        linear-gradient(327deg, #ff7c32 2.65%, rgba(255, 169, 39, 0) 33.12%),
        linear-gradient(to bottom right, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
          bottom right / 50% 50% no-repeat,
        linear-gradient(to bottom left, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
          bottom left / 50% 50% no-repeat,
        linear-gradient(to top left, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top
          left / 50% 50% no-repeat,
        linear-gradient(to top right, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top
          right / 50% 50% no-repeat,
        linear-gradient(90deg, rgba(255, 53, 53, 0) 28%, #ff3535 100%), #ff35ba;
      
      .btn-text {
        font-family: Inter;
        font-size: 16px;
        font-weight: 700;
        line-height: 19px;
      }
    }
  }
}
</style>
