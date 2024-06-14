<template>
  <div class="step-first">
    <div class="step-first-top step-top step-bottom-boder">
      <div class="create-title">Create a Rollup</div>
    </div>
    <div class="step-first-bottom step-bottom">
      <div>
        <div class="create-item-title">Framework</div>
        <div class="option-box">
          <v-container fluid>
            <v-row justify="space-between" dense>
              <v-radio-group
                class="mt-0 hide-msg"
                style="width: 100%"
                v-model="stack"
                row
              >
                <v-col
                  cols="12"
                  md="3"
                  v-for="item in stackOption"
                  :key="item.key"
                >
                  <div
                    class="option-item"
                    :class="{
                      'option-item-active': item.value == stack,
                    }"
                    @click.stop="onRadioClick(item)"
                  >
                    <v-radio class="ma-0" :value="item.value">
                      <template slot="label">
                        <div class="option-item-label">
                          <img
                            v-if="item.icon"
                            class="mr-1"
                            :src="item.icon"
                            width="24"
                            alt=""
                          />
                          <span>
                            {{ item.name }}
                          </span>
                        </div>
                      </template>
                    </v-radio>
                  </div>
                </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </div>
      </div>
      <div>
        <div class="create-item-title">Data Avalability</div>
        <div class="option-box">
          <v-container fluid>
            <v-row justify="space-between" dense>
              <v-radio-group
                class="mt-0 hide-msg"
                style="width: 100%"
                v-model="dataAvailability"
                row
              >
                <v-col
                  cols="12"
                  md="3"
                  v-for="item in dataAvailabilityOption"
                  :key="item.key"
                >
                  <div
                    class="option-item"
                    :class="{
                      'option-item-active': item.value == dataAvailability,
                    }"
                    @click.stop="onRadioClick(item)"
                  >
                    <v-radio class="ma-0" :value="item.value">
                      <template slot="label">
                        <div class="option-item-label">
                          <img
                            v-if="item.icon"
                            class="mr-1"
                            :src="item.icon"
                            width="24"
                            alt=""
                          />
                          <span>
                            {{ item.name }}
                          </span>
                        </div>
                      </template>
                    </v-radio>
                  </div>
                </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </div>
      </div>
      <div>
        <div class="create-item-title">Settlement Layer</div>
        <div class="option-box">
          <v-container fluid>
            <v-row justify="space-between" dense>
              <v-radio-group
                class="mt-0 hide-msg"
                style="width: 100%"
                v-model="layer1"
                row
              >
                <v-col
                  cols="12"
                  md="3"
                  v-for="item in layer1Option"
                  :key="item.key"
                >
                  <div
                    class="option-item"
                    :class="{
                      'option-item-active': item.value == layer1,
                    }"
                    @click.stop="onRadioClick(item)"
                  >
                    <v-radio
                      class="ma-0"
                      :value="item.value"
                      @change="layer1Change(item)"
                    >
                      <template slot="label">
                        <div class="option-item-label">
                          <img
                            v-if="item.icon"
                            class="mr-1"
                            :src="item.icon"
                            width="24"
                            alt=""
                          />
                          <span>
                            {{ item.name }}
                          </span>
                        </div>
                      </template>
                    </v-radio>
                  </div>
                </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </div>
      </div>
      <div>
        <div class="create-item-title">Testnet / Mainnet</div>
        <div class="option-box">
          <v-container fluid>
            <v-row justify="space-between" dense>
              <v-radio-group
                class="mt-0 hide-msg"
                style="width: 100%"
                v-model="netWorkType"
                row
              >
                <template v-for="item in netWorkTypeOption">
                  <v-col
                    :key="item.key"
                    cols="12"
                    md="3"
                    v-show="isShowNetwork(item)"
                  >
                    <div
                      class="option-item"
                      :class="{
                        'option-item-active': item.value == netWorkType,
                      }"
                      @click.stop="onRadioClick(item)"
                    >
                      <v-radio class="ma-0" :value="item.value">
                        <template slot="label">
                          <div class="option-item-label">
                            <img
                              v-if="item.icon"
                              class="mr-1"
                              :src="item.icon"
                              width="24"
                              alt=""
                            />
                            <span>
                              {{ item.name }}
                            </span>
                          </div>
                        </template>
                      </v-radio>
                    </div>
                  </v-col>
                </template>
              </v-radio-group>
            </v-row>
          </v-container>
        </div>
      </div>
    </div>
    <div class="ta-r pa-6" style="border-top: 1px solid #cbd5e1">
      <v-btn
        color="primary"
        width="96"
        :disabled="
          !(
            stack != null &&
            dataAvailability != null &&
            layer1 != null &&
            netWorkType != null
          )
        "
        @click="onNext"
      >
        Next
        <v-icon right> mdi-arrow-right </v-icon></v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardWebsiteCreateFirst",

  data() {
    return {
      stack: 0,
      dataAvailability: 6,
      layer1: 0,
      netWorkType: 2,
      nextDisabled: true,
      stackOption: [
        {
          name: "OP Stack",
          key: "Op",
          value: 0,
          icon: require("@/assets/imgs/raas/icon/op.svg"),
          type: "stack",
        },
        {
          name: "Polygon CDK",
          key: "_PolygonCdk",
          value: 2,
          icon: require("@/assets/imgs/raas/icon/polygon.svg"),
          type: "stack",
        },
        // {
        //   name: "Arbitrum Orbit",
        //   key: "Arbitrum_Orbit",
        //   value: 1,
        //   icon: require("@/assets/imgs/raas/icon/arbitrum.png"),
        //   type: "stack",
        // },
        {
          name: "Others",
          key: "Stack_Others",
          value: 3,
          icon: require("@/assets/imgs/raas/icon/other.svg"),
          type: "stack",
        },
      ],
      dataAvailabilityOption: [
        // {
        //   name: "Ethereum Blobs",
        //   key: "Ethereum_Blobs",
        //   value: 0,
        //   icon: require("@/assets/imgs/raas/icon/eth.svg"),
        //   type: "dataAvailability",
        // },
        {
          name: "Settlement Layer",
          key: "SettlementLayer",
          value: 6,
          icon: require("@/assets/imgs/raas/icon/settlement_layer.svg"),
          type: "dataAvailability",
        },
        {
          name: "Arweave",
          key: "Arweave",
          value: 1,
          icon: require("@/assets/imgs/raas/icon/ar.svg"),
          type: "dataAvailability",
        },
        // {
        //   name: "Celestia",
        //   key: "Celestia",
        //   value: 3,
        //   icon: require("@/assets/imgs/raas/icon/celestia.svg"),
        //   type: "dataAvailability",
        // },
        // {
        //   name: "Avail",
        //   key: "Avail",
        //   value: 2,
        //   icon: require("@/assets/imgs/raas/icon/ava.svg"),
        //   type: "dataAvailability",
        // },
        // {
        //   name: "EigenLayer",
        //   key: "Eigenlayer",
        //   value: 5,
        //   icon: require("@/assets/imgs/raas/icon/eigen.svg"),
        //   type: "dataAvailability",
        // },
        {
          name: "Others",
          key: "DataAvailability_Others",
          value: 4,
          icon: require("@/assets/imgs/raas/icon/other.svg"),
          type: "dataAvailability",
        },
      ],
      layer1Option: [
        {
          name: "Ethereum",
          key: "Ethereum_Sepolia",
          value: 0,
          icon: require("@/assets/imgs/raas/icon/eth.svg"),
          type: "layer1",
          defaultNetwork: 2,
        },
        {
          name: "Bitcoin",
          key: "Bitcoin_Signet",
          value: 1,
          icon: require("@/assets/imgs/raas/icon/bitcoin.svg"),
          type: "layer1",
          defaultNetwork: 3,
        },
        {
          name: "BNB Chain",
          key: "BNB_CHAIN",
          value: 3,
          icon: require("@/assets/imgs/raas/icon/bnb_chain.svg"),
          type: "layer1",
          defaultNetwork: 0,
        },
        {
          name: "Others",
          key: "Layer1_Others",
          value: 2,
          icon: require("@/assets/imgs/raas/icon/other.svg"),
          type: "layer1",
          defaultNetwork: 0,
        },
      ],
      netWorkTypeOption: [
        {
          name: "Sepolia",
          key: "Sepolia",
          value: 2,
          icon: null,
          layer1Show: [0],
          type: "netWorkType",
        },
        {
          name: "Signet",
          key: "Signet",
          value: 3,
          icon: null,
          layer1Show: [1],
          type: "netWorkType",
        },
        {
          name: "Testnet",
          key: "TestNet",
          value: 0,
          icon: null,
          layer1Show: [1, 2, 3],
          type: "netWorkType",
        },
        {
          name: "Mainnet",
          key: "MainNet",
          value: 1,
          icon: null,
          layer1Show: [0, 1, 2, 3],
          type: "netWorkType",
        },
      ],
    };
  },
  mounted() {},

  methods: {
    onNext() {
      const stack = this.stack;
      const dataAvailability = this.dataAvailability;
      const layer1 = this.layer1;
      const netWorkType = this.netWorkType;
      const fastDeploy = this.isFastDeploy();
      const data = {
        stack,
        dataAvailability,
        layer1,
        netWorkType,
        fastDeploy,
      };
      this.$emit("onNext", data);
    },
    isFastDeploy() {
      let fastDeploy = false;
      const stack = this.stack;
      const dataAvailability = this.dataAvailability;
      const layer1 = this.layer1;
      const netWorkType = this.netWorkType;
      if (stack == 0 && dataAvailability == 6) {
        if (
          (layer1 == 0 && netWorkType == 2) ||
          (layer1 == 3 && netWorkType == 0)
        ) {
          fastDeploy = true;
        }
      }
      return fastDeploy;
    },
    isShowNetwork(item) {
      return item.layer1Show.includes(this.layer1);
    },
    onRadioClick(item) {
      this[item.type] = item.value;
      console.log(item);
      if (item.type == "layer1") {
        this.layer1Change(item);
      }
    },
    layer1Change(item) {
      this.netWorkType = item.defaultNetwork;
    },
  },
};
</script>

<style lang="scss" scoped>
.step-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  .create-title {
    color: #0f172a;
    font-family: "SF Pro Text";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
.step-bottom-boder {
  border-bottom: 1px solid #cbd5e1;
}
.step-bottom {
  padding: 16px;
  .create-item-title {
    color: #0f172a;
    font-family: "SF Pro Text";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .option-item {
    border-radius: 4px;
    border: 1px solid #cbd5e1;
    background: #fff;
    display: flex;
    padding: 12px 16px;
    align-items: center;
    cursor: pointer;
    .option-item-label {
      display: flex;
      align-items: center;
      span {
        color: #0f172a;
        font-family: "SF Pro Text";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
      }
    }
  }
  .option-item-active {
    border: 1px solid rgba(115, 94, 161, 0.5);
    background: rgba(243, 232, 255, 0.25);
  }
}
.step-first {
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #fff;
}
</style>
