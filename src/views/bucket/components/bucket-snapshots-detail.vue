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
      ></v-text-field>
    </div>
    <v-data-table
      class="mt-5 data-table"
      :headers="header"
      :items="filterList"
      item-key="id"
      hide-default-footer
      disable-pagination
      :loading="tableLoading"
      @click:row="onRow"
    >
      <template v-slot:item.name="{ item }">
        <div class="file-name" v-if="/\/$/.test(item.name)">
          <v-btn color="#000" class="e-btn-text" text @click.stop="onRow(item)">
            <v-icon size="18" class="mr-2">mdi-folder</v-icon>
            {{ item.name.replace("/", "").cutStr(5, 5) }}
          </v-btn>
        </div>
        <div class="file-name" v-else>
          <v-btn color="#000" class="e-btn-text" text>
            {{ item.name.cutStr(5, 5) }}
          </v-btn>
        </div>
      </template>

      <template v-slot:item.cid="{ item }">
        <div class="al-c">
          <a
            :href="ipfsLink(item.cid)"
            class="hash-link"
            style="color: #0b0817"
            target="_blank"
            @click.stop
            >{{ item.cid.cutStr(10, 8) }}</a
          >
          <v-btn
            v-if="item.cid"
            class="e-btn-text ml-2"
            icon
            small
            @click.stop
            v-clipboard="item.cid"
            @success="$toast('Copied!')"
          >
            <img src="/img/svg/copy.svg" width="12" />
          </v-btn>
        </div>
      </template>
      <template v-slot:item.size="{ item }">
        {{ $utils.getFileSize(item.size) }}
      </template>
    </v-data-table>
    <!-- Loading Img -->
    <div
      class="ta-c loading-img"
      :class="tableLoading ? 'mt-10' : 'mt-15'"
      v-if="!filterList.length"
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
import { mapGetters } from "vuex";
export default {
  props: {
    snapshotId: String,
  },
  data() {
    return {
      header: [
        { text: "Name", value: "name" },
        { text: "IPFS CID", value: "cid" },
        { text: "TSize", value: "size" },
      ],
      list: [],
      matchPathCid: [],
      tableLoading: false,
      searchKey: "",
      userClick: false,
    };
  },
  created() {
    if (this.snapshotId) {
      this.getInfo();
      this.matchPathCid.push({
        cid: null,
        name: this.$route.path.split("/")[4],
      });
    }
  },
  computed: {
    ...mapGetters(["bucketDefaultGateWay"]),
    filterList() {
      if (this.searchKey == "" || this.searchKey == null) {
        return this.list;
      }
      const reg = new RegExp(this.searchKey);
      return this.list.filter((it) => reg.test(it.name));
    },
  },
  methods: {
    async getInfo() {
      try {
        this.list = [];
        this.tableLoading = true;
        const { data } = await this.$http.get(
          `/snapshots/${this.snapshotId}/dag`
        );
        this.list = data.list;
        this.tableLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async onRow(item) {
      this.userClick = true;
      const curRouteArr = this.$route.path.split("/");
      const curRoute = curRouteArr.slice(4, curRouteArr.length - 1);
      curRoute.push(item.name);
      const curRoutePath = decodeURI(curRoute.join("/"));
      if (this.matchPathCid.findIndex((it) => it.cid == item.cid) == -1) {
        this.matchPathCid.push({
          cid: item.cid,
          name: curRoutePath,
        });
      }

      if (!/\/$/.test(item.name)) return;
      if (!item.noRoute) {
        this.$router.push(this.$route.path + item.name + location.search);
      }
      try {
        this.tableLoading = true;
        this.list = [];
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
      } catch (error) {
        console.log(error);
      }
      this.userClick = false;
    },
    ipfsLink(ipfs) {
      return this.bucketDefaultGateWay + "/ipfs/" + ipfs;
    },
  },
  watch: {
    "$route.path"(newVal, oldVal) {
      if (this.$route.query.tab != "snapshots") return;
      newVal = decodeURI(newVal);
      oldVal = decodeURI(oldVal);
      let curRoute = newVal.split("/").slice(4).join("/");
      const matchPathArr = this.matchPathCid.map((it) => it.name);
      let index = matchPathArr.indexOf(curRoute);
      let matchRoute;
      if (index == -1) {
        matchRoute = this.matchPathCid[0];
      } else {
        matchRoute = this.matchPathCid[index];
      }
      if (matchRoute.cid && !this.userClick) {
        this.onRow({
          name: matchRoute.name + "/",
          cid: matchRoute.cid,
          noRoute: true,
        });
      }
      if (!matchRoute.cid) {
        this.getInfo();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hash-link {
  display: block;
  min-width: 150px;
  color: #0b0817;
}
</style>
