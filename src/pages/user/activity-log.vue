<template>
  <div class="pos-r">
    <v-date-picker
      v-model="date"
      :allowed-dates="isAllow"
      :class="asMobile ? 'w100p' : 'pos-a top-0 right-0'"
    ></v-date-picker>
    <v-skeleton-loader
      v-if="!list"
      type="article"
      style="max-width: 400px; min-height: 300px"
    ></v-skeleton-loader>
    <e-empty v-else-if="!list.length" class="pt-10">No Logs</e-empty>
    <template v-else>
      <div class="al-c mb-5" v-for="it in list" :key="it.id">
        <div class="bdrs-100 bd-1">
          <v-avatar size="34" class="bg-white d-b bd-">
            <svg
              style="display: block"
              width="80"
              height="80"
              :data-jdenticon-value="it.label"
            ></svg>
          </v-avatar>
        </div>
        <div class="ml-4 fz-14">
          <div>
            <span>{{ it.label }}</span>
            <span class="ml-5">{{ it.desc }}</span>
          </div>
          <div class="gray mt-1 fz-12">
            <span>{{ new Date(it.operateAt * 1e3).format() }}</span>
            <template v-if="it.path">
              <span class="ml-2">at</span>
              <a class="ml-2" :href="'#' + it.link">{{ it.path }}</a>
            </template>
          </div>
        </div>
      </div>
    </template>
    <e-pagi
      class="pa-5"
      @input="getList"
      v-model="page"
      :limit="10"
      :total="total"
    />
  </div>
</template>

<script>
const now = new Date();

export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      list: null,
      date: now.format("yy-MM-dd"),
      page: 1,
      total: 0,
      start: "2022-7-27".toDate() * 1,
    };
  },
  watch: {
    date() {
      this.page = 1;
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    isAllow(val) {
      const date = val.toDate();
      return date < now && date > this.start;
    },
    getDesc(it) {
      const act = it.action;
      let obj = {};
      try {
        obj = JSON.parse(it.message || "{}");
      } catch (error) {
        console.log(it, error.message);
      }
      const utils = this.$utils;
      if (act == "OAUTH_REGISTER_DRIP") {
        it.desc = "started 4EVERLAND Tour";
        it.path = "Overview";
        it.link = "/overview";
      } else if (act == "OAUTH_FIRST_LOGIN") {
        it.desc = "got airdrop resources for new users";
      } else if (act == "BILL_RECHARGE") {
        it.desc = `deposited ${utils.cutFixed(obj.amount, 4)} USDC`;
      } else if (act == "BILL_WITHDRAW") {
        it.desc = `withdrew ${utils.cutFixed(obj.amount, 4)} USDC`;
      } else if (act == "BILL_PURCHASED") {
        const info = utils.getPurchase(obj.type, obj.incremental);
        it.desc = `purchased ${info.amount} ${info.unit || "for"} ${info.name}`;
        if (obj.time > 0)
          it.desc += ` until ${new Date(obj.time * 1e3).format("date")}`;
      } else if (
        act == "HOSTING_ADD_DOMAIN" ||
        act == "HOSTING_DELETE_DOMAIN"
      ) {
        console.log(obj);
        it.desc =
          (/add/i.test(act) ? "added" : "deleted") +
          " domain " +
          (obj.domain || obj.domains[0]);
      } else if (act == "HOSTING_REDEPLOY_PROJECT") {
        it.desc = "redeployed project " + obj.projectName;
      } else if (act == "HOSTING_DELETE_PROJECT") {
        it.desc = "deleted project " + obj.projectName;
      } else if (act == "HOSTING_CREATE_PROJECT") {
        it.desc = "created project " + obj.projectName;
      } else if (act == "HOSTING_GENERATE_CLI_TOKEN") {
        it.desc = "generated Auth Token";
        it.path = "Settings";
        it.link = "/settings?tab=auth_tokens";
      }
      if (!it.path) {
        if (/^bill/i.test(act) || act == "OAUTH_FIRST_LOGIN") {
          it.path = "Billing";
          it.link = "/billing/bills";
        } else if (/^hosting.*project$/i.test(act) && obj.projectName) {
          it.path = "Hosting " + obj.projectName;
          it.link = `/hosting/project/${obj.projectName}/${obj.projectId}`;
        } else if (/^hosting.*domain$/i.test(act)) {
          const name = obj.projectName || obj.projectNames[0];
          const id = obj.projectId || obj.projectIds[0];
          it.path = "Hosting " + name;
          it.link = `/hosting/project/${name}/${id}`;
        }
      }
    },
    async getList() {
      try {
        if (this.list) {
          this.$loading();
        }
        const api = this.$inDev ? "https://log.foreverland.xyz" : "";
        const { data } = await this.$http2.get(api + "/action/logs", {
          params: {
            time: 3600 * 12 + this.date.toDate() / 1e3,
            size: 10,
            page: this.page - 1,
          },
        });
        this.total = data.total;
        const list = data.list.map((it) => {
          it.label = it.guid.cutStr(6, 4);
          this.getDesc(it);
          return it;
        });
        this.list = list;
        setTimeout(() => {
          window.jdenticon();
        }, 100);
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
  },
};
</script>