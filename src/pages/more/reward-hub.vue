<template>
  <div>
    <div class="bdrs-10 ov-h mb-4 pos-r">
      <img
        src="/img/bg/user/reward-hub-bg.png"
        class="w100p img-cover d-b"
        style="max-height: 210px"
      />
      <div class="pos-center link-2 fw-b ta-c w100p" style="max-width: 450px">
        <h1 class="fz-40">Reward Hub</h1>
        <div class="fz-18">Enjoy free resources in 4EVERLAND Reward Hub.</div>
      </div>
    </div>
    <div class="main-wrap">
      <div class="al-c mb-3">
        <span class="fw-b mr-2">Ways for Reward</span>
        <e-tooltip top>
          <v-icon slot="ref" color="#aaa" size="14">mdi-alert-circle</v-icon>
          <span
            >Getting free resources by completing the following tasks and
            resources are valid for one year after completion of tasks.</span
          >
        </e-tooltip>
      </div>
      <v-data-table
        class="strip"
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
            :disabled="item.status == 'DONE'"
            :loading="item.loading"
          >
            <span
              :class="{
                'white-0': item.status != 'DONE',
              }"
            >
              {{ item.statusName || "To do" }}
            </span>
          </v-btn>
          <v-btn
            v-if="item.status == 'GOTO'"
            :loading="item.refreshing"
            icon
            class="ml-2"
            small
            @click="onRefresh(item)"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
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
        console.log(data);
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
        await this.$http.post("$auth" + val);
        if (/claim/.test(val)) {
          await this.$alert("Claimed successfully.");
          this.$navTo("/resource/bills");
        }
        this.getList();
      } else if (type == "EMAIL_SUBSCRIPTION_VERIFICATION") {
        this.onSubsribe();
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
        this.list = data.item;
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>