<template>
  <div class="chain-detail">
    <div class="chain-info-box">
      <div class="chain-info">
        <v-avatar size="40" class="mr-3">
          <v-img :src="detailData.chainLogo"></v-img>
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
                :class="`dot-${statusFilter(
                  detailData.status,
                  detailData.expirationAt
                )}`"
              ></div>
              <span class="status-text">
                {{ statusFilter(detailData.status, detailData.expirationAt) }}
              </span>
            </span>
          </div>
          <div class="expira-time mt-1">Expiration: 18 July 2023</div>
        </div>
      </div>
      <div>
        <v-btn color="primary" width="130">
          <v-icon> mdi-cloud-upload </v-icon>Renew</v-btn
        >
      </div>
    </div>
    <e-tabs class="mt-6" :list="list" />
  </div>
</template>

<script>
import { fetchRollupDetail } from "@/api/raas.js";

export default {
  name: "DashboardWebsiteDetail",

  data() {
    return {
      detailData: {},
      list: [
        {
          text: "Details",
          comp: "raas-details",
        },
        {
          text: "Logs",
          comp: "raas-logs",
        },
        {
          text: "Setting",
          comp: "raas-setting",
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
    async getDetail() {
      const id = this.$route.params.id;
      const { data } = await fetchRollupDetail(id);
      this.detailData = data;
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
    statusFilter(status, expirationAt) {
      const days = this.formatExpirationAt(expirationAt);
      if (days < 0) {
        status = 4;
      }
      const statusMap = {
        0: "Applying",
        1: "Pending Payment",
        2: "Creating",
        3: "Running",
        4: "Terminated",
      };
      return statusMap[status];
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
