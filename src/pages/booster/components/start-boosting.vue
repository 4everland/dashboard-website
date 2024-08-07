<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="start-boosting d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />
        <div class="text-center" style="margin-bottom: 44px">
          <img src="/img/booster/boost-icon.png" width="94" alt="" />
        </div>
        <div class="text-center fz-20 mb-4 fw-b">START BOOSTING</div>
        <div v-for="(item, idx) in activity" :key="item.actId">
          <div
            class="boosting-task d-flex align-center justify-space-between pa-3 fz-14"
            v-if="item.actType != 'invite'"
          >
            <div class="d-flex align-center">
              <div class="idx">{{ idx + 1 }}</div>
              <div class="ml-4">{{ item.actName }}</div>
            </div>
            <v-btn
              class="act-btn"
              @click="handleNext(item.actId)"
              :disabled="item.actStatus == 'DONE'"
            >
              {{ item.extra.buttonName }}
            </v-btn>
          </div>

          <div class="boosting-task pa-3 fz-14" v-else>
            <div class="d-flex align-center">
              <div class="idx">{{ idx + 1 }}</div>
              <div class="ml-4">
                <div>Invite code (optional)</div>
                <div>Boost production rate by</div>
                <div>+10/H for 24 hours</div>
              </div>
            </div>
            <div class="invite-content mt-2" style="width: 50%">
              <input
                class="invite-input"
                type="text"
                v-model="inviteCode"
                placeholder="Enter your invite code"
              />
            </div>
          </div>
        </div>
        <v-btn
          class="start-boost-btn"
          height="54"
          style="color: #fff"
          @click="handleStartBoost"
          :disabled="startDisabled"
          :loading="loading"
        >
          Start Boosting Now
        </v-btn>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="738px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="booster-module-dialog">
        <div class="start-boosting-dialog">
          <img
            class="close-btn"
            @click="$emit('input', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />

          <img
            class="boost-icon"
            src="/img/booster/boost-icon.png"
            width="94"
            alt=""
          />

          <div class="text-center fz-20 mt-4 fw-b">START BOOSTING</div>
          <div
            class="boosting-task fz-14"
            v-for="(item, idx) in activity"
            :key="item.actId"
          >
            <div
              v-if="item.actType != 'invite'"
              class="d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center">
                <div class="idx">{{ idx + 1 }}</div>
                <div class="ml-4">{{ item.actName }}</div>
              </div>
              <v-btn
                class="act-btn"
                @click="handleNext(item.actId)"
                :disabled="item.actStatus == 'DONE'"
              >
                {{ item.extra.buttonName }}
              </v-btn>
            </div>
            <div class="d-flex align-center justify-space-between" v-else>
              <div class="d-flex align-center">
                <div class="idx">{{ idx + 1 }}</div>
                <div class="ml-4">
                  <span>Invite code (optional)</span>
                  <span
                    class="fz-12 ml-2"
                    style="color: rgba(255, 255, 255, 0.6)"
                    >Boost production rate by +10/H for 24 hours</span
                  >
                </div>
              </div>
              <div class="invite-content">
                <input
                  class="invite-input"
                  type="text"
                  v-model="inviteCode"
                  placeholder="Enter your invite code"
                />
              </div>
            </div>
          </div>

          <div
            class="d-flex align-center justify-center"
            style="margin-top: 30px"
          >
            <v-btn
              class="start-boost-btn"
              height="54"
              :disabled="startDisabled"
              @click="handleStartBoost"
              :loading="loading"
            >
              Start Boosting Now
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { fetchPreTaskActivity, initBoost, onNext } from "@/api/booster";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      // overlay: false,
      activity: [],
      inviteCode: "",
      loading: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    startDisabled() {
      return this.activity.filter((it) => it.actStatus == "DONE").length < 4;
    },
  },
  created() {
    if (this.$route.query) {
      this.inviteCode = this.$route.query.boosterCode;
    }
    this.getTaskList();
  },
  methods: {
    async getTaskList() {
      try {
        const { data } = await fetchPreTaskActivity();
        if (data) {
          this.activity = data.items;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async handleStartBoost() {
      this.loading = true;
      try {
        const { data } = await initBoost(this.inviteCode);
        console.log(data);
        this.$store.dispatch("getBoosterUserInfo");
        this.$emit("input", false);
        this.$emit("showEndPoints");
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },

    async handleNext(id) {
      try {
        const { data, message } = await onNext(id);
        if (message) {
          return this.$toast2(message, "error");
        }
        const idx = this.activity.findIndex((it) => it.actId == data.actId);
        console.log(data);
        this.activity[idx].actStatus = data.actStatus;
        if (data.action.web.nextButtonName) {
          this.activity[idx].extra.buttonName = data.action.web.nextButtonName;
        }
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
        setTimeout(() => {
          this.getTaskList();
        }, 6000);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.start-boosting {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .boosting-task {
    margin-bottom: 8px;
    background: url("/img/booster/svg/fringe-bg.svg");
    .idx {
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #000;
      font-weight: bold;
      border-radius: 100%;
      background: rgba(255, 255, 255, 0.6);
    }
    .act-btn {
      color: #fff;
      width: 88px;
      height: 29px;
      line-height: 29px;
      text-align: center;
      border-radius: 4px;
      background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
    }
  }
  .start-boost-btn {
    margin: 34px auto 0;
    width: 50%;
    padding: 16px 24px;
    border-radius: 4px;
    text-shadow: 0px 0px 8px #6172f3;
    border: 1px solid #0e6cc6;
    background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
      0px 4px 8px 0px rgba(0, 133, 195, 0.25);
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 524px;
  background: url("/img/booster/svg/dialog-bg.svg") no-repeat;
  background-size: contain;
}
.start-boosting-dialog {
  position: relative;
  height: 100%;
  padding: 26px 7px 20px 7px;
  color: #fff;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);

  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  .boost-icon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -50px;
  }
  .boosting-task {
    padding: 12px 24px;
    margin-bottom: 8px;
    background: url("/img/booster/svg/fringe-bg.svg");
    .idx {
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #000;
      font-weight: bold;
      border-radius: 100%;
      background: rgba(255, 255, 255, 0.6);
    }
    .act-btn {
      color: #fff;
      width: 88px;
      height: 29px;
      line-height: 29px;
      text-align: center;
      border-radius: 4px;
      background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
      cursor: pointer;
    }
  }
  .boosting-task:hover {
    background: linear-gradient(
        270deg,
        rgba(0, 114, 248, 0) 0.18%,
        rgba(0, 114, 248, 0.2) 100.11%
      ),
      url("/img/booster/svg/fringe-bg.svg");
  }
  .start-boost-btn {
    margin-top: 8px;
    padding: 16px 24px;
    color: #fff !important;
    border-radius: 4px;
    border: 1px solid #0e6cc6;
    background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
      0px 4px 8px 0px rgba(0, 133, 195, 0.25);
    cursor: pointer;
  }
}
.invite-content {
  padding: 8px;
  border-radius: 4px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(49, 49, 49, 0.9);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
  .invite-input {
    width: 100%;
    color: #fff;
  }
}
</style>
