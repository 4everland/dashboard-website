<template>
  <div>
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
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>