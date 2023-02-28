export default {
  methods: {
    async onDelProj(it) {
      const { name } = it;
      let html =
        "4EVERLAND will delete all of your projects, along with all of its Deployments, Domains, SSL Certificates, and all other resources belonging to your project.";

      if (it.platform == "AR") {
        html =
          "Deleting the project will remove it from your Hosting project list, but it will remain on Arweave's decentralized network permanently.";
      }
      html +=
        '<div class="bg-warning pd-10-20 fz-14 mt-3"><b>Warning</b>: This action is not reversible.Please be cautious.</div>' +
        `<div class="gray-6 fz-14 mt-5">Enter project name '${name}' to continue</div>`;

      await this.$prompt(html, "Delete Project", {
        confirmText: "Delete",
        confirmTextAttrs: {
          color: "error",
          text: false,
        },
        inputAttrs: {
          label: `Project Name`,
          rules: [(v) => v == name || "The text you entered doesn't match."],
          required: true,
        },
      });
      this.$loading();
      await this.$http.delete("$hosting/project/" + it.id);
      // this.$loading.close();
      this.$toast("Project deleted successfully");
    },
  },
};
