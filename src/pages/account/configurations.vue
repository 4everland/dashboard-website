<template>
  <div>
    <v-skeleton-loader
      class="mt-15 mb-15"
      v-if="onChain == null"
      type="article"
    ></v-skeleton-loader>
    <template v-else>
      <template v-if="teamInfo.isOwner">
        <account-info class="mb-5"></account-info>
        <div
          class="mint-tip ta-c mb-5 py-3 bdrs-6 al-c justify-center cursor-p"
          v-if="!onChain"
          @click="showClaim"
        >
          <img width="20" src="/img/svg/overview/notice-white.svg" alt="" />
          <span class="ml-5 fz-14">
            Click to claim your account activation gift pakage!</span
          >
        </div>
        <account-bind></account-bind>
        <div class="account-delete bg-white px-8 py-4 bd-1 bdrs-10 al-c mt-6">
          <img height="50" src="/img/svg/settings/delete_account.svg" alt="" />
          <div class="ml-3 d-flex flex-column">
            <span class="fz-16">Delete Account</span>
            <span class="gray mt-2 fz-14"
              >Delete your account from 4EVERLAND along with all of its data
              permanently and irrecoverably? Please confirm before
              proceeding.</span
            >
          </div>
          <div class="ml-auto">
            <v-btn
              color="red"
              min-width="75"
              width="160"
              max-width="160"
              @click="onDelete"
              outlined
              >Delete</v-btn
            >
          </div>
        </div>
        <e-claim-dialog
          ref="claimRef"
          @claimCompeleted="claimCompeleted"
        ></e-claim-dialog>
      </template>
      <div class="bg-white pa-8 bd-1 bdrs-10 al-c" v-else>
        <div style="width: 60%" class="mr-auto">
          <h3 class="fz-20">Leave Account</h3>
          <p class="fz-14 mb-6 mt-3 description">
            You won't be able to manage the account's projects or content when
            you leave the account, and the account will be hidden.
          </p>
        </div>
        <v-btn color="primary" width="120px" outlined @click="onExit"
          >Exit</v-btn
        >
      </div>
    </template>
  </div>
</template>

<script>
import AccountBind from "@/views/account/account-bind";
import AccountInfo from "@/views/account/account-info";
import { mapState, mapGetters } from "vuex";
export default {
  components: { AccountBind, AccountInfo },
  computed: {
    ...mapState({
      onChain: (s) => s.onChain,
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["teamInfo"]),
    hasAccess() {
      return (
        this.teamInfo.status !== "DISABLED" &&
        this.teamInfo.access.includes("MEMBER") &&
        this.teamInfo.isMember
      );
    },
  },
  methods: {
    async onDelete() {
      try {
        let html =
          "4EVERLAND will delete all of your projects, as well as all their deployments, domains, SSL certificates, activity, and all other resources belonging to your Personal Account.";
        html +=
          '<div class="bg-warning pd-10-20 fz-14 mt-3"><b>Warning</b>: This action is not reversible. Please be cautious.</div>';
        // const { username } = this.userInfo;
        await this.$prompt(html, "Delete Personal Account", {
          confirmText: "Delete",
          confirmTextAttrs: {
            color: "error",
            text: false,
          },
          // inputAttrs: {
          //   label: `Enter your name \`${username}\` to continue`,
          //   rules: [
          //     (v) => v == username || "The text you entered didn't match.",
          //   ],
          //   required: true,
          // },
          inputAttrs: {
            label: `Type \`delete my account\` to verify`,
            rules: [
              (v) =>
                v == "delete my account" ||
                "The text you entered doesn't match.",
            ],
            required: true,
          },
        });
        this.$loading();
        // await this.$sleep(500)
        await this.$http.delete("$auth/accounts");
        this.$clearLogin();
        this.$loading.close();
        this.$alert("Personal account deleted successfully").then(() => {
          location.href = "index.html";
        });
      } catch (error) {
        console.log(error);
        this.$loading.close();
      }
    },
    showClaim() {
      this.$refs.claimRef.showDialog = true;
    },
    async claimCompeleted() {
      await this.getHandler();
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
    async onExit() {
      try {
        await this.$confirm(
          "Are you sure you want to leave the account?",
          "Alert"
        );
        this.$loading();
        await this.$http.post("$auth/cooperation/exit");
        this.$loading.close();
        this.$setState({
          teamId: null,
        });
        location.href = "/overview";
      } catch (error) {
        //
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  padding: 50px;
}
.mint-tip {
  background: #f49e28;
  color: #fff;
}
</style>
