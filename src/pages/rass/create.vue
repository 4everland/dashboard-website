<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12">
          <div
            class="notice fz-14 py-2 px-4 al-c space-btw fz-14"
            v-show="showWithDrawNotice"
          >
            <div class="al-c">
              <img src="/img/svg/new-billing/notice.svg" width="24" alt="" />
              <div class="ml-2">
                4EVER RaaS offers solutions built on OP Stack and Celestia
              </div>
            </div>
            <img
              width="24"
              class="cursor-p"
              @click="showWithDrawNotice = false"
              src="/img/svg/new-billing/close-icon.svg"
              alt=""
            />
          </div>
        </v-col>

        <v-col cols="12">
          <div
            class="main-wrap"
            :style="{
              'min-height': 'auto',
            }"
          >
            <v-row>
              <v-col cols="6">
                <div>
                  <div class="mb-2">Chain ID *</div>
                  <v-form
                    ref="formChainId"
                    v-model="validChainId"
                    lazy-validation
                  >
                    <v-text-field
                      v-model="chainId"
                      :rules="chainIdRules"
                      class="mt-4 chainid-box"
                      persistent-placeholder
                      outlined
                      placeholder="Please enter chain id"
                      :success-messages="chainIdHint"
                      persistent-hint
                      dense
                      prefix="777"
                      @input="onChainIdChange"
                    >
                      <template v-slot:append-outer>
                        <v-btn
                          small
                          text
                          color="primary"
                          width="60"
                          :disabled="!chainId"
                          @click="onCheck"
                          >Check</v-btn
                        >
                      </template>
                    </v-text-field>
                  </v-form>
                </div>
              </v-col>
              <v-col cols="6">
                <div>
                  <div class="mb-2">Chain Name *</div>
                  <v-text-field
                    v-model="chainName"
                    :rules="chainNameRules"
                    class="mt-4"
                    persistent-placeholder
                    outlined
                    placeholder="Please enter chain name"
                    dense
                  >
                  </v-text-field>
                </div>
              </v-col>
              <v-col cols="12">
                <div>
                  <div class="mb-2">Chain Logo *</div>
                  <v-text-field
                    v-model="chainLogo"
                    :rules="chainLogoRules"
                    class="mt-4"
                    persistent-placeholder
                    outlined
                    placeholder="Please enter the URL of the image"
                    dense
                  >
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12">
          <div
            class="main-wrap"
            :style="{
              'min-height': 'auto',
            }"
          >
            <v-row>
              <v-col cols="4">
                <div>
                  <div class="mb-2">Email</div>
                  <v-text-field
                    v-model="email"
                    class="mt-4"
                    persistent-placeholder
                    outlined
                    placeholder="Please enter contact email"
                    dense
                  >
                  </v-text-field>
                </div>
              </v-col>
              <v-col cols="4">
                <div>
                  <div class="mb-2">X</div>
                  <v-text-field
                    v-model="xId"
                    class="mt-4 hide-msg"
                    persistent-placeholder
                    outlined
                    placeholder="Please enter your X ID"
                    dense
                    prefix="Twitter.com/"
                  >
                  </v-text-field>
                </div>
              </v-col>
              <v-col cols="4">
                <div>
                  <div class="mb-2">Telegram</div>
                  <v-text-field
                    v-model="telegram"
                    class="mt-4 hide-msg"
                    persistent-placeholder
                    outlined
                    placeholder="Please enter your telegram"
                    dense
                  >
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12">
          <div
            class="main-wrap"
            :style="{
              'min-height': 'auto',
            }"
          >
            <v-row>
              <v-col
                cols="12"
                md="4"
                v-for="(it, i) in timeList"
                :key="i"
                @click="chooseTime(it.value)"
              >
                <div
                  class="d-flex al-c bdrs-4 plat-item pos-r"
                  :class="{
                    active: purchasePlan == it.value,
                  }"
                >
                  <div class="ml-2 fw-b fz-16 pos-r">
                    <span> {{ it.label }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="d-flex justify-end">
            <v-btn
              :disabled="!valid"
              color="primary"
              min-width="100"
              :loading="onLoading"
              @click="onSubmit"
              >Submit</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import Axios from "axios";
import {
  fetchDefaultChainId,
  sendCreateRass,
  sendCheckChainId,
} from "@/api/rass.js";
export default {
  data() {
    return {
      showWithDrawNotice: true,
      timeList: [
        {
          label: "90 Days",
          value: 90,
        },
        {
          label: "185 Days",
          value: 185,
        },

        {
          label: "365 Days",
          value: 365,
        },
      ],
      valid: true,
      validChainId: true,
      chainId: "",
      chainIdRules: [
        (v) => !!v || "chainId is required",
        (v) => (v && v.length <= 5) || "chainId must be less than 5 characters",
        () =>
          !this.isIdExist ||
          "The ID already exists, please enter a different one.",
      ],
      chainName: "",
      chainNameRules: [(v) => !!v || "chainName is required"],
      chainLogo: "",
      chainLogoRules: [(v) => !!v || "chainLogo is required"],
      email: "",
      xId: "",
      telegram: "",
      purchasePlan: 90,
      onLoading: false,
      chainIdHint: "",
      isIdExist: false,
    };
  },
  created() {
    this.getDefaultChainId();
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
      this.onLoading = true;
      await this.$refs.form.validate();
      if (this.isIdExist) {
        this.onLoading = false;
        return;
      }
      if (this.valid) {
        const data = {
          chainId: "777" + this.chainId,
          chainName: this.chainName,
          chainLogo: this.chainLogo,
          email: this.email,
          xId: this.xId,
          telegram: this.telegram,
          purchasePlan: this.purchasePlan,
        };
        await sendCreateRass(data);
      }
      this.onLoading = false;
    },
    async onCheck() {
      const id = "777" + this.chainId;
      const isInChain = await this.getChainIdList(id);
      if (isInChain) {
        this.isIdExist = true;
      } else {
        const { data } = await sendCheckChainId(id);
        console.log(data.status);
        if (data.status) {
          this.chainIdHint = "Valid ChainID";
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
      console.log(result);
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
.notice {
  color: #735ea1;
  border-radius: 4px;
  background: #f3e8ff;
  span {
    text-decoration: underline;
  }
  a {
    text-decoration: underline;
    color: #735ea1;
  }
}
.plat-item {
  padding: 14px 12px;
  background: #eef0f4;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
  &.active {
    background: #634695;
    color: #fff;
  }
  .tag {
    right: 0;
    top: 0;
    padding: 2px 10px;
    color: #000;
    background: #edad27;
    border-radius: 0 4px 0 4px;
  }
}
.beta-icon {
  position: absolute;
  right: -55px;
  top: -7px;
}
</style>
