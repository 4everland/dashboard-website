<template>
  <div class="invite-detail d-flex flex-column">
    <div
      class="invite-reward-content d-flex align-center justify-space-between"
    >
      <span class="fz-14">My Invites</span>
      <ICountUp
        class="total-num"
        :delay="1000"
        :endVal="userInviteCount"
        :options="{
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: '',
        }"
      />
    </div>

    <div class="invite-act my-4 d-flex align-center" style="gap: 12px">
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

    <div class="invite-title">Invite List</div>
    <InviteList></InviteList>
    <div class="fz-12 my-3" style="line-height: 20px">
      <div class="fw-b fz-16 mb-2">Rules</div>

      <ul style="list-style: disc">
        <li style="list-style: disc">
          Invite friends to join <b>4EVER Boost</b> (available on both the
          webpage and miniapp).
        </li>
        <li style="list-style: disc">
          <b>'Start Boost'</b>—each Boost counts as a successful invitation.
        </li>
        <li style="list-style: disc">
          Earn <b>5%</b> of your friend's total points for each successful
          invite, and receive this every time they claim points.
        </li>
        <li style="list-style: disc">
          Access your history by clicking the book icon next to your total
          points.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import InviteList from "./invite-list.vue";
import ICountUp from "vue-countup-v2";

export default {
  computed: {
    ...mapState({
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
      userInviteCount: (s) => s.moduleBooster.userInviteCount,
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
          "💎 Join me in the #4EVERBoost, your one-stop aggregator platform to explore diverse project mining opportunities and earn valuable points or token rewards."
        );
      } else {
        let shareUrl =
          "💎 Join me in the #4EVERBoost, your one-stop aggregator platform to explore diverse project mining opportunities and earn valuable points or token rewards.";
        shareUrl += this.inviteInfo.link;
        shareUrl =
          "https://x.com/intent/tweet?text=" + encodeURIComponent(shareUrl);

        this.asMobile ? (location.href = shareUrl) : window.open(shareUrl);
      }
    },
  },
  components: {
    InviteList,
    ICountUp,
  },
};
</script>

<style lang="scss" scoped>
.invite-detail {
  .invite-reward-content {
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(117deg, #0fe1f8 -21.41%, #1102fc 99.47%);
    .total-num {
      font-family: "DIN Alternate";
      font-size: 28px;
    }
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

  .invite-title {
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    text-shadow: 0px 0px 8px #6172f3;
  }
}
</style>
