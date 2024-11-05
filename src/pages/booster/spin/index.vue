<template>
  <div class="spin-container">
    <div class="containerin">
      <div class="nav-bar">
        <div class="nav-mobile d-flex align-center justify-space-between">
          <div class="logo d-flex align-center" @click="backtoindex">
            <img src="/img/booster/spin/chevron-left.png" width="24" alt="" />
          </div>
          <div class="mobile-title fz-16 font-weight-bold">Points Swap</div>
          <div>
            <div class="spin-rules d-flex justify-center align-center" @click="opendialog">
              <img
                src="/img/booster/spin/rules-icon.svg"
                width="16"
                alt=""
              /> &nbsp;Rules
            </div>
          </div>
        </div>
      </div>
      <div
        class="congratulations-users d-flex align-center justify-center"
        :class="currentclass"
        v-if="list.length > 0"
      >
        <img src="/img/booster/spin/congratulations.png" width="24" alt="" />
        <div>
          Congrats
          <span style="font-weight: 700"
            >{{ (current.username || "unkown").cutStr(4, 4) }}!</span
          >
          Swapped {{ current.amount * 1e3 }}
          points for
          <span style="font-weight: 700; font-style: italic; font-size: 16px">
            ${{ current.amount }}
          </span>
        </div>
      </div>
      <div class="spinwrap">
        <div class="spin-header">
          <div class="d-flex align-center justify-center spin-header-img">
            <div class="d-flex justify-center flex-column">
              <div class="d-flex justify-center">
                <e-team-avatar
                  :src="userInfo.avatar"
                  :size="68"
                  :uid="userInfo.uid"
                ></e-team-avatar>
              </div>
              <div class="spin-header-name">
                {{ (userInfo.username || "unkown").cutStr(6, 4) }}
              </div>
            </div>
          </div>
          <div class="spin-header-tips fz-14">
            <span class="spin-header-number"
              >${{ spinStartInfo.cashValue }}</span
            >
            available, more point quota required
          </div>
          <div class="spin-header-number-short point_pulse">
            <ICountUp
                  class="points mx-1"
                  :delay="1000"
                  :endVal="shortPoint"
                  :options="{
                    useEasing: true,
                    useGrouping: true,
                    decimalPlaces: 1,
                    separator: ',',
                    decimal: '.',
                    prefix: '',
                    suffix: '',
                  }"
                />
            <!-- {{
              (spinStartInfo.duration * 10 -
                spinStartInfo.currentDuration * 10) /
              10
            }} -->
          </div>
          <div
            class="d-flex align-center justify-space-between spin-header-quota"
          >
            <div class="d-flex justify-center flex-column">
              <div class="d-flex align-center fz-12">Point Quota Earned</div>

              <div class="d-flex align-center justify-center">
                <span class="font-14 mr-1 quota-left"
                  >
                  <ICountUp
                  class="points mx-1"
                  :delay="1000"
                  :endVal="currentPoint"
                  :options="{
                    useEasing: true,
                    useGrouping: true,
                    decimalPlaces: 1,
                    separator: ',',
                    decimal: '.',
                    prefix: '',
                    suffix: '',
                  }"
                />
                </span>
              </div>
            </div>
            <div
              class="d-flex justify-center flex-column spin-content-top-right"
            >
              <div class="d-flex align-center fz-12">Point Quota Required</div>
              <div class="d-flex align-center justify-center">
                <span class="font-16 mr-1 quota-right"
                  >{{
                    (spinStartInfo.duration * 10 -
                      spinStartInfo.currentDuration * 10) /
                    10
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="spin-content">
          <div class="spin-content-header-bg">
            <div
              class="d-flex align-center justify-center spin-content-topheader"
            >
              <div style="width: 80%">
                <div class="d-flex justify-start align-center">
                  <img
                    src="/img/booster/spin/spin-icon.png"
                    width="16"
                    alt=""
                  />
                  <div class="chip-text">{{ spinStartInfo.duration }}</div>
                </div>
                <div class="d-flex align-center spin-content-pro">
                  <div class="progress-content">
                    <div class="progress" :style="{ width: percent + '%'}" >
                      <img
                        style="border-radius: 12px"
                        class="d-b"
                        width="100%"
                        src="/img/booster/4ever-token-progress-mask.png"
                        height="12"
                        alt=""
                      />
                      <div class="zebra-stripe-content"></div>

                      <img
                        class="hot-icon"
                        src="/img/booster/progress-hot.png"
                        height="32"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex align-center cash-value">
                ${{ spinStartInfo.cashValue }}
              </div>
            </div>
          </div>
          <div class="luckWrap d-flex justify-center">
            <LuckyWheel
              ref="myLucky"
              width="295px"
              height="295px"
              :prizes="prizes"
              :blocks="blocks"
              :buttons="buttons"
              :default-config="defaultConfig"
              @end="endCallback"
            />
            <div class="luck_button" @click="startCallback">
              <div
                class="d-flex align-center justify-center flex-column luck_button_wrap"
                v-if="percent < 100"
              >
                <div class="luck_button_tips" v-if="spinStartInfo.remainSpins>0">
                  {{ spinStartInfo.remainSpins }}
                </div>
                <div class="font-weight-bold">Spin</div>
                <div class="spin_left_time">
                  {{ spinStartInfo.remainSpins }} Time
                </div>

                <div class="luck_button_hands" v-if="spinStartInfo.remainSpins>0">
                  <img
                    class="luck_button_hands_img updown"
                    src="/img/booster/spin/icon_hands.png"
                    width="37"
                    height="40"
                    alt=""
                  />
                </div>
                <div class="luck_button_point" v-show="showpoint">
                  <img
                    class="luck_button_point_img coin_fly"
                    src="/img/booster/spin/icon_Points_Quota.png"
                    width="37"
                    height="40"
                  >
                </div>
              </div>
              <div
                class="d-flex align-center justify-center flex-column luck_button_wrap"
                v-if="percent >= 100"
              >
                <div class="font-weight-bold">Swap</div>
              </div>
            </div>
          </div>

          <div class="d-flex align-center justify-center spin-content-footer" v-if="!taskEnd">
            <div>Reset countdown</div>
            <div class="countdown">
              <count-down
                :endTimeStamp="spinStartInfo.endAt"
                @timeOver="timeOver"
              ></count-down>
            </div>
          </div>

          <div class="mt-4 inviteWrap">
            <div class="invite-detail d-flex align-center">
              <v-btn
                class="invite-act-btn flex-1"
                height="48"
                @click="handleShare"
              >
                Invite new friends for more spins
              </v-btn>

              <v-btn
                class="invite-act-copy"
                width="48"
                height="48"
                v-clipboard="copyValue"
                @success="() => $toast2('Copied!', 'success')"
              >
                <img src="/img/booster/invite/copy.svg" width="24" alt="" />
              </v-btn>
            </div>
            <div class="invite_button_hands" v-if="spinStartInfo.remainSpins == 0">
              <img
                class="luck_button_hands_img updown"
                src="/img/booster/spin/icon_hands.png"
                width="37"
                height="40"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="spin-footer-swapList" v-if="false">
          <h3 class="tit">Swap List</h3>
          <v-simple-table class="swap-list-table mt-1">
            <thead>
              <tr>
                <th class="text-center">Username</th>
                <th class="text-center">Amount</th>
                <th class="text-center">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in list" :key="i">
                <td class="text-center">{{ item.username.cutStr(4, 4) }}</td>
                <td class="text-center">${{ item.amount }}</td>
                <td class="text-center">
                  {{ new Date(item.claimAt * 1000).format() }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <booster-pagination
            v-show="list.length != 0"
            :total-visible="5"
            :length="totalPages"
            class="my-5"
            v-model="page"
            @input="getList"
          ></booster-pagination>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="ruleDialog">
        <v-toolbar dark class="ruleDialog-toolbar">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Swap Rules</v-toolbar-title>
        </v-toolbar>
        <v-list class="rulelist">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title"
                >Points Swap</v-list-item-title
              >
              <div class="swap-rule-content">
                Everyone can exchange their $4EVER Points for TON based on their
                allocated Point Quota. The more points you accumulate, the more
                TON you can swap.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title"
                >Point Quota</v-list-item-title
              >
              <div class="swap-rule-content">
                The Point Quota specifies how many Points can be exchanged for
                TON. There are three tiers: 100, 500, and 1000 Points, with an
                exchange rate of 100 Points = $0.10. The Quota is valid for 24
                hours before they expire.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title"
                >Spin</v-list-item-title
              >
              <div class="swap-rule-content">
                You earn one ‘Spin’ for each friend you successfully invite to
                join 4EVER Boost during the each Points Swap round. After each
                round, your invites will reset.
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="swap-rule-title">TON</v-list-item-title>
              <div class="swap-rule-content">
                The amount you receive when exchanging Points may vary due to
                the fluctuating value of TON, reflecting the actual amount
                credited to your account.
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <SpinSwapped v-model="showSwapped"></SpinSwapped>
    <SpinSorry v-model="showSpinSorry"></SpinSorry>
    <SpinInvite v-model="showInvite"></SpinInvite>
    <RewardOpenReceived
      v-model="showRewardReceive"
      @openStartNext="showRewardClaim = true"
    ></RewardOpenReceived>
    <RewardOpenClaim v-model="showRewardClaim"></RewardOpenClaim>
    <SpinStartReward
      v-model="showStartClaim"
      @openStartNext="handleStartNext"
    ></SpinStartReward>
    <SpinPlayReward v-model="showPlayReward" @showpoint="doCoinAnim"></SpinPlayReward>
    <SpinEndSorry v-model="showSpinEndSorry"></SpinEndSorry>
    <SpinSwapAchieved v-model="showSwapAchieved" @openSwapDialog="handleSwap"></SpinSwapAchieved>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import BoosterPagination from "../components/booster-pagination.vue";
import countDown from "../components/count-down.vue";
import SpinSwapped from "../components/spin-swapped.vue";
import SpinSorry from "../components/spin-sorry.vue";
import SpinInvite from "../components/spin-invite.vue";
import RewardOpenReceived from "../components/reward-open-received.vue";
import RewardOpenClaim from "../components/reward-open-claim.vue";
import SpinStartReward from "../components/spin-start-reward.vue";
import SpinPlayReward from "../components/spin-play-reward.vue";
import SpinEndSorry from "../components/spin-end-sorry.vue";
import SpinSwapAchieved from "../components/spin-swap-achieved.vue";
import ICountUp from "vue-countup-v2";

import {
  fetchSpinStart,
  playSpin,
  fetchClaimList,
  claimSpinReward,
} from "@/api/booster";

export default {
  components: {
    RewardOpenReceived,
    RewardOpenClaim,
    SpinStartReward,
    SpinSwapped,
    SpinSorry,
    SpinInvite,
    SpinPlayReward,
    countDown,
    SpinEndSorry,
    BoosterPagination,
    SpinSwapAchieved,
    ICountUp
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
      spinStartInfo: (s) => s.moduleBooster.spinStartInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    percent() {
      const percent =
        this.spinStartInfo.currentDuration / this.spinStartInfo.duration;
      return percent * 100;
    },
    taskEnd() {
      const curTimeStamp = +new Date() / 1e3;
      return curTimeStamp > this.spinStartInfo.endAt;
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
    currentPoint() {
      if(this.spinStartInfo.currentDuration){
        return this.spinStartInfo.currentDuration
      } else {
        return 0
      }
      
    },
    shortPoint() {
      if(this.spinStartInfo.duration){
        return (this.spinStartInfo.duration * 10 -
          this.spinStartInfo.currentDuration * 10) / 10 ;
      } else {
        return 0
      }
      
    }
  },
  data() {
    return {
      dialog: false,
      showRewardReceive: false,
      showRewardClaim: false,
      showStartClaim: false,
      showPlayReward: false,
      showSwapped: false,
      showSpinSorry: false,
      showInvite: false,
      showSpinEndSorry: false,
      showSwapAchieved: false,
      showpoint: false,
      page: 1,
      size: 10,
      totalPages: 0,
      list: [],
      spinData: {},
      blocks: [
        {
          imgs: [
            {
              src: "/img/booster/spin/bg.png",
              width: "100%",
              height: "100%",
              rotate: true,
            },
          ],
        },
      ],
      prizes: [
        { title: "0" },
        { title: "1" },
        { title: "2" },
        { title: "3" },
        { title: "4" },
        { title: "5" },
      ],
      buttons: [
        {
          radius: "45%",
          imgs: [
            {
              src: "/img/booster/spin/spin-arrow.png",
              width: "80%",
              top: "-100%",
            },
          ],
        },
      ],
      defaultConfig: {
        offsetDegree: -30,
        accelerationTime: 1500,
        decelerationTime: 1500,
      },
      current: "",
      activeIndex: 0,
      currentclass: "hideItem",
      playing: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.$store.dispatch("getInviteInfo");
      let info = this.userInfo.username
        ? this.userInfo.username.cutStr(6, 4)
        : "unknown";
      const curTimeStamp = +new Date() / 1e3;
      if (
        this.spinStartInfo.claimAt == null &&
        curTimeStamp < this.spinStartInfo.endAt
      ) {
        const data = await fetchSpinStart();
        if (data.data) {
          this.$store.commit("SET_SPIN_INFO", data.data);
          localStorage.setItem("spinInfo" + info, JSON.stringify(data.data));
        } else {
          this.$toast2("Sorry, try it again later", "info");
        }
      }

      let spinFirstStep = localStorage.getItem("spinFirstStep" + info);
      if (spinFirstStep) {
        this.showStartClaim = true;
        localStorage.removeItem("spinFirstStep" + info);
      }
      let spinInfo = localStorage.getItem("spinInfo" + info);
      if (spinInfo) {
        this.$store.commit("SET_SPIN_INFO", JSON.parse(spinInfo));
      }
      this.getList();
      this.showNotice();
    },
    async startCallback() {
      let taskId = this.spinStartInfo.taskId;
      let info = this.userInfo.username
        ? this.userInfo.username.cutStr(6, 4)
        : "unknown";
      if (this.percent >= 100) {
        if (this.boosterInfo.totalPoint < this.spinStartInfo.duration) {
          this.showSpinSorry = true;
          return;
        }
        const curTimeStamp = +new Date() / 1e3;
        if (curTimeStamp > this.spinStartInfo.endAt) {
          this.showSpinEndSorry = true;
          return;
        }
        const res = await claimSpinReward(taskId);
        if (res.code == 200) {
          this.showSwapped = true;
        }
      } else {
        if (this.playing) return;
        this.playing = true;
        const data1 = await fetchSpinStart();
        if (data1.data) {
          this.$store.commit("SET_SPIN_INFO", data1.data);
          localStorage.setItem("spinInfo" + info, JSON.stringify(data1.data));
        } else {
          this.$toast2("Sorry, try it again later", "info");
          this.playing = false;
          return;
        }

        if (this.spinStartInfo.remainSpins == 0){
          this.showInvite = true;
          this.playing = false;
          return;
        }
        if(this.spinStartInfo.claimAt!= null){
          this.showSpinEndSorry = true;
          this.playing = false;
          return;
        }


        this.$refs.myLucky.play();
        const { data } = await playSpin(taskId);

        this.$store.commit("SET_SPIN_PLAYREWARD", data.reward);
        let index = 0;
        if (data.reward.rewardType == "spin") {
          index = 0;
        } else {
          index = 1;
        }
        this.$refs.myLucky.stop(index);
        await this.$sleep(3000);
        this.spinData = data;
        if (data.reward.rewardType == "spin") {
          this.saveData();
        }
        
        this.showPlayReward = true;
        this.playing = false;
      }
    },
    saveData(){
      let info = this.userInfo.username
        ? this.userInfo.username.cutStr(6, 4)
        : "unknown";
      this.$store.commit("SET_SPIN_INFO", this.spinData);
      localStorage.setItem("spinInfo" + info, JSON.stringify(this.spinData));
    },
    async handleShowSwapDialog() {
      if (this.percent >= 100){
        this.showSwapAchieved = true;
      }
    },
    async handleSwap() {
      let taskId = this.spinStartInfo.taskId;
      let info = this.userInfo.username
        ? this.userInfo.username.cutStr(6, 4)
        : "unknown";
      const data1 = await fetchSpinStart();
      if (data1.data) {
        this.$store.commit("SET_SPIN_INFO", data1.data);
        localStorage.setItem("spinInfo" + info, JSON.stringify(data1.data));
      } else {
        this.$toast2("Sorry, try it again later", "info");
      }
      if(data1.data.claimAt != null){
        this.showSpinEndSorry = true;
        return;
      }

      if (this.percent >= 100) {
        if (this.boosterInfo.totalPoint < this.spinStartInfo.duration) {
          this.showSpinSorry = true;
          return;
        }
        const curTimeStamp = +new Date() / 1e3;
        if (curTimeStamp > this.spinStartInfo.endAt) {
          this.showSpinEndSorry = true;
          return;
        }
        const res = await claimSpinReward(taskId);
        if (res.code == 200) {
          this.$store.commit("SET_CLAIMED_INFO", res.data);
          this.$store.dispatch("getBoosterUserInfo");
          this.showSwapped = true;
        }
      }
    },
    endCallback(prize) {
      // console.log(prize);
      // this.playing = false;
    },
    opendialog() {
      this.dialog = true;
    },
    backtoindex() {
      this.$router.push("/boost");
    },
    handleStartNext() {
      this.showStartClaim = false;
      this.showRewardReceive = true;
    },
    handleStartNext() {
      this.showStartClaim = false;
      this.showRewardReceive = true;
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
    async getList() {
      const { data } = await fetchClaimList();
      this.list = data;
    },
    timeOver() {
      let info = this.userInfo.username
        ? this.userInfo.username.cutStr(6, 4)
        : "unknown";
      localStorage.removeItem("spinInfo" + info);
      this.$router.push("/boost");
    },
    showNotice() {
      let nextIndex = 1;
      setInterval(() => {
        nextIndex = this.activeIndex + 1;
        if (nextIndex > this.list.length - 1) {
          nextIndex = 0;
        }
        this.currentclass = "hideItem";
        setTimeout(() => {
          this.currentclass = "infoshow";
          this.current = this.list[this.activeIndex];
          this.activeIndex = nextIndex;
        }, 1000);
      }, 5000);
    },
    doCoinAnim() {
      this.showpoint = true;
      setTimeout(() => {
        this.showpoint = false;
        this.$store.commit("SET_SPIN_PLAYREWARD", {});
        this.handleShowSwapDialog()
      }, 600);
      this.saveData();
      
    },
  },
};
</script>

<style lang="scss" src="../spin.scss"></style>
<style lang="scss" scoped>
@media screen and (max-width: 960px) {
}
.spin-container {
  background: linear-gradient(180deg, #6172f3 0%, #3538cd 100%),
    linear-gradient(
      159.56deg,
      rgba(211, 212, 213, 0.35) 1.7%,
      rgba(139, 145, 147, 0.35) 94.8%
    );
  position: relative;
  width: 100%;
  height: 100%;
  .nav-mobile {
    height: 64px;
  }
  .containerin {
    background-image: url("/img/booster/spin/background_pattern.png");
    background-repeat: repeat-x;
    position: relative;
    height: 100%;
    padding: 0px 24px;
  }
  .congratulations-users {
    position: absolute;
    height: 40px;
    top: 52px;
    left: 8px;
    right: 8px;
    padding: 8px 16px 8px 16px;
    gap: 4px;
    border-radius: 8px;
    z-index: 3;
    background: linear-gradient(97.34deg, #ffde7f 29.43%, #ffad08 55.71%),
      linear-gradient(0deg, #ffde7f, #ffde7f);
    color: #000;
    font-size: 12px;
  }
  .hideItem {
    display: none !important;
  }
  .spinwrap {
    width: 100%;
    margin-top: 20px;
  }
  .nav-bar {
    height: 64px;
    position: relative;
    .spin-rules {
      width: 67px;
      height: 23px;
      font-family: "Inter", sans-serif;
      font-size: 12px;
      font-weight: 400;
      background: #12153680;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      text-align: center;
      line-height: 23px;
      position: absolute;
      top: 20px;
      right: -24px;
    }
  }
  .spin-header {
    background: linear-gradient(0deg, #f5f8ff, #f5f8ff);
    border: 4px solid #2d31a640;
    backdrop-filter: blur(39.5px);
    height: 244px;
    border-radius: 24px;
    position: relative;
    margin: 0 10px;
    .spin-header-img {
      margin-top: -30px;
    }
    .spin-header-name {
      background: #6172f3;
      font-size: 12px;
      height: 20px;
      border-radius: 25px;
      padding: 0 10px;
      line-height: 20px;
      margin-top: -20px;
      position: relative;
      font-weight: bold;
    }
    .spin-header-number {
      font-size: 20px;
      font-family: "Inter", sans-serif;
      font-style: italic;
      font-weight: 700;
      color: #ffde7f;
      text-align: center;
      text-shadow: 1px 2px 0px #ff9408;
    }
    .spin-header-number-short {
      font-size: 48px;
      font-family: "Inter", sans-serif;
      font-style: italic;
      font-weight: 700;
      color: #ff9408;
      text-align: center;
      text-shadow: 1px 2px 0px #ffde7f;
    }
    .spin-header-tips {
      text-align: center;
      color: #121536;
    }
    .spin-header-quota {
      color: #667085;
      background-color: #c7d7fe;
      border-radius: 8px;
      height: 100px;
      margin: 0 20px;
      padding: 0 10px;
      .quota-left {
        color: #121536;
        margin-bottom: 45px;
      }
      .quota-right {
        color: #ff9408;
        margin-bottom: 45px;
        font-weight: 700;
      }
    }
  }
  .spin-content {
    height: 512px;
    position: relative;
    top: -50px;
    background: linear-gradient(
        180deg,
        rgba(57, 59, 62, 0.9) 25.52%,
        rgba(36, 39, 42, 0.9) 100%
      ),
      #4c5277;
    background-blend-mode: overlay;
    border-radius: 24px;
    padding: 15px 18px;
    .spin-content-header-bg {
      margin-top: 20px;
      height: 46px;
      background: linear-gradient(99.62deg, #ff3821 0%, #dc33d6 100%);
      position: relative;
      border-radius: 50px;
      padding: 0 10px;
      font-size: 12px;
    }
    .chip-text {
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
    }
    .cash-value {
      font-size: 24px;
      font-style: italic;
      font-weight: 700;
      line-height: 30px;
      color: #ffde7f;
    }
    .spin-content-topheader {
      margin-top: -16px;
      height: 100%;
      .spin-content-pro {
        min-width: 220px;
        width: 100%;
      }
      .font-16 {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .spin-content-top-right {
    min-width: 114px;
  }
  .progress-content {
    position: relative;
    height: 16px;
    border-radius: 12px;
    border: 2px solid #ffffff80;
    background: #17191d;
    width: 100%;
    .progress {
      position: absolute;
      width: 97%;

      .zebra-stripe-content {
        left: 0;
        top: 0;
        width: 100%;
        height: 12px;
        border-radius: 12px;
        position: absolute;
        background-image: url("/img/booster/zebra-stripe.png");
        background-repeat: repeat;
        animation: run 6s infinite linear;
      }

      .hot-icon {
        position: absolute;
        right: -3%;
        top: -120%;
      }
      @keyframes run {
        from {
          background-position-x: -100px;
        }

        to {
          /*left:500px;*/
        }
      }
    }
  }
  .spin-content-footer {
    text-align: center;
  }
  .countdown {
    width: 86px;
    height: 24px;
    margin-left:10px;
    border-radius: 16px;
    background-color: #ffde7f40;
    color: #ffde7f;
    display: inline-block;
  }
  .inviteWrap {
    position: relative;
    .invite_button_hands {
      position: absolute;
      top: 20px;
      left: 50%;
      z-index: 1;
      border-radius: 24px;
    }
  }
  .invite-detail {
    gap: 12px;
    .invite-act-btn {
      height: 48px;
      font-family: "Inter", sans-serif;
      font-size: 14px;
      color: #fff;
      letter-spacing: normal;
      border-radius: 24px;
      background: linear-gradient(315.05deg, #1102fc 3.4%, #0fe1f8 92.46%);
    }
    .invite-act-copy {
      width: 48px;
      height: 48px;
      min-width: 48px;
      background: #1102fc;
      border-radius: 24px;
    }
  }
  .spin-footer-swapList {
    width: 100%;
    min-height: 200px;
    margin-top: -80px;
    background: linear-gradient(
        180deg,
        rgba(57, 59, 62, 0.9) 25.52%,
        rgba(36, 39, 42, 0.9) 100%
      ),
      #4c5277;
    background-blend-mode: overlay;
    border-radius: 24px;
    padding: 20px;
    .swap-list-table {
      color: #fff !important;

      :deep th {
        border-bottom: 1px solid rgba(255, 255, 255, 0.25) !important;
        font-size: 12px !important;
        color: rgba(255, 255, 255, 0.75) !important;
      }
      :deep td {
        font-size: 12px;
        padding-left: 2px;
        padding-right: 2px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.25) !important;
      }

      :deep tbody tr.trigger {
        font-weight: bold;
        background: linear-gradient(
            rgba(97, 114, 243, 0) 19.38%,
            rgba(97, 114, 243, 0.25) 84.92%
          ),
          #121536 !important;
        td {
          border-bottom: 1px solid rgba(97, 114, 243, 0.5) !important;
        }
      }
      :deep tbody tr:hover {
        background: linear-gradient(
            rgba(97, 114, 243, 0) 19.38%,
            rgba(97, 114, 243, 0.25) 84.92%
          ),
          #121536 !important;
      }
      :deep tbody tr:hover td {
        border-bottom: 1px solid rgba(97, 114, 243, 0.5) !important;
      }
    }
  }
  .luckWrap {
    position: relative;
    width: 100%;
    height: 300px;
    :deep canvas {
      width: 295px !important;
      height: 295px !important;
      transform: scale(1) !important;
      overflow: hidden;
    }
    .luck_button {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      .luck_button_tips {
        width: 24px;
        height: 24px;
        border-radius: 24px;
        font-size: 12px;
        line-height: 16px;
        position: absolute;
        background: #f04438;
        text-align: center;
        color: #fff;
        padding: 4px;
        right: 0;
        top: 0;
      }
      .luck_button_point{
        position: absolute;
        top: -53px;
        right: 27%;
      }
      .luck_button_hands_img {
        position: absolute;
        right: 0;
        bottom: -10px;
      }
      .luck_button_wrap {
        height: 80px;
      }
      .spin_button_text {
        font-weight: bold;
      }
      .spin_left_time {
        font-size: 12px;
        color: #fff;
        text-align: center;
      }
    }
  }
}
.ruleDialog {
  background: linear-gradient(
      180deg,
      rgba(57, 59, 62, 0.9) 25.52%,
      rgba(36, 39, 42, 0.9) 100%
    ),
    #4c5277;
  background-blend-mode: overlay;
  color: #ffffff;
  .ruleDialog-toolbar {
    color: #fff;
    background: transparent;
    box-shadow: none;
    .v-toolbar__title {
      width: 80%;
      text-align: center;
    }
  }
  .swap-rule-title {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: #ffffff;
    font-weight: 700;
    position: relative;
    padding-left: 12px;
    line-height: 20px;
  }
  .swap-rule-title::before {
    content: "•";
    position: absolute;
    width: 20px;
    left: 0;
  }
  .swap-rule-content {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #ffffffbf;
  }
  .rulelist {
    background: transparent;
    color: #fff;
    .v-list-item {
      color: #fff;
    }
  }
}
</style>
