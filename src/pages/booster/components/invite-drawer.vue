<template>
  <div class="invite-drawer-box">
    <v-navigation-drawer
      class="invite-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      right
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showInviteDrawer"
      @input="handleToggle"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="drawer-title mb-6">Invite Friends Earn Cash!</div>

        <div class="mobile-invite-panel-content">
          <div class="mobile-invite-panel-basic-item d-flex align-center fz-14">
            <div>
              <span>Invite link:</span>
              <span class="ml-2">
                {{
                  inviteInfo.link == "-"
                    ? "-"
                    : inviteInfo.link.slice(0, 12) +
                      "..." +
                      inviteInfo.link.slice(-8)
                }}</span
              >
            </div>
            <img
              class="ml-auto cursor-p"
              src="/img/booster/svg/copy.svg"
              width="24"
              alt=""
              v-clipboard="inviteInfo.link"
              @success="() => $toast2('Copied!', 'success')"
            />
          </div>
          <div class="mobile-invite-panel-basic-item d-flex align-center fz-14">
            <div>
              <span>Invite code:</span>
              <span class="ml-2">{{ inviteInfo.inviteCode }}</span>
            </div>
            <img
              class="ml-auto cursor-p"
              src="/img/booster/svg/copy.svg"
              width="24"
              alt=""
              v-clipboard="inviteInfo.inviteCode"
              @success="() => $toast2('Copied!', 'success')"
            />
          </div>
          <div class="mobile-invite-panel-basic-item d-flex align-center fz-14">
            <div>
              <span>Total invites:</span>
              <span class="ml-2">{{ inviteInfo.invited }}</span>
            </div>
          </div>
          <div class="mobile-invite-panel-basic-item d-flex align-center fz-14">
            <div>
              <span>Today's invites:</span>
              <span class="ml-2">{{ inviteInfo.daily }}</span>
            </div>
            <img class="ml-auto" src="" width="24" alt="" />
          </div>

          <div class="fz-12 mobile-invite-panel-basic-item-desc">
            🎁 Earn a 5% Points Reward for every invitation!
          </div>

          <v-btn
            class="tg-invite"
            v-if="isTg"
            :disabled="inviteInfo.link == '-'"
            @click="handleTgShare"
          >
            <img src="/img/booster/svg/tg-icon.svg" width="16" alt="" />
            <span class="ml-2">INVITE FRIENDS</span>
          </v-btn>
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { fetchInviteInfo, fetchTgInviteInfo } from "@/api/booster";

export default {
  computed: {
    ...mapState({
      showInviteDrawer: (s) => s.moduleBooster.showInviteDrawer,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTg() {
      return process.env.VUE_APP_TG_VERSION == "true";
    },
  },

  data() {
    return {
      inviteInfo: {
        daily: "-",
        inviteCode: "-",
        invited: "-",
        link: "-",
      },
    };
  },
  methods: {
    handleToggle(val) {
      if (val) {
        //
        console.log(val);
        this.handleTriggerInvite();
      } else {
        this.$store.commit("SET_INVITE_BAR", val);
      }
    },
    async getInviteInfo() {
      try {
        const { data } = await fetchInviteInfo();
        if (data) {
          this.inviteInfo = data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getTgInviteInfo() {
      try {
        const { data } = await fetchTgInviteInfo();
        if (data) {
          this.inviteInfo = data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleTriggerInvite() {
      if (this.isTg) {
        this.getTgInviteInfo();
      } else {
        this.getInviteInfo();
      }
    },

    handleTgShare() {
      this.$tg.shareUrl(
        this.inviteInfo.link,
        "Embark on the exciting 4EVER Boost campaign to boost your $4EVER points and grab exciting upcoming airdrops!🚨"
      );
    },
  },
  watch: {
    showInviteDrawer(val) {
      if (!val) {
        this.showBuyDialog = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-drawer-box {
  ::v-deep .invite-drawer {
    width: 100% !important;
    height: 80% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/invite-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    overflow: scroll;
    .drawer-title {
      font-size: 24px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0px 0px 8px #6172f3;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

@media (min-width: 960px) {
  .invite-drawer-box {
    ::v-deep .invite-drawer {
      top: 74px !important;
      right: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
    }
  }
}

.mobile-invite-title {
  font-size: 24px;
  text-shadow: 0px 0px 8px #6172f3;
}

.mobile-invite-panel-basic-item {
  padding: 4px 20px;
  margin-bottom: 12px;
  backdrop-filter: blur(2px);
}
.mobile-invite-panel-basic-item-desc {
  display: flex;
  padding: 8px 20px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 4px;
  background: linear-gradient(
    163deg,
    #6172f3 2.92%,
    rgba(97, 114, 243, 0.25) 79.4%
  );
}
.tg-invite {
  margin: 16px 0;
  color: #fff !important;
  width: 100%;
  padding: 8px 18px;
  border-radius: 4px;
  background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
}
</style>
