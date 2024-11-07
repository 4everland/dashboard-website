<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog"
      v-model="value"
       overlay-opacity="0.9"
      overlay-color="black"
      @click:outside="$emit('input', false)"
    >
      <div class="daily-boost">
        <img
          class="lightning"
          src="/img/booster/spin/icon_spin.png"
          width="94"
          alt=""
        />
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />

        <div class="spin-background">
          <div class="congratulations">0 Times</div>
          <div class="swap">
            Get more Spin times by inviting new friends!
          </div>
          <div class="invite-btn d-flex justify-center align-center">
            <v-btn class="got-btn" height="40" @click="handleok">
              <div class="btn-text">Got!</div>
            </v-btn>
            <v-btn class="reward-btn" height="40" @click="handleInvite">
              <div class="btn-text">Invite</div>
            </v-btn>
          </div>
        </div>
      </div>
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
      list: [],
      checkinInfo: null,
      checkinLoading: false,
      showReward: false,
      today: 1,
    };
  },

  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      dailySign: (s) => s.moduleBooster.dailySign,
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },

  methods: {
    handleok(){
      this.$emit('input', false);
    },
    handleInvite(){
      this.$emit('input', false);
      this.handleShare()
    },
    handleShare() {
      if (this.isTgMiniApp) {
        this.$tg.shareUrl(
          this.inviteInfo.link,
          "💎 Join me in the #4EVERBoost and reap amazing rewards! Earn $4EVER points, Ton rewards, and exciting @4everland_org #airdrops! Don't miss out—let's boost together! 🎗️🎊"
        );
      } else {
        let shareUrl =
          "💎 Join me in the #4EVERBoost and reap amazing rewards! Earn $4EVER points, Ton rewards, and exciting @4everland_org #airdrops! Don't miss out—let's boost together! 🎗️🎊 ";
        shareUrl += this.inviteInfo.link;
        shareUrl =
          "https://x.com/intent/tweet?text=" + encodeURIComponent(shareUrl);

        this.asMobile ? (location.href = shareUrl) : window.open(shareUrl);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .daily-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  margin: 24px 12px !important;
}

.daily-boost {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  background: #121536;
  .close-btn {
    position: absolute;
    right: 18px;
    top: 18px;
    cursor: pointer;
  }
  .lightning {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  }
  .reward-number {
    font-family: Inter;
    font-size: 40px;
    font-style: italic;
    font-weight: 700;
    line-height: 48.41px;
    text-align: center;
    margin-right: 24px;
    color: #ffde7f;
  }

  .congratulations {
    margin-top: 30px;
    font-family: Inter;
    font-size: 20px;
    font-style: italic;
    font-weight: 900;
    line-height: 24px;
    text-align: center;
    color: #fff;
  }
  .swap {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.94px;
    text-align: center;
    margin-top: 8px;
    color: #ffffff;
  }
}
.invite-btn {
  margin-top: 20px;
}
.got-btn {
  width: 150px;
  border-radius: 8px;
  border: 1px #ffffff solid;
  margin-right: 10px;
  background: #121536 !important;
  .btn-text {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #ffffff;
  }
}
.reward-btn {
  width: 150px;
  letter-spacing: 0;
  backdrop-filter: blur(2px);
  border-radius: 8px;
  background: linear-gradient(315.05deg, #1102fc 3.4%, #0fe1f8 92.46%);
  .btn-text {
    font-family: Inter;
    font-size: 14px;
    font-weight: 700;
    line-height: 19px;
    color: #ffffff;
  }
}

.cancel-btn {
  color: #fff !important;
  font-weight: 500;
  font-family: Inter;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  background: transparent !important;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
</style>
