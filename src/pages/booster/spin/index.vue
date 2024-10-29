<template>
  <div class="spin-container">
    <div class="containerin">
      <div class="nav-bar">
        <div
          class="nav-mobile d-flex align-center justify-space-between"
        >
          <div class="logo d-flex align-center" @click="backtoindex">
            <img src="/img/booster/spin/chevron-left.png" width="24" alt="" />
          </div>
          <div class="mobile-title fz-16">
            Points Swap
          </div>
          <div class="d-flex align-center">
            <div class="spin-rules" @click="opendialog">
              Rule
            </div>
          </div>
        </div>
      </div>
      <div class="spinwrap">
        
        <div class="spin-header">
          <div class="d-flex align-center justify-center spin-header-img">
            <div class="d-flex justify-center flex-column">
              <div class="text-center">
                <img src="/img/booster/spin/Maskgroup.png" width="68" alt="" />
              </div>
              <div class="spin-header-name">
                xxxsdfasdf
              </div>
            </div>
            
          </div>
          <div class="spin-header-number">$0.1</div>
          <div class="spin-header-tips">Available For Swap</div>
        </div>
        <div class="spin-content">
          <div class="spin-content-header-bg">
            <div class="d-flex align-center justify-space-between spin-content-topheader ">
              <div class="d-flex justify-center flex-column">
                <div class="d-flex align-center">
                  Swap eligibility
                </div>
                <div class="d-flex align-center"><img src="/img/booster/spin/icon_point.png" width="16" alt="" /> <span class="font-16">998 </span> Points</div>
              </div>
              <div class="d-flex justify-center flex-column">
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
                      src="/img/booster/progress-hot.png"
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
              width="300px"
              height="300px"
              :prizes="prizes"
              :blocks="blocks"
              :buttons="buttons"
              @end="endCallback"
            />
            <div class="luck_button" @click="startCallback">
              <div class="d-flex align-center justify-center flex-column luck_button_wrap">
                <div class="font-weight-bold">Spin</div>
                <div class="spin_left_time">20 Time</div>
              </div>
            </div>
          </div>

          <div class="spin-content-footer">
            <div>Reset countdown</div>
            <div class="countdown">23:56:13</div>
          </div>

          <div class="mt-4">
            <div class="invite-detail d-flex align-center">
              <v-btn
                class="invite-act-btn flex-1"
                height="48"
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
                <td class="text-center">
                  123
                </td>
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
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Swap Rules</v-toolbar-title>

        </v-toolbar>
        <v-list class="rulelist">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Points Swap</v-list-item-title>
              <div>Everyone can exchange their $4EVER Points for TON based on their allocated Point Quota. The more points you accumulate, the more TON you can swap.</div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Point Quota</v-list-item-title>
              <div>The Point Quota specifies how many Points can be exchanged for TON. There 
are three tiers: 100, 500, and 1000 Points, with an exchange rate of 
100 Points = $0.10. The Quota is valid for 24 hours before they expire.
</div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Spin</v-list-item-title>
              <div>You earn one ‘Spin’ for each friend you successfully invite to join 4EVER Boost 

during the each Points Swap round. After each round, your invites will reset.
</div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>TON</v-list-item-title>
              <div>The amount you receive when exchanging Points may vary due to the fluctuating value of TON, reflecting the actual amount credited to your account.</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <SpinSwapped v-model="showSwapped"></SpinSwapped>
    <SpinSorry v-model="showSpinSorry"></SpinSorry>
    <SpinInvite v-model="showInvite"></SpinInvite>
    <RewardOpenReceived v-model="showRewardReceive"></RewardOpenReceived>
    <RewardOpenClaim v-model="showRewardClaim"></RewardOpenClaim>
    <SpinStartReward v-model="showStartClaim" @openStartNext="handleStartNext"></SpinStartReward>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BoosterPagination from "../components/booster-pagination.vue";
import { fetchLeaderboard } from "@/api/booster";
import SpinSwapped from "../components/spin-swapped.vue";
import SpinSorry from "../components/spin-sorry.vue";
import SpinInvite from "../components/spin-invite.vue";
import RewardOpenReceived from "../components/reward-open-received.vue";
import RewardOpenClaim from "../components/reward-open-claim.vue";
import SpinStartReward from "../components/spin-start-reward.vue"

export default {
  components: {
    RewardOpenReceived,
    RewardOpenClaim,
    SpinStartReward,
    SpinSwapped,
    SpinSorry,
    SpinInvite
  },
  data () {
    return {
      dialog: false,
      showRewardReceive: false,
      showRewardClaim: false,
      showStartClaim: true,
      copyValue:'',
      showSwapped:false,
      showSpinSorry: false,
      showInvite: false,
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
      { title: '6' },
      { title: '7' },
    ],
      buttons: [{
        radius: '45%',
        imgs: [{
            src: '/img/booster/spin/spin-arrow.png',
            width: '80%',
            top: '-100%'
          }]
        }]
        // {
        //   fonts: [{ text: 'Spin\n20 Time', top: '-20px', fontSize: '12px', fontWeight: '700', fontColor: '#ffffff' }]
        // }],
    }
  },
  methods: {
    // 点击抽奖按钮会触发star回调
    startCallback () {
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play()
      // 模拟调用接口异步抽奖
      setTimeout(() => {
        // 假设后端返回的中奖索引是0
        const index = 0
        // 调用stop停止旋转并传递中奖索引
        this.$refs.myLucky.stop(index)
      }, 3000)
    },
    // 抽奖结束会触发end回调
    endCallback (prize) {
      console.log(prize)
    },
    opendialog(){
      this.dialog = true
    },
    backtoindex() {
      this.$router.push('/boost');
    },
    handleStartNext () {
      this.showStartClaim = false
      this.showRewardReceive = true
    }
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
}
.spin-container {
  background: linear-gradient(180deg, #6172F3 0%, #3538CD 100%), linear-gradient(159.56deg, rgba(211, 212, 213, 0.35) 1.7%, rgba(139, 145, 147, 0.35) 94.8%);
  position: relative;
  width: 100%;
  height: 100%;
  .nav-mobile{
    height: 45px;
  }
  .containerin {
    background-image: url("/img/booster/spin/background_pattern.png");
    background-repeat: repeat-x;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0px 24px;
  }
  .spinwrap{
    width: 100%;
  }
  .nav-bar {
    height: 64px;
    .spin-rules{
      width: 47px;
      height: 23px;
      background: #12153680;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      margin-right:-25px;
      text-align: center;
   }
  }
  .spin-header {
    background: linear-gradient(142.14deg, #F5F8FF 9.63%, #C7D7FE 59.92%);
    border: 4px solid #2D31A640;
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
      height: 20px;
      border-radius: 25px;
      padding: 0 10px;
      line-height: 100%;
      margin-top: -20px;
    }
    .spin-header-number{
      font-size: 32px;
      font-family: "Inter", sans-serif;
      font-style: italic;
      font-weight: 700;
      color: #FFDE7F;
      text-align: center;
      text-shadow: 1px 2px 0px #FF9408;

    }
    .spin-header-tips{
      text-align: center;
      color: #121536;
    }
  }
  .spin-content {
    width: 100%;
    height: 512px;
    position: relative;
    top: -100px;
    background: linear-gradient(180deg, rgba(57, 59, 62, 0.9) 25.52%, rgba(36, 39, 42, 0.9) 100%), #4C5277;
    background-blend-mode: overlay;
    border-radius: 24px;
    padding: 20px;
    .spin-content-header-bg {
      height: 46px;
      margin: 0 20px;
      background: #1102FC80;
      position: relative;
      padding: 0 20px;
      font-size: 12px;
    }
    .spin-content-topheader {
      height: 100%;
      .font-16{
        font-size: 16px;
        font-weight: bold;
      }
    }
    .spin-content-header-bg::before{
      content: '';
      position: absolute;
      width: 43px;
      height: 46px;
      background: url("/img/booster/spin/icon_left.png");
      background-size: cover;
      margin-left:-20px;
      left: 0;
      z-index: 1;

    }
    .spin-content-header-bg::after{
      content: '';
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
  .progress-content {
    position: relative;
    height: 20px;
    border-radius: 12px;
    border: 4px solid #041f44;
    background: #17191d;
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
  .countdown{
    width: 108px;
    height: 24px;
    border-radius: 16px;
    background-color: #FFDE7F40;
    color: #FFDE7F;
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
      background: linear-gradient(315.05deg, #1102FC 3.4%, #0FE1F8 92.46%);
    }
    .invite-act-copy {
      width: 48px;
      height: 48px;
      min-width: 48px;
      background: #1102FC;
      border-radius: 24px;
    }
  }
  .spin-footer-swapList{
    width: 100%;
    min-height: 200px;
    
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
  .luckWrap{
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
.ruleDialog{
  background: linear-gradient(180deg, rgba(57, 59, 62, 0.9) 25.52%, rgba(36, 39, 42, 0.9) 100%);
  background-blend-mode: overlay;
  background: #4C5277;
  .rulelist{
    background: transparent;
    color: #fff;
  }
}

</style>
