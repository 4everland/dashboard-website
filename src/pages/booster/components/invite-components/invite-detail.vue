<template>
  <div class="invite-detail d-flex flex-column">
    <div class="invite-reward-content">
      <InviteReward></InviteReward>
    </div>

    <div class="mt-4">
      <div class="invite-act d-flex align-center" style="gap: 12px">
        <v-btn
          class="act-btn flex-1"
          height="48"
          @click="handleShare"
          :disabled="inviteInfo.link == '-'"
        >
          <div class="d-flex align-center" v-if="!isTgMiniApp">
            <span class="mr-2">Share on </span>
            <img src="/img/booster/invite/x.svg" width="16" alt="" />
          </div>
          <div v-else>Invite Friend</div>
        </v-btn>

        <v-btn
          class="act-btn"
          :width="!asMobile ? 160 : 48"
          height="48"
          v-clipboard="copyValue"
          @success="() => $toast2('Copied!', 'success')"
        >
          <img src="/img/booster/invite/copy.svg" width="24" alt="" />
          <span v-if="!asMobile" class="ml-2"> Copy</span>
        </v-btn>
      </div>
    </div>
    <div class="fz-12 my-3" style="line-height: 20px">
      <div class="fw-b fz-16 mb-2">Rules</div>
      <div>
        Invite friends and earn TON rewards! Have them log in to the 4EVERLAND
        Bot and activate a node—<span class="fw-b"
          >each activation counts as one invite!</span
        >
      </div>
      <ul style="list-style: disc">
        <li style="list-style: disc">
          The invite count <span class="fw-b">resets</span> when the event
          launches.
        </li>
        <li style="list-style: disc">
          Track your <span class="fw-b">My Invites</span> on the page and claim
          rewards once you hit the target.
        </li>
        <li style="list-style: disc">
          You will earn a <span class="fw-b">5%</span> points reward for every
          invitation!
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import InviteReward from "./invite-reward.vue";
export default {
  computed: {
    ...mapState({
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },

    copyValue() {
      return (
        "Invite link:" +
        this.inviteInfo.link +
        "\n" +
        "Invite code:" +
        this.inviteInfo.inviteCode
      );
    },
  },
  methods: {
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
  components: {
    InviteReward,
  },
};
</script>

<style lang="scss" scoped>
.invite-detail {
  .invite-reward-content {
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(117deg, #0fe1f8 -21.41%, #1102fc 99.47%);
  }

  .invite-act {
    .act-btn {
      font-size: 14px;
      letter-spacing: 0;
      border-radius: 4px;
      color: #fff !important;
      text-shadow: 0px 0px 8px #6172f3;
      border: 1px solid #0e6cc6;
      background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
      box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
        0px 4px 8px 0px rgba(0, 133, 195, 0.25);
    }
  }
}
</style>
