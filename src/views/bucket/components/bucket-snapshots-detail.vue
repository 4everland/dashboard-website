<template>
  <div>
    <div class="ml-auto" style="width: 225px">
      <v-text-field
        class="hide-msg bd-1"
        dense
        solo
        clearable
        label="Search"
        prepend-inner-icon="mdi-magnify"
        v-model="searchKey"
        @input="handleInput"
      ></v-text-field>
    </div>
    <v-data-table
      class="mt-5 data-table"
      :headers="header"
      :items="list"
      item-key="id"
      hide-default-footer
      disable-pagination
      :loading="tableLoading"
    >
      <template v-slot:item.name="{ item }">
        <div
          class="file-name"
          v-if="/\/$/.test(item.name)"
          @click="onRow(item)"
        >
          <v-icon size="18" class="mr-2">mdi-folder</v-icon>
          {{ item.name.replace("/", "") }}
        </div>

        <div class="file-name" v-else>
          {{ item.name.cutStr(5, 5) }}
        </div>
      </template>

      <template v-slot:item.cid="{ item }">
        <span>{{ item.cid.cutStr(5, 5) }}</span>
        <v-btn
          v-if="item.cid"
          class="e-btn-text ml-2"
          icon
          small
          v-clipboard="item.cid"
          @success="$toast('Copied to clipboard !')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
      </template>
      <template v-slot:item.size="{ item }">
        {{ $utils.getFileSize(item.size) }}
      </template>
    </v-data-table>
    <!-- Loading Img -->
    <div
      class="ta-c loading-img"
      :class="tableLoading ? 'mt-10' : 'mt-15'"
      v-if="!list.length"
    >
      <img
        :src="`/img/svg/common/empty${tableLoading ? 1 : 2}.svg`"
        :height="tableLoading ? 100 : 130"
      />
      <div class="mt-5 gray fz-17">
        {{ tableLoading ? "Loading files..." : "No folders or files found" }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    snapshotId: String,
  },
  data() {
    return {
      header: [
        { text: "Name", value: "name" },
        { text: "IPFS CID", value: "cid" },
        { text: "Size", value: "size" },
      ],
      list: [],
      matchPathCid: [],
      tableLoading: false,
      searchKey: "",
    };
  },
  created() {
    if (this.snapshotId) {
      console.log(111);
      this.getInfo();
      this.matchPathCid.push({
        cid: null,
      });
    }
  },
  methods: {
    async getInfo() {
      try {
        this.list = [];
        this.tableLoading = true;
        const { data } = await this.$http.get(
          `/snapshots/${this.snapshotId}/dag`
        );
        // console.log(data);
        this.list = data.list;
        this.tableLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async onRow(item) {
      this.$router.push(this.$route.path + item.name + location.search);
      try {
        this.tableLoading = true;
        const { data } = await this.$http({
          url: `/snapshots/${this.snapshotId}/dag`,
          method: "get",
          params: {
            cid: item.cid,
          },
        });
        // console.log(data);
        this.list = data.list;
        this.tableLoading = false;
        this.matchPathCid.push({
          cid: item.cid,
          name: item.name.replace("/", ""),
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleInput() {},
  },
  watch: {
    "$route.path"(newVal, oldVal) {
      let curRoute = newVal.split("/").slice(4);
      const lastRoute = curRoute[curRoute.length - 2];
      if (newVal.length < oldVal.length) {
        let matchRoute = this.matchPathCid.filter((it) => it.name == lastRoute);
        let matchRouteIndex = this.matchPathCid.findIndex(
          (it) => it.name == lastRoute
        );
        this.matchPathCid.splice(
          matchRouteIndex + 1,
          this.matchPathCid.length - 1
        );
        if (matchRoute.cid) {
          console.log(1111);
          this.onRow(matchRoute);
        } else {
          this.getInfo();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-name {
  font-family: "Arial-BoldMT", "Arial";
}
</style>