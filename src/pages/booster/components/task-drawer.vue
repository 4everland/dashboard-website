<template>
  <div class="task-drawer-box">
    <v-navigation-drawer
      class="task-drawer"
      absolute
      bottom
      temporary
      hide-overlay
      right
      color="#1E2234"
      :value="showTaskDrawer"
      @input="stateTaskDrawerShow"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="task-drawer-top">
          <div class="drawer-title task-drawer-title">
            Daily Task: Claim LAND
          </div>
          <div class="daily-sign">
            <div class="daily-sign-box">
              <div
                v-for="(item, index) in signList"
                :key="index"
                class="daily-sign-item"
                :class="signDays % 7 > index ? 'daily-signed' : ''"
              >
                <div class="daily-sign-item-top">
                  <div class="point">+{{ item.reward }}/H</div>
                  <div>
                    <img
                      v-if="signDays % 7 > index"
                      src="/img/booster/drawer/check.png"
                      alt=""
                    />
                    <img v-else src="/img/booster/drawer/coin.png" alt="" />
                  </div>
                </div>
                <div class="daily-sign-item-bottom">Day {{ item.step }}</div>
              </div>
            </div>
            <v-btn class="drawer-btn" @click="onSign"> Claim LAND </v-btn>
          </div>
        </div>
        <div class="task-box">
          <v-row no-gutters style="gap: 18px 0">
            <v-col
              v-for="(item, index) in tasksLists"
              :key="item.actId"
              cols="12"
            >
              <div class="task-item-box">
                <div class="task-item-left">
                  <img class="task-item-image" :src="item.icon" alt="" />
                  <div class="task-text-box">
                    <div class="task-name">{{ item.actName }}</div>
                    <div class="task-desc">+3/H, valid for 24 hours</div>
                  </div>
                </div>

                <div class="task-item-right">
                  <v-btn
                    v-if="item.actStatus !== 'DONE'"
                    class="drawer-btn"
                    @click="stepNext(item)"
                    >{{ item.extra.buttonName }}</v-btn
                  >

                  <!-- <v-btn class="go-btn">Go</v-btn> -->
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

export default {
  computed: {
    ...mapGetters(["showTaskDrawer"]),
  },
  data() {
    return {
      signList: [],
      tasksLists: [],
      signDays: 0,
    };
  },
  created() {
    this.getDailySign();
    this.getTasks();
    bus.$on("getDailyTasks", () => {
      this.getDailySign();
    });
  },
  mounted() {},
  methods: {
    async getDailySign() {
      const { data } = await fetchDailySign();
      const rewardList = data.items[0].extra.dailySign.rewardList;
      const stepList = data.items[0].extra.dailySign.stepList;
      const signDays = data.items[0].extra.dailySign.continuous;
      this.signDays = signDays;
      let signList = [];
      rewardList.forEach((element, index) => {
        signList.push({
          reward: element,
          step: stepList[index],
          signDays: signDays,
        });
      });
      console.log(signList);
      this.signList = signList;
    },
    async getTasks() {
      const { data } = await fetchTasks();
      this.tasksLists = data.items;
    },
    async stepNext(item) {
      const id = item.actId;
      const { data } = await onNext(id);
      switch (data.action.web.next) {
        case "REDIRECT":
          location.href = data.action.web.message;
          break;
        case "JUMP_OUT":
          window.open(data.action.web.message);
          break;
        default:
          break;
      }
      this.getTasks();
      this.$store.dispatch("getBoosterUserInfo");
    },
    async onSign() {
      this.stateTaskDrawerShow(false);
      const land = 10000;
      const report = true;
      bus.$emit("showDepositDialog", { land, report });
    },
    stateTaskDrawerShow(state) {
      this.$store.dispatch("TaskDrawerState", { state });
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
    }
    .task-drawer-top {
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      .daily-sign {
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .daily-sign-box {
          display: flex;
          align-items: center;
          gap: 10px;
          .daily-sign-item {
            .daily-sign-item-top {
              display: flex;
              padding: 7px 7.5px 10px 7.5px;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 5px;
              border-radius: 100px;
              background: rgba(255, 255, 255, 0.1);
              .point {
                font-size: 12px;
              }
              img {
                width: 24px;
                height: 24px;
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
              opacity: 0.8;
              background: rgba(97, 114, 243, 0.1);
              .point {
                color: #6172f3;
              }
            }
            .daily-sign-item-bottom {
              opacity: 0.3;
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
      height: calc(100% - 74px - 64px) !important;
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
