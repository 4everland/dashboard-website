<template>
  <div>
    <div class="mt-5 d-flex al-c">
      <h3 class="pd-20 pr-2">My DApps</h3>
      <e-tooltip right max-width="300" v-if="tip">
        <v-icon slot="ref" color="#ddd" size="14" class="pa-1 d-ib mt-1"
          >mdi-help-circle-outline</v-icon
        >
        <span v-html="tip"></span>
      </e-tooltip>
      <!-- <v-btn plain color="white" small :loading="loading" @click="getList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn> -->
    </div>
    <div class="ov-a bg-white bdrs-5 bd-1b ov-h">
      <table class="w100p ta-c" style="min-width: 560px">
        <thead>
          <tr>
            <td>#</td>
            <td>DApp</td>
            <td>Added Domain</td>
            <td>4EVERLAND Domain</td>
            <td>Total Users</td>
            <td>Percentage</td>
            <td>CreatedAt</td>
          </tr>
        </thead>
        <tbody class="op-9">
          <tr v-for="(it, i) in appList" :key="it.projectId">
            <td>{{ 1 + i }}</td>
            <td>{{ it.projectName }}</td>
            <td>
              <act-e-link :domain="it.domain" :notice="isTipCopy" />
            </td>
            <td>
              <act-e-link :domain="it.foreverlandDomain" :notice="isTipCopy" />
            </td>
            <td>{{ it.totalUsers }}</td>
            <td>{{ it.percentage }}%</td>
            <td>{{ new Date(it.createAt * 1000).format() }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pt-15 pb-15 ta-c" v-if="!list.length">
        <span class="fz-14 gray">No Statistics</span>
      </div>
    </div>
    <div class="mt-6" v-if="pageLen > 1">
      <v-pagination
        v-model="page"
        :length="pageLen"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tip: String,
  },
  data() {
    return {
      list: [],
      loading: false,
      isTipCopy: false,
      page: 1,
      pageLen: 1,
    };
  },
  computed: {
    appList() {
      return this.list.slice((this.page - 1) * 10, this.page * 10);
    },
  },
  watch: {
    page() {
      setTimeout(() => {
        this.setTipCopy();
      }, 100);
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async setTipCopy() {
      window.scrollTo(0, this.$el.offsetTop);
      await this.$sleep(100);
      this.isTipCopy = true;
      await this.$sleep(1000);
      this.isTipCopy = false;
    },
    async getList() {
      this.loading = true;
      try {
        await this.$sleep(300);
        const { data } = await this.$http.get(
          "$hosting/project/bigbang/projects"
        );
        this.list = data;
        this.pageLen = Math.ceil(data.length / 10);
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>