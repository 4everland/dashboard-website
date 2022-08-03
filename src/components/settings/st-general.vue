<template>
  <div class="ta-c pt-10 pb-10 st-general">
    <div class="del-wrap d-ib bdrs-8">
      <img src="img/svg/settings/account-del.svg" class="d-b" width="150" />
    </div>
    <div class="mt-3">
      <h3>Delete Personal Account</h3>
      <div class="gray fz-14 mt-3 ta-l">
        Permanently delete your Personal Account and all of its contents from
        the 4everland platform. This action is not reversible, so please
        continue to act with caution.
      </div>
      <div class="mt-8">
        <v-btn outlined small @click="onDelete">Delete Account</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
  },
  methods: {
    async onDelete() {
      try {
        let html =
          "4everland will delete all of your projects, as well as all their deployments, domains, SSL certificates, activity, and all other resources belonging to your Personal Account.";
        html +=
          '<div class="bg-warning pd-10-20 fz-14 mt-3"><b>Warning</b>: This action is not reversible. Please be certain.</div>';
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
                "The text you entered didn't match.",
            ],
            required: true,
          },
        });
        this.$loading();
        this.deleting = true;
        // await this.$sleep(500)
        await this.$http.delete("$auth/accounts");
        localStorage.clear();
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
</style>