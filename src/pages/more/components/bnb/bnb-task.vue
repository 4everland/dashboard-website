<template>
  <div class="task-box">
    <div class="task-tit">Tasks</div>
    <div class="task-tips">
      Complete tasks to unlock the prize pool sharing eligibility. Rewards will
      be distributed uniformly at the end of the event.
    </div>
    <div class="task-list">
      <div class="task-item" v-for="(item, index) in taskList" :key="index">
        <div class="task-item-top" @click="onTaskShow(item)">
          <div class="task-item-top-icon">
            <img
              v-if="item.isShow"
              src="@/assets/imgs/more/arrow-down.svg"
              alt=""
            />
            <img v-else src="@/assets/imgs/more/arrow-left.svg" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div>
            <template v-if="userInfo.uid">
              <div>
                <v-btn
                  v-if="
                    item.info.taskStatus == 'NOT_READY' ||
                    item.info.taskStatus == 'ON_GOING'
                  "
                  class="cursor-ban"
                  elevation="0"
                  style="color: #fff"
                  color="rgba(255, 255, 255, 0.25)"
                  @click.stop="
                    (e) => {
                      return e.default;
                    }
                  "
                  >{{ item.disBtnTetx }}</v-btn
                >
                <v-btn
                  v-if="item.info.taskStatus == 'CLAIM'"
                  style="color: #fff"
                  color="#039CFF"
                  elevation="0"
                  @click.stop="onClaim(item)"
                  >Claim</v-btn
                >
                <v-btn
                  v-if="item.info.taskStatus == 'COMPLETED'"
                  class="cursor-ban"
                  style="color: #fff"
                  elevation="0"
                  color="rgba(255, 255, 255, 0.25)"
                  @click.stop="
                    (e) => {
                      return e.default;
                    }
                  "
                >
                  <v-img
                    class="mr-1"
                    max-height="16"
                    max-width="16"
                    src="@/assets/imgs/more/check-circle.svg"
                  ></v-img>
                  Claimed</v-btn
                >
                <v-btn
                  v-if="item.info.taskStatus == 'DENY'"
                  class="cursor-ban"
                  style="color: #fff"
                  elevation="0"
                  color="rgba(255, 255, 255, 0.25)"
                  @click.stop="
                    (e) => {
                      return e.default;
                    }
                  "
                >
                  Not eligible</v-btn
                >
              </div>
            </template>
            <template v-else>
              <v-btn elevation="0" color="#039CFF" @click.stop="onLogin">
                <span class="fw-b" style="color: #fff"> Login</span></v-btn
              >
            </template>
          </div>
        </div>
        <v-expand-transition>
          <div class="task-item-bottom" v-show="item.isShow">
            <div class="task-item-bottom-description">
              {{ item.description }}
            </div>
            <div class="task-item-bottom-reward">
              <div>
                <span>Total</span>
                <span class="task-item-bottom-reward-points">{{
                  item.points
                }}</span>
              </div>
              <div
                v-if="item.info.reward"
                class="task-item-bottom-reward-points-get"
              >
                <span>{{ item.info.reward }} Points</span>
              </div>
            </div>
            <div v-if="item.child">
              <v-row dense>
                <v-col
                  cols="12"
                  md="6"
                  v-for="it in item.child"
                  :key="it.type"
                  class="pa-2"
                >
                  <div class="media-item">
                    <div class="media-item-icon">
                      <v-img
                        max-height="32"
                        max-width="32"
                        :src="it.icon"
                      ></v-img>
                      <div>
                        <div class="media-item-title">{{ it.name }}</div>
                        <div>{{ it.description }}</div>
                      </div>
                    </div>
                    <div>
                      <div
                        v-if="
                          it.info.taskStatus == 'COMPLETED' ||
                          it.info.taskStatus == 'DONE_TO_STAY'
                        "
                      >
                        <v-btn
                          v-if="$vuetify.breakpoint.smAndDown"
                          elevation="0"
                          min-width="32"
                          height="32"
                          class="cursor-ban pa-0"
                          style="color: #fff"
                          color="rgba(255, 255, 255, 0.05)"
                        >
                          <v-img
                            max-height="16"
                            max-width="16"
                            src="@/assets/imgs/more/check-circle.svg"
                          ></v-img>
                        </v-btn>
                        <v-btn
                          v-else
                          elevation="0"
                          class="cursor-ban"
                          style="color: #fff"
                          color="rgba(255, 255, 255, 0.05)"
                          min-width="96px"
                        >
                          <v-img
                            class="mr-1"
                            max-height="16"
                            max-width="16"
                            src="@/assets/imgs/more/check-circle.svg"
                          ></v-img>
                          {{ it.info.buttonName || it.disBtnTetx }}</v-btn
                        >
                      </div>
                      <div v-else>
                        <v-btn
                          v-if="$vuetify.breakpoint.smAndDown"
                          elevation="0"
                          class="pa-0"
                          outlined
                          min-width="32"
                          height="32"
                          color="#039CFF"
                          @click.stop="onNext(it)"
                        >
                          <v-icon size="16">mdi-arrow-right</v-icon>
                        </v-btn>
                        <v-btn
                          v-else
                          elevation="0"
                          outlined
                          min-width="96px"
                          color="#039CFF"
                          @click.stop="onNext(it)"
                          >{{ it.btnName }}</v-btn
                        >
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-expand-transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { fetchTaskList, fetchNext, fetchClaim } from "@/api/airdrop.js";

export default {
  name: "DashboardWebsiteBnbTask",
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
  },
  data() {
    return {
      taskList: [
        {
          name: "Level 1",
          type: "FOREVER_PASS_BNB_TASK_1",
          description:
            "Confirm your eligibility for BNB Chain's Airdrop Alliance Program level 1 criteria.",
          taskStatus: "",
          reward: 0,
          points: "4 million Points",
          isShow: true,
          disBtnTetx: "Not open",
          info: {},
          child: null,
        },
        {
          name: "Level 2",
          type: "FOREVER_PASS_BNB_TASK_2",
          description:
            "Confirm your eligibility for BNB Chain's Airdrop Alliance Program level 2 criteria.",
          taskStatus: "",
          reward: 0,
          points: "2 million Points",
          isShow: true,
          disBtnTetx: "Not open",
          info: {},
          child: null,
        },
        {
          name: "Complete Tasks to Unlock Extra Rewards",
          type: "FOREVER_PASS_BNB_TASK_3",
          description:
            "Complete the tasks according to the requirements below to earn extra points.",
          taskStatus: "",
          reward: 0,
          points: "9 million Points",
          timeOut: 1717171200000,
          isShow: true,
          disBtnTetx: "Not completed",
          info: {},
          child: [
            {
              name: "Step1: Follow on X",
              type: "FOLLOW_TWITTER",
              description: "Follow @4everland_org on X.",
              taskStatus: "",
              reward: 0,
              btnName: "Follow",

              icon: require("@/assets/imgs/more/x.svg"),
              info: {},
            },
            {
              name: "Step2: Join Discord",
              type: "JOIN_DISCORD",
              description: "Connect your Discord and join our server.",
              taskStatus: "",
              reward: 0,
              btnName: "Join",
              icon: require("@/assets/imgs/more/discord.svg"),
              info: {},
            },
            {
              name: "Step3: Share on X",
              type: "FOREVER_PASS_SHARE_TWITTER",
              description: "Share on X to earn points.",
              taskStatus: "",
              reward: 0,
              btnName: "Share",
              disBtnTetx: "Shared",

              icon: require("@/assets/imgs/more/share.svg"),
              info: {},
            },
            {
              name: "Step4: Activate Account",
              type: "MINT_ID",
              description: "Become a standard user on the 4EVERLAND dashboard.",
              taskStatus: "",
              reward: 0,
              btnName: "Activate",
              disBtnTetx: "Activated",

              icon: require("@/assets/imgs/more/user.svg"),
              info: {},
            },
            {
              name: "Step5: Deposit LAND",
              type: "FOREVERPASS_DEPOSIT",
              description: "Deposit any amount of LAND through BSC/opBNB.",
              taskStatus: "",
              reward: 0,
              btnName: "Deposit",
              disBtnTetx: "Deposited",

              icon: require("@/assets/imgs/more/deposit.svg"),
              info: {},
            },
          ],
        },
      ],
    };
  },
  async created() {
    await this.getList();
  },
  mounted() {},
  methods: {
    async init() {
      await this.getList();
    },
    async getList() {
      if (!localStorage.token) return;
      const { data } = await fetchTaskList();
      this.taskList.map((item) => {
        data.list.map((task) => {
          if (item.type == task.type) {
            item.info = task;
          }
          if (item.child) {
            item.child.map((ch) => {
              if (ch.type == task.type) {
                ch.info = task;
              }
            });
          }
        });
        item.type;
      });
      console.log(this.taskList);
    },
    onLogin() {
      localStorage.loginTo = "/quest/bnb";
      this.$router.push("/login");
    },
    onTaskShow(item) {
      item.isShow = !item.isShow;
    },
    async onClaim(item) {
      await fetchClaim(item.info.id);
      this.$toast("Congratulations, claim successful!");
      this.init();
    },
    async onNext(item) {
      const { data } = await fetchNext(item.info.id);
      this.onAfterNext(item.info, data);
    },
    async onAfterNext(item, data) {
      switch (data.next) {
        case "JUMP":
          this.$router.push(data.message);
          break;
        case "OPEN_NEW_TAB":
          window.open(data.message);
          setTimeout(() => {
            this.init();
          }, 15000);
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
  },
};
</script>

<style lang="scss" scoped>
.task-box {
  color: #fff;
  .task-tit {
    color: #fff;
    font-size: 24px;
    font-weight: 700;
  }
  .task-tips {
    color: #f1f5f9;
    font-size: 14px;
    font-weight: 400;
    margin-top: 8px;
  }
  .task-list {
    .task-item {
      border-radius: 16px;
      background: #15171a;
      margin-bottom: 16px;
      padding: 24px;
      &-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        &-icon {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          line-height: 20px; /* 125% */
        }
      }
      &-bottom {
        color: #f1f5f9;
        font-size: 12px;
        font-weight: 400;
        &-description {
        }
        &-reward {
          display: flex;
          align-items: center;
          justify-content: space-between;
          &-points {
            color: #ffce56;
            font-size: 16px;
            font-weight: 700;
            margin-left: 4px;
          }
          &-points-get {
            color: #039cff;
            font-size: 16px;
            font-weight: 700;
          }
        }
        .media-item {
          display: flex;
          padding: 16px;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: #1a1c21;
          &-icon {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          &-title {
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            line-height: 16px; /* 114.286% */
          }
        }
      }
    }
  }
}
</style>
