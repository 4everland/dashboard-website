<template>
  <div class="task-box">
    <div class="task-tit">Tasks</div>
    <div class="task-tips">
      Complete tasks to unlock the prize pool sharing eligibility. Rewards will
      be distributed uniformly at the end of the event.
    </div>
    <div class="task-list">
      <div class="task-item" v-for="(item, index) in taskList" :key="index">
        <div class="task-item-top">
          <div>
            <img src="@/assets/imgs/more/arrow-left.svg" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div>
            <v-btn style="color: #fff" color="#039CFF" @click="onLogin"
              >Login</v-btn
            >
          </div>
        </div>
        <div class="task-item-bottom">
          <div class="task-item-bottom-description">{{ item.description }}</div>
          <div class="task-item-bottom-reward">
            <span>Requirements</span>
            <span class="task-item-bottom-reward-points"
              >{{ item.reward }} Points</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchTaskList } from "@/api/airdrop.js";

export default {
  name: "DashboardWebsiteBnbTask",

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
          child: [],
        },
        {
          name: "Level 2",
          type: "FOREVER_PASS_BNB_TASK_2",
          description:
            "Confirm your eligibility for BNB Chain's Airdrop Alliance Program level 2 criteria.",
          taskStatus: "",
          reward: 0,
          child: [],
        },
        {
          name: "Level 3",
          type: "FOREVER_PASS_BNB_TASK_3",
          description:
            "Complete the tasks according to the requirements below to earn extra points.",
          taskStatus: "",
          reward: 0,
          child: [
            {
              name: "Step1: Follow on X",
              type: "FOLLOW_TWITTER",
              description: "Follow @4everland_org on X to earn points.",
              taskStatus: "",
              reward: 0,
              btnName: "Follow",
            },
            {
              name: "Step2: Join Discord",
              type: "JOIN_DISCORD",
              description:
                "Connect your Discord and join our server to earn points.",
              taskStatus: "",
              reward: 0,
              btnName: "Join",
            },
            {
              name: "Step3: Share on X",
              type: "FOREVER_PASS_SHARE_TWITTER",
              description: "Share on Xto earn points.",
              taskStatus: "",
              reward: 0,
              btnName: "Share",
            },
            {
              name: "Step4: Standard user",
              type: "MINT_ID",
              description:
                "Become a standard user on the 4EVERLAND dashboard to earn points.",
              taskStatus: "",
              reward: 0,
              btnName: "Go to Dashboard",
            },
          ],
        },
      ],
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    async getList() {
      const { data } = await fetchTaskList();
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.task-box {
  color: #fff;
  .task-tit {
    color: #f1f5f9;
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
      padding: 16px 24px;
      &-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &-bottom {
        color: #f1f5f9;
        font-size: 12px;
        font-weight: 400;
        &-description {
        }
        &-reward {
          &-points {
            color: #ffce56;
            font-size: 16px;
            font-weight: 700;
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
