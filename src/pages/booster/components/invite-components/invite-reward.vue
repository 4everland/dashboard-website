<template>
  <div>
    <div class="invite-reward" ref="inviteReward">
      <div class="reward-progress" :style="{ width: list.length * 100 + 'px' }">
        <PointDesc
          class="point-dot"
          v-for="(item, index) in list"
          :key="index"
          :style="{ left: index * 100 + 'px' }"
          v-bind="item"
        ></PointDesc>

        <div
          class="completed-progress"
          :style="{ width: curTaskIdx * 100 + 40 + 'px' }"
        ></div>
      </div>
    </div>

    <div class="total-invite mt-4 d-flex align-center justify-space-between">
      <div class="d-flex aling-center">
        <span class="total-text">My Invites</span>

        <ICountUp
          class="total-num ml-2"
          :delay="1000"
          :endVal="userInviteCount"
          :options="{
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: '',
          }"
        />
      </div>
      <v-btn
        class="claim-btn text-center"
        @click="handleBatchClaim"
        :loading="loading"
        :disabled="claimList.length == 0"
        :class="{ disabled: claimList.length == 0 }"
      >
        <div>
          <div class="fz-16">Claim</div>
          <div class="fz-12 claim-text">
            {{ claimText }}
          </div>
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { fetchInvite_Milestone_Tasks, inviteBatchClaim } from "@/api/booster";
import PointDesc from "./point-desc.vue";
import ICountUp from "vue-countup-v2";
import { mapState } from "vuex";

export default {
  components: { PointDesc, ICountUp },
  data() {
    return {
      list: [
        {
          status: "UNDO",
          inviteCount: "1",
          pointType: "ton",
          rewardValue: "0.0035",
        },
        {
          status: "UNDO",
          inviteCount: "3",
          pointType: "ton",
          rewardValue: "0.007",
        },
        {
          status: "UNDO",
          inviteCount: "7",
          pointType: "ton",
          rewardValue: "0.014",
        },
        {
          status: "UNDO",
          inviteCount: "15",
          pointType: "ton",
          rewardValue: "0.028",
        },
        {
          status: "UNDO",
          inviteCount: "30",
          pointType: "ton",
          rewardValue: "0.0525",
        },
        {
          status: "UNDO",
          inviteCount: "100",
          pointType: "ton",
          rewardValue: "0.245",
        },

        {
          status: "UNDO",
          inviteCount: "500",
          pointType: "ton",
          rewardValue: "1.4",
        },
      ],
      loading: false,
      curTaskIdx: 0,
    };
  },

  computed: {
    ...mapState({
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
      userInviteCount: (s) => s.moduleBooster.userInviteCount,
    }),
    claimList() {
      return this.list.filter((it) => it.status == "CLAIM");
    },
    claimText() {
      if (this.claimList.length == 0) return "";

      const ton = this.claimList.reduce((prev, it) => {
        console.log(prev);
        return (prev += it.pointType == "ton" ? Number(it.rewardValue) : 0);
      }, 0);
      console.log();
      let text = "";
      if (ton > 0) {
        text += "+" + ton.toFixed(4) + "Ton";
      }

      return text;
    },
  },
  created() {
    this.getTaskList();
  },
  methods: {
    async getTaskList() {
      try {
        const { data } = await fetchInvite_Milestone_Tasks();
        console.log(data);
        if (data) {
          const list = data.items.map((it, i) => {
            if (it.actStatus == "CLAIM" || it.actStatus == "DONE") {
              this.curTaskIdx = i;
            }
            const descArr = it.description.split(":");
            return {
              status: it.actStatus,
              inviteCount: descArr[0],
              pointType: descArr[1],
              rewardValue: descArr[2],
            };
          });

          this.list = list;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async handleBatchClaim() {
      this.loading = true;
      try {
        const data = await inviteBatchClaim();
        console.log(data);
        this.getTaskList();
        this.$store.dispatch("getBoostTonCount");
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },

  watch: {
    list(val, oldVal) {
      if (val.length != oldVal) {
        const completedArr = val.filter(
          (it) => it.status == "DONE" || it.status == "CLAIM"
        );
        this.$refs.inviteReward.scrollTo({
          left: (completedArr.length - 2) * 100,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-reward {
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid #000;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%), #121536;
  overflow: auto;
  .reward-progress {
    position: relative;
    margin: 0 12px;
    height: 8px;
    background: #2b364f;
    border-radius: 16px;
    .point-dot {
      position: absolute;
      z-index: 5;
      left: 8px;
      top: -9px;
    }
    .completed-progress {
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 8px;
      left: 0;
      top: 0;
      background: linear-gradient(163deg, #1102fc 2.92%, #0fe1f8 79.4%);
      border-radius: 16px;
      transition: all 1s ease;
    }
  }
}
.total-invite {
  color: #06090f;
  padding: 8px;
  border-radius: 12px;
  background: linear-gradient(0deg, #fff 0%, #fff 100%),
    linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  .total-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 32px; /* 114.286% */
  }
  .total-num {
    font-family: "DIN Alternate";
    font-size: 28px;
    font-weight: 700;
    line-height: 32px; /* 114.286% */
  }
  .claim-btn {
    letter-spacing: 0;
    padding: 0 24px;
    height: 44px;
    color: #06090f;
    font-weight: 700;
    border-radius: 8px;
    background: linear-gradient(99deg, #ffe205 35.35%, #ffc305 56.77%);

    cursor: pointer;
    .claim-text {
      font-weight: 400;
      line-height: 14px;
    }
  }

  .claim-btn.disabled {
    color: rgba(6, 9, 15, 0.5);
    background: linear-gradient(0deg, #eaecf0 0%, #eaecf0 100%),
      linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  }
}
</style>
