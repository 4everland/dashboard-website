<template>
  <div class="spin-container">
    <div class="containerin">
      <div class="nav-bar">
        <div class="nav-mobile d-flex align-center justify-space-between">
          <div class="logo d-flex align-center" @click="backtoindex">
            <img src="/img/booster/spin/chevron-left.png" width="24" alt="" />
          </div>
          <div class="mobile-title fz-16 font-weight-bold">
            Points Swap
          </div>
          <div class="d-flex align-center">
            <div class="spin-rules" @click="opendialog">Rule</div>
          </div>
        </div>
      </div>
      <div class="congratulations-users d-flex align-center justify-center">
        <img src="/img/booster/spin/congratulations.png" width="24" alt="" />
        <div>
          Congrats <span style="font-weight: 700">ergou!</span> Swapped 100
          points for
          <span style="font-weight: 700; font-style: italic; font-size: 16px">
            $0.1.
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
          <div class="spin-header-number">${{ spinStartInfo.cashValue }}</div>
          <div class="spin-header-tips">Available For Swap</div>
        </div>
        <div class="spin-content">
          <div class="spin-content-header-bg">
            <div
              class="d-flex align-center justify-space-between spin-content-topheader"
            >
              <div class="d-flex justify-center flex-column">
                <div class="d-flex align-center">Swap eligibility</div>
                
                <div class="d-flex align-center"><img src="/img/booster/spin/icon_point.png" width="16" alt="" /> <span class="font-16 mr-1">{{ spinStartInfo.currentDuration }} </span> Points</div>
              </div>
              <div class="d-flex justify-center flex-column spin-content-top-right">
                <div class="d-flex align-center">Points Quote</div>
                <div class="progress-content">
                  <div class="progress">
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
                      src="/img/booster/spin/spin-coin-progress.png"
                      height="26"
                      alt=""
                    />
                  </div>
                </div>
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
              >
                <div class="font-weight-bold">Spin</div>
                <div class="spin_left_time">{{ spinStartInfo.remainSpins }} Time</div>
              </div>
            </div>
          </div>

          <div class="spin-content-footer">
            <div>Reset countdown</div>
            <div class="countdown">
              <count-down
              :endTimeStamp="spinStartInfo.endAt"
            ></count-down>
            </div>
          </div>

          <div class="mt-4">
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
          </div>
        </div>
        <div class="spin-footer-swapList">
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
              <tr>
                <td class="text-center">aaa</td>
                <td class="text-center">123</td>
                <td class="text-center">2024-10-25</td>
              </tr>
            </tbody>
          </v-simple-table>
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
    <RewardOpenReceived v-model="showRewardReceive" @openStartNext="showRewardClaim = true"></RewardOpenReceived>
    <RewardOpenClaim v-model="showRewardClaim"></RewardOpenClaim>
    <SpinStartReward v-model="showStartClaim" @openStartNext="handleStartNext"></SpinStartReward>
    <SpinPlayReward v-model="showPlayReward"></SpinPlayReward>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import BoosterPagination from "../components/booster-pagination.vue";
import { fetchLeaderboard } from "@/api/booster";
import countDown from "../components/count-down.vue";
import SpinSwapped from "../components/spin-swapped.vue";
import SpinSorry from "../components/spin-sorry.vue";
import SpinInvite from "../components/spin-invite.vue";
import RewardOpenReceived from "../components/reward-open-received.vue";
import RewardOpenClaim from "../components/reward-open-claim.vue";
import SpinStartReward from "../components/spin-start-reward.vue"
import SpinPlayReward from "../components/spin-play-reward.vue"

import { fetchSpinStart, playSpin, fetchClaimList, claimSpinReward } from "@/api/booster";

export default {
  components: {
    RewardOpenReceived,
    RewardOpenClaim,
    SpinStartReward,
    SpinSwapped,
    SpinSorry,
    SpinInvite,
    SpinPlayReward,
    countDown
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
      spinStartInfo: (s) => s.moduleBooster.spinStartInfo,
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
  data() {
    return {
      dialog: false,
      showRewardReceive: false,
      showRewardClaim: false,
      showStartClaim: false,
      showPlayReward: false,
      showSwapped:false,
      showSpinSorry: false,
      showInvite: false,
      claimList:[],
      blocks: [
        {
          imgs: [{
            src: '/img/booster/spin/bg.png',
            width: '100%',
            height: '100%',
            rotate: true
          }]
        },
      ],
      prizes: [
        { title: '0' },
        { title: '1' },
        { title: '2' },
        { title: '3' },
        { title: '4' },
        { title: '5' },
      ],
      buttons: [{
        radius: '45%',
        imgs: [{
            src: '/img/booster/spin/spin-arrow.png',
            width: '80%',
            top: '-100%'
          }]
      }],
      defaultConfig: {
        offsetDegree: -30,
        accelerationTime: 1500,
        decelerationTime: 1500,
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      this.$store.dispatch("getInviteInfo");
      let info = this.userInfo.username ? this.userInfo.username.cutStr(6, 4): 'unknown'
      let spinFirstStep = localStorage.getItem('spinFirstStep'+info);
      if(spinFirstStep){
        this.showStartClaim = true
      }
      let spinInfo = localStorage.getItem('spinInfo'+info);
      if(spinInfo){
        this.$store.commit("SET_SPIN_INFO", JSON.parse(spinInfo));
      }
      this.getSpinHistory()
    },
    async startCallback () {
      this.$refs.myLucky.play()
      let taskId = this.spinStartInfo.taskId
      const { data } = await playSpin(taskId);
      this.$store.commit("SET_SPIN_INFO", data);
     // console.log('reward',data.reward)
    //  const data = {
    //   reward:{
    //     'rewardType': "points",
    //     'rewardValue': "20"
    //   }
    //  }
      this.$store.commit("SET_SPIN_PLAYREWARD", data.reward);
      let index = 0
      if(data.reward.rewardType == 'spin'){
        index = 0
      } else {
        index = 1
      }
      console.log('index',data.reward)
      this.$refs.myLucky.stop(index)
      await this.$sleep(3000);
      this.showPlayReward = true
     
      
      // setTimeout(() => {
      //   // 假设后端返回的中奖索引是0
      //   const index = 0
      //   // 调用stop停止旋转并传递中奖索引
        
      // }, 2000)
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log(prize);
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
    handleStartNext () {
      this.showStartClaim = false
      this.showRewardReceive = true
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
    async getSpinHistory() {

      const { data } = await fetchClaimList();
      this.claimList = data;
    }
    
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
  .nav-mobile{
    height: 64px;
  }
  .containerin {
    background-image: url("/img/booster/spin/background_pattern.png");
    background-repeat: repeat-x;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0px 24px;
  }
  .congratulations-users {
    position: absolute;
    height: Hug (40px);
    top: 52px;
    left: 8px;
    right: 8px;
    padding: 8px 16px 8px 16px;
    gap: 4px;
    border-radius: 8px;
    opacity: 0px;
    z-index: 3;
    background: linear-gradient(97.34deg, #ffde7f 29.43%, #ffad08 55.71%),
      linear-gradient(0deg, #ffde7f, #ffde7f);
    color: #000;
    font-size: 12px;
  }
  .spinwrap {
    width: 100%;
    margin-top: 25px;
  }
  .nav-bar {
    height: 64px;
    .spin-rules {
      width: 47px;
      height: 23px;
      font-family: "Inter", sans-serif;
      font-size: 12px;
      font-weight: 400;
      background: #12153680;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      margin-right: -25px;
      text-align: center;
      line-height: 23px;
   }

  }
  .spin-header {
    background: linear-gradient(142.14deg, #f5f8ff 9.63%, #c7d7fe 59.92%);
    border: 4px solid #2d31a640;
    backdrop-filter: blur(39.5px);
    height: 244px;
    border-radius: 24px;
    position: relative;
    margin: 0 10px;
    .spin-header-img {
      margin-top: -30px;
    }
    .spin-header-name{
      background: #6172F3;
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
      font-size: 32px;
      font-family: "Inter", sans-serif;
      font-style: italic;
      font-weight: 700;
      color: #ffde7f;
      text-align: center;
      text-shadow: 1px 2px 0px #ff9408;
    }
    .spin-header-tips {
      text-align: center;
      color: #121536;
    }
  }
  .spin-content {
    width: 100%;
    height: 512px;
    position: relative;
    top: -100px;
    background: linear-gradient(
        180deg,
        rgba(57, 59, 62, 0.9) 25.52%,
        rgba(36, 39, 42, 0.9) 100%
      ),
      #4c5277;
    background-blend-mode: overlay;
    border-radius: 24px;
    padding: 20px 18px;
    .spin-content-header-bg {
      height: 46px;
      margin: 0 20px;
      background: #1102fc80;
      position: relative;
      padding: 0 20px;
      font-size: 12px;
    }
    .spin-content-topheader {
      height: 100%;
      .font-16 {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .spin-content-header-bg::before {
      content: "";
      position: absolute;
      width: 43px;
      height: 46px;
      background: url("/img/booster/spin/icon_left.png");
      background-size: cover;
      margin-left: -20px;
      left: 0;
      z-index: 1;
    }
    .spin-content-header-bg::after {
      content: "";
      position: absolute;
      width: 43px;
      height: 46px;
      background: url("/img/booster/spin/icon_right.png");
      background-size: cover;
      z-index: 1;
      right: -20px;
      top: 0;
    }
  }
  .spin-content-top-right {
    min-width: 114px;
  }
  .progress-content {
    position: relative;
    height: 20px;
    border-radius: 12px;
    padding: 0 4px;
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
        right: -1%;
        top: -87%;
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
    width: 108px;
    height: 24px;
    border-radius: 16px;
    background-color: #ffde7f40;
    color: #ffde7f;
    font-size: 14px;
    display: inline-block;
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
    background: linear-gradient(180deg, rgba(57, 59, 62, 0.9) 25.52%, rgba(36, 39, 42, 0.9) 100%), #4C5277;
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
