<template>
  <div>
    <div class="step-first">
      <div class="step-first-top step-top step-bottom-boder">
        <div class="create-title">
          <v-btn tile text icon @click="goBack">
            <v-icon> mdi-arrow-left </v-icon></v-btn
          >
          <span>STEP 2: Pay AND Create</span>
        </div>
        <div></div>
      </div>
      <div class="step-first-bottom step-bottom">
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="step-bottom-boder pa-4">
            <div class="create-item-title mb-4">Chain Info (Unmodifiable)</div>
            <v-row>
              <v-col cols="12">
                <div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div>
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span> Chain ID </span>
                            <span style="color: #ff0000"> * </span>
                          </div>
                          <v-btn
                            small
                            text
                            color="primary"
                            width="60"
                            :disabled="!chainId"
                            @click="onCheck"
                            >Check</v-btn
                          >
                        </div>
                        <v-form
                          ref="formChainId"
                          v-model="validChainId"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="chainId"
                            :rules="chainIdRules"
                            persistent-placeholder
                            outlined
                            placeholder="Please enter chain id"
                            :hint="chainIdHint"
                            persistent-hint
                            dense
                            @input="onChainIdChange"
                          >
                          </v-text-field>
                        </v-form>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div>
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span> Chain Name </span>
                            <span style="color: #ff0000"> * </span>
                          </div>
                        </div>
                        <v-text-field
                          v-model="chainName"
                          :rules="chainNameRules"
                          persistent-placeholder
                          outlined
                          placeholder="Please enter chain name"
                          dense
                        >
                        </v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
          <div class="step-bottom-boder pa-4">
            <div class="create-item-title mb-4">
              Custom Website (Modifiable)
            </div>
            <v-row>
              <v-col cols="12">
                <div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div>
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span>Chain Logo Favicon (Optional)</span>
                          </div>
                          <v-btn small text color="primary" width="60"
                            >Example</v-btn
                          >
                        </div>
                        <v-text-field
                          v-model="favicon"
                          outlined
                          placeholder="Please enter URL / 16*16"
                          dense
                        >
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div>
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span>Chain Logo Lock-up (Optional)</span>
                          </div>
                          <v-btn small text color="primary" width="60"
                            >Example</v-btn
                          >
                        </div>
                        <v-text-field
                          v-model="chainLogo"
                          outlined
                          placeholder="Please enter URL / 256*200"
                          dense
                        >
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div>
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span>Background (Optional)</span>
                          </div>
                          <v-btn small text color="primary" width="60"
                            >Example</v-btn
                          >
                        </div>
                        <v-text-field
                          v-model="background"
                          outlined
                          placeholder="Please enter URL / 400*200"
                          dense
                        >
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div>
                        <div class="mb-2 d-flex space-btw">
                          <div>
                            <span>Footer Link (Optional)</span>
                          </div>
                          <v-btn small text color="primary" width="60"
                            >Example</v-btn
                          >
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
          <div class="pa-4">
            <div class="create-item-title mb-4">Duration</div>
            <v-row>
              <v-col cols="12">
                <v-radio-group
                  row
                  class="mt-0 hide-msg"
                  v-model="purchasePlan"
                  @change="chooseTime"
                >
                  <v-col cols="12" md="6" v-for="(it, i) in timeList" :key="i">
                    <div
                      class="time-item"
                      :class="{
                        active: purchasePlan == it.value,
                      }"
                    >
                      <v-radio :value="it.value"></v-radio>
                      <div class="ml-2 fz-14">
                        <span>{{ it.price }}</span>
                        <span>/</span>
                        <span class="fw-b fz-16"> {{ it.label }}</span>
                      </div>
                    </div>
                  </v-col>
                </v-radio-group>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </div>
    </div>
    <div class="step-include mt-4">
      <div class="step-include-top">
        <div class="create-item-title">What's Include</div>
        <div class="include-text mt-4">
          <div
            v-for="(item, index) in includeList"
            :key="index"
            class="d-flex al-c"
          >
            <img class="mr-2" src="@/assets/imgs/raas/check_icon.svg" alt="" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="step-include-bottom">
        <div>
          <div class="create-item-title">Purchase</div>
          <div class="price">
            <!-- <span class="num">0</span> -->
            <span class="text">{{ showPrice }}</span>
          </div>
        </div>
        <div class="d-flex justify-end">
          <v-btn
            class="pay-btn"
            :class="!valid ? 'pay-disabled' : ''"
            :disabled="!valid"
            min-width="336"
            elevation="0"
            :loading="onLoading"
            @click="onSubmit"
            >Pay and Create</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import {
  fetchDefaultChainId,
  sendCreateRaas,
  sendCheckChainId,
} from "@/api/raas.js";

export default {
  name: "DashboardWebsiteCreateFirst",
  props: {
    onLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeList: [
        {
          label: "2 Hours",
          value: 0,
          price: "Free trial",
        },
        {
          label: "90 Days",
          value: 90,
          price: "1,500,000,000 LANDs≈$1.5k",
        },
        {
          label: "185 Days",
          value: 185,
          price: "3,000,000,000 LANDs≈$3k",
        },

        {
          label: "365 Days",
          value: 365,
          price: "6,000,000,000 LANDs≈$6k",
        },
      ],
      includeList: [
        "Built on OP STACK with ETHEREUM DA",
        "Built-in block explorer, tracer, and bridge",
        "RPC (Remote Procedure Call) interface",
        "Scan API",
        "Graphnode APl",
        "Layer1 Sepolia contract deployment fee",
        "Gas Cosume and DA Comsume",
        "Discord & TG Support",
        "Advanced customization",
      ],
      valid: true,
      validChainId: true,
      chainId: "",
      chainIdRules: [
        (v) => !!v || "chainId is required",
        (v) =>
          (v && v.length <= 16) || "chainId must be less than 16 characters",
        (v) => /^[0-9]\d*$/.test(v) || "chainId must be valid",
        () =>
          !this.isIdExist ||
          "The ID already exists, please enter a different one.",
      ],
      chainName: "",
      chainNameRules: [(v) => !!v || "chainName is required"],
      chainLogo: "",
      chainLogoRules: [(v) => !!v || "chainLogo is required"],
      favicon: "",
      background: "",
      footerLink: "",
      purchasePlan: 0,
      chainIdHint: "",
      isIdExist: false,
      showPrice: "Free trial",
    };
  },

  mounted() {},

  methods: {
    chooseTime(val) {
      // this.purchasePlan = val;
      const chooseObj = this.timeList.find((item) => {
        return item.value == val;
      });
      this.showPrice = chooseObj.price;
    },
    goBack() {
      this.$emit("goBack");
    },
    async getDefaultChainId() {
      const { data } = await fetchDefaultChainId();
      this.chainId = data.chainId;
    },
    async onSubmit() {
      await this.$refs.form.validate();
      if (this.isIdExist) {
        return;
      } else {
        if (this.valid) {
          const data = {
            chainId: this.chainId,
            chainName: this.chainName,
            favicon: this.favicon,
            chainLogo: this.chainLogo,
            background: this.background,
            footerLink: this.footerLink,
            purchasePlan: this.purchasePlan,
          };
          this.$emit("onSubmit", data);
        }
      }
    },
    async onCheck() {
      const id = this.chainId;
      const isInChain = await this.getChainIdList(id);
      if (isInChain) {
        this.isIdExist = true;
      } else {
        const { data } = await sendCheckChainId(id);
        if (data.status) {
          this.chainIdHint = "✅ Valid ChainID";
        } else {
          this.isIdExist = true;
        }
      }
      this.$refs.formChainId.validate();
    },
    async getChainIdList(id) {
      const url = "https://chainid.foreverland.xyz/chains.json";
      const { data } = await Axios.get(url);
      const chainList = data;
      let result = chainList.some((el) => {
        el.chainId == id;
      });
      return result;
    },
    onChainIdChange() {
      this.chainIdHint = "";
      this.isIdExist = false;
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
    display: flex;
    align-items: center;
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
  // padding: 16px;
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
  .time-item {
    display: flex;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    border-radius: 8px;
    background: #f1f5f9;
  }
}
.step-first {
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #fff;
}
.step-include {
  border-radius: 8px;
  background: #f3e8ff;
  .create-item-title {
    color: #0f172a;
    font-family: "SF Pro Text";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .step-include-top {
    padding: 16px;
    .include-text {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 24px;
      color: #735ea1;
      font-family: "SF Pro Text";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
    }
  }
  .step-include-bottom {
    padding: 16px;
    border-radius: 0px 0px 8px 8px;
    background: #735ea1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .create-item-title {
      color: #fff;
    }
    .price {
      .num {
        color: #fff;
        text-align: right;
        font-family: "DIN Alternate";
        font-size: 28px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 0.56px;
        margin-right: 4px;
      }
      .text {
        color: #e2e8f0;
        font-family: "SF Pro Text";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
        text-transform: capitalize;
      }
    }
    .pay-btn {
      background: #fff;
      color: #735ea1;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: capitalize;
    }
    .pay-disabled {
      background: #e2e8f0 !important;
      color: #fff !important;
    }
  }
}
</style>
