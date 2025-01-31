<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="earn-boost-dialog"
      :value="value"
      overlay-opacity="0.9"
      overlay-color="black"
      persistent
    >
      <div class="earn-dialog">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />
        <div class="earn-content">
          <img class="logo" :src="info.projectLogoUrl" width="80" alt="" />
          <div class="d-flex justify-end align-center">
            <v-btn class="earning-btn">
              <span class="btn-text"
                >{{ $utils.formatCompactNumbers(info.projectTotalPoints+info.projectInitTotalPoints)
                }}{{ " " }}{{ info.projectName }} {{ info.projectName == 'LSP Finance' ? 'Gems' : info.rewardType == 'POINT'? 'Points': info.rewardType == 'TOKEN'? 'Tokens': 'Gems' }}</span
              >
            </v-btn>
          </div>
          <div>
            <div class="title mt-3">{{ info.projectName }}</div>
            <div class="text mt-2">
              {{ info.projectDesc }}
            </div>
            <!-- <div
              class="countdown d-flex justify-space-between align-center mt-2"
            >
              <div>Ended</div>
              <div class="d-flex align-center endtime">
                <time-count-down :endTimeStamp="info.endAt"></time-count-down>
                
              </div>
            </div> -->
            <div class="unlock-node mt-4">Complete Tasks To Start Project Mining</div>
            <v-skeleton-loader
              v-if="loading"
              class="mx-auto"
              height="50"
              width="100%"
              type="list-item"
              dark
            ></v-skeleton-loader>
            <div
              class="back-step"
              v-if="!loading"
              v-for="(item, index) in tasksLists"
              :key="item.actId"
              cols="12"
            >
              <div class="d-flex justify-space-between align-center mt-2 step">
                <div class="d-flex justify-start">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-text">{{ item.actName }}</div>
                </div>
                <v-btn
                  v-if="item.actStatus !== 'DONE'"
                  :class="
                    item.extra.buttonName == 'Go' ? 'go-btn' : 'drawer-btn'
                  "
                  :loading="false || loadingStatus[item.actId]"
                  @click="stepNext(item, index, 'one')"
                >
                  <span class="btn-text">{{ item.extra.buttonName }}</span>
                </v-btn>
                <v-btn v-if="item.actStatus == 'DONE'" class="done-btn"
                  ><img src="/img/booster/earnings/icon_task_check.png" width="16" alt="">
                </v-btn>
              </div>
            </div>
            <v-btn 
              class="start-btn mt-3 "
              :disabled="disabled"
              :class="{
                'unlock-btn': info.type == 'unlocked'}"
              @click="startMining"
            > 
              <img
                v-if="info.type == 'unlocked'"
                src="/img/booster/icon_hammer.png"
                width="14"
                alt=""
              />
            {{ info.type == 'unlocked' ? 'Mining ...' : 'Start Mining Now' }}
            </v-btn>
            
            <div class="d-flex justify-start mt-2">
              <div>
                <img
                  src="/img/booster/earnings/subtract.png"
                  width="16"
                  alt=""
                />
              </div>
              <div class="view">
                Rewards are generated based on your earning rate.
              </div>
            </div>
          </div>
        </div>
        <div v-if="showBind" class="d-flex justify-space-between align-center project-info-footer">
          <div class="evm-wallet fz-12">Bind your EVM wallet before claiming rewards.</div>
          <v-btn small class="bind-btn fz-14 d-flex align-center" @click="onConnect"
            ><img src="/img/booster/earnings/icon_wallet.png" width="16" alt="">Bind</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
  
<script>
import TimeCountDown from "@/pages/booster/components/time-count-down";
import { bus } from "@/utils/bus";
import { fetchPoolProjectList, fetchProjectTasks, onNext } from "@/api/booster";
import { mapState } from "vuex";
export default {
  props: {
    value: Boolean,
    info: Object,
  },
  data() {
    return {
      endTimetTask: 1735082613,
      loadingStatus: {},
      tasksLists: [],
      loading: false,
    };
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === true) {
        this.tasksLists = [];
        this.getTaskList();
      }
    },
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    disabled() {
      if(this.tasksLists.length == 0) {
        return true;
      }
      const completedTaskList = this.tasksLists.filter(
        (it) => it.actStatus == "DONE"
      );
      if (completedTaskList.length == this.tasksLists.length) {
        return false;
      }else {
        return true;
      }

    },
    currentAddress() {
      return this.userInfo.wallet?.address;
    },
    showBind() {
      let _project = this.info.projectName;
      return ["DeepLink", "AILayer", "LSP Finance"].includes(_project) && !this.currentAddress;
    }
  },

  methods: {
    backtoindex() {
      this.$router.push("/boost");
    },
    async getTaskList(flag) {
      if (flag !== "check") {
        this.loading = true;
      }
      fetchProjectTasks(this.info.id).then((res) => {
        this.tasksLists = res.data.items;
        this.loading = false;
        if (flag == "check") {
          const completedTaskList = this.tasksLists.filter(
            (it) => it.actStatus == "DONE"
          );
          if (completedTaskList.length == this.tasksLists.length) {
            bus.$emit("refreshPartnerList");
            bus.$emit("initPointsPool");
          }
        }
      });
    },
    onConnect() {
      let state = true;
      this.$store.dispatch("ConnectDrawerState", { state });
    },
    startMining(){
      this.$emit("input", false);
      if (this.info.type == "unlocked") {
        return;
      }
      this.$toast2(
        `Activated successfully! Claim rewards on the homepage.`
      );
    },
    async stepNext(item, index, taskListType) {
      try {
        let _this = this;
        if (item.extra.buttonName == "Go") {
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
        if (item.extra.buttonName == "Check") {
          this.$set(this.loadingStatus, item.actId, true);
        }

        const id = item.actId;

        const { data } = await onNext(id);
          if(data.alert){
            this.$toast2(data.alert, "info");
          }
        if (item.actType == "exchange_ads") {
          let inOut = item.adDescription.split(";");
          const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
          await clickAds(userId, inOut[0], inOut[1]);
        }

        this.$set(this.loadingStatus, item.actId, false);
        item.extra.buttonName = data.action.web.nextButtonName;
        this.$set(_this.tasksLists, index, item);

        //  const actType = data.actType;
        switch (data.action.web.next) {
          case "REDIRECT":
            if (this.isTgMiniApp) return this.$tg.openAuto(shareUrl);
            location.href = data.action.web.message;
            break;
          case "CLAIM":
            this.$toast2(data.action.web.message, "success");
            break;
          case "COMPLETE":
            this.getTaskList("check");
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
            break;
        }
      } catch (error) {
        console.log(error, "--------");
      }
    },
  },
  components: {
    TimeCountDown,
  },
};
</script>
  
<style lang="scss" scoped>
::v-deep .earn-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  margin: 24px 12px !important;
}

.earn-dialog {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  .close-btn {
    position: absolute;
    right: 18px;
    top: 0;
    cursor: pointer;
  }
  .earn-content {
    z-index: 1;
    position: relative;
    color: #fff;
    width: 327px;
    border-radius: 16px;
    border: 1px solid #45516f80;
    padding: 12px;
    background: linear-gradient(179.52deg, #000a10 8.53%, #003e70 99.59%),
      linear-gradient(
        180deg,
        rgba(17, 2, 252, 0.15) 28.41%,
        rgba(15, 225, 248, 0) 100%
      );
    .logo {
      position: absolute;
      top: -28px;
      
      z-index: 3;
      border-radius: 80px;
      border: 4px solid rgba(15, 225, 248, 0.25);
    }
    .earning-btn {
      height: 34px;
      padding: 8px 16px;
      border-radius: 4px;
      background: linear-gradient(99.62deg, #dc33d6 0%, #ff3821 100%);
      .btn-text {
        font-size: 14px;
        font-weight: 700;
        line-height: 16px;
        color: #fff;
        letter-spacing: normal;
      }
      .hot-icon {
        margin-bottom: 4px;
      }
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
    .text {
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      color: #0fe1f8;
    }
    
    .countdown {
      font-size: 14px;
      font-weight: 300;
      line-height: 17px;
      text-align: left;
      color: #ffce56;
      .endtime {
        font-size: 14px;
        color: #0fe1f8;
        ::v-deep .label {
          background-color: #ffce56;
          padding: 0px 4px;
          margin-right: 2px;
          margin-left: 2px;
          border-radius: 2px;
          color: #000;
          height: 24px;
          line-height: 24px;
        }
      }
      .timer {
        width: 20px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border-radius: 2px;
        background: #ffce56;
        color: #000;
        font-size: 12px;
        font-weight: 400;
        margin-left: 2px;
      }
    }
    .unlock-node {
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
      text-shadow: 0px 0px 10px #6172f3;
    }
    .back-step {
      background: linear-gradient(
        270.31deg,
        rgba(255, 255, 255, 0) 0.18%,
        rgba(0, 114, 248, 0.2) 100.11%
      );
    }
    .step {
      padding: 8px 12px;
      background: linear-gradient(
        135deg,
        rgb(33, 61, 92) 0,
        rgb(33, 61, 92) 10%,
        transparent 10%,
        transparent 50%,
        rgb(33, 61, 92) 50%,
        rgb(33, 61, 92) 60%,
        transparent 60%,
        transparent 100%
      );
      background-size: 8px 8px;
      color: #fff;
      .step-number {
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        background: #6172f380;
      }
      .step-text {
        font-size: 14px;
        font-weight: 400;
        margin-left: 8px;
        width: fit-content;
      }
      .go-btn {
        height: 25px;
        min-width: 51px;
        padding: 4px 13px;
        border-radius: 4px;
        letter-spacing: normal;
        background: linear-gradient(96.98deg, #0fe1f8 -22.19%, #1102fc 99.83%);
        .btn-text {
          font-size: 14px;
          font-weight: 400;
          color: #fff;
          letter-spacing: normal;
        }
      }
      .drawer-btn {
        height: 25px;
        min-width: 51px;
        background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
        box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
        color: #fff !important;
        font-size: 14px;
        font-weight: 400;
        padding: 0 10px;
        cursor: pointer;
        letter-spacing: normal;
      }
      .done-btn {
        height: 25px;
        min-width: 51px;
        border-radius: 21px;
        background: #17B26A !important;
        color: #fff !important;
        cursor: not-allowed;
      }
      
    }
    .start-btn {
      height: 40px;
      width: 100%;
      padding: 4px 13px;
      border-radius: 4px;
      background: linear-gradient(96.98deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      color: #fff;
      letter-spacing: normal;
    }
    .unlock-btn {
      height: 40px;
      width: 100%;
      padding: 4px 13px;
      border-radius: 4px;
      background: #0FE1F80D;
      color: #0FE1F8;
      font-size: 14px;
      letter-spacing: normal;
      img {
        margin-right: 4px;
      }
    }
    ::v-deep .v-btn--disabled {
      background: #31383F!important;
      color: #FFFFFF50 !important;
    }
    .view {
      font-size: 12px;
      font-weight: 400;
      line-height: 14.52px;
      color: #c0c1c2;
      margin-left: 4px;
    }
  }
  .project-info-footer{
    position: relative;
    background-color: #6172F3;
    color: #fff;
    margin-top: -14px;
    z-index: 0;
    width: 327px;
    border-radius: 16px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border: 1px solid #45516f80;
    padding: 20px 12px 10px 12px;
    .evm-wallet {
      color: #fff;
    }
    .bind-btn {
      width: 80px;
      font-size: 14px;
      background: #FFFFFF;
      color: #121536;
      letter-spacing: normal;
      ::v-deep .v-btn__content{
        line-height: 16px;
      }
      img{
        margin-right: 4px;
      }
    }
  }
}

.cancel-btn {
  color: #fff !important;
  font-weight: 500;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  background: transparent !important;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
</style>
  