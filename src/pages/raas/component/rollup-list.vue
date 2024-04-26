<template>
  <div class="rollup-list">
    <table class="rollup-table">
      <thead>
        <tr>
          <th scope="col">Chain</th>
          <th scope="col">Duration</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-bottom-tr"
          :class="
            item.status == 4 ? 'cursor-ban opacity-terminated' : 'cursor-p'
          "
          v-for="item in rollupData?.detail"
          :key="item.id"
          @click="goDetail(item)"
        >
          <td>
            <div class="chain-info-box">
              <v-avatar size="40" class="mr-3">
                <v-img
                  :src="
                    item.favicon || require('@/assets/imgs/raas/Avatar.png')
                  "
                ></v-img>
              </v-avatar>
              <div>
                <div class="chain-name">{{ item.chainName || "-" }}</div>
                <div class="chain-id" v-if="item.chainId">
                  ChainId:{{ item.chainId }}
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="chain-duration">
              <svg
                v-if="item.status == 3 || item.status == 4"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.99992 6.33325V8.99992L9.66658 9.99992M7.99992 3.33325C4.8703 3.33325 2.33325 5.8703 2.33325 8.99992C2.33325 12.1295 4.8703 14.6666 7.99992 14.6666C11.1295 14.6666 13.6666 12.1295 13.6666 8.99992C13.6666 5.8703 11.1295 3.33325 7.99992 3.33325ZM7.99992 3.33325V1.33325M6.66659 1.33325H9.33325M13.5526 3.72795L12.5526 2.72795L13.0526 3.22795M2.44727 3.72795L3.44727 2.72795L2.94727 3.22795"
                  :stroke="durationColorFilter(item.expirationAt)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span> {{ formatExpirationText(item) }}</span>
            </div>
          </td>
          <td>
            <div class="chain-status">
              <span class="chain-status-box">
                <div
                  class="dot"
                  :class="`dot-${statusFilter(item.status)}`"
                ></div>
                <span class="status-text">
                  {{ statusFilter(item.status) }}
                </span>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "DashboardWebsiteRollupList",
  props: {
    rollupData: {
      type: Object,
      default() {
        return {
          count: 0,
          detail: [],
        };
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    formatExpirationAt(expirationAt) {
      const now = new Date().getTime();
      const timestamp = expirationAt * 1000 - now;
      if (timestamp <= 0) {
        return 0;
      } else {
        const days = Math.floor(timestamp / 1000 / 60 / 60 / 24);
        return days;
      }
    },
    formatExpirationText(item) {
      const days = this.formatExpirationAt(item.expirationAt);
      if (item.status == 3) {
        return days + "Days";
      } else if (item.status == 4) {
        return "Expired";
      } else {
        return "-";
      }
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
    goDetail(item) {
      if (item.status == 4) {
        return;
      }
      if (item.status == 3) {
        this.$router.push(`/raas/${item.chainName || "-"}/${item.id}`);
      } else if (item.status == 2) {
        this.$router.push(`/raas/progress/${item.chainName || "-"}/${item.id}`);
      } else {
        this.$router.push(`/raas/status/${item.id}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rollup-list {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
  .rollup-table {
    width: 100%;
    background: #fff;
    text-align: left;
    border-collapse: collapse;

    thead {
      height: 36px;
      background: #f8fafc;
      tr {
        border-bottom: 1px solid #cbd5e1;
      }
    }

    th,
    td {
      padding: 16px 24px;
    }
    .border-bottom-tr {
      border-bottom: 1px solid #cbd5e1;
      &:last-child {
        border: none;
      }
    }
    .opacity-terminated {
      opacity: 0.5;
    }
    .chain-info-box {
      display: flex;
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
    }
    .chain-duration {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #334155;
      font-family: "SF Pro Text";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px; /* 150% */
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
  }
}
</style>
