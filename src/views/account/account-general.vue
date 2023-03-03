<template>
  <div>
    <div class="ta-c pt-10 pb-10 st-general" v-if="teamInfo.isOwner">
      <div class="del-wrap d-ib bdrs-8">
        <img src="/img/svg/settings/account-del.svg" class="d-b" width="150" />
      </div>
      <div class="mt-3">
        <h3>Delete Account</h3>
        <div class="gray fz-14 mt-3 ta-l">
          Delete your account from 4EVERLAND along with all of its data
          permanently and irrecoverably? Please confirm before proceeding.
        </div>
        <div class="mt-8">
          <v-btn outlined small @click="onDelete">Delete</v-btn>
        </div>
      </div>
    </div>
    <div class="mt-5 config-item al-c" v-else>
      <div style="width: 60%" class="mr-auto">
        <h3 class="fz-20">Leave Account</h3>
        <p class="fz-14 mb-6 mt-3 description">
          You won't be able to manage the account's projects or content when you
          leave the account, and the account will be hidden.
        </p>
      </div>
      <v-btn color="primary" width="120px" outlined @click="handleDelete"
        >Exit</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["teamInfo"]),
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
            label: `Type \`delete my account\` To verify`,
            rules: [
              (v) =>
                v == "delete my account" ||
                "The text you entered doesn't match.",
            ],
            required: true,
          },
        });
        this.$loading();
        this.deleting = true;
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
      this.deleting = false;
    },
    async handleDelete() {
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

<style lang="scss">
.st-general {
  max-width: 410px;
  margin: auto;
  .del-wrap {
    background: #e2f2fa;
    padding: 20px 60px;
  }
}
.config-item {
  padding: 32px 28px;
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
  border-radius: 10px;
  .description {
    color: #6c7789;
  }
}
</style>
