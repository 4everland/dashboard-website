<template>
  <div>
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:item="{ item }">
          <router-link
            v-if="!item.disabled"
            :to="item.to"
            class="breadcrumb-link"
          >
            {{ item.text }}
          </router-link>
          <span v-else>
            {{ item.text }}
          </span>
        </template>
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <e-tabs :list="list" :info="info" @handleEvent="getList"></e-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { text: "Settings", comp: "gateway-settings" },
        { text: "Allowlists", comp: "gateway-allowlists" },
        { text: "Domains", comp: "gateway-domains" },
      ],
      breadcrumbsItems: [
        {
          text: "Gateway",
          disabled: false,
          to: "/gateway/list",
        },
        {
          text: "",
          disabled: true,
        },
      ],
      info: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("$gateway/gateway/");
        data.forEach((it) => (it.type = "IPFS"));
        this.info = data.find((it) => it.name == this.$route.params.name);
        console.log(this.info);
        this.breadcrumbsItems[1].text = this.info.name;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .act-control {
    width: 100% !important;
  }
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
</style>