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
        <div class="task-drawer-top">
          <div class="drawer-title task-drawer-title">
            <span class="fz-16 fw-b"> Daily Tasks </span>
            <v-btn
              :class="signed ? 'done-btn' : 'drawer-btn'"
              @click="onSign"
              :disabled="signed"
            >
              {{ signed ? "Done" : "Claim LAND" }}
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
          <div v-if="tasksLists_without_done.length > 0">
            <v-row no-gutters style="gap: 18px 0; margin: 12px 0">
              <v-col
                v-for="(item, index) in tasksLists_without_done"
                :key="item.actId"
                cols="12"
                v-show="
                  item.deployOn == 'all' ||
                  (item.deployOn == 'pc' && !isTgMiniApp) ||
                  (item.deployOn == 'tg' && isTgMiniApp)
                "
              >
                <div class="task-item-box">
                  <div class="task-item-left" @click="handleTitle(item)">
                    <img class="task-item-image" :src="item.icon" alt="" />
                    <div class="task-text-box">
                      <div class="task-name">{{ item.actName }}</div>
                      <div class="task-desc">{{ item.description }}</div>
                    </div>
                  </div>

                  <div class="task-item-right">
                    <v-btn
                      v-if="
                        item.actStatus !== 'DONE' &&
                        item.extra.buttonName == 'Go' &&
                        item.actType == 'daily_invite'
                      "
                      class="go-btn"
                      width="84"
                      @click="stepNext(item, index, 'daily')"
                      v-clipboard="inviteInfo.link"
                      @success="() => $toast2('Copied!', 'success')"
                      >Go</v-btn
                    >
                    <v-btn
                      v-else-if="item.actStatus !== 'DONE'"
                      :class="
                        item.extra.buttonName == 'Go' ? 'go-btn' : 'drawer-btn'
                      "
                      width="84"
                      :loading="false || loadingStatus[item.actId]"
                      @click="stepNext(item, index, 'daily')"
                    >
                      <span>{{ item.extra.buttonName }}</span>
                    </v-btn>

                    <v-btn
                      v-if="item.actStatus == 'DONE'"
                      class="done-btn"
                      width="84"
                      >Done</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- one off task -->
          <div
            v-if="tasksLists_one_without_done.length > 0"
            style="margin: 12px 0"
          >
            <div
              class="task-list-title"
              style="border-top: 1px solid rgba(255, 255, 255, 0.3)"
            >
              Basic Tasks
            </div>
            <v-row no-gutters style="gap: 18px 0">
              <v-col
                v-for="(item, index) in tasksLists_one_without_done"
                :key="item.actId"
                cols="12"
                v-show="
                  item.deployOn == 'all' ||
                  (item.deployOn == 'pc' && !isTgMiniApp) ||
                  (item.deployOn == 'tg' && isTgMiniApp && isAndroid) ||
                  (item.deployOn == 'tg' &&
                    isTgMiniApp &&
                    !isAndroid &&
                    item.actType != 'save_home_screen')
                "
              >
                <div class="task-item-box">
                  <div class="task-item-left" @click="handleTitle(item)">
                    <img class="task-item-image" :src="item.icon" alt="" />
                    <div class="task-text-box">
                      <div class="task-name">{{ item.actName }}</div>
                      <div class="task-desc">{{ item.description }}</div>
                    </div>
                  </div>

                  <div class="task-item-right">
                    <v-btn
                      v-if="
                        item.actStatus !== 'DONE' &&
                        item.extra.buttonName == 'Go' &&
                        item.actType == 'daily_invite'
                      "
                      class="go-btn"
                      width="84"
                      @click="stepNext(item, index, 'one')"
                      v-clipboard="inviteInfo.link"
                      @success="() => $toast2('Copied!', 'success')"
                      >Go</v-btn
                    >
                    <v-btn
                      v-else-if="item.actStatus !== 'DONE'"
                      :class="
                        item.extra.buttonName == 'Go' ? 'go-btn' : 'drawer-btn'
                      "
                      :loading="false || loadingStatus[item.actId]"
                      width="84"
                      @click="stepNext(item, index, 'one')"
                    >
                      <span>{{ item.extra.buttonName }}</span>
                    </v-btn>

                    <v-btn
                      v-if="item.actStatus == 'DONE'"
                      class="done-btn"
                      width="84"
                      >Done</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- ton ai ads -->

          <div style="margin: 12px 0" v-if="tonAds.length > 0">
            <div
              class="task-list-title"
              style="border-top: 1px solid rgba(255, 255, 255, 0.3)"
            >
              Ton AI Ads Tasks
            </div>
            <v-row no-gutters style="gap: 18px 0">
              <v-col v-for="item in tonAds" :key="item.adId" cols="12">
                <div class="task-item-box">
                  <div class="task-item-left">
                    <img class="task-item-image" :src="item.icon" alt="" />
                    <div class="task-text-box">
                      <div class="task-name">{{ item.brandName }}</div>
                      <div class="task-desc">+5 pts/h, valid for 24 hours</div>
                    </div>
                  </div>

                  <div class="task-item-right">
                    <v-btn
                      v-if="item.buttonText == 'Go'"
                      width="84"
                      class="go-btn"
                      @click="showPopupAdd(item)"
                      :loading="item.load"
                      >Go</v-btn
                    >

                    <v-btn
                      v-if="item.buttonText == 'done'"
                      class="done-btn"
                      width="84"
                      >Done</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- partner task -->
          <div
            v-if="isTgMiniApp && tasksLists_partner_without_done.length > 0"
            style="margin: 12px 0"
          >
            <div
              class="task-list-title"
              style="border-top: 1px solid rgba(255, 255, 255, 0.3)"
            >
              Partner Tasks
            </div>
            <v-row no-gutters style="gap: 18px 0">
              <v-col
                v-for="(item, index) in tasksLists_partner_without_done"
                :key="item.actId"
                cols="12"
                v-show="
                  item.deployOn == 'all' ||
                  (item.deployOn == 'pc' && !isTgMiniApp) ||
                  (item.deployOn == 'tg' && isTgMiniApp)
                "
              >
                <div class="task-item-box">
                  <div class="task-item-left" @click="handleTitle(item)">
                    <img class="task-item-image" :src="item.icon" alt="" />
                    <div class="task-text-box">
                      <div class="task-name">{{ item.actName }}</div>
                      <div class="task-desc">{{ item.description }}</div>
                    </div>
                  </div>

                  <div class="task-item-right">
                    <v-btn
                      v-if="
                        item.actStatus !== 'DONE' &&
                        item.extra.buttonName == 'Go' &&
                        item.actType == 'daily_invite'
                      "
                      class="go-btn"
                      width="84"
                      @click="stepNext(item, index, 'partner')"
                      v-clipboard="inviteInfo.link"
                      @success="() => $toast2('Copied!', 'success')"
                      >Go</v-btn
                    >
                    <v-btn
                      v-else-if="item.actStatus !== 'DONE'"
                      :class="
                        item.extra.buttonName == 'Go' ? 'go-btn' : 'drawer-btn'
                      "
                      width="84"
                      :loading="false || loadingStatus[item.actId]"
                      @click="stepNext(item, index, 'partner')"
                    >
                      <span>{{ item.extra.buttonName }}</span>
                    </v-btn>

                    <v-btn
                      v-if="item.actStatus == 'DONE'"
                      class="done-btn"
                      width="84"
                      >Done</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- done task -->
          <div v-if="completedTaskList.length > 0" style="margin: 12px 0">
            <div
              class="task-list-title"
              style="border-top: 1px solid rgba(255, 255, 255, 0.3)"
            >
              Completed Tasks
            </div>

            <v-row no-gutters style="gap: 18px 0">
              <v-col
                v-for="item in completedTaskList"
                :key="item.actId"
                cols="12"
                v-show="
                  item.deployOn == 'all' ||
                  (item.deployOn == 'pc' && !isTgMiniApp) ||
                  (item.deployOn == 'tg' && isTgMiniApp)
                "
              >
                <div class="task-item-box">
                  <div class="task-item-left" @click="handleTitle(item)">
                    <img class="task-item-image" :src="item.icon" alt="" />
                    <div class="task-text-box">
                      <div class="task-name">{{ item.actName }}</div>
                      <div class="task-desc">{{ item.description }}</div>
                    </div>
                  </div>

                  <div class="task-item-right">
                    <v-btn class="done-btn" width="84">Done</v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import {
  fetchDailySign,
  fetchTasks,
  onNext,
  fetchTasks_One,
  fetchPartner_Tasks,
} from "@/api/booster.js";
import { bus } from "@/utils/bus";
import { fetchInviteInfo, fetchTgInviteInfo } from "@/api/booster";
import { clickAds } from "@/api/ton-ads";
// import { connectOkxWallet } from "@/pages/booster/components/wallet-connect.js";
import { postEvent } from "@telegram-apps/sdk";

import { TonAdInit, GetMultiTonAd, TonAdPopupShow } from "ton-ai-sdk";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["showTaskDrawer", "boostLocked"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    isAndroid() {
      return this.$tg.platform == "android";
    },
    completedTaskList() {
      let completedTaskList = this.tasksLists
        .concat(this.tasksLists_one)
        .concat(this.tasksLists_partner);
      completedTaskList = completedTaskList.filter(
        (it) => it.actStatus == "DONE"
      );
      return completedTaskList;
    },
    tasksLists_one_without_done() {
      return this.tasksLists_one.filter((it) => it.actStatus != "DONE");
    },
    tasksLists_without_done() {
      return this.tasksLists.filter((it) => it.actStatus != "DONE");
    },

    tasksLists_partner_without_done() {
      return this.tasksLists_partner.filter((it) => it.actStatus != "DONE");
    },
  },
  data() {
    return {
      signList: [],
      dailyTaskList: [],
      tasksLists: [],
      tasksLists_one: [],
      tasksLists_partner: [],
      signDays: 0,
      signed: false,
      inviteInfo: {
        daily: "-",
        inviteCode: "-",
        invited: "-",
        link: "-",
      },
      loadingStatus: {},
      okxUniversalProvider: null,
      tonAds: [],
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

  async mounted() {
    TonAdInit({
      appId: "670a71808f26dee225e26a86",
    });
    await this.getMultiTOnAdd();
  },
  methods: {
    async getDailySign() {
      const { data } = await fetchDailySign();

      this.dailyTaskList = data.items;
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

      this.checkUndo();
    },
    async getTasks() {
      const { data } = await fetchTasks();
      const { data: datas } = await fetchTasks_One();
      const { data: partnerTaskData } = await fetchPartner_Tasks();
      this.tasksLists = data.items.filter((it) => {
        if (
          it.deployOn == "all" ||
          (it.deployOn == "pc" && !this.isTgMiniApp) ||
          (it.deployOn == "tg" && this.isTgMiniApp)
        ) {
          return it;
        }
      });
      this.tasksLists_one = datas.items.filter((it) => {
        if (
          it.deployOn == "all" ||
          (it.deployOn == "pc" && !this.isTgMiniApp) ||
          (it.deployOn == "tg" && this.isTgMiniApp && this.isAndroid) ||
          (it.deployOn == "tg" &&
            this.isTgMiniApp &&
            !this.isAndroid &&
            it.actType != "save_home_screen")
        ) {
          return it;
        }
      });

      this.tasksLists_partner = partnerTaskData.items.filter((it) => {
        if (
          it.deployOn == "all" ||
          (it.deployOn == "pc" && !this.isTgMiniApp) ||
          (it.deployOn == "tg" && this.isTgMiniApp)
        ) {
          return it;
        }
      });
      this.checkUndo();
    },
    async stepNext(item, index, taskListType) {
      try {
        let _this = this;
        if (item.extra.buttonName == "Go") {
          if (item.actType == "okx_bind") {
            // await this.connectOkxWallet();
            this.stateTaskDrawerShow(false);
            this.$store.dispatch("ConnectDrawerState", { state: true });
          } else if (item.actType == "telegram_daily_share") {
            const oriDescriptionArr = item.oriDescription.split(";");
            let [media_url, text] = oriDescriptionArr;
            text += this.inviteInfo.link;
            this.shareOnTgStory(media_url, text);
          } else if (item.actType == "save_home_screen") {
            bus.$emit("showSaveToHomeEvent");
          } else if (item.actType == "bind_exchange_address") {
            bus.$emit("showBindExchangeEvent");
          } else {
            let url = item.oriDescription;
            if (item.actType == "share_twitter") {
              url += encodeURIComponent(this.inviteInfo.link);
            }
            url = url.replace(/^http:\/\//i, "https://");
            if (this.isTgMiniApp) {
              this.$tg.openAuto(url);
            } else {
              window.open(url);
            }
          }
        }
        if (item.extra.buttonName == "Check") {
          this.$set(this.loadingStatus, item.actId, true);
        }

        const id = item.actId;

        const { data } = await onNext(id);
        if (item.actType == "exchange_ads") {
          let inOut = item.adDescription.split(";");
          const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
          await clickAds(userId, inOut[0], inOut[1]);
        }

        this.$set(this.loadingStatus, item.actId, false);
        item.extra.buttonName = data.action.web.nextButtonName;
        if (taskListType == "daily") {
          this.$set(_this.tasksLists, index, item);
        } else if (taskListType == "one") {
          this.$set(_this.tasksLists_one, index, item);
        } else {
          this.$set(_this.tasksLists_partner, index, item);
        }

        //  const actType = data.actType;
        switch (data.action.web.next) {
          case "REDIRECT":
            if (this.isTgMiniApp) return this.$tg.openAuto(shareUrl);
            location.href = data.action.web.message;
            break;
          case "CLAIM":
            this.$toast2(data.action.web.message, "success");
            // this.getTasks();
            break;
          case "COMPLETE":
            this.getTasks();
            break;
          case "COPY":
            if (this.isTgMiniApp) {
              this.$tg.shareUrl(
                this.inviteInfo.link,
                "Embark on the exciting 4EVER Boost campaign to boost your $4EVER points and grab exciting upcoming airdrops!🚨"
              );
            }
            break;
          default:
            // this.getTasks();
            break;
        }
        this.$store.dispatch("getBoosterUserInfo");
      } catch (error) {
        console.log(error, "--------");
      }
    },
    async onSign() {
      if (!this.userInfo.wallet && !this.isTgMiniApp) {
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
      if (this.isTgMiniApp) {
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
    checkUndo() {
      const dailyUndo = this.dailyTaskList.filter((it) => {
        if (
          it.deployOn == "all" ||
          (it.deployOn == "pc" && !this.isTgMiniApp) ||
          (it.deployOn == "tg" && this.isTgMiniApp)
        ) {
          return it.actStatus == "UNDO" || it.actStatus == "CLAIM";
        }
      });

      const taskUndo = this.tasksLists.filter((it) => {
        if (
          it.deployOn == "all" ||
          (it.deployOn == "pc" && !this.isTgMiniApp) ||
          (it.deployOn == "tg" && this.isTgMiniApp)
        ) {
          return it.actStatus == "UNDO" || it.actStatus == "CLAIM";
        }
      });
      const taskOneUndo = this.tasksLists_one.filter((it) => {
        if (
          it.deployOn == "all" ||
          (it.deployOn == "pc" && !this.isTgMiniApp) ||
          (it.deployOn == "tg" && this.isTgMiniApp)
        ) {
          return it.actStatus == "UNDO" || it.actStatus == "CLAIM";
        }
      });
      const taskPartner = this.tasksLists_partner.filter((it) => {
        if (
          it.deployOn == "all" ||
          (it.deployOn == "pc" && !this.isTgMiniApp) ||
          (it.deployOn == "tg" && this.isTgMiniApp)
        ) {
          return it.actStatus == "UNDO" || it.actStatus == "CLAIM";
        }
      });
      if (
        (dailyUndo.length ||
          taskUndo.length ||
          taskOneUndo.length ||
          taskPartner.length) &&
        !this.boostLocked
      ) {
        this.$store.commit("SET_BOOST_TASK_UNDO", true);
      } else {
        this.$store.commit("SET_BOOST_TASK_UNDO", false);
      }
    },
    handleTitle(it) {
      if (it.actType == "telegram_daily_share") {
        const oriDescriptionArr = it.oriDescription.split(";");
        let [media_url, text] = oriDescriptionArr;
        text += this.inviteInfo.link;
        this.shareOnTgStory(media_url, text);
        return;
      }

      if (it.actType == "save_home_screen") {
        bus.$emit("showSaveToHomeEvent");
        return;
      }
      if (it.actType == "bind_exchange_address") {
        bus.$emit("showBindExchangeEvent");
        return;
      }

      let url = it.oriDescription;
      if (it.actType == "share_twitter") {
        url += encodeURIComponent(this.inviteInfo.link);
      }
      if (this.isTgMiniApp) return this.$tg.openAuto(url);
      window.open(url);
    },
    async shareOnTgStory(media_url, text) {
      postEvent("web_app_share_to_story", { media_url, text });
    },

    async getMultiTOnAdd() {
      try {
        const { ads } = await GetMultiTonAd("6784b61a1dc5294b8f00272f", 5);
        if (ads && ads.length > 0) {
          this.tonAds = ads.map((it) => {
            return {
              ...it,
              load: false,
              buttonText: "Go",
            };
          });
        }
      } catch (err) {
        console.log(err);
      }
    },

    async showPopupAdd(tonAd) {
      const i = this.tonAds.findIndex((ad) => {
        return ad.adId == tonAd.adId;
      });
      this.tonAds[i].load = true;
      let timer = setTimeout(() => {
        this.$set(this.tonAds, i, {
          ...this.tonAds[i],
          load: false,
          buttonText: "done",
        });
        this.$toast2("completed", "success");
        const isCompleted =
          this.tonAds.map((it) => {
            return it.buttonText == "Go";
          }).length == 0;

        if (isCompleted) {
          this.getMultiTOnAdd();
        }
      }, 15000);

      TonAdPopupShow({
        tonAd,
        onAdClick: (ad) => {
          console.log("Ad clicked:", ad);
        },
        onAdError: (error) => {
          console.error("Ad error:", error);
        },
        onAdClose: () => {
          this.tonAds[i].load = false;
          clearTimeout(timer);
          this.showTaskDrawer = true;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .task-name {
    font-size: 14px;
  }
}

.task-list-title {
  padding: 16px 0;
  font-size: 16px;
  text-shadow: 0px 0px 8px #6172f3;
  font-weight: 700;
  color: #fff;
}
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
  border-radius: 21px;
  background: #31383f !important;
  color: #fff !important;
  cursor: not-allowed;
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
      // border-bottom: 1px solid rgba(255, 255, 255, 0.3);

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
    // padding: 24px 0;
    .task-item-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .task-item-left {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        .task-item-image {
          width: 44px;
          border-radius: 100%;
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
            color: #a4bcfd;
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
        // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
  .col-md-15 {
    width: 20%;
    max-width: 20%;
  }
}
</style>
