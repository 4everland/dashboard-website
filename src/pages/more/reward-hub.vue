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
      <div class="al-c mb-10">
        <span class="fw-b mr-2 fz-20">Ways for Reward</span>
        <e-tooltip top>
          <v-icon slot="ref" color="#6C7789" size="16">mdi-alert-circle</v-icon>
          <span
            >Getting free resources by completing the following tasks and
            resources are valid for one year after completion of tasks.</span
          >
        </e-tooltip>
      </div>
      <v-row v-if="list.length">
        <template v-for="item in list">
          <v-col
            :md="item.type == 'AIRDROP_FOR_NEW' ? '12' : '6'"
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
              <div class="al-c justify-center">
                <v-btn
                  :color="getBtnColor(item)"
                  @click="onAct(item)"
                  depressed
                  tile
                  width="100"
                  :disabled="item.isDone"
                  :loading="item.loading"
                >
                  <span
                    :class="{
                      'white-0': !item.isDone,
                    }"
                  >
                    {{ item.statusName || "To do" }}
                  </span>
                </v-btn>
                <v-btn
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

      <!-- <v-data-table
        :class="{ strip: list.length }"
        :loading="loading"
        :headers="headers"
        :items="list"
        hide-default-footer
        disable-sort
      >
        <template v-slot:item.status="{ item }">
          <v-btn
            :color="getBtnColor(item)"
            small
            @click="onAct(item)"
            depressed
            width="80"
            :disabled="item.isDone"
            :loading="item.loading"
          >
            <span
              :class="{
                'white-0': !item.isDone,
              }"
            >
              {{ item.statusName || "To do" }}
            </span>
          </v-btn>
          <v-btn
            :class="{
              hidden: !(item.status == 'GOTO' || item.refreshing),
            }"
            :loading="item.refreshing"
            icon
            class="ml-2"
            small
            @click="onRefresh(item)"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-data-table> -->
    </div>
    <!-- <div class="resource-description fz-14">
      Getting free resources by completing the following 7 tasks and resources
      are valid for one year after completion of tasks.
    </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from "./reward-hub-mixin";
export default {
  mixins: [mixin],
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
      userInfo: (s) => s.userInfo,
      chainId: (s) => s.chainId,
    }),
    shareUrl() {
      return location.origin + "?invite=" + this.code;
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
                (v) => this.$regMap.email.test(v) || "Invalid email adress.",
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
      const { nextStep: type, stepValue: val } = info;
      if (type == "OPEN_NEW_TAB") {
        this.openItem = it;
        if (/^http/.test(val)) this.$openWindow(val);
        else this.$navTo(val);
      } else if (type == "SEND_REQUEST") {
        if (it.type == "AIRDROP_FOR_NEW" && !this.isRegister) {
          await this.registerForNew();
          if (!this.isRegister)
            return this.$alert(
              "New user registration rewards are required for successful registration on the chain, please try later."
            );
        }

        await this.$http.post("$auth" + val);
        this.$toast("Claimed successfully");
        this.getList();
      } else if (type == "EMAIL_SUBSCRIPTION_VERIFICATION") {
        this.onSubsribe();
      } else if (type == "OPEN_TELEGRAM_WIDGET") {
        this.onTg();
      } else if (type == "SHARE_ON_TWITTER") {
        window.open(
          `https://twitter.com/intent/tweet?text=💠The %23Web3 product journey has begun for me at @4everland_org, and I have received free resources to help me along the way.🚀The best way to explore Web3 is to experience its products. Join us today and start your Web3 journey.✅${encodeURIComponent(
            this.shareUrl
          )}&hashtags=IPFS,Arweave,Dfinity`
        );
        this.onRefresh(it);
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
        this.list = data.item.map((it) => {
          switch (it.type) {
            case "AIRDROP_FOR_NEW":
              it.icon = "/img/svg/rewardHub/register_reward.svg";
              break;
            case "TWITTER_SHARE":
              it.icon = "/img/svg/rewardHub/twitter.svg";

              break;
            case "JOIN_DISCORD":
              it.icon = "/img/svg/rewardHub/discord.svg";

              break;
            case "JOIN_TELEGRAM":
              it.icon = "/img/svg/rewardHub/telegram.svg";

              break;
            case "FOLLOW_TWITTER":
              it.icon = "/img/svg/rewardHub/twitter.svg";

              break;
            case "SUBSCRIBE_NEWSLETTER":
              it.icon = "/img/svg/rewardHub/subscribe.svg";

              break;
            case "DEPOSIT":
              it.icon = "/img/svg/rewardHub/deposit.svg";

              break;
            case "REFERRAL_FRIENDS":
              it.icon = "/img/svg/rewardHub/referral.svg";

              break;
            case "AIRDROP":
              it.icon = "/img/svg/rewardHub/airdrop.svg";
              break;
            default:
              it.icon = "/img/svg/rewardHub/register_reward.svg";
              break;
          }
          if (it.status == "DONE") {
            it.isDone = true;
            it.statusName = "Done";
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
      const { data } = await this.$http2.get("$auth/invitation/code");
      this.code = data;
    },
  },
};
</script>
<style lang="scss" scoped>
.reward-task {
  position: relative;
  height: 116px;
  padding: 15px 0 15px 30px;
  box-sizing: border-box;
  background: #ffffff;
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
</style>