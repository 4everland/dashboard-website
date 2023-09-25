<template>
  <div id="RewardHub">
    <div class="banner">
      <div class="banner-title">Task Hub</div>
      <div class="points-box">
        <!-- <div class="num">{{ regexHandleNum(pointsTrack) }}</div> -->
        <div class="num">
          <ScrollNum
            v-for="(num, idx) of numArr"
            :key="idx"
            :i="num"
            :delay="idx * 0.3"
          />
        </div>
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
            background-color="#fff"
            color="#1EEFA4"
            :value="(progressData.cur / progressData.upLimit) * 100"
            height="16"
            rounded
            style="border: 4px solid #fff; border-radius: 16px"
          ></v-progress-linear>
          <div
            class="points-icon"
            v-for="item in progressData.milestone"
            :key="item.id"
            :style="{
              left: item.at + '%',
            }"
          >
            <v-btn
              icon
              class="points-button"
              :class="item.canClaim && !item.claimed ? 'can-claim' : ''"
              @click="onNext(item)"
              :disabled="item.claimed || !item.canClaim"
            >
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
              <span
                class="points"
                :class="{
                  canClaim: item.canClaim,
                  claimed: item.claimed,
                }"
                >+{{ item.reward }}</span
              >
            </v-btn>
            <div
              class="points-text"
              :class="{
                claimed: item.claimed,
              }"
            >
              <span class="num">{{ item.at }}</span>
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
                :src="
                  item.status == 'COMPLETED'
                    ? item.iconCompleted
                    : item.iconOngoing
                "
                alt=""
              />
              <div class="task-info">
                <div class="task-name">{{ item.name }}</div>
                <div class="task-tips">
                  {{ `${item.step} Active | ${item.description}` }}
                </div>
              </div>
              <div class="task-btn" v-if="item.type == 'DAILY_INVITE'">
                <div class="referral-link">
                  <span>Referral link:</span>
                  <span>{{ shareUrl }}</span>
                </div>
                <v-btn
                  icon
                  class="task-button"
                  v-clipboard="shareUrl"
                  @success="$toast('Copied!')"
                >
                  <img
                    src="@/assets/imgs/reward_hub/copy.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn>
                <v-btn icon class="task-button" @click="onInvite">
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
                <v-btn
                  v-else-if="item.type != 'CO_MINT'"
                  icon
                  class="task-button"
                  @click="onNext(item)"
                >
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
                :value="(item.cur / item.upLimit) * 100"
                height="16"
                rounded
              ></v-progress-linear>
              <div class="progress-text">
                {{ item.cur }}/{{ item.upLimit }} Activity
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-if="beginnerList.list?.length > 0" class="tasks-box beginner-box">
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
            :class="{
              completed: item.taskStatus == 'COMPLETED',
              donetostay: item.taskStatus == 'DONE_TO_STAY',
            }"
            @click="onCardNext(item)"
          >
            <div class="task-detail">
              <img
                class="task-icon"
                :src="
                  item.taskStatus == 'ON_GOING'
                    ? item.iconOngoing
                    : item.iconCompleted
                "
                alt=""
              />
              <div class="task-info">
                <div class="task-name">{{ item.name }}</div>
                <div class="task-tips">
                  {{
                    `${item.reward} Points ${item.tips} | ${item.description} `
                  }}
                </div>
              </div>
              <div class="task-btn">
                <v-btn
                  v-if="item.taskStatus == 'COMPLETED'"
                  elevation="0"
                  class="task-button"
                >
                  +{{ item.reward }}
                </v-btn>
                <v-btn
                  disabled
                  icon
                  v-else-if="item.taskStatus == 'DONE_TO_STAY'"
                >
                  <img
                    src="@/assets/imgs/reward_hub/check-circle.png"
                    alt=""
                    width="24px"
                    style="display: block"
                  />
                </v-btn>
                <v-btn
                  v-else
                  icon
                  class="task-button"
                  @click.stop="onNext(item)"
                >
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

    <share-img ref="shareImg" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixin from "@/pages/more/mixin-register";
import shareImg from "@/components/rewardHub/shareImg";
import ScrollNum from "@/components/rewardHub/ScrollNum";
export default {
  mixins: [mixin],
  components: { shareImg, ScrollNum },
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
    numArr() {
      const str = String(this.pointsTrack);
      let arr = [];
      for (let i = 0; i < str.length; i++) {
        arr.push(parseInt(str[i]));
      }

      return arr;
    },
  },
  data() {
    return {
      loading: false,
      progressData: {},
      dailyList: {},
      beginnerList: {},
      default_icon_1: require("@/assets/imgs/reward_hub/default_1.png"),
      default_icon_2: require("@/assets/imgs/reward_hub/default_2.png"),
      default_icon_3: require("@/assets/imgs/reward_hub/default_3.png"),
      unfinished_icon: require("@/assets/imgs/reward_hub/icon_points_blue.png"),
      finished_icon: require("@/assets/imgs/reward_hub/icon_points_yellow.png"),
      claimed_icon: require("@/assets/imgs/reward_hub/icon_points_green.png"),
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["checkClaim"]),
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
      this.onAfterNext(item, data);
    },
    async onCardNext(item) {
      if (item.taskStatus == "COMPLETED") {
        this.onNext(item);
      }
    },

    async onAfterNext(item, data) {
      switch (data.next) {
        case "JUMP":
          this.$router.push(data.message);
          break;
        case "OPEN_NEW_TAB":
          window.open(data.message);
          break;
        case "POPUP":
          this.onPopup(item, data);
          break;
        case "POPUP_S_C_T":
          this.onPopupMint(item, data);
          break;
        case "EMAIL_BIND":
          this.onEmailBind();
          break;
        case "NONE":
          this.init();
          break;
        default:
          break;
      }
    },
    async onPopup(item, data) {
      await this.$alert(`+${item.reward} Points`, data.message, {
        maxWidth: 300,
        textCenter: true,
      });
      this.init();
    },
    async onPopupMint(item, data) {
      await this.$alert(data.tips, data.message);
      this.init();
    },
    async onEmailBind() {
      try {
        const { value } = await this.$prompt(
          "Verify your email to stay up to date on the 4EVERLAND latest news and events.",
          "E-mail verification",
          {
            confirmText: "Send",
            inputAttrs: {
              label: `Your email address`,
              rules: [
                (v) => this.$regMap.email.test(v) || "Invalid email address.",
              ],
              required: true,
            },
          }
        );
        this.$loading();
        await this.$http.post("$auth/bind", {
          type: 3,
          apply: value,
        });
        this.$loading.close();
        this.onVerifyEmail();
      } catch (error) {
        //
      }
    },
    async onVerifyEmail() {
      const { value } = await this.$prompt(
        "The verification code has been sent to your email address.",
        "E-mail verification",
        {
          confirmText: "Verify",
          inputAttrs: {
            label: `Verify code`,
            rules: [(v) => v.trim().length >= 4 || "Invalid code."],
            required: true,
          },
        }
      );
      await this.$sleep(100);
      let params = {
        type: 3,
      };
      this.$loading("Binding Email");
      await this.$http.get(`$auth/auth/vcode/${value}`, {
        params,
      });
      this.$setMsg({
        name: "updateUser",
      });
      this.$loading.close();
      this.$toast("Email binded successfully!");
      this.init();
    },
    onInvite() {
      this.$refs.shareImg.onShow();
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
        display: flex;
        align-items: baseline;
        --width: 28px;
        --color: #fff;
        font-size: 48px;
        font-weight: 700;
        color: #fff;
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
    margin-top: 30px;
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
            .points.canClaim {
              color: #ff811a;
            }
            .points.claimed {
              color: #0c8f8f;
            }
          }
          .points-button.can-claim {
            animation: shakespan 0.8s ease-in-out infinite alternate;
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
          .points-text.claimed {
            .num {
              color: rgba(140, 140, 161, 0.25);
            }
            .unit {
              color: rgba(140, 140, 161, 0.25);
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
            border: 4px solid #fff;
            border-radius: 16px;
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
          }
          .task-btn {
            .referral-link {
              border: 1px solid #83f6cd;
              background: #e9fdf6;
            }
            .task-button {
              background: #1eefa4;
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
          .task-btn {
            .task-button {
              background: #fda9ff;
            }
          }
        }
      }
      .completed {
        background: #f4fefa;
        cursor: pointer;
        .task-detail {
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
      .donetostay {
        background: #f4fefa;
        .task-detail {
          .task-icon {
            opacity: 0.5;
          }
          .task-info {
            opacity: 0.5;
          }
          .task-btn {
            .referral-link {
              border: 1px solid #83f6cd;
              background: #e9fdf6;
            }
            .task-button {
              background: #1eefa4;
            }
          }
        }
      }
    }
  }
}

@keyframes shakespan {
  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(10deg);
  }

  50% {
    transform: rotate(-10deg);
  }

  75% {
    transform: rotate(5deg);
  }

  85% {
    transform: rotate(-5deg);
  }
}
</style>

<style>
.num {
}
</style>
