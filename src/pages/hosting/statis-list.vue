<style lang="scss">
.right-con {
  width: 550px;
  border-radius: 2px;
  padding-left: 15px;
  td {
    width: 25%;
    padding: 3px;
  }
}
.proj-item {
  &:nth-child(2n) {
    background: #f7f9fb;
  }
  cursor: pointer;
  &:hover {
    .name {
      color: #34a9ff;
    }
  }
}
</style>

<template>
  <div>
    <v-skeleton-loader v-if="!list" type="article"></v-skeleton-loader>
    <div v-else>
      <div
        class="al-c pa-4 pb-2 bdb-1 gray-6 fw-b fz-14 pos-s bg-white z-10"
        style="top: 60px"
        v-if="!asMobile"
      >
        <span>Project</span>
        <table class="right-con ml-auto">
          <tr>
            <td></td>
            <!-- <td>New Users</td> -->
            <td>Unique Visitors</td>
            <td>Page Views</td>
          </tr>
        </table>
      </div>
      <div class="mt-8" v-if="!list.length">
        <e-empty class="pt-10">No Projects</e-empty>
      </div>
      <div
        v-else
        @click="onClick(it)"
        class="al-c pa-4 proj-item f-wrap"
        v-for="(it, i) in list"
        :key="i"
      >
        <v-img
          :class="{
            'mb-4': asMobile,
          }"
          :src="$getImgSrc(it.screenshot)"
          lazy-src="/img/bg/empty/project.png"
          max-height="60"
          max-width="60"
          :aspect-ratio="1"
          class="bdrs-8 bd-1"
        />
        <b class="ml-5 fz-14 name">
          {{ it.projectName }}
        </b>
        <table class="right-con fz-14 ml-auto">
          <tr v-if="asMobile">
            <td></td>
            <!-- <td>New Users</td> -->
            <td>UV</td>
            <td>PV</td>
          </tr>
          <tr>
            <td class="gray-6">Yesterday</td>
            <!-- <td>{{ it.yesterdayNewUser }}</td> -->
            <td>{{ it.yesterdayUv }}</td>
            <td>{{ it.yesterdayPv }}</td>
          </tr>
          <tr>
            <td class="gray-6">Today</td>
            <!-- <td>{{ it.todayNewUser }}</td> -->
            <td>{{ it.todayUv }}</td>
            <td>{{ it.todayPv }}</td>
          </tr>
          <!-- <tr>
            <td class="gray-6">Total</td>
            <td>{{ it.totalNewUser }}</td>
            <td>{{ it.totalUv }}</td>
            <td>{{ it.totalPv }}</td>
          </tr> -->
        </table>
      </div>
    </div>
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
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      list: null,
      page: 1,
      total: 0,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    onClick(item) {
      this.$navTo(`/hosting/statistics/${item.projectName}/${item.projectId}`);
    },
    async getList() {
      try {
        if (this.list) this.$loading();
        const params = {
          page: this.page - 1,
          size: 10,
        };
        let { data } = await this.$http2.get(
          "/analytics/user/v3/project/page/list",
          {
            params,
          }
        );
        this.list = data.content || data || [];
        this.total = data.totalElements || 0;
        console.log(this.list);
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
  },
};
</script>