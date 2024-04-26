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
              <div class="raas-rpc-item">
                <div class="raas-rpc-item-title">RPC</div>
                <div class="raas-rpc-item-content">
                  <span> {{ infoData.detail.rpc }} </span>
                  <v-btn
                    icon
                    class="task-button"
                    v-clipboard="infoData.detail.rpc"
                    @success="$toast('Copied!')"
                  >
                    <v-icon size="16" color="primary">mdi-content-copy</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="raas-rpc-item">
                <div class="raas-rpc-item-title">WS</div>
                <div class="raas-rpc-item-content">
                  <span> {{ infoData.detail.ws }} </span>
                  <v-btn
                    icon
                    class="task-button"
                    v-clipboard="infoData.detail.ws"
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
              <v-col v-for="item in linkItem" :key="item.key" cols="12" md="6">
                <div class="d-flex space-btw al-c raas-box-bg py-7 px-3">
                  <div class="d-flex al-c">
                    <img :src="item.icon" width="24" />
                    <span class="raas-title ml-2">{{ item.text }}</span>
                  </div>
                  <div class="d-flex al-c cursor-p" @click="onLinkActive(item)">
                    <img
                      src="@/assets/imgs/raas/link-external.svg"
                      width="24"
                    />
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
      <div class="rollup-list">
        <table class="rollup-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Type</th>
              <th scope="col">Address</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border-bottom-tr"
              v-for="(item, key, index) in sequncerAddressBalanceObj"
              :key="item.id"
            >
              <td>
                <div class="bill-type">
                  {{ index + 1 }}
                </div>
              </td>
              <td>
                <div class="bill-plan">
                  <span> {{ key }}</span>
                </div>
              </td>
              <td>
                <div class="bill-plan">
                  <span> {{ item }}</span>
                  <v-btn
                    icon
                    class="task-button"
                    v-clipboard="item"
                    @success="$toast('Copied!')"
                  >
                    <v-icon size="16" color="#0F172A">mdi-content-copy</v-icon>
                  </v-btn>
                </div>
              </td>
              <td>
                <div class="bill-plan">
                  <span> {{ getBalance(item) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="860">
      <v-card>
        <v-card-actions class="d-flex al-c space-btw">
          <span class="raas-title"> {{ dialogTitle }} </span>
          <div>
            <v-btn
              icon
              v-clipboard="
                () => {
                  return jsonCode;
                }
              "
              @success="$toast('Copied!')"
            >
              <v-icon size="16">mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-actions>

        <v-card-text>
          <SimpleCodeEditor
            theme="github"
            :modelValue.sync="jsonCode"
            width="100%"
            height="500px"
            readOnly
          ></SimpleCodeEditor>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SimpleCodeEditor from "@/views/hosting/common/simple-code-editor";
import { fetchEthBalance } from "@/api/raas.js";
export default {
  name: "DashboardWebsiteRaasDetails",
  components: { SimpleCodeEditor },
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {
          detail: {
            rpc: "",
            ws: "",
          },
        };
      },
    },
  },
  watch: {
    infoData(val) {
      this.init(val.detail);
    },
  },
  data() {
    return {
      dialog: false,
      dialogTitle: "",
      jsonCode: "",
      infoObj: [
        {
          key: "settlementLayer",
          value: "",
          text: "Settlement Layer",
        },
        {
          key: "gasBlockLimit",
          value: "",
          text: "Gas Block Limit",
        },
        {
          key: "withdrawPeriod",
          value: "",
          text: "Withdraw Period",
        },
        {
          key: "gasToken",
          value: "",
          text: "Gas Token",
        },
        {
          key: "framework",
          value: "",
          text: "Framework",
        },
        {
          key: "daLayer",
          value: "",
          text: "DA Layer",
        },
      ],
      linkItem: [
        {
          key: "blockExplorer",
          icon: require("@/assets/imgs/raas/block.svg"),
          text: "Block Explorer",
          link: "",
          value: "",
          type: "link",
        },
        {
          key: "bridgeAssets",
          icon: require("@/assets/imgs/raas/bridge.svg"),
          text: "Bridge Assets",
          link: "",
          value: "",
          type: "link",
        },
        {
          key: "contractAddress",
          icon: require("@/assets/imgs/raas/contract.svg"),
          text: "Contract Address",
          link: "",
          value: "",
          type: "dialog",
        },
        {
          key: "rollupConfig",
          icon: require("@/assets/imgs/raas/rollup.svg"),
          text: "Rollup Config",
          link: "",
          value: "",
          type: "dialog",
        },
      ],
      sequncerAddressBalanceObj: {},
    };
  },

  mounted() {},

  methods: {
    init(val) {
      const detail = val;
      this.infoObj.forEach((element) => {
        element.value = detail[element.key];
      });
      this.linkItem.forEach((element) => {
        element.value = detail[element.key];
      });
      const sequncerAddressBalanceObj = JSON.parse(
        detail.sequncerAddressBalance
      );
      this.sequncerAddressBalanceObj = sequncerAddressBalanceObj;
    },
    onLinkActive(item) {
      if (item.type == "link") {
        window.open(item.value);
      }
      if (item.type == "dialog") {
        this.dialogTitle = item.text;
        this.jsonCode = item.value;
        this.dialog = true;
      }
    },

    async getBalance(address) {
      const { data } = await fetchEthBalance(address);
      const balance = data.balance;
      console.log(balance);
      return balance;
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
