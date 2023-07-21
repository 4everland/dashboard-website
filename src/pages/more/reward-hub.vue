<template>
  <div>
    <div class="bdrs-10 ov-h mb-4 pos-r">
      <img
        src="https://static1.4everland.org/img/banner/20221109-160350.png"
        class="w100p img-cover d-b"
        style="max-height: 170px"
      />
    </div>
    <div class="main-wrap">
      <div class="al-c mb-4">
        <span class="fw-b mr-2 fz-20">Ways for Reward</span>
        <v-btn
          class="ml-auto"
          small
          outlined
          color="primary"
          @click="$router.push('/resource/bills?typeIdx=2')"
          >Transaction</v-btn
        >
      </div>
      <div class="py-3 px-4 mb-4 tips">
        <v-icon size="20">mdi-alert-decagram-outline</v-icon>
        <span class="ml-4 fz-14">{{ tips }}</span>
      </div>
      <v-row v-if="list.length">
        <template v-for="item in list">
          <v-col
            :md="
              item.type == 'AIRDROP_FOR_NEW' || item.type == 'UPGRADE'
                ? '12'
                : '6'
            "
            cols="12"
            :key="item.id"
          >
            <div
              class="reward-task al-c justify-space-between"
              :class="item.type == 'AIRDROP_FOR_NEW' ? 'register-task' : ''"
            >
              <div>
                <e-kv label="Task">
                  <div class="al-c">
                    <img class="task-icon" width="18" :src="item.icon" alt="" />
                    <span class="ml-3">{{ item.name }}</span>
                  </div>
                </e-kv>
                <e-kv label="Reward" class="mt-4">
                  {{ item.reward }}
                </e-kv>
              </div>

              <div v-if="item.type == 'UPGRADE'">
                <div v-if="item.status !== 'DONE'">
                  <e-menu open-on-hover top>
                    <v-btn
                      slot="ref"
                      color="primary"
                      class="mr-2"
                      width="250"
                      dark
                    >
                      <span class="ml-2">Mint</span>
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                    <v-list max-height="200">
                      <v-list-item
                        style="background: #fff"
                        v-for="item in claimList"
                        :key="item.type"
                        link
                        @click="handleTypeClaim(item.type)"
                      >
                        <v-list-item-title
                          class="item-title fz-14 al-c justify-center"
                        >
                          <img :src="item.icon" width="18" alt="" />
                          <span class="ml-3">{{ item.name }}</span>
                          <e-tooltip top v-if="item.tips">
                            <v-icon
                              slot="ref"
                              size="18"
                              color="#999"
                              class="pa-1 d-ib"
                              >mdi-alert-circle-outline</v-icon
                            >
                            <span>{{ item.tips }}</span>
                          </e-tooltip>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </e-menu>
                </div>
                <v-btn v-else class="mr-9" width="100" disabled> Done </v-btn>
              </div>
              <div
                v-else
                class="al-c justify-center"
                :class="{ 'mr-9': !onChain }"
              >
                <v-btn
                  :color="getBtnColor(item)"
                  @click="onAct(item)"
                  depressed
                  width="100"
                  :disabled="item.isDone || !onChain"
                  :loading="item.loading"
                >
                  <span
                    v-if="!onChain"
                    :class="{
                      'white-0': !item.isDone,
                    }"
                    >To do</span
                  >
                  <span
                    v-else
                    :class="{
                      'white-0': !item.isDone,
                    }"
                  >
                    {{ item.statusName || "To do" }}
                  </span>
                </v-btn>
                <v-btn
                  v-if="onChain"
                  :class="{
                    hidden: !(item.status == 'GOTO' || item.refreshing),
                  }"
                  :loading="item.refreshing"
                  icon
                  @click="onRefresh(item)"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </div>

              <img
                v-show="item.status == 'DONE'"
                width="20"
                class="check-status"
                src="/img/svg/rewardHub/check.svg"
                alt=""
              />
            </div>
          </v-col>
        </template>
      </v-row>
      <v-row v-else>
        <v-col v-for="i in 8" :key="i" :md="i == 1 ? '12' : '6'" cols="12">
          <v-skeleton-loader
            class="mt-10 mb-10"
            type="article"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>
    <e-register-share ref="share"></e-register-share>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from "@/pages/more/mixin-register";
export default {
  mixins: [mixin],
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      userInfo: (s) => s.userInfo,
      chainId: (s) => s.chainId,
      onChain: (s) => s.onChain,
    }),
    shareUrl() {
      return location.origin + "?invite=" + this.code;
    },
    tips() {
      if (this.onChain)
        return "More free resources can be obtained by completing tasks. Please note that the validity period of IPFS resources is December 31, 2023.";
      return "More free resources can be obtained by upgrading registration tasks. Please note that the validity period of IPFS resources is December 31, 2023.";
    },
  },
  data() {
    return {
      headers: [
        { text: "TASK", value: "name" },
        { text: "REWARD", value: "reward" },
        { text: "STATUS", value: "status" },
      ],
      loading: false,
      list: [],
      showTg: false,
      tgTag: `<b>2</b>`,
      code: null,
      activitiesInfo: {},
      claimList: [
        {
          name: "Polygon",
          icon: require("/public/img/svg/billing/ic-polygon-0.svg"),
          type: "Polygon",
        },
        {
          name: "zkSync Lite(v1)",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSync",
          tips: "Please ensure that you have sufficient ETH in zkSync Lite. Interaction with the zkSync network will rely on cross-chain communication services to complete on-chain identity registration on Polygon.",
        },
        {
          name: "ZkSync Era(V2)",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSyncV2",
          tips: "Please ensure that you have sufficient ETH inzkSync Era. Interaction with the zkSync network will rely on cross-chain communication services to complete on-chain identity registration on Polygon.",
        },
        {
          name: "opBNB Testnet",
          icon: require("/public/img/svg/billing/ic-opbnb-test.svg"),
          type: "OpBNBTest",
        },
        {
          name: "Ethereum",
          icon: require("/public/img/svg/billing/ic-ethereum.svg"),
          type: "Ethereum",
        },
        {
          name: "Polygon ZkEVM",
          icon: require("/public/img/svg/billing/ic-polygon-zkEVM.svg"),
          type: "PolygonZkEVM",
        },
        {
          name: "BNB Chain",
          icon: require("/public/img/svg/billing/ic-bsc.png"),
          type: "BSC",
        },
        {
          name: "Arbitrum",
          icon: require("/public/img/svg/billing/ic-arbitrum.png"),
          type: "Arbitrum",
        },
        {
          name: "Linea",
          icon: require("/public/img/svg/billing/ic-linea.svg"),
          type: "Linea",
        },
      ],
    };
  },
  watch: {
    isFocus(val) {
      if (val && this.openItem) {
        this.onRefresh(this.openItem);
        this.openItem = null;
        // this.getList();
      }
    },
  },
  async created() {
    this.getCode();
    this.isRegister();
  },
  mounted() {
    const { from } = this.$route.query;
    if (from) {
      window.close();
      return;
    }
    this.getList();
  },
  methods: {
    getBtnColor(it) {
      // console.log(it);
      if (it.type == "AIRDROP_FOR_NEW") return "#E21951";
      if (it.status == "CLAIM") return "#E21951";
      if (/verify/i.test(it.statusName)) return "#FFB759";
      if (it.status == "GOTO") return "#20B1FF";
      return "primary";
    },
    async onRefresh(it) {
      try {
        this.$set(it, "refreshing", true);
        const { data } = await this.$http.post(
          `$auth/rewardhub/${it.id}/refresh`
        );
        Object.assign(it, data);
        // if(data.status != it.status) this.getList()
        // await this.getList();
      } catch (error) {
        //
      }
      this.$set(it, "refreshing", false);
    },
    async onVerifyEmail(title = "Thank you for subscription") {
      await this.$alert(
        "For security reasons, please login to your mailbox and click the confirmation link to ensure that your mailbox is for your own use before subscribing.",
        title
      );
      this.getList();
    },
    onTg() {
      this.$openWindow("./tg.html?uid=" + this.userInfo.uid);
    },
    async onSubsribe(it) {
      try {
        const data = await this.$prompt(
          "",
          "Stay up to date on developer updates for the 4EVERLAND",
          {
            confirmText: "Subscribe",
            inputAttrs: {
              label: "Email",
              rules: [
                (v) => this.$regMap.email.test(v) || "Invalid email address.",
              ],
              required: true,
            },
          }
        );
        // console.log(data);
        this.$loading();
        await this.$http.post("$auth/bind", {
          type: 6,
          apply: data.value,
        });
        this.$loading.close();
        this.onVerifyEmail();
      } catch (error) {
        //
      }
    },
    async onNext(it, info) {
      try {
        const { nextStep: type, stepValue: val } = info;
        if (type == "OPEN_NEW_TAB") {
          this.openItem = it;
          if (/^http/.test(val)) this.$openWindow(val);
          else this.$navTo(val);
        } else if (type == "SEND_REQUEST") {
          await this.$http.post("$auth" + val);
          this.$toast("Claimed successfully");
          this.getList();
        } else if (type == "EMAIL_SUBSCRIPTION_VERIFICATION") {
          this.onSubsribe();
        } else if (type == "OPEN_TELEGRAM_WIDGET") {
          this.onTg();
        } else if (type == "SHARE_ON_TWITTER") {
          window.open(`https://twitter.com/intent/tweet?text=${val}`);
          this.onRefresh(it);
        }
      } catch (error) {
        console.log(error);
        this.getList();
      }
    },
    async onAct(it) {
      console.log(it);
      if (it.type == "SUBSCRIBE_NEWSLETTER" && it.status == "GOTO") {
        this.onVerifyEmail("Verify Email");
        return;
      }
      try {
        this.$set(it, "loading", true);
        const { data } = await this.$http.post(`$auth/rewardhub/${it.id}/next`);
        console.log(data);
        await this.onNext(it, data);
      } catch (error) {
        //
      }
      this.$set(it, "loading", false);
      // if (it.type == "SUBSCRIBE_NEWSLETTER") {
      // }
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("$auth/rewardhub/activities");
        this.activitiesInfo = data;
        this.list = data.item.map((it) => {
          if (it.status == "DONE") {
            it.isDone = true;
            // it.statusName = "Done";
          }
          return it;
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async getCode() {
      if (this.code) return;
      const { data } = await this.$http.get("$auth/invitation/code");
      this.code = data;
    },
    async handleTypeClaim(type = "Polygon") {
      try {
        const register = await this.isRegister();
        if (register) {
          this.onAnimation();
          await this.getHandler();
          return this.getList();
        }
        let claimStatus = null;
        if (type == "Polygon") {
          claimStatus = await this.handleClaim();
        } else if (type == "zkSync") {
          claimStatus = await this.handleZkClaim();
        } else if (type == "zkSyncV2") {
          claimStatus = await this.handleOtherChainClaim("zkSync");
        } else {
          claimStatus = await this.handleOtherChainClaim(type);
        }
        if (claimStatus) {
          this.onAnimation();
          await this.getHandler();
          this.getList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getHandler() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );
        this.$setState({
          onChain: data.handled,
        });
      } catch (error) {
        console.log(error);
      }
    },
    onAnimation() {
      this.$refs.share.showDialog = true;
      // this.$flowersAnimation();
    },
  },
};
</script>
<style lang="scss" scoped>
.tips {
  border: 1px solid #d0dae9;
  border-radius: 10px;
  color: gray;
}
.reward-task {
  position: relative;
  height: 116px;
  padding: 15px 0 15px 30px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 4px 4px 0px 0px #edf2fa;
  border-radius: 10px;
  border: 1px solid #d0dae9;
  transition: all 0.2s ease-in;
  .check-status {
    position: absolute;
    top: 12px;
    right: 11px;
  }
  .task-icon {
    vertical-align: middle;
  }
}
.reward-task:hover {
  border: 1px solid #775da6;
  box-shadow: 2px 2px 0px 0px #775da6;
}
.item-title::after {
  content: "";
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: rgba(200, 200, 200, 0.3);
}
</style>
