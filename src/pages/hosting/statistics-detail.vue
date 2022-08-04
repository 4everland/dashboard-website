<style>
.bg-s0 {
  background: #75a6e7;
}
.bg-s1 {
  background: #84d199;
}
.bg-s2 {
  background: #be80e0;
}
</style>

<template>
  <div>
    <v-tabs v-model="tabIdx" background-color="transparent" color="primary">
      <v-tab v-for="(it, i) in tabList" :key="i">
        {{ it.label }}
      </v-tab>
    </v-tabs>
    <div class="main-wrap mt-6" style="min-height: 300px">
      <component
        :is="it.comp"
        :appId="appId"
        :active="i == tabIdx"
        :reloadAt="reloadAt"
        v-show="i == tabIdx"
        :is-render="activeIdxList.includes(i)"
        v-for="(it, i) in tabList"
        :key="i"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const { id, projName } = this.$route.params;
    return {
      appId: id,
      projName,
      info: null,
      loading: false,
      reloadAt: 0,
      tabIdx: 0,
      activeIdxList: [0],
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    tabList() {
      const list = [
        {
          label: "User Analysis",
          comp: "statis-analysis",
        },
        {
          label: "Request",
          comp: "statis-request",
        },
        {
          label: "Data Transfer",
          comp: "statis-data",
        },
      ];
      return list;
    },
    navItems() {
      const { id, projName } = this.$route.params;
      return [
        {
          text: "Statistics",
          to: "/dashboard/statistics",
        },
        {
          text: projName,
          to: `/statistics/${projName}/${id}`,
        },
      ];
    },
  },
  watch: {
    asMobile() {
      location.reload();
    },
    tabIdx(tab) {
      if (!this.activeIdxList.includes(tab)) {
        this.activeIdxList.push(tab);
      }
    },
    appId() {
      this.getData();
    },
    "$route.query.appId"(val) {
      if (val) {
        this.appId = val;
      }
    },
  },
};
</script>