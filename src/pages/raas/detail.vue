<template>
  <div class="chain-detail">
    <div class="chain-info-box">
      <div class="chain-info">
        <v-avatar size="40" class="mr-3">
          <v-img
            :src="
              detailData.favicon || require('@/assets/imgs/raas/Avatar.png')
            "
          ></v-img>
        </v-avatar>
        <div class="mr-2">
          <div class="chain-name">{{ detailData.chainName }}</div>
          <div class="chain-id mt-2">ChainId:{{ detailData.chainId }}</div>
        </div>
        <div>
          <div class="chain-status">
            <span class="chain-status-box">
              <div
                class="dot"
                :class="`dot-${statusFilter(detailData.status)}`"
              ></div>
              <span class="status-text">
                {{ statusFilter(detailData.status) }}
              </span>
            </span>
          </div>
          <div class="expira-time mt-1">
            Expiration: {{ parseTime(detailData.expirationAt, "{y}-{m}-{d}") }}
          </div>
        </div>
      </div>
      <div>
        <v-btn color="primary" width="130" @click="onRenew">
          <v-icon class="mr-2"> mdi-wallet </v-icon>Renew</v-btn
        >
      </div>
    </div>
    <e-tabs class="mt-6" :list="list" />
  </div>
</template>

<script>
import { fetchRollupDetail, sendRenew } from "@/api/raas.js";
import { parseTime } from "@/utils/index.js";

export default {
  name: "DashboardWebsiteDetail",

  data() {
    return {
      detailData: {},
      list: [
        {
          text: "Details",
          comp: "raas-details",
          props: {
            infoData: {
              detail: {
                rpc: "",
                ws: "",
              },
            },
          },
        },
        {
          text: "Logs",
          comp: "raas-logs",
        },
        {
          text: "Setting",
          comp: "raas-setting",
          props: {
            infoData: {},
          },
        },
        {
          text: "Billings",
          comp: "raas-Billings",
        },
      ],
    };
  },
  created() {
    this.getDetail();
  },
  mounted() {},

  methods: {
    parseTime,
    async getDetail() {
      const id = this.$route.params.id;
      const { data } = await fetchRollupDetail(id);
      this.detailData = data;
      this.list[0].props.infoData = data;
      this.list[2].props.infoData = data;
    },
    formatExpirationAt(expirationAt) {
      const now = new Date().getTime();
      const timestamp = expirationAt * 1000 - now;
      const days = Math.floor(timestamp / 1000 / 60 / 60 / 24);
      return days;
    },

    durationColorFilter(expirationAt) {
      const days = this.formatExpirationAt(expirationAt);
      let expirationStatus = 0;
      if (days > 30) {
        expirationStatus = 0;
      } else if (days > 0) {
        expirationStatus = 1;
      } else {
        expirationStatus = 2;
      }
      const statusMap = {
        0: "#0F172A",
        1: "#FFAD08",
        2: "#F35950",
      };
      return statusMap[expirationStatus];
    },
    statusFilter(status) {
      const statusMap = {
        0: "Applying",
        1: "Pending Payment",
        2: "Creating",
        3: "Running",
        4: "Terminated",
        5: "Creating",
      };
      return statusMap[status];
    },
    async onRenew() {
      this.onLoading = true;
      const id = this.$route.params.id;
      try {
        await sendRenew(id);
        this.$toast("Successfully.");
      } catch (error) {
        const code = error.code;
        if (code == 10002) {
          this.$confirm(error.message, "Tips", {
            cancelText: "Cancel",
            confirmText: "Deposit",
          }).then(async () => {
            this.$router.push("/billing/deposit");
          });
        } else {
          this.$alert(error.message);
        }
      }
      this.onLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.chain-detail {
  .chain-info-box {
    display: flex;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    background: #fff;
    .chain-info {
      display: flex;
      align-items: center;
      .chain-name {
        color: #0f172a;
        font-family: "SF Pro Text";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
      .chain-id {
        color: #475569;
        font-family: "SF Pro Text";
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      .chain-status {
        display: inline-block;
        min-width: 78px;
        height: 26px;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid #cbd5e1;
        .chain-status-box {
          display: flex;
          align-items: center;
          gap: 4px;
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #039cff;
          }
          .dot-Running {
            background-color: #00bd9a;
          }
          .dot-Terminated {
            background-color: #f35950;
          }
          .status-text {
            color: #334155;
            text-align: center;
            font-family: "SF Pro Text";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
          }
        }
      }
      .expira-time {
        color: #775da6;
        font-family: "SF Pro Text";
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
}
</style>
