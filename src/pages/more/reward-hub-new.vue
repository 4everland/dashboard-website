<template>
  <div id="RewardHub">
    <div class="banner">
      <div class="banner-title">Reward Hub</div>
      <div class="points-box">
        <div class="num">{{ regexHandleNum(pointsTrack) }}</div>
        <div class="unit">Points Track</div>
        <img src="@/assets/imgs/reward_hub/icon_1.png" alt="" class="icon-1" />
        <img src="@/assets/imgs/reward_hub/icon_2.png" alt="" class="icon-2" />
      </div>
    </div>
    <div class="tasks-box daily-box">
      <div
        class="plan-box"
        :class="progressData.cur == 100 ? 'finished' : 'unfinished'"
      >
        <img src="@/assets/imgs/reward_hub/plan.png" alt="" class="icon-plan" />
        <div class="plan-text">
          <span class="plan-name">Daily Tasks</span>
          <span class="plan-time">Refresh at 0:00 UTC</span>
        </div>
        <div class="plan-progress">
          <v-progress-linear
            v-model="progressData.cur"
            background-color="#fff"
            color="#1EEFA4"
            height="16"
            rounded
          ></v-progress-linear>
          <div
            class="points-icon"
            v-for="item in progressData.milestone"
            :key="item.id"
            :style="{
              left: item.at + '%',
            }"
          >
            <v-btn icon class="points-button" @click="onNext(item)">
              <img
                class="points-icon-img"
                :src="
                  item.claimed
                    ? claimed_icon
                    : item.canClaim
                    ? finished_icon
                    : unfinished_icon
                "
                alt=""
                width="44px"
                style="display: block"
              />
              <span class="points">+{{ item.reward }}</span>
            </v-btn>
            <div class="points-text">
              <span class="num">{{ item.reward }}</span>
              <span class="unit">Activity</span>
            </div>
          </div>
        </div>
      </div>
      <v-row class="task-list">
        <v-col
          :cols="12"
          :md="item.type == 'DAILY_INVITE' ? 12 : 6"
          v-for="item in dailyList.items"
          :key="item.id"
        >
          <div
            class="card"
            :class="item.status == 'COMPLETED' ? 'completed' : ''"
          >
            <div class="task-detail">
              <img
                class="task-icon"
                src="@/assets/imgs/reward_hub/default_1.png"
                alt=""
              />
              <div class="task-info">
                <div class="task-name">{{ item.name }}</div>
                <div class="task-tips">
                  {{ item.description }}
                </div>
              </div>
              <div class="task-btn" v-if="item.type == 'DAILY_INVITE'">
                <div class="referral-link">
                  <span>Referral link:</span>
                  <span>{{ shareUrl }}</span>
                </div>
                <v-btn icon class="task-button">
                  <img
                    src="@/assets/imgs/reward_hub/copy.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn>
                <v-btn icon class="task-button">
                  <img
                    src="@/assets/imgs/reward_hub/download.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn>
              </div>
              <div class="task-btn" v-else>
                <v-btn disabled icon v-if="item.status == 'COMPLETED'">
                  <img
                    src="@/assets/imgs/reward_hub/check-circle.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn>
                <v-btn v-else icon class="task-button" @click="onNext(item)">
                  <img
                    src="@/assets/imgs/reward_hub/arrow-circle-right.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn>
              </div>
            </div>
            <div class="task-progress">
              <v-progress-linear
                class="progress-bar"
                background-color="#fff"
                :color="item.status == 'COMPLETED' ? '#1EEFA4' : '#5865F2'"
                :value="item.cur"
                height="16"
                rounded
              ></v-progress-linear>
              <div class="progress-text">
                {{ item.step }}/{{ item.upLimit }} Activity
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="tasks-box beginner-box">
      <div class="beginner-title">Beginner Tasks</div>
      <v-row class="task-list">
        <v-col
          :cols="12"
          :md="6"
          v-for="item in beginnerList.list"
          :key="item.id"
        >
          <div
            class="card"
            :class="item.taskStatus == 'COMPLETED' ? 'completed' : ''"
          >
            <div class="task-detail">
              <img
                class="task-icon"
                src="@/assets/imgs/reward_hub/default_2.png"
                alt=""
              />
              <div class="task-info">
                <div class="task-name">{{ item.name }}</div>
                <div class="task-tips">
                  {{ `${item.reward} Points/${item.description} ` }}
                </div>
              </div>
              <div class="task-btn">
                <!-- <v-btn icon class="task-button" v-if="item.status == 'COMPLETED'">
                  <img
                    src="@/assets/imgs/reward_hub/arrow-circle-right.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn> -->

                <v-btn
                  v-if="item.taskStatus == 'COMPLETED'"
                  elevation="0"
                  class="task-button"
                  @click="onNext(item)"
                >
                  +{{ item.reward }}
                </v-btn>
                <v-btn v-else icon class="task-button" @click="onNext(item)">
                  <img
                    src="@/assets/imgs/reward_hub/arrow-circle-right.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixin from "@/pages/more/mixin-register";
export default {
  mixins: [mixin],
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      userInfo: (s) => s.userInfo,
      chainId: (s) => s.chainId,
      onChain: (s) => s.onChain,
      pointsTrack: (s) => s.pointsTrack,
      code: (s) => s.code,
    }),
    shareUrl() {
      return location.origin + "?invite=" + this.$store.state.code;
    },
  },
  data() {
    return {
      loading: false,
      code: null,
      progressData: {},
      dailyList: {},
      beginnerList: {},
      claimList: [
        {
          name: "Polygon",
          icon: require("/public/img/svg/billing/ic-polygon-0.svg"),
          type: "Polygon",
        },
        {
          name: "zkSync Lite(v1)",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSync",
          tips: "Please ensure that you have sufficient ETH in zkSync Lite. Interaction with the zkSync network will rely on cross-chain communication services to complete on-chain identity registration on Polygon.",
        },
        {
          name: "ZkSync Era(V2)",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSyncV2",
          tips: "Please ensure that you have sufficient ETH inzkSync Era. Interaction with the zkSync network will rely on cross-chain communication services to complete on-chain identity registration on Polygon.",
        },
        {
          name: "opBNB",
          icon: require("/public/img/svg/billing/ic-opbnb-test.svg"),
          type: "OpBNB",
        },
        {
          name: "Ethereum",
          icon: require("/public/img/svg/billing/ic-ethereum.svg"),
          type: "Ethereum",
        },
        {
          name: "Polygon ZkEVM",
          icon: require("/public/img/svg/billing/ic-polygon-zkEVM.svg"),
          type: "PolygonZkEVM",
        },
        {
          name: "BNB Smart Chain",
          icon: require("/public/img/svg/billing/ic-bsc.png"),
          type: "BSC",
        },
        {
          name: "Arbitrum",
          icon: require("/public/img/svg/billing/ic-arbitrum.png"),
          type: "Arbitrum",
        },
        {
          name: "Linea",
          icon: require("/public/img/svg/billing/ic-linea.svg"),
          type: "Linea",
        },
      ],
      unfinished_icon: require("@/assets/imgs/reward_hub/icon_points_blue.png"),
      finished_icon: require("@/assets/imgs/reward_hub/icon_points_yellow.png"),
      claimed_icon: require("@/assets/imgs/reward_hub/icon_points_green.png"),
    };
  },
  async created() {},
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["checkClaim"]),
    async onVerifyEmail(title = "Thank you for subscription") {
      await this.$alert(
        "For security reasons, please login to your mailbox and click the confirmation link to ensure that your mailbox is for your own use before subscribing.",
        title
      );
      this.init();
    },
    async onSubsribe(it) {
      try {
        const data = await this.$prompt(
          "",
          "Stay up to date on developer updates for the 4EVERLAND",
          {
            confirmText: "Subscribe",
            inputAttrs: {
              label: "Email",
              rules: [
                (v) => this.$regMap.email.test(v) || "Invalid email address.",
              ],
              required: true,
            },
          }
        );
        this.$loading();
        await this.$http.post("$auth/bind", {
          type: 6,
          apply: data.value,
        });
        this.$loading.close();
        this.onVerifyEmail();
      } catch (error) {
        //
      }
    },
    async init() {
      // this.getPoints();
      this.getProgress();
      this.getDailyList();
      this.getBeginnerList();
      this.checkClaim();
    },
    async getPoints() {
      const { data } = await this.$http.get("$auth/activities/point/overview");
      this.pointsTrack = data;
    },
    async getProgress() {
      const { data } = await this.$http.get("$auth/activities/progress");
      this.progressData = data;
    },
    async getDailyList() {
      const { data } = await this.$http.get("$auth/activities/daily");
      this.dailyList = data;
    },
    async getBeginnerList() {
      const { data } = await this.$http.get("$auth/activities/newbie");
      this.beginnerList = data;
    },
    async onNext(item) {
      const { data } = await this.$http.get(`$auth/activities/${item.id}/next`);
      console.log(data);
      this.onAfterNext(data);
    },
    async onAfterNext(data) {
      switch (data.next) {
        case "JUMP":
          this.$router.push(data.message);
          break;
        case "OPEN_NEW_TAB":
          window.open(data.message);
          break;
        case "POPUP":
          this.onPopup(data);
          break;
        case "EMAIL_BIND":
          this.onSubsribe();
          break;
        case "NONE":
          this.onPopup(data);
          break;
        default:
          break;
      }
    },
    async onPopup(data) {
      await this.$alert("+50 Activity", "Get it!");
      this.init();
    },
    async handleTypeClaim(type = "Polygon") {
      try {
        const register = await this.isRegister();
        if (register) {
          this.onAnimation();
          await this.getHandler();
          return this.getList();
        }
        let claimStatus = null;
        if (type == "Polygon") {
          claimStatus = await this.handleClaim();
        } else if (type == "zkSync") {
          claimStatus = await this.handleZkClaim();
        } else if (type == "zkSyncV2") {
          claimStatus = await this.handleOtherChainClaim("zkSync");
        } else {
          claimStatus = await this.handleOtherChainClaim(type);
        }
        if (claimStatus) {
          this.onAnimation();
          await this.getHandler();
          this.getList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getHandler() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );
        this.$setState({
          onChain: data.handled,
        });
      } catch (error) {
        console.log(error);
      }
    },
    onAnimation() {
      this.$refs.share.showDialog = true;
      // this.$flowersAnimation();
    },
    regexHandleNum(num) {
      num = Number(num);
      if (String(num).indexOf(".") > -1) {
        num = num.toFixed(2);
      }
      return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
<style lang="scss" scoped>
#RewardHub {
  padding-bottom: 72px;
  .banner {
    width: 100%;
    height: 152px;
    border-radius: 16px;
    background-image: url("../../assets/imgs/reward_hub/bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 60px;
    .banner-title {
      color: #fff;
      font-size: 48px;
      font-weight: 900;
    }
    .points-box {
      display: flex;
      padding: 8px 20px;
      align-items: baseline;
      gap: 8px;
      border-radius: 16px;
      background: rgba(0, 0, 0, 0.25);
      position: relative;
      .num {
        color: #fff;
        font-size: 48px;
        font-weight: 700;
      }
      .unit {
        color: #fff;
        font-size: 20px;
        font-weight: 400;
      }
      .icon-1 {
        position: absolute;
        width: 72px;
        left: -36px;
        top: -36px;
      }
      .icon-2 {
        position: absolute;
        width: 180px;
        right: -100px;
        bottom: -90px;
      }
    }
  }
  .tasks-box {
    border-radius: 16px;
    background: #fff;
    margin-top: 40px;
    padding: 24px;
    .task-list {
      .card {
        width: 100%;
        height: 168px;
        padding: 24px;
        border-radius: 12px;
        .task-detail {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          .task-icon {
            width: 80px;
          }
          .task-info {
            .task-name {
              color: #0e0e2c;
              font-size: 20px;
              font-weight: 700;
            }
            .task-tips {
              color: rgba(14, 14, 44, 0.75);
              font-size: 12px;
              font-weight: 400;
            }
          }
          .task-btn {
            display: flex;
            align-items: center;
            margin-left: auto;
            .task-button {
              padding: 8px;
              border-radius: 8px;
              margin: 0 4px;
            }
          }
        }
        .task-progress {
          display: flex;
          align-items: center;
          .progress-bar {
            flex: 1;
          }
          .progress-text {
            color: #8c8ca1;
            font-size: 12px;
            font-weight: 400;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .daily-box {
    .plan-box {
      border-radius: 12px;
      padding: 12px;
      padding-right: 48px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      .icon-plan {
        width: 120px;
      }
      .plan-text {
        margin-right: 24px;
        span {
          display: block;
        }
        .plan-name {
          color: #ffad08;
          font-size: 32px;
          font-weight: 900;
        }

        .plan-time {
          color: #8c8ca1;
          font-size: 12px;
          font-weight: 400;
        }
      }
      .plan-progress {
        position: relative;
        flex: 1;
        .points-icon {
          position: absolute;
          top: -65%;
          transform: translateX(-22px);
          .points-button {
            position: relative;
            .points-icon-img {
              display: block;
            }
            .points {
              position: absolute;
              top: 24px;
              color: #1e50ff;
              font-size: 12px;
              font-weight: 700;
            }
          }
          .points-text {
            margin-top: 6px;
            span {
              display: block;
              text-align: center;
            }
            .num {
              color: #0e0e2c;
              font-size: 12px;
              font-weight: 700;
            }
            .unit {
              color: #8c8ca1;
              font-size: 12px;
              font-weight: 400;
            }
          }
        }
      }
    }
    .plan-box.unfinished {
      background: rgba(255, 173, 8, 0.1);
    }
    .plan-box.finished {
      background: #f4fefa;
      .plan-name {
        color: #1eefa4;
      }
    }
    .task-list {
      .card {
        background: #eef0fe;
        .task-detail {
          .task-icon {
          }
          .task-info {
            .task-name {
            }
            .task-tips {
            }
          }
          .task-btn {
            .referral-link {
              padding: 8px 16px;
              border-radius: 8px;
              border: 1px solid rgba(88, 101, 242, 0.5);
              background: rgba(88, 101, 242, 0.05);
              margin-right: 16px;
              span:first-child {
                color: #0e0e2c;
                font-family: SF Pro Text;
                font-size: 16px;
                font-weight: 700;
                margin-right: 8px;
              }
            }
            .task-button {
              background: #5865f2;
            }
          }
        }
        .task-progress {
          display: flex;
          align-items: center;
          .progress-bar {
            flex: 1;
          }
          .progress-text {
            color: #8c8ca1;
            font-size: 12px;
            font-weight: 400;
            margin-left: 8px;
          }
        }
      }
      .completed {
        background: #f4fefa;
        .task-detail {
          .task-icon {
            opacity: 0.5;
          }
          .task-info {
            opacity: 0.5;
            .task-name {
            }
            .task-tips {
            }
          }
          .task-btn {
            .referral-link {
              padding: 8px 16px;
              border-radius: 8px;
              border: 1px solid rgba(88, 101, 242, 0.5);
              background: rgba(88, 101, 242, 0.05);
              margin-right: 16px;
              span:first-child {
                color: #0e0e2c;
                font-family: SF Pro Text;
                font-size: 16px;
                font-weight: 700;
                margin-right: 8px;
              }
            }
            .task-button {
              background: #5865f2;
            }
          }
        }
      }
    }
  }
  .beginner-box {
    .beginner-title {
      color: #0e0e2c;
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 24px;
    }
    .task-list {
      .card {
        height: 128px;
        background: #fff2ff;
        .task-detail {
          .task-icon {
          }
          .task-info {
            .task-name {
            }
            .task-tips {
            }
          }
          .task-btn {
            .task-button {
              background: #fda9ff;
            }
          }
        }
      }
      .completed {
        background: #f4fefa;
        .task-detail {
          .task-icon {
          }
          .task-info {
            .task-name {
            }
            .task-tips {
            }
          }
          .task-btn {
            .task-button {
              background: #1eefa4;
              color: #fff;
              font-family: DIN Alternate;
              font-size: 24px;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}
</style>
