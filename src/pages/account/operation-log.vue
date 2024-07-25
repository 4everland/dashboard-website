<template>
  <div class="pos-r">
    <e-right-opt-wrap fix style="top: -30px">
      <div class="al-c">
        <v-select
          class="ipfs-input hide-msg mr-4"
          outlined
          :items="items"
          dense
          @change="fTypeChange"
          v-model="seleted"
        ></v-select>

        <e-custom-date-picker
          @date="handleDate"
          :items="dType"
          selected="DAY_1"
        ></e-custom-date-picker>
      </div>
    </e-right-opt-wrap>

    <v-skeleton-loader
      v-if="!list"
      type="article"
      style="max-width: 400px; min-height: 300px"
    ></v-skeleton-loader>
    <e-empty v-else-if="!list.length" class="pt-10">No Logs</e-empty>
    <template v-else>
      <div class="al-c mb-5" v-for="it in pagiList" :key="it.id">
        <e-avatar :diameter="34" :address="it.addr"></e-avatar>
        <!-- <e-team-avatar
          class="cursor-p"
          :src="teamAvatar"
          :uid="teamInfo.teamId"
        ></e-team-avatar> -->
        <div class="ml-4 fz-14">
          <div>
            <span>{{ it.label }}</span>
            <span class="ml-5">{{ it.desc }}</span>
          </div>
          <div class="gray mt-1 fz-12">
            <span>{{ new Date(it.operateAt * 1e3).format() }}</span>
            <template v-if="it.path">
              <span class="ml-2">in</span>
              <e-link class="ml-2" :href="it.link">
                <u class="gray">{{ it.path }}</u>
              </e-link>
            </template>
          </div>
        </div>
      </div>
    </template>
    <e-pagi class="pa-5" v-model="page" :limit="limit" :total="total" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    path() {
      return this.$route.path;
    },
    pagiList() {
      const list = JSON.parse(JSON.stringify(this.list));
      if (this.list.length) {
        const curPageList = list.splice(
          (this.page - 1) * this.limit,
          this.limit
        );
        return curPageList;
      }
      return [];
    },
  },
  data() {
    return {
      list: null,
      page: 1,
      total: 0,
      limit: 10,
      start: "2022-7-27".toDate() * 1,
      items: [
        { text: "All", value: "ALL" },
        { text: "Owner", value: "OWNER" },
        { text: "Member", value: "MEMBER" },
      ],
      seleted: "ALL",
      dType: [
        { text: "Past 24h", value: "DAY_1" },

        { text: "Past 30d", value: "DAY_30" },
      ],
      dTypeSelected: "DAY_1",
      rewardHubAct: [
        "OAUTH_BIND_EMAIL",
        "OAUTH_BIND_DISCORD",
        "OAUTH_BIND_TELEGRAM",
        "OAUTH_BIND_TWITTER",
        "OAUTH_CREATE_BUCKET",
        "OAUTH_ARWEAVE_BUCKET",
        "OAUTH_BIND_BUCKET_DOMAIN",
        "OAUTH_SNAPSHOT",
        "OAUTH_BIND_HOSTING_DOMAIN",
        "OAUTH_DEPLOYED_IPFS",
        "OAUTH_DEPLOYED_AR",
        "OAUTH_DEPLOYED_GREENFIELD",
        "OAUTH_MINT_CHAIN",
        "OAUTH_CREATE_GATEWAY",
        "OAUTH_INVITE_TEAM",
      ],
    };
  },
  watch: {
    path() {
      if (this.path == this.initPath) {
        this.getList();
      }
    },
  },
  mounted() {
    this.initPath = this.path;
    this.getList();
  },
  methods: {
    getDesc(it) {
      const act = it.action;
      let obj = {};
      try {
        obj = JSON.parse(it.message || "{}");
      } catch (error) {
        // obj = it.message;
        console.log(it, error.message);
      }
      const utils = this.$utils;
      if (this.rewardHubAct.includes(act)) {
        console.log(it.message);
        it.desc = it.message;
        it.path = "Task Hub";
        it.link = "/task-hub";
        return;
      }
      if (act == "OAUTH_REGISTER_DRIP") {
        it.desc = "Got airdrop resources for new users";
        it.path = "Resource Transaction History";
        it.link = "/billing/bills";
      } else if (act == "OAUTH_EXCLUSIVE_DRIP") {
        it.desc = `Got a exclusive ${obj.name} resources`;
      } else if (act == "OAUTH_FIRST_LOGIN") {
        it.desc = "Welcome to 4EVERLAND";
        it.path = "Overview";
        it.link = "/overview";
      } else if (act == "OAUTH_BIND_GITHUB") {
        it.desc = "Connected Github account";
        it.path = "Configurations Account";
        it.link = "/account/config?tab=account_binding";
      } else if (act == "BILL_RECHARGE") {
        it.desc = `Deposited ${utils.cutFixed(obj.amount, 4)} USDC`;
      } else if (act == "BILL_WITHDRAW") {
        it.desc = `Withdrew ${utils.cutFixed(obj.amount, 4)} USDC`;
      } else if (act == "BILL_PURCHASED") {
        const info = utils.getPurchase(obj.type, obj.incremental);
        it.desc = `Purchased ${info.amount} ${info.unit || "for"} ${info.name}`;
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
        it.desc = "Redeployed project " + obj.projectName;
      } else if (act == "HOSTING_DELETE_PROJECT") {
        it.desc = "Deleted project " + obj.projectName;
        it.path = "Hosting";
        it.link = "/hosting/projects";
      } else if (act == "HOSTING_CREATE_PROJECT") {
        it.desc = "Created project " + obj.projectName;
      } else if (act == "HOSTING_GENERATE_CLI_TOKEN") {
        it.desc = "Generated Hosting Auth Token";
        it.path = "Hosting Auth Tokens";
        it.link = "/hosting/auth-tokens";
      } else if (act == "BUCKET_GENERATE_ACCESS_KEY") {
        it.desc = "Generated an Access Key";
        it.path = "Bucket(s3) Access Keys";
        it.link = "/bucket/access-keys";
      } else if (act == "BUCKET_DELETE") {
        it.desc = "Deleted bucket " + obj.bucket;
      } else if (act == "BUCKET_CREATE") {
        it.desc = "Created bucket " + obj.bucket;
      } else if (act == "BUCKET_ADD_DOMAIN") {
        it.desc = "Added domain " + obj.domain;
      } else if (act == "BUCKET_DELETE_DOMAIN") {
        it.desc = "Deleted domain " + obj.map((it) => it.domain).join(", ");
      } else if (act == "IPNS_MANAGER_GENERATE") {
        it.desc = "Generated an IPNS named " + obj.name;
      } else if (act == "IPNS_MANAGER_PUBLISH") {
        it.desc = "Published  an IPNS named " + obj.name;
      } else if (act == "IPNS_MANAGER_DELETE") {
        it.desc = "Deleted  an IPNS named " + obj.name;
      } else if (act == "IPNS_MANAGER_AUTH_TOKEN_GENERATE") {
        it.desc = "Generated an Auth Token";
      } else if (act == "IPNS_MANAGER_AUTH_TOKEN_DELETE") {
        it.desc = "Deleted an Auth Token";
      } else if (act == "BUCKET_SNAPSHOT") {
        it.desc =
          "Snapshotted a folder named " +
          obj.prefix.split("/")[obj.prefix.split("/").length - 2];
      } else if (act == "BUCKET_PUBLISH_SNAPSHOT") {
        it.desc =
          "Published a snapshot named " +
          obj.prefix.split("/")[obj.prefix.split("/").length - 2];
      } else if (act == "BUCKET_DELETE_SNAPSHOT") {
        it.desc =
          "Deleted a snapshot named " +
          obj.prefix.split("/")[obj.prefix.split("/").length - 2];
      } else if (act == "BUCKET_RESET_API_SECRET") {
        it.desc = "Resetted an API Secret";
        it.path = "Bucket(s3) Access Keys";
        it.link = "/bucket/access-keys";
      } else if (act == "GATEWAY_GENERATE") {
        it.desc = `Generate a dedicated gateway named ${obj.name}.4everland.link`;
      } else if (act == "GATEWAY_DELETE") {
        it.desc = `Deleted a gateway named ${obj.name}.4everland.link`;
      } else if (act == "REWARD_HUB_USED_GIFT_VOUCHER") {
        it.desc = `Redeemed a Credit`;
        it.path = "Resource Billing";
        it.link = "/billing/bills";
      } else if (act == "REWARD_HUB_USED_RESOURCE_VOUCHER") {
        it.desc = `Redeemed a Resource Voucher`;
        it.path = "Resource Billing";
        it.link = "/billing/bills/?typeIdx=2";
      } else if (act == "OAUTH_UPDATE_TEAM_NAME") {
        if (obj.type == "name") {
          it.desc = `Changed the account name to ${obj.name}`;
        } else {
          it.desc = "Changed the account photo";
        }
        it.path = "Configurations Account";
        it.link = "/account/config";
      } else if (act == "OAUTH_EXIT_TEAM") {
        it.desc = `Left the account`;
        it.path = "Members Account";
        it.link = "/account/member";
      } else if (act == "OAUTH_DISABLE_MEMBER") {
        it.desc = `Disabled the permissions to ${obj.name}`;
        it.path = "Members Account";
        it.link = "/account/member";
      } else if (act == "OAUTH_UPDATE_MEMBER_ACCESS") {
        it.desc = `Changed the permissions to ${obj.name}`;
        it.path = "Members Account";
        it.link = "/account/member";
      } else if (act == "OAUTH_ENABLE_MEMBER") {
        it.desc = `Enabled the permissions to ${obj.name}`;
        it.path = "Members Account";
        it.link = "/account/member";
      } else if (act == "OAUTH_REMOVE_MEMBER") {
        it.desc = `Removed the permissions to ${obj.name}`;
        it.path = "Members Account";
        it.link = "/account/member";
      } else if (act == "REWARD_HUB_USED_RESOURCE_VOUCHER") {
        it.desc = `Redeemed a Resource Voucher`;
        it.path = "Resource Billing";
        it.link = "/billing/bills";
      } else if (act == "PINNING_SERVICE_RESET_ACCESS_KEY") {
        it.desc = `Reset the Access Key`;
        it.path = "4EVER Pin";
        it.link = "/bucket/pinning-service";
      } else if (act == "PINNING_SERVICE_GENERATE_ACCESS_KEY") {
        it.desc = `Generate an Access Key`;
        it.path = "4EVER Pin";
        it.link = "/bucket/pinning-service";
      } else if (act == "BILL_LAND_RECHARGE") {
        const amount = JSON.parse(it.message).Amount / 1e18;
        it.desc = `Deposited ${amount} LANDs`;
        it.path = "Deposit History";
        it.link = "/billing/records?tab=Deposit History";
      } else {
        // console.log(act, it);
        it.desc = act;
      }
      if (!it.path) {
        if (/^bill/i.test(act)) {
          it.link = "/billing/bills";
          it.path = "Resource Transaction History";
        } else if (act == "OAUTH_EXCLUSIVE_DRIP") {
          it.link = "/billing/bills?typeIdx=2";
          it.path = "Resource Transaction History";
        } else if (/^hosting.*project$/i.test(act) && obj.projectName) {
          it.path = "Hosting " + obj.projectName;
          it.link = `/hosting/project/${obj.projectName}/${obj.projectId}`;
        } else if (/^hosting.*domain$/i.test(act)) {
          const name = obj.projectName || obj.projectNames[0];
          const id = obj.projectId || obj.projectIds[0];
          it.path = "Hosting " + name;
          it.link = `/hosting/project/${name}/${id}`;
        } else if (/bucket/i.test(act)) {
          if (/domain/i.test(act)) {
            it.path = "Bucket(s3) Domains";
            it.link = "/bucket/domains";
          } else if (/snapshot/i.test(act)) {
            it.path = "Bucket(s3) " + obj.bucket;
            it.link = `/bucket/storage/${obj.bucket}/?tab=snapshots`;
          } else {
            it.path = "Bucket(s3)";
            it.link = "/bucket/storage/";
          }
        } else if (/ipns_manager/i.test(act)) {
          if (/ipns_manager_auth/i.test(act)) {
            it.path = "Gateway Auth Token";
            it.link = "/gateway/auth-token";
          } else {
            it.path = "Gateway IPNS Manager";
            it.link = "/gateway/ipns";
          }
        } else if (/gateway/i.test(act)) {
          it.path = "Gateway Dedicated Gateway";
          it.link = "/gateway/list";
        } else if (act == "RAAS_ONE_CLIENT_CREATE_ROLLUP") {
          const name = obj.RollupName;
          const id = obj.RollupId;
          it.desc = `deployed rollup ${name}`;
          it.path = `RaaS ${name}`;
          it.link = `/raas/${name}/${id}`;
        } else if (act == "RAAS_RENEW_ROLLUP") {
          const name = obj.RollupName;
          const id = obj.RollupId;
          const days = obj.Days;
          it.desc = `renewed rollup ${name} for ${days} Days`;
          it.path = `RaaS ${name}`;
          it.link = `/raas/${name}/${id}`;
        } else if (act == "RAAS_CREATE_ROLLUP") {
          it.desc = "submitted a Rollup creation form";
          it.path = `RaaS`;
          it.link = `/raas`;
        } else if (act == "RPC_CREATE_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `created RPC Key ${keyName}`;
          it.path = `RPC ${keyName}`;
          it.link = `/rpc/detail/${keyName}/${keyId}`;
        } else if (act == "RPC_RESET_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `reset RPC Key ${keyName}`;
          it.path = `RPC ${keyName}`;
          it.link = `/rpc/detail/${keyName}/${keyId}`;
        } else if (act == "RPC_DELETE_KEY") {
          it.desc = `deleted RPC Key`;
          it.path = `RPC`;
          it.link = `/rpc`;
        } else if (act == "RPC_ACTIVE_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `set RPC Key ${keyName} to active`;
          it.path = `RPC ${keyName}`;
          it.link = `/rpc/detail/${keyName}/${keyId}`;
        } else if (act == "RPC_INACTIVE_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `set RPC Key ${keyName} to inactive`;
          it.path = `RPC ${keyName}`;
          it.link = `/rpc/detail/${keyName}/${keyId}`;
        } else if (act == "AI_RPC_CREATE_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `created AI RPC Key ${keyName}`;
          it.path = `AI ${keyName}`;
          it.link = `/ai-rpc/key/${keyName}/${keyId}`;
        } else if (act == "AI_RPC_DELETE_KEY") {
          const keyName = obj.keyName;
          it.desc = `deleted AI RPC Key ${keyName}`;
          it.path = `AI`;
          it.link = `/ai-rpc?tab=Keys`;
        } else if (act == "AI_RPC_RESET_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `reset AI RPC Key ${keyName}`;
          it.path = `AI ${keyName}`;
          it.link = `/ai-rpc/key/${keyName}/${keyId}`;
        } else if (act == "AI_RPC_LIMIT_KEY") {
          const keyName = obj.keyName;
          const limit = obj.limit;
          const keyId = obj.keyId;
          it.desc = `set  AI RPC Key ${keyName}  month limit to ${limit} LAND`;
          it.path = `AI ${keyName}`;
          it.link = `/ai-rpc/key/${keyName}/${keyId}`;
        } else if (act == "AI_RPC_INACTIVE_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `set AI RPC Key ${keyName} to inactive`;
          it.path = `AI ${keyName}`;
          it.link = `/ai-rpc/key/${keyName}/${keyId}`;
        } else if (act == "AI_RPC_ACTIVE_KEY") {
          const keyName = obj.keyName;
          const keyId = obj.keyId;
          it.desc = `set AI RPC Key ${keyName} to active`;
          it.path = `AI ${keyName}`;
          it.link = `/ai-rpc/key/${keyName}/${keyId}`;
        }
      }
    },
    async getList() {
      try {
        if (this.list) {
          this.$loading();
        }
        const api = this.$inDev ? "https://log.foreverland.xyz" : "$hosting";
        const { data } = await this.$http.get(
          api + "/user/activity/team/action/logs",
          {
            params: {
              fType: this.seleted,
              dType: this.dTypeSelected,
            },
          }
        );
        this.total = data.total;
        const list = data.list.map((it) => {
          if (!it.memberName && !it.currentUid) {
            it.addr = this.userInfo.username;
          } else {
            it.addr = it.memberName || it.currentUid;
          }

          it.label = it.addr.cutStr(6, 4);
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
    fTypeChange() {
      this.page = 1;
      if (typeof this.dTypeSelected == "number") {
        this.handleDate(this.dTypeSelected);
      } else {
        this.getList();
      }
    },
    async handleDate(val) {
      this.dTypeSelected = val;
      this.page = 1;
      if (typeof val == "string") return this.getList();
      try {
        if (this.list) {
          this.$loading();
        }
        const api = this.$inDev ? "https://log.foreverland.xyz" : "$hosting";
        const { data } = await this.$http.get(
          api + "/user/activity/team/action/logs",
          {
            params: {
              fType: this.seleted,
              dType: "DAY_30",
            },
          }
        );
        const list = data.list
          .map((it) => {
            if (!it.memberName && !it.currentUid) {
              it.addr = this.userInfo.username;
            } else {
              it.addr = it.memberName || it.currentUid;
            }
            it.label = it.addr.cutStr(6, 4);
            this.getDesc(it);
            return it;
          })
          .filter((it) => {
            return (
              it.operateAt * 1000 > val &&
              it.operateAt * 1000 <= val + 864 * 1e5
            );
          });
        this.total = list.length;
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

<style lang="scss" scoped>
::v-deep .ipfs-input {
  width: 130px;
}
</style>
