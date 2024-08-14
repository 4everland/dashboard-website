<template>
  <div class="rollup-list">
    <table class="rollup-table">
      <thead>
        <tr>
          <th scope="col">Type</th>
          <th scope="col">Plan</th>
          <th scope="col">Amount</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-bottom-tr" v-for="item in listData" :key="item.id">
          <td>
            <div class="bill-type">
              {{ item.billType | statusFilter }}
            </div>
          </td>
          <td>
            <div class="bill-plan">
              <span> {{ item.time + " Days" }}</span>
            </div>
          </td>
          <td>
            <div class="bill-plan">
              <span>
                {{
                  (item.land / 1e18 / 1e6)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                  "M" +
                  " LAND"
                }}</span
              >
            </div>
          </td>
          <td>
            <div class="bill-plan">
              <span>
                {{ parseTime(item.createdAt, "{y}-{m}-{d}") + " Paid" }}</span
              >
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchRollupBillings } from "@/api/raas.js";
import { parseTime } from "@/utils/index.js";
import { bus } from "@/utils/bus.js";

export default {
  name: "DashboardWebsiteRaasBillings",
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
    active: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "Create Rollup",
        1: "Renew",
      };
      return statusMap[status];
    },
  },
  watch: {
    active(val) {
      if (val) {
        this.getList();
      }
    },
  },
  data() {
    return {
      listData: [],
    };
  },
  created() {
    bus.$on("getRassBilling", () => {
      this.getList();
    });
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getList();
  },
  methods: {
    parseTime,
    async getList() {
      const params = {
        page: 0,
        size: 20,
        rollupId: this.id,
      };
      const { data } = await fetchRollupBillings(params);
      this.listData = data.details;
    },
  },
};
</script>

<style lang="scss" scoped>
.rollup-list {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  overflow-x: scroll;
  .rollup-table {
    width: 100%;
    background: #fff;
    text-align: left;
    border-collapse: collapse;
    overflow-x: scroll;
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
    .bill-type {
      color: #0f172a;
      font-family: "SF Pro Text";
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
    .bill-plan {
      color: #0f172a;
      font-family: "SF Pro Text";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-transform: capitalize;
    }
  }
}
</style>
