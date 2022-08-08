<template>
  <div>
    <div class="d-flex al-c mb-2">
      <e-right-opt-wrap style="width: 100%" :top="-60">
        <v-row class="d-flex">
          <v-col md="4" style="max-width: 230px">
            <v-select
              class="hide-msg bd-1"
              dense
              solo
              :items="items"
              v-model="state"
              @change="getList"
            />
          </v-col>
          <v-col md="8">
            <v-text-field
              class="hide-msg bd-1"
              prepend-inner-icon="mdi-magnify"
              solo
              dense
              placeholder="Search"
              v-model="searchKey"
              @input="handleInput"
              @keydown.enter="getList"
            />
          </v-col>
        </v-row>
        <div class="d-flex ml-auto shrink-0 justify-end mt-2">
          <nav-item icon="ic-sync" unit="MB">{{
            usageInfo.arSyncing
          }}</nav-item>
          <nav-item icon="ic-synced" unit="MB" class="ml-7">{{
            usageInfo.arSynced
          }}</nav-item>
        </div>
      </e-right-opt-wrap>
    </div>

    <!-- :show-select="list.length > 0" -->
    <div class="main-wrap mt-6">
      <v-data-table
        class="hide-bdb"
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        v-model="selected"
        item-key="id"
        no-data-text=""
        loading-text=""
        checkbox-color="#0F8DFF"
        hide-default-footer
        disable-pagination
        @click:row="onRow"
      >
        <template v-slot:item.name="{ item }">
          <span>{{ item.name.cutStr(20, 10) }}</span>
          <e-tooltip right v-if="item.isDeleted">
            <v-icon slot="ref" color="#333" size="18" class="pa-1 d-ib ml-2"
              >mdi-alert-circle-outline</v-icon
            >
            <span>Deleted in Bucket</span>
          </e-tooltip>
        </template>
        <template v-slot:item.arweaveHash="{ item }">
          <e-link
            class="d-ib fz-13"
            style="width: 85px"
            v-if="item.arweaveHash"
            @click.native.stop="onStop"
            :href="$arHashPre + item.arweaveHash"
          >
            <span>
              {{ item.arweaveHash.cutStr(4, 4) }}
            </span>
          </e-link>
          <v-btn
            v-if="item.arweaveHash"
            icon
            small
            @click.stop="onStop"
            v-clipboard="item.arweaveHash"
            @success="$toast('Copied to clipboard !')"
          >
            <!-- <v-icon size="14" color="primary">mdi-content-copy</v-icon> -->
            <img src="/img/svg/copy.svg" width="11" />
          </v-btn>
        </template>
        <template v-slot:item.arweaveStatus="{ item }">
          <sync-state :val="item.arweaveStatus"></sync-state>
        </template>
      </v-data-table>
      <div class="ta-c mt-8" v-if="!list.length">
        <e-empty :loading="tableLoading">
          {{ tableLoading ? `Loading files...` : `No files` }}
        </e-empty>
      </div>

      <div
        v-if="!finished"
        class="pd-20 gray ta-c fz-16 mt-5"
        :class="{
          'hover-1': !loadingMore,
        }"
        @click="onLoadMore"
        v-intersect="onLoadMore"
      >
        <span v-if="list.length" v-show="!tableLoading">
          {{ loadingMore ? "Loading..." : "Load More" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
function debounce(func, delay = 300, immediate = false) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate && !timer) {
      func.apply(this, arguments);
    }
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "AR Hash", value: "arweaveHash" },
        { text: "Last Modified", value: "updateAt" },
        { text: "AR Status", value: "arweaveStatus" },
      ],
      list: [],
      total: 0,
      tableLoading: false,
      selected: [],
      finished: false,
      loadingMore: false,
      cursor: 0,
      usageInfo: {
        arSyncing: 0,
        arSynced: 0,
      },
      state: "",
      searchKey: "",
      items: [
        { text: "All", value: "" },
        { text: "Syncing", value: "syncing" },
        { text: "Synced", value: "synced" },
        { text: "Time Out", value: "timeout" },
        { text: "Failure", value: "failure" },
      ],
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    navItems() {
      return [
        {
          text: "AR History",
          to: "/arweave",
          exact: true,
        },
      ];
    },
  },
  watch: {
    path() {
      if (this.path == "/bucket/arweave") {
        this.getList();
      }
    },
  },
  created() {
    this.getStorage();
  },
  mounted() {
    this.getList();
  },
  methods: {
    onStop() {},
    onLoadMore() {
      if (this.tableLoading) return;
      this.loadingMore = true;
      this.getList();
    },
    async getList() {
      try {
        this.tableLoading = true;
        if (this.loadingMore) {
          this.cursor = this.next;
        } else {
          this.finished = false;
          this.cursor = 0;
        }
        const { data } = await this.$http.get("/arweave/objects", {
          params: {
            cursor: this.cursor,
            state: this.state,
            key: this.searchKey,
          },
        });
        this.next = Math.max(1, data.page.next);
        const list = data.list.map((it, i) => {
          it.id = it.id || it.cid + i;
          it.name = it.key.replace(/^.+\//, "");
          it.size = this.$utils.getFileSize(it.size);
          it.updateAt = new Date(it.lastModified * 1e3).format();
          return it;
        });
        if (this.loadingMore) {
          this.loadingMore = false;
          this.list = [...this.list, ...list];
        } else {
          this.list = list;
        }
        this.finished = !data.page.hasNext;
        this.total = data.page.total;
        // console.log(this.list);
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
      this.$setMsg({
        name: "updateUsage",
      });
    },
    async getStorage() {
      try {
        const { data } = await this.$http("/user/resource/usage");
        console.log(data);
        const { arweaveUsedStorage = 0, arweaveSyncingStorage = 0 } = data;
        this.usageInfo.arSyncing = (arweaveSyncingStorage / 1024).toFixed(2);
        this.usageInfo.arSynced = (arweaveUsedStorage / 1024).toFixed(2);
      } catch (error) {
        console.log(error, "error");
      }
    },
    handleInput: debounce(function () {
      this.getList();
    }),
    onRow(it) {
      // console.log(it);
      if (it.isDeleted) return this.$toast("The file was deleted in Bucket.");
      const link = `/bucket/arweave/${it.bucket}/${it.key}`;
      this.$router.push(link);
    },
  },
};
</script>