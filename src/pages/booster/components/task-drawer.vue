<template>
  <div class="task-drawer-box">
    <v-navigation-drawer
      class="task-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      temporary
      :hide-overlay="!asMobile"
      right
      color="#1E2234"
      :value="showTaskDrawer"
      @input="stateTaskDrawerShow"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="task-drawer-top" v-if="!isTgMiniApp">
          <div class="drawer-title task-drawer-title">
            <span> Daily Task: Claim LAND </span>
            <v-btn
              :class="signed ? 'done-btn' : 'drawer-btn'"
              :disabled="signed"
              @click="onSign"
            >
              {{ signed ? "Done" : "Claim" }}
            </v-btn>
          </div>
          <div class="daily-sign">
            <div class="daily-sign-box">
              <div
                v-for="(item, index) in signList"
                :key="index"
                class="daily-sign-item"
                :class="[
                  signDays % 7 > index ? 'daily-signed' : '',
                  signDays % 7 == index && !signed ? 'daily-today' : '',
                ]"
              >
                <div class="daily-sign-item-top">
                  <div class="point">
                    +{{ item.reward }}
                    <br />
                    pts/h
                  </div>
                  <div>
                    <img
                      v-if="signDays % 7 > index"
                      src="/img/booster/drawer/check-circle.png"
                      alt=""
                    />
                    <img v-else src="/img/booster/drawer/coin.png" alt="" />
                  </div>
                </div>
                <div class="daily-sign-item-bottom">
                  {{
                    (!signed && signDays % 7 == index) ||
                    (signed && (signDays % 7) - 1 == index)
                      ? "Today"
                      : `Day ${item.step}`
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="task-box">
          <v-row no-gutters style="gap: 18px 0">
            <v-col
              v-for="(item, index) in tasksLists"
              :key="item.actId"
              cols="12"
              v-show="
                item.deployOn == 'all' ||
                (item.deployOn == 'pc' && !isTgMiniApp) ||
                (item.deployOn == 'tg' && isTgMiniApp)
              "
            >
              <div class="task-item-box">
                <div class="task-item-left">
                  <img class="task-item-image" :src="item.icon" alt="" />
                  <div class="task-text-box">
                    <div class="task-name">{{ item.actName }}</div>
                    <div class="task-desc">{{ item.description }}</div>
                  </div>
                </div>

                <div class="task-item-right">
                  <v-btn
                    v-if="
                      item.actStatus !== 'DONE' && item.extra.buttonName == 'Go'
                    "
                    class="go-btn"
                    @click="stepNext(item, index)"
                    >Go</v-btn
                  >
                  <v-btn
                    v-else-if="item.actStatus !== 'DONE'"
                    class="drawer-btn"
                    @click="stepNext(item, index)"
                    >{{ item.extra.buttonName }}</v-btn
                  >

                  <v-btn v-if="item.actStatus == 'DONE'" class="done-btn"
                    >Done</v-btn
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { fetchDailySign, fetchTasks, onNext } from "@/api/booster.js";
import { bus } from "@/utils/bus";
import { fetchInviteInfo, fetchTgInviteInfo } from "@/api/booster";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["showTaskDrawer"]),
    isTg() {
      return process.env.VUE_APP_TG_VERSION == "true";
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  data() {
    return {
      signList: [],
      tasksLists: [],
      signDays: 0,
      signed: false,
      inviteInfo: {
        daily: "-",
        inviteCode: "-",
        invited: "-",
        link: "-",
      },
    };
  },
  created() {
    this.getDailySign();
    this.getTasks();
    bus.$on("getDailyTasks", () => {
      // this.getDailySign();
      this.signed = true;
    });
  },
  mounted() {},
  methods: {
    async getDailySign() {
      const { data } = await fetchDailySign();
      const rewardList = data.items[0].extra.dailySign.rewardList;
      const stepList = data.items[0].extra.dailySign.stepList;
      const signDays = data.items[0].extra.dailySign.continuous;
      if (data.items[0].actStatus == "DONE") {
        this.signed = true;
      }
      this.signDays = signDays;
      let signList = [];
      rewardList.forEach((element, index) => {
        signList.push({
          reward: element,
          step: stepList[index],
          signDays: signDays,
        });
      });
      this.signList = signList;
    },
    async getTasks() {
      const { data } = await fetchTasks();
      this.tasksLists = data.items;
    },
    async stepNext(item, index) {
      let _this = this;
      if (item.extra.buttonName == "Go") {
        if (item.actType == "4ever_chat") {
          window.open("https://ai-dev.4everland.app/");
        }
        if (item.actType == "storage") {
          window.open("https://dashboard.4everland.org/bucket/storage/");
        }
        if (item.actType == "access_event_desktop") {
          window.open("https://dashboard.4everland.org/boost/");
        }
      }
      const id = item.actId;
      const { data } = await onNext(id);
      const actType = data.actType;

      item.extra.buttonName = data.action.web.nextButtonName;
      this.$set(_this.tasksLists, index, item);

      switch (data.action.web.next) {
        case "REDIRECT":
          location.href = data.action.web.message;
          break;
        case "JUMP_OUT":
          if (actType == "share_twitter") {
            const inviteLink = encodeURI(this.inviteInfo.link);
            const shareUrl = data.action.web.message.replace(
              "%25s",
              inviteLink
            );
            this.asMobile ? (location.href = shareUrl) : window.open(shareUrl);
          } else {
            if (data.action.web.message) {
              this.asMobile
                ? (location.href = data.action.web.message)
                : window.open(data.action.web.message);
            }
          }
          break;
        case "CLAIM":
          this.$toast2(data.action.web.message, "success");
          this.getTasks();
          break;
        case "COMPLETE":
          this.getTasks();
          break;
        case "COPY":
          if (actType == "daily_invite") {
            try {
              const textToCopy = this.inviteInfo.link;
              this.$copyText(textToCopy).then(
                (e) => {
                  this.$toast2("Copied!");
                },
                function (e) {
                  console.log(e);
                }
              );
            } catch (error) {
              console.error(error);
            }
          } else {
            const textToCopy = data.action.web.message;
            this.$copyText(textToCopy).then(
              (e) => {
                this.$toast2("Copied!");
              },
              function (e) {
                console.log(e);
              }
            );
          }
          break;
        default:
          this.getTasks();
          break;
      }
      this.$store.dispatch("getBoosterUserInfo");
    },
    async onSign() {
      if (this.isTgMiniApp) {
        window.open("https://dashboard.4everland.org/boost");
        // return this.$toast2(
        //   "This feature is coming soon for the bot. Stay tuned!",
        //   "success"
        // );
        return;
      }
      if (!this.userInfo.wallet) {
        this.$store.dispatch("BindWalletToggle");
        this.stateTaskDrawerShow(false);
      } else {
        this.stateTaskDrawerShow(false);
        const land = 50000;
        const report = true;
        bus.$emit("showDepositDialog", { land, report });
      }
    },
    stateTaskDrawerShow(state) {
      if (state) {
        this.getInvite();
      }
      this.$store.dispatch("TaskDrawerState", { state });
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
    getInvite() {
      if (this.isTg) {
        this.getTgInviteInfo();
      } else {
        this.getInviteInfo();
      }
    },
    openUrl(url) {
      let a = document.createElement("a");
      a.target = "_blank";
      a.href = url;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    },
  },
};
</script>

<style lang="scss" scoped>
.go-btn {
  border-radius: 4px;
  border: 1px solid #43e7fa;
  background: rgba(0, 48, 92, 0.8) !important;
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
  color: #fff !important;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}
.drawer-btn {
  background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
  color: #fff !important;
  font-size: 14px;
  font-weight: 400;
  min-width: 80px !important;
  cursor: pointer;
}
.done-btn {
  border-radius: 21px;
  background: #31383f !important;
  color: #fff !important;
  cursor: not-allowed;
}
::v-deep .theme--light.v-btn.v-btn--disabled.done-btn {
  color: #fff !important;
}
.task-drawer-box {
  ::v-deep .task-drawer {
    width: 100% !important;
    height: 80% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/task-bg.png");
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
    .task-drawer-top {
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      .daily-sign {
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .daily-sign-box {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: auto;
          .daily-sign-item {
            .daily-sign-item-top {
              display: flex;
              width: 44px;
              padding: 5px 8px 4px 6px;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 4px;
              border-radius: 100px;
              opacity: 0.8;
              background: rgba(97, 114, 243, 0.1);
              .point {
                color: #6172f3;
                text-align: center;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
              }
              img {
                width: 24px;
                height: 24;
              }
            }
            .daily-sign-item-bottom {
              font-size: 12px;
              opacity: 0.6;
              text-align: center;
              margin-top: 6px;
            }
          }
          .daily-signed {
            .daily-sign-item-top {
              opacity: 1;
              background: rgba(255, 255, 255, 0.1);

              .point {
                color: #fff;
              }
            }
            .daily-sign-item-bottom {
              opacity: 1;
            }
          }
          .daily-today {
            .daily-sign-item-top {
              opacity: 1;
              background: #6172f3;

              .point {
                color: #fff;
              }
            }
            .daily-sign-item-bottom {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  .task-box {
    padding: 24px 0;
    .task-item-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .task-item-left {
        display: flex;
        align-items: center;
        gap: 12px;
        .task-item-image {
          width: 44px;
        }
        .task-text-box {
          .task-text {
            font-size: 16px;
            font-weight: 400;
            color: #fff;
          }
          .task-desc {
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }
  }
}

@media (min-width: 960px) {
  .task-drawer-box {
    ::v-deep .task-drawer {
      top: 74px !important;
      right: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
      .task-drawer-top {
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
  .col-md-15 {
    width: 20%;
    max-width: 20%;
  }
}
</style>
