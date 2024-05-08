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
        <v-btn
          elevation="0"
          outlined
          width="165"
          @click="addWallet"
          class="mr-2"
        >
          <v-icon class="mr-2"> mdi-wallet-plus-outline </v-icon>Add to
          Wallet</v-btn
        >
        <v-btn
          elevation="0"
          color="primary"
          width="130"
          @click="renewDialog = true"
        >
          <v-icon class="mr-2"> mdi-wallet </v-icon>Renew</v-btn
        >
      </div>
    </div>
    <e-tabs ref="rassTab" class="mt-6" :list="list" />
    <v-dialog v-model="renewDialog" max-width="700">
      <v-card class="pa-2">
        <v-card-actions class="d-flex al-c space-btw">
          <span class="raas-title"> Renew </span>
          <div>
            <v-btn icon @click="renewDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-actions>

        <v-card-text class="mt-6">
          <v-row dense>
            <v-col
              cols="12"
              md="4"
              v-for="(item, index) in timeList"
              :key="item.value"
            >
              <div
                class="renew-item"
                :class="{
                  'renew-item-active': item.value == purchasePlan,
                }"
                @click="chooseTime(item)"
              >
                <div class="renew-item-label">{{ item.label }}</div>
                <div>/</div>
                <div>{{ item.price }}</div>
              </div>
            </v-col>
          </v-row>
          <div class="ta-r mt-6">
            <v-btn text elevation="0" class="mr-6" @click="renewDialog = false"
              >Cancel
            </v-btn>
            <v-btn elevation="0" color="primary" @click="onRenew"
              >Pay with LAND</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { fetchRollupDetail, sendRenew } from "@/api/raas.js";
import { parseTime } from "@/utils/index.js";

export default {
  name: "DashboardWebsiteDetail",

  data() {
    return {
      renewDialog: false,
      purchasePlan: null,
      detailData: {},
      timeList: [
        {
          label: "93 Days",
          value: 3,
          price: "",
        },
        {
          label: "186 Days",
          value: 6,
          price: "",
        },

        {
          label: "372 Days",
          value: 12,
          price: "",
        },
      ],
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
      const renewLand = Number(data.renewLand) / 1e18;
      this.timeList.map((item) => {
        let land = item.value * renewLand;
        let dollar = land / 1e6;
        if (dollar > 1000) {
          dollar = dollar / 1e3 + "k";
        }
        item.price = `${land
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} LANDs≈$${dollar}`;
      });
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
    chooseTime(item) {
      this.purchasePlan = item.value;
    },
    async addWallet() {
      try {
        const chainId = Number(this.detailData.chainId);
        window.ethereum &&
          (await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + chainId.toString(16),
                chainName: this.detailData.chainName,
                nativeCurrency: {
                  name: this.detailData.detail.gasToken,
                  symbol: this.detailData.detail.gasToken,
                  decimals: 18,
                },
                rpcUrls: [this.detailData.detail.rpc],
                blockExplorerUrls: [this.detailData.detail.blockExplorer],
              },
            ],
          }));
      } catch (error) {
        this.$alert(error.message);
      }
    },
    async onRenew() {
      this.onLoading = true;
      const id = this.$route.params.id;
      try {
        await sendRenew(id, { purchasePlan: this.purchasePlan });
        this.$toast("Successfully.");
        this.getDetail();
        this.renewDialog = false;
        if (this.$refs.rassTab.curIdx == 3) {
          this.$refs.rassTab.$children[2].getList();
        }
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
.raas-title {
  color: #0f172a;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.renew-item {
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  background: #f1f5f9;
  text-align: center;
  color: #0f172a;
  text-align: center;
  font-family: "SF Pro Text";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 183.333% */
  cursor: pointer;
  .renew-item-label {
    color: #0f172a;
    font-family: "SF Pro Text";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
.renew-item-active {
  border: 1px solid #735ea1;
  background: #f3e8ff;
}
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
