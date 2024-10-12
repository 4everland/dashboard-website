<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog"
      v-model="value"
      @click:outside="$emit('input', false)"
    >
      <div class="daily-boost">
        <img
          class="lightning"
          src="/img/booster/reward/lightning.png"
          width="169"
          alt=""
        />

        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />
        <div class="daily-boost-title text-center">Daily Boost</div>
        <div class="sign-content">
          <div
            class="sign-item pa-1 text-center"
            :class="{ 'sign-today-item': it.day == today }"
            v-for="(it, i) in list"
            :key="it.day"
          >
            <div
              class="text-center fz-12"
              :class="{
                'past-header': it.signed && it.day !== today,
                'today-header': it.day == today,
                'today-header-undo': it.day == today && !it.signed,
                'future-header': !it.signed && it.day !== today,
              }"
            >
              <img
                v-if="it.signed"
                src="/img/booster/drawer/check-circle.png"
                width="16"
                alt=""
              />
              <span>
                {{
                  it.day == today
                    ? "Today"
                    : i == 7
                    ? "GO ON!"
                    : "Day " + it.day
                }}</span
              >
            </div>

            <div class="pos-r">
              <img
                :style="{
                  opacity: it.signed && it.day !== today ? '0.25' : '1',
                }"
                src="/img/booster/daily-boost/battery.png"
                width="56"
                alt=""
              />
              <img
                v-if="it.day == today"
                class="lightning-bg"
                src="/img/booster/daily-boost/lightning-bg.png"
                width="56"
                alt=""
              />
            </div>
            <div class="fz-12 text-center">+{{ it.reward }} pts/h</div>
          </div>
        </div>

        <div
          class="d-flex align-center daily-sign-footer mt-3"
          style="gap: 8px"
        >
          <div class="flex-1" style="width: 100%">
            <v-btn
              class="checkin-btn"
              @click="handleCheckin"
              style="width: 100%"
              height="44"
              :disabled="checkinDisabled"
              :loading="checkinLoading"
            >
              <div v-if="!checkinDisabled">
                <span>Checkin</span>
                <span>+1 pts/h</span>
              </div>
              <div v-else>Checked</div>
            </v-btn>
          </div>

          <div class="flex-1" style="width: 100%">
            <v-btn
              class="boost-btn"
              style="width: 100%"
              height="44"
              @click="handleBoostClaim"
            >
              <div class="boost-btn-tips">CLAIM LAND</div>
              <div class="d-flex align-center">
                <span class="fz-20 fw-b" style="font-style: italic">Boost</span>
                <span class="ml-2">+{{ todayInfoReward }} pts/h</span>
              </div>
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>

    <RewardDialog v-model="showReward" reward="Boost Rate +1 pts/h">
      <div class="d-flex align-center justify-center mt-8" style="gap: 8px">
        <v-btn
          class="cancel-btn"
          :width="106"
          height="44"
          @click="showReward = false"
        >
          <span>Cancel</span>
        </v-btn>

        <v-btn
          class="boost-btn"
          :width="213"
          height="44"
          @click="handleBoostClaim"
        >
          <div class="boost-btn-tips">CLAIM LAND</div>
          <span>Boost</span>
          <span>+{{ todayInfoReward }} pts/h</span>
        </v-btn>
      </div>
    </RewardDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { onNext } from "@/api/booster";
import { bus } from "@/utils/bus";
import RewardDialog from "./reward-dialog.vue";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      list: [],
      checkinInfo: null,
      checkinLoading: false,
      showReward: false,
      today: 1,
    };
  },

  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      dailySign: (s) => s.moduleBooster.dailySign,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    checkinDisabled() {
      if (!this.checkinInfo) return true;
      return this.checkinInfo.actStatus !== "CLAIM";
    },
    todayInfoReward() {
      const list = this.list.filter((it) => it.day == this.today);
      if (list.length > 0) {
        return list[0].reward;
      }
      return "10";
    },
  },

  methods: {
    async transferDailySign() {
      this.checkinInfo = this.dailySign[1];
      const continuous = this.dailySign[0].extra.dailySign.continuous;
      const undo = this.dailySign[0].actStatus == "UNDO";
      const list = [];
      this.today = undo ? continuous + 1 : continuous;
      let position = Math.min(this.today, 7); //  position = [1,7]
      let start = Math.max(this.today - 6, 1); // start = [1, inf]
      for (let i = 1; i <= 8; i++) {
        //generate 8 elements
        list.push({
          day: start,
          reward: start <= 7 ? i * 10 : 70,
          signed: position > i || (position == i && !undo), // position never larger than 7
        });
        start++;
      }

      this.list = list;
    },
    async handleCheckin() {
      this.checkinLoading = true;
      try {
        await onNext(this.checkinInfo.actId);
        this.$emit("input", false);
        this.showReward = true;
        this.$store.dispatch("getDailySign");
      } catch (err) {
        console.log(err);
      }
      this.checkinLoading = false;
    },
    handleBoostClaim() {
      if (!this.userInfo.wallet && !this.isTgMiniApp) {
        this.$store.dispatch("BindWalletToggle");
        this.$emit("input", false);
        this.showReward = false;
      } else {
        const land = 50000;
        const report = true;
        bus.$emit("showDepositDialog", { land, report });
        this.$emit("input", false);
        this.showReward = false;
      }
    },
  },
  components: {
    RewardDialog,
  },
  watch: {
    value(val) {
      if (val) {
        this.$store.dispatch("getDailySign");
        this.transferDailySign();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .daily-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}

@media screen and (max-width: 900px) {
  .daily-sign-footer {
    flex-direction: column-reverse;
  }
}

.daily-boost {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  background: url("/img/booster/daily-boost/bg.png");
  background-size: 100% 100%;
  .close-btn {
    position: absolute;
    right: 0;
    top: -40px;
    cursor: pointer;
  }

  .lightning {
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
  }
  .daily-boost-title {
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 245px;
    position: absolute;
    color: #fff;
    text-shadow: 0px 0px 8px #6172f3;
    font-size: 24px;
    font-weight: 700;
    border-radius: 4px 4px 32px 32px;
    background: linear-gradient(
        99deg,
        rgba(211, 212, 213, 0.15) 12.86%,
        rgba(139, 145, 147, 0.15) 15.34%,
        rgba(87, 95, 99, 0.15) 17.82%,
        rgba(55, 65, 69, 0.15) 18.64%,
        rgba(43, 54, 58, 0.15) 19.47%,
        rgba(52, 62, 66, 0.15) 22.77%,
        rgba(77, 85, 89, 0.15) 26.9%,
        rgba(117, 123, 126, 0.15) 32.68%,
        rgba(173, 176, 177, 0.15) 38.46%,
        rgba(205, 205, 206, 0.15) 41.76%,
        rgba(198, 199, 200, 0.15) 43.41%,
        rgba(180, 182, 184, 0.15) 45.06%,
        rgba(151, 156, 158, 0.15) 46.71%,
        rgba(111, 118, 122, 0.15) 49.19%,
        rgba(72, 83, 87, 0.15) 50.84%,
        rgba(76, 86, 90, 0.15) 52.49%,
        rgba(89, 98, 102, 0.15) 54.97%,
        rgba(112, 117, 120, 0.15) 57.45%,
        rgba(143, 144, 146, 0.15) 59.1%,
        rgba(152, 152, 154, 0.15) 59.92%,
        rgba(165, 165, 166, 0.15) 63.23%,
        rgba(199, 199, 200, 0.15) 70.66%,
        rgba(255, 255, 255, 0.15) 78.91%,
        rgba(209, 209, 210, 0.15) 81.39%,
        rgba(79, 79, 83, 0.15) 87.17%,
        rgba(27, 27, 32, 0.15) 90.47%,
        rgba(49, 49, 54, 0.15) 91.3%,
        rgba(77, 77, 81, 0.15) 92.12%,
        rgba(116, 116, 118, 0.15) 92.95%,
        rgba(165, 165, 167, 0.15) 94.6%,
        rgba(233, 233, 233, 0.15) 95.43%
      ),
      linear-gradient(0deg, #6172f3 0%, #6172f3 100%), #e8e8e8;
    background-blend-mode: hard-light, normal, normal;
  }

  .sign-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    border-radius: 16px;
    background: #121536;
    .sign-item {
      width: calc((100% - 24px) / 4);
      box-sizing: border-box;
      color: #fff;
      border-radius: 12px;
      background: rgba(45, 50, 130, 0.5);
      box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.15) inset;

      .past-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px;
        border-radius: 8px;
        background: rgba(97, 114, 243, 0.05);
      }
      .today-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 8px;
        background: #121536;
        padding: 4px;
      }
      .today-header.today-header-undo {
        justify-content: center;
      }
      .future-header {
        border-radius: 8px;
        background: rgba(97, 114, 243, 0.25);
        padding: 4px 0;
      }
    }

    .sign-item.sign-today-item {
      background: linear-gradient(165deg, #0fe1f8 7.05%, #1102fc 97.43%),
        #6172f3;
      box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.15) inset;
    }
  }

  .checkin-btn {
    color: #fff !important;
    padding: 0 !important;
    letter-spacing: 0;
    backdrop-filter: blur(2px);
    border-radius: 12px;
    background: #039cff !important;
  }

  .lightning-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 56px;
    height: 56px;
  }
}

.boost-btn {
  position: relative;
  color: #fff !important;
  padding: 0 !important;
  letter-spacing: 0;
  backdrop-filter: blur(2px);
  border-radius: 12px;
  background: linear-gradient(180deg, #ffa927 0%, rgba(255, 169, 39, 0) 59.56%),
    linear-gradient(270deg, rgba(255, 114, 114, 0) 27%, #ff7272 100%),
    linear-gradient(327deg, #ff7c32 2.65%, rgba(255, 169, 39, 0) 33.12%),
    linear-gradient(to bottom right, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
      bottom right / 50% 50% no-repeat,
    linear-gradient(to bottom left, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
      bottom left / 50% 50% no-repeat,
    linear-gradient(to top left, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top left /
      50% 50% no-repeat,
    linear-gradient(to top right, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top
      right / 50% 50% no-repeat,
    linear-gradient(90deg, rgba(255, 53, 53, 0) 28%, #ff3535 100%), #ff35ba;
  box-shadow: 0px 3px 1px 0px rgba(255, 255, 255, 0.4) inset,
    0px 4px 1px 0px rgba(255, 255, 255, 0.86) inset,
    0px 0px 6px 0px rgba(0, 0, 0, 0.2) inset,
    0px -2px 5px 0px rgba(0, 0, 0, 0.3) inset;

  .boost-btn-tips {
    position: absolute;
    right: 0;
    top: -15px;
    padding: 0 12px;
    // font-style: italic;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.8);
    font-size: 12px;
    transform: skew(-20deg);
    border-radius: 4px;
    background: radial-gradient(
        46.43% 45.33% at 41.69% 50%,
        #ffde7f 0%,
        rgba(255, 64, 1, 0) 100%
      ),
      radial-gradient(
        118.43% 40.42% at 7.72% 28.75%,
        #fffda6 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #ffe433;
  }
}

.cancel-btn {
  color: #fff !important;
  font-weight: 500;

  background: transparent !important;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
</style>
