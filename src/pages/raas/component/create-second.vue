<template>
  <div>
    <div class="step-first">
      <div class="step-first-top step-top step-bottom-boder">
        <div class="create-title">
          <v-btn tile text icon @click="goBack">
            <v-icon> mdi-arrow-left </v-icon></v-btn
          >
          <span>STEP 2: Add Contact Info</span>
        </div>
        <div>
          <v-btn
            color="primary"
            width="96"
            :disabled="!(email && telegram)"
            @click="onSubmit"
          >
            Submit
            <v-icon right> mdi-arrow-right </v-icon></v-btn
          >
        </div>
      </div>
      <div class="step-first-bottom step-bottom">
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="pa-4">
            <v-row>
              <v-col cols="12">
                <div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="icon-box">
                        <div>
                          <v-img
                            max-height="40"
                            max-width="40"
                            src="@/assets/imgs/raas/email.svg"
                          ></v-img>
                        </div>
                        <div class="main-box">
                          <div class="mb-2 d-flex space-btw">
                            <div>
                              <span>Email</span>
                              <span style="color: #ff0000"> * </span>
                            </div>
                          </div>
                          <v-form
                            ref="formChainId"
                            v-model="validChainId"
                            lazy-validation
                          >
                            <v-text-field
                              v-model="email"
                              :rules="chainIdRules"
                              outlined
                              placeholder="Please enter contact email"
                              dense
                            >
                            </v-text-field>
                          </v-form>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="icon-box">
                        <div>
                          <v-img
                            max-height="40"
                            max-width="40"
                            src="@/assets/imgs/raas/telegram.svg"
                          ></v-img>
                        </div>
                        <div class="main-box">
                          <div class="mb-2 d-flex space-btw">
                            <div>
                              <span>Telegram</span>
                              <span style="color: #ff0000"> * </span>
                            </div>
                          </div>
                          <v-text-field
                            v-model="telegram"
                            :rules="chainNameRules"
                            persistent-placeholder
                            outlined
                            placeholder="Please enter your telegram"
                            dense
                          >
                          </v-text-field>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="icon-box">
                        <div>
                          <v-img
                            max-height="40"
                            max-width="40"
                            src="@/assets/imgs/raas/x.svg"
                          ></v-img>
                        </div>
                        <div class="main-box">
                          <div class="mb-2 d-flex space-btw">
                            <div>
                              <span>X (Optional)</span>
                            </div>
                          </div>
                          <v-text-field
                            v-model="xId"
                            outlined
                            prefix="Twitter.com/"
                            placeholder="Please enter your X handle"
                            dense
                          >
                          </v-text-field>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="icon-box">
                        <div>
                          <v-img
                            max-height="40"
                            max-width="40"
                            src="@/assets/imgs/raas/link.svg"
                          ></v-img>
                        </div>
                        <div class="main-box">
                          <div class="mb-2 d-flex space-btw">
                            <div>
                              <span>Scheduling Link (Optional)</span>
                            </div>
                          </div>
                          <v-text-field
                            v-model="schedulingLink"
                            outlined
                            placeholder=""
                            dense
                          >
                          </v-text-field>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-form>
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
      valid: true,
      validChainId: true,
      chainIdRules: [
        (v) => !!v || "chainId is required",
        (v) =>
          (v && v.length <= 16) || "chainId must be less than 16 characters",
        (v) => /^[0-9]\d*$/.test(v) || "chainId must be valid",
        () =>
          !this.isIdExist ||
          "The ID already exists, please enter a different one.",
      ],
      chainNameRules: [(v) => !!v || "chainName is required"],
      chainLogoRules: [(v) => !!v || "chainLogo is required"],
      email: "",
      xId: "",
      telegram: "",
      schedulingLink: "",
    };
  },

  mounted() {},

  methods: {
    chooseTime(val) {
      this.purchasePlan = val;
    },
    async getDefaultChainId() {
      const { data } = await fetchDefaultChainId();
      this.chainId = data.chainId;
    },
    async onSubmit() {
      const data = {
        email: this.email,
        xId: this.xId,
        telegram: this.telegram,
        schedulingLink: this.schedulingLink,
      };
      this.$emit("onSubmit", data);
    },
    goBack() {
      this.$emit("goBack");
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
.icon-box {
  display: flex;
  gap: 8px;
  .main-box {
    flex: 1;
  }
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
