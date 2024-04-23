<template>
  <div class="step-first">
    <div class="step-first-top step-top step-bottom-boder">
      <div class="create-title">Create a Rollup</div>
      <div>
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
    <div class="step-first-bottom step-bottom">
      <div>
        <div class="create-item-title">Stack</div>
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
                  md="2"
                  v-for="item in stackOption"
                  :key="item.key"
                >
                  <div class="option-item">
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
                  md="2"
                  v-for="item in dataAvailabilityOption"
                  :key="item.key"
                >
                  <div class="option-item">
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
        <div class="create-item-title">Layer 1</div>
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
                  md="2"
                  v-for="item in layer1Option"
                  :key="item.key"
                >
                  <div class="option-item">
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
                <v-col
                  cols="12"
                  md="2"
                  v-for="item in netWorkTypeOption"
                  :key="item.key"
                >
                  <div class="option-item">
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
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardWebsiteCreateFirst",

  data() {
    return {
      stack: null,
      dataAvailability: null,
      layer1: null,
      netWorkType: null,
      nextDisabled: true,
      stackOption: [
        {
          name: "OP Stack",
          key: "Op",
          value: 0,
          icon: require("@/assets/imgs/raas/icon/op.svg"),
        },
        {
          name: "ZK Stack",
          key: "Zk",
          value: 1,
          icon: require("@/assets/imgs/raas/icon/zk.svg"),
        },
        {
          name: "Polygon CDK",
          key: "_PolygonCdk",
          value: 2,
          icon: require("@/assets/imgs/raas/icon/polygon.svg"),
        },
        {
          name: "Others",
          key: "Stack_Others",
          value: 3,
          icon: null,
        },
      ],
      dataAvailabilityOption: [
        {
          name: "Ethereum Blobs",
          key: "Ethereum_Blobs",
          value: 0,
          icon: require("@/assets/imgs/raas/icon/eth.svg"),
        },
        {
          name: "Arweave",
          key: "Arweave",
          value: 1,
          icon: require("@/assets/imgs/raas/icon/ar.svg"),
        },

        {
          name: "Celestia",
          key: "Celestia",
          value: 3,
          icon: require("@/assets/imgs/raas/icon/celestia.svg"),
        },
        {
          name: "Avail",
          key: "Avail",
          value: 2,
          icon: require("@/assets/imgs/raas/icon/ava.svg"),
        },
        {
          name: "EigenLayer",
          key: "Eigenlayer",
          value: 5,
          icon: require("@/assets/imgs/raas/icon/eigen.svg"),
        },
        {
          name: "Others",
          key: "DataAvailability_Others",
          value: 4,
          icon: null,
        },
      ],
      layer1Option: [
        {
          name: "Ethereum",
          key: "Ethereum",
          value: 0,
          icon: require("@/assets/imgs/raas/icon/eth.svg"),
        },
        {
          name: "Bitcoin",
          key: "Bitcoin",
          value: 1,
          icon: require("@/assets/imgs/raas/icon/bitcoin.svg"),
        },
        {
          name: "Others",
          key: "Layer1_Others",
          value: 2,
          icon: null,
        },
      ],
      netWorkTypeOption: [
        {
          name: "Testnet",
          key: "TestNet",
          value: 0,
          icon: null,
        },
        {
          name: "Mainnet",
          key: "MainNet",
          value: 1,
          icon: null,
        },
      ],
    };
  },

  mounted() {},

  methods: {
    onNext() {
      let fastDeploy = false;
      const stack = this.stack;
      const dataAvailability = this.dataAvailability;
      const layer1 = this.layer1;
      const netWorkType = this.netWorkType;
      if (
        stack == 0 &&
        dataAvailability == 0 &&
        layer1 == 0 &&
        netWorkType == 0
      ) {
        fastDeploy = true;
      }
      const data = {
        stack,
        dataAvailability,
        layer1,
        netWorkType,
        fastDeploy,
      };
      this.$emit("onNext", data);
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
}
.step-first {
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #fff;
}
</style>
