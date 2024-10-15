<template>
  <div>
    <div
      class="task-item-box"
      v-for="item in list"
      :key="item.inExchangeCampaignId"
    >
      <div class="task-item-left">
        <img class="task-item-image" :src="item.icon" alt="" />
        <div class="task-text-box">
          <div class="task-name">{{ item.text }}</div>
          <div class="task-desc">{{ 3213123123 }}</div>
        </div>
      </div>

      <div class="task-item-right">
        <v-btn
          class="go-btn"
          @click="handleClick(item)"
          width="84"
          @success="() => $toast2('Copied!', 'success')"
          >Go</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getAds, clickAds } from "@/api/ton-ads";
export default {
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      // const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      const { data } = await getAds("5403887592", 5);

      console.log(data);
      this.list = data.data.exchangeCampaigns;
    },
    async handleClick({
      inExchangeCampaignId,
      outExchangeCampaignId,
      destination,
    }) {
      await clickAds("5403887592", inExchangeCampaignId, outExchangeCampaignId);
      window.open(destination.url);
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
.task-item-box {
  margin: 18px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .task-item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    .task-item-image {
      width: 44px;
      border-radius: 100%;
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
        color: #a4bcfd;
      }
    }
  }
}
</style>
