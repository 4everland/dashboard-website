<template>
  <div class="nav-bar">
    <div class="nav d-none d-md-flex align-center">
      <div class="logo d-flex align-center">
        <img
          src="/img/booster/svg/logo.svg"
          @click="$router.push('/boost')"
          width="157"
          alt=""
          style="display: block"
        />
      </div>
      <div class="router-link d-flex align-center">
        <div
          class="router-item"
          :class="{
            corner: currentHoverIdx == index,
            'corner trigger': $route.path == item.path,
          }"
          @mouseenter="currentHoverIdx = index"
          @mouseleave="currentHoverIdx = -1"
          v-for="(item, index) in routers"
          :key="index"
          @click="handleNavChange(item)"
        >
          {{ item.name }}
          <span
            class="top-left"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
          <span
            class="top-right"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
          <span
            class="bottom-left"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
          <span
            class="bottom-right"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
        </div>
      </div>
      <div class="flex-1"></div>

      <div
        v-if="!notLogin"
        class="login-content user-info d-flex align-center px-4"
      >
        <div class="flex-1 d-flex align-center">
          <e-team-avatar
            :src="userInfo.avatar"
            :size="32"
            :uid="userInfo.uid"
          ></e-team-avatar>
          <div class="info-content flex-1">
            <div
              class="d-flex align-center justify-space-between"
              style="gap: 24px"
            >
              <span class="fw-b fz-14 ml-2">
                {{ (userInfo.username || "unkown").cutStr(6, 4) }}
              </span>

              <v-menu
                offset-y
                content-class="user-menu"
                left
                nudge-right="122"
                nudge-bottom="20"
                :close-on-content-click="true"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div v-on="on" v-bind="attrs">
                    <div class="d-flex align-center" id="point-receive">
                      <img
                        width="16"
                        src="/img/booster/4ever-point-icon.png"
                        alt=""
                      />

                      <ICountUp
                        class="points mx-1"
                        :delay="1000"
                        :endVal="boosterInfo.totalPoint"
                        :options="{
                          useEasing: true,
                          useGrouping: true,
                          separator: ',',
                          decimal: '.',
                          prefix: '',
                          suffix: '',
                        }"
                      />

                      <img
                        src="/img/booster/svg/down-arrow.svg"
                        width="12"
                        alt=""
                      />
                    </div>
                  </div>
                </template>
                <div class="user-panel">
                  <div class="user-panel-header">
                    <div
                      class="d-flex align-center justify-space-between py-2 mb-2"
                    >
                      <div>Total $4EVER points</div>
                      <div class="d-flex align-center">
                        <img
                          width="16"
                          src="/img/booster/4ever-point-icon.png"
                          alt=""
                        />
                        <span class="points mx-1">{{
                          boosterInfo.totalPoint
                        }}</span>
                        <PointLogs></PointLogs>
                      </div>
                    </div>
                    <div class="d-flex align-center justify-space-between py-2">
                      <div>
                        <span>Balance: </span>
                        <span>{{ balance.land }}</span>
                        <span>{{ balance.unit }}</span>
                        <span class="ml-1">LAND</span>

                        <v-btn
                          class="ml-1"
                          small
                          color="#fff"
                          icon
                          :loading="reloadBalance"
                          @click.stop="handleGetBalance"
                        >
                          <v-icon color="#fff">mdi-refresh</v-icon>
                        </v-btn>
                      </div>
                      <v-btn
                        color="#6172F3"
                        @click="$router.push('/billing/deposit')"
                      >
                        <img
                          src="/img/booster/svg/pig_bank.svg"
                          width="16"
                          alt=""
                        />
                        <span class="ml-1" style="color: #fff">Deposit</span>
                      </v-btn>
                    </div>
                  </div>
                  <div
                    class="logout d-flex align-center py-2 cursor-p"
                    @click="handleLogout"
                  >
                    <img width="24" src="/img/booster/menu/logout.svg" alt="" />
                    <span class="fz-14 ml-2" style="color: #e2e8f0"
                      >Logout</span
                    >
                  </div>
                </div>
              </v-menu>
            </div>
          </div>
        </div>

        <v-menu
          offset-y
          content-class="inviter-menu"
          nudge-bottom="15"
          left
          nudge-left="-13"
          @input="handleTriggerInvite"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              style="background: rgba(255, 255, 255, 0.1)"
              class="ml-auto"
              v-on="on"
              v-bind="attrs"
              width="80"
            >
              <img src="/img/booster/svg/invite-user.svg" width="16" alt="" />
              <span class="ml-1" style="color: #fff">Invite</span>
            </v-btn>
          </template>
          <div class="invite-panel">
            <div class="invite-panel-content">
              <div class="invite-panel-basic-item d-flex align-center fz-14">
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
              <div class="invite-panel-basic-item d-flex align-center fz-14">
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
              <div class="invite-panel-basic-item d-flex align-center fz-14">
                <div>
                  <span>Total invites:</span>
                  <span class="ml-2">{{ inviteInfo.invited }}</span>
                </div>
              </div>
              <div class="invite-panel-basic-item d-flex align-center fz-14">
                <div>
                  <span>Today's invites:</span>
                  <span class="ml-2">{{ inviteInfo.daily }}</span>
                </div>
              </div>

              <div class="fz-12 invite-panel-basic-item-desc">
                For every 20+ Points collected by your invited Boosters, you'll
                earn an additional 5% points reward!
              </div>
            </div>
          </div>
        </v-menu>
      </div>

      <div v-else class="login-content d-flex align-center justify-center px-4">
        <v-btn
          style="background: rgba(255, 255, 255, 0.1)"
          class="fz-14"
          @click="handleLogin"
        >
          <img src="/img/booster/svg/wallet.svg" width="16" alt="" />
          <span class="ml-1" style="color: #fff">Connect Wallet</span>
        </v-btn>
      </div>
    </div>

    <div
      class="nav-mobile px-2 d-flex align-center justify-space-between d-md-none"
    >
      <div class="logo d-flex align-center">
        <img
          src="/img/booster/svg/logo.svg"
          width="157"
          @click="$router.push('/boost')"
          alt=""
          style="display: block"
        />
      </div>
      <div class="d-flex align-center">
        <v-menu
          offset-y
          content-class="mobile-inviter-menu"
          :close-on-content-click="false"
          min-width="100%"
          nudge-bottom="10"
          @input="handleTriggerInvite"
        >
          <template v-slot:activator="{ on, attrs }">
            <div
              class="mobile-btn pa-2"
              v-on="on"
              v-bind="attrs"
              v-show="!notLogin"
            >
              <img src="/img/booster/svg/invite-user.svg" width="24" alt="" />
            </div>
          </template>
          <div class="mobile-invite-panel">
            <div class="mobile-invite-title mb-4">Invite</div>
            <div class="mobile-invite-panel-content">
              <div
                class="mobile-invite-panel-basic-item d-flex align-center fz-14"
              >
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
              <div
                class="mobile-invite-panel-basic-item d-flex align-center fz-14"
              >
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
              <div
                class="mobile-invite-panel-basic-item d-flex align-center fz-14"
              >
                <div>
                  <span>Total invites:</span>
                  <span class="ml-2">{{ inviteInfo.invited }}</span>
                </div>
              </div>
              <div
                class="mobile-invite-panel-basic-item d-flex align-center fz-14"
              >
                <div>
                  <span>Today's invites:</span>
                  <span class="ml-2">{{ inviteInfo.daily }}</span>
                </div>
                <img class="ml-auto" src="" width="24" alt="" />
              </div>

              <div class="fz-12 mobile-invite-panel-basic-item-desc">
                For every 20+ Points collected by your invited Boosters, you'll
                earn an additional 5% points reward!
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
          </div>
        </v-menu>

        <div
          class="connect-wallet"
          @click="handleLogin"
          v-show="notLogin && !this.isTgMiniApp"
        >
          Connect Wallet
        </div>
        <div class="mobile-btn ml-1 pa-2" @click="$emit('open-drawer')">
          <img src="/img/booster/svg/mobile-draw-icon.svg" width="24" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchInviteInfo, fetchTgInviteInfo } from "@/api/booster";
import { mapGetters, mapState } from "vuex";
import PointLogs from "../components/point-logs.vue";
import ICountUp from "vue-countup-v2";

export default {
  data() {
    return {
      currentHoverIdx: -1,
      routers: [
        {
          name: "Home",
          path: "/boost",
        },
        {
          name: "Elite Quest",
          path: "/boost/quest",
        },
        {
          name: "Leaderboard",
          path: "/boost/leaderboard",
        },
      ],
      inviteInfo: {
        daily: "-",
        inviteCode: "-",
        invited: "-",
        link: "-",
      },
      reloadBalance: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
    }),
    ...mapGetters(["notLogin", "balance"]),
    isTg() {
      return process.env.VUE_APP_TG_VERSION == "true";
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },

  created() {
    if (!this.notLogin) {
      this.$store.dispatch("getBalance");
    }
  },

  methods: {
    handleNavChange(item) {
      if (item.name == "Leaderboard" && this.notLogin) {
        this.$router.push("/login");
        return;
      }

      this.$router.push(item.path);
    },

    handleLogin() {
      localStorage.loginTo = location.pathname + location.search;
      this.$router.push("/login");
    },
    handleLogout() {
      localStorage.clear();
      localStorage.loginTo = location.pathname + location.search;
      location.reload();
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

    handleTriggerInvite(val) {
      if (val) {
        console.log(this.isTg);
        if (this.isTg) {
          this.getTgInviteInfo();
        } else {
          this.getInviteInfo();
        }
      }
    },

    handleTgShare() {
      this.$tg.shareUrl(
        this.inviteInfo.link,
        "Embark on the exciting 4EVER Boost campaign to boost your $4EVER points and grab exciting upcoming airdrops!🚨"
      );
    },
    async handleGetBalance() {
      try {
        this.reloadBalance = true;
        await this.$store.dispatch("getBalance");
        this.reloadBalance = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    PointLogs,
    ICountUp,
  },
  watch: {
    notLogin(val) {
      if (!val) {
        this.$store.dispatch("getBalance");
      }
    },
  },
};
</script>

<style></style>
<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .nav-bar {
    top: 0 !important;
    height: 64px;
  }
}
::v-deep .user-menu {
  border-radius: 0;
}
::v-deep .user-panel-header {
  padding-bottom: 16px;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

::v-deep .user-menu {
  border: none !important;
  border-radius: 0 !important;
}
::v-deep .mobile-inviter-menu {
  border: none;
  border-radius: 0;
}
::v-deep .mobile-invite-panel {
  color: #fff;
  padding: 16px;
  background: linear-gradient(180deg, #202538 0%, #151928 100%);
  backdrop-filter: blur(19.75px);
}
::v-deep .mobile-invite-title {
  font-size: 24px;
  text-shadow: 0px 0px 8px #6172f3;
}
::v-deep .mobile-invite-panel-content {
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-image: linear-gradient(
      to right,
      rgba(164, 188, 253, 0),
      rgba(164, 188, 253, 1)
    )
    1;
}
::v-deep .mobile-invite-panel-basic-item {
  padding: 4px 0;
  margin-bottom: 12px;
  backdrop-filter: blur(2px);
}
::v-deep .mobile-invite-panel-basic-item-desc {
  padding: 4px 0;
  backdrop-filter: blur(2px);
  color: rgba(255, 255, 255, 0.4);
}
::v-deep .inviter-menu {
  border-radius: 0;
}
::v-deep .invite-panel {
  color: #fff;
  padding: 32px 20px;
  width: 340px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(54, 59, 64, 0.9);
}
::v-deep .invite-panel-content {
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-image: linear-gradient(
      to right,
      rgba(164, 188, 253, 0),
      rgba(164, 188, 253, 1)
    )
    1;
}
::v-deep .invite-panel-basic-item {
  padding: 4px 20px;
  margin-bottom: 12px;
  backdrop-filter: blur(2px);
}
::v-deep .invite-panel-basic-item-desc {
  padding: 4px 20px;
  backdrop-filter: blur(2px);
  color: rgba(255, 255, 255, 0.4);
}

::v-deep .user-panel {
  color: #fff;
  padding: 24px 20px;
  width: 340px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(54, 59, 64, 0.9);
}
::v-deep .connect-wallet {
  display: inline-flex;
  padding: 8px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}
::v-deep .points {
  color: #6172f3;
  font-family: "DIN Alternate";
  font-size: 20px;
  font-weight: 700;
  line-height: 24px; /* 120% */
}

.nav-bar {
  z-index: 2;
  position: absolute;
  width: 100%;
  top: 24px;
  .nav {
    height: 50px;
    margin: 0 24px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.05) 100%
      ),
      rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    > div {
      height: 100%;
    }
    .logo {
      padding: 0 59px 0 24px;
    }

    .router-link {
      border-left: 1px solid rgba(255, 255, 255, 0.25);

      .router-item {
        padding: 16px 0;
        width: 128px;
        text-align: center;
        font-size: 14px;
        border-right: 1px solid rgba(255, 255, 255, 0.25);
        line-height: 16px;
        box-sizing: border-box;
        cursor: pointer;
      }

      .router-item.trigger {
        font-weight: bold;
        background: radial-gradient(
            34.71% 14.84% at 50% 68.75%,
            rgba(97, 114, 243, 0.5) 0%,
            rgba(97, 114, 243, 0) 100%
          ),
          radial-gradient(
            50% 50% at 50% 50%,
            rgba(13, 13, 13, 0) 0%,
            #0d0d0d 100%
          ),
          url("/img/booster/header-link-shadow.png") 50% / cover no-repeat;
      }
    }

    .corner {
      position: relative;
      .top-left {
        position: absolute;
        left: -1px;
        top: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 1px 0 0 1px;
      }
      .top-right {
        position: absolute;
        right: -1px;
        top: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 1px 1px 0 0;
      }
      .bottom-left {
        position: absolute;
        right: -1px;
        bottom: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 0 1px 1px 0;
      }
      .bottom-right {
        position: absolute;
        left: -1px;
        bottom: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 0 0 1px 1px;
      }
    }

    .user-info {
      gap: 8px;

      .info-content {
        padding-right: 16px;
        border-right: 1px solid rgba(255, 255, 255, 0.25);
      }
      .balance {
        white-space: nowrap;
        color: #94a3b8;
      }
    }
    .login-content {
      // width: 340px;
      border-left: 1px solid rgba(255, 255, 255, 0.25);
    }
  }

  .nav-mobile {
    height: 100%;
    .mobile-btn {
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      > img {
        vertical-align: middle;
      }
    }
  }
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
