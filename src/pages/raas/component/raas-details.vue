<template>
  <div class="raas-details">
    <div class="rass-network-info rass-box-boder">
      <div class="top-box pa-4">
        <div class="raas-title mb-4">Network Information</div>
        <v-row class="raas-info-list">
          <v-col
            cols="6"
            md="2"
            v-for="item in infoObj"
            :key="item.key"
            class="raas-info-list-item"
          >
            <div class="item-name">{{ item.text }}</div>
            <div class="item-value">{{ item.value }}</div>
          </v-col>
        </v-row>
      </div>
      <div class="bottom-box">
        <v-row class="pa-4">
          <v-col class="rpc-box" cols="12" md="6">
            <div class="raas-box-bg">
              <div class="raas-title mb-4">
                <img src="@/assets/imgs/raas/rpc.svg" width="24" />
                <span> RPC </span>
              </div>
              <div v-for="item in 2" class="raas-rpc-item">
                <div class="raas-rpc-item-title">RPC</div>
                <div class="raas-rpc-item-content">
                  <span> https://rpc-aevo-mainnet-prod-O.t.conduit.xyz </span>
                  <v-btn
                    icon
                    class="task-button"
                    v-clipboard="'shareUrl'"
                    @success="$toast('Copied!')"
                  >
                    <v-icon size="16" color="primary">mdi-content-copy</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <v-col v-for="item in 4" cols="12" md="6">
                <div class="d-flex space-btw al-c raas-box-bg py-7 px-3">
                  <div class="d-flex al-c">
                    <img src="@/assets/imgs/raas/rpc.svg" width="24" />
                    <span class="raas-title ml-2">Block Explorer</span>
                  </div>
                  <div class="d-flex al-c">
                    <img src="@/assets/imgs/raas/rpc.svg" width="24" />
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="rass-box-boder mt-4 pa-4">
      <div class="raas-title mb-4">Sequencer Address Balance</div>
      <div>12345</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardWebsiteRaasDetails",

  data() {
    return {
      infoObj: [
        {
          key: "layer1",
          value: "Sepolia",
          text: "Settlement Layer",
        },
        {
          key: "layer2",
          value: "Sepolia",
          text: "Gas Block Limit",
        },
        {
          key: "layer3",
          value: "Sepolia",
          text: "Withdraw Period",
        },
        {
          key: "layer4",
          value: "Sepolia",
          text: "Gas Token",
        },
        {
          key: "layer5",
          value: "Sepolia",
          text: "Framework",
        },
        {
          key: "layer6",
          value: "Sepolia",
          text: "DA Layer",
        },
      ],
    };
  },

  mounted() {},

  methods: {},
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
.raas-box-bg {
  border-radius: 8px;
  background: #f8fafc;
  padding: 16px;
}
.rass-box-boder {
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #fff;
}
.raas-details {
  .rass-network-info {
    .top-box {
      border-bottom: 1px solid #cbd5e1;
      .raas-info-list {
        display: flex;
        justify-content: space-between;
        .raas-info-list-item {
          .item-name {
            color: #475569;
            font-family: "SF Pro Text";
            font-size: 11px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          .item-value {
            display: flex;
            min-width: 160px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      }
    }
    .bottom-box {
      .rpc-box {
        .raas-rpc-item {
          .raas-rpc-item-title {
            color: #475569;
            font-family: "SF Pro Text";
            font-size: 11px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          .raas-rpc-item-content {
            color: #735ea1;
            font-family: "SF Pro Text";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px; /* 150% */
          }
        }
      }
    }
  }
}
</style>
