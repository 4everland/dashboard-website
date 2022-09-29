<template>
  <div class="main-wrap">
    <div v-if="!childPath">
      <div class="al-c justify-space-between">
        <div class="fz-14 gray">
          <v-icon size="14" color="#6C7789">mdi-alert-circle</v-icon>
          <span class="ml-1"
            >The publish will fail if the file in the folder is changed after
            the snapshot, deleting the snapshot will automatically unpin
            it!</span
          >
        </div>
        <div class="ml-auto" style="min-width: 150px">
          <v-text-field
            class="hide-msg bd-1"
            dense
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="prefix"
            @input="handleInput"
          ></v-text-field>
        </div>
      </div>
      <v-data-table
        class="mt-5 data-table"
        :headers="header"
        fixed-header
        :items="list"
        item-key="id"
        no-data-text=""
        loading-text=""
        hide-default-footer
        disable-pagination
        :loading="tableLoading"
        @click:row="onRow"
      >
        <template v-slot:item.prefix="{ item }">
          <!-- <v-icon size="18" class="mr-3">mdi-folder</v-icon>
          <span class="snapshot-name">{{ item.prefix.replace("/", "") }}</span> -->

          <v-btn color="#000" text @click.stop="onRow(item)">
            <!-- <v-icon v-if="!item.isFile" size="18" class="mr-2"
                  >mdi-folder</v-icon
                >
                <b>{{ item.name.cutStr(5, 5) }}</b> -->
            <v-icon size="18" class="mr-3">mdi-folder</v-icon>
            <span class="snapshot-name">{{ item.prefix }}</span>
          </v-btn>
        </template>

        <template v-slot:item.cid="{ item }">
          <div class="al-c">
            <a
              :href="$utils.getCidLink(item.cid)"
              class="hash-link"
              style="color: #0b0817"
              target="_blank"
              @click.stop
              >{{ item.cid.cutStr(5, 4) }}</a
            >
            <v-btn
              v-if="item.cid"
              class="e-btn-text ml-2"
              icon
              small
              @click.stop
              v-clipboard="item.cid"
              @success="$toast('Copied to clipboard !')"
            >
              <img src="/img/svg/copy.svg" width="12" />
            </v-btn>
          </div>
        </template>
        <template v-slot:item.size="{ item }">
          {{ $utils.getFileSize(item.size) }}
        </template>
        <template v-slot:item.status="{ item }">
          <span class="status">
            {{ transformStatus(item.status) }}
          </span>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ new Date(item.createdAt * 1000).format() }}
        </template>
        <template #item.action="{ item }">
          <v-btn
            class="action-btn"
            text
            @click="handlePublish(item)"
            color="#775da6"
            @click.stop
            :disabled="item.status == 'pin' || item.status == 'pinning'"
          >
            Publish
          </v-btn>
          <v-btn
            class="action-btn"
            text
            @click="handleDelete(item)"
            color="#775da6"
            @click.stop
            :disabled="item.status == 'pinning'"
          >
            Delete
          </v-btn>
        </template>
      </v-data-table>
      <div
        v-show="!list.length"
        class="ta-c loading-img"
        :class="tableLoading ? 'mt-10' : 'mt-15'"
      >
        <img
          :src="`/img/svg/common/empty${tableLoading ? 1 : 2}.svg`"
          :height="tableLoading ? 100 : 130"
        />
        <div class="mt-5 gray fz-17">
          {{ tableLoading ? "Loading files..." : "No folders or files found" }}
        </div>
      </div>

      <div
        v-if="hasNext"
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
    <bucket-snapshots-detail v-else :snapshotId="snapshotId">
    </bucket-snapshots-detail>
  </div>
</template>

<script>
import bucketSnapshotsDetail from "./bucket-snapshots-detail.vue";
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
  props: {
    active: Boolean,
  },
  data() {
    return {
      header: [
        { text: "Name", value: "prefix" },
        { text: "IPFS CID", value: "cid" },
        { text: "TSize", value: "size" },
        { text: "Publish", value: "status" },
        { text: "Create", value: "createdAt" },
        { text: "Action", value: "action" },
      ],
      list: [],
      searchKey: "",
      cursor: 0,
      prefix: "",
      hasNext: false,
      snapshotId: null,
      tableLoading: false,
      loadingMore: false,
    };
  },
  activated() {
    this.$router
      .push({
        path: this.$route.path.split("/").slice(0, 4).join("/") + "/",
        query: { tab: "snapshots" },
      })
      .catch((err) => err);
    this.getList();
  },
  // created() {
  //   this.getList();
  // },
  computed: {
    childPath() {
      return this.$route.path.split("/").length > 5;
    },
    bucket() {
      return this.$route.path.split("/")[3];
    },
    transformStatus() {
      return (status) => {
        if (status == "pinning") {
          return "Publishing";
        }
        if (status == "unpin") {
          return "Unpublished";
        }
        if (status == "pin") {
          return "Published";
        }
        return status;
      };
    },
  },
  methods: {
    onRow(item) {
      this.snapshotId = item.id;
      this.$router.push(this.$route.path + item.prefix + location.search);
    },
    async getList() {
      this.tableLoading = true;
      try {
        let payload = {
          cursor: this.loadingMore ? this.cursor : 0,
          prefix: this.prefix,
          bucket: this.bucket,
        };
        const { data } = await this.$http({
          url: "/snapshots",
          methods: "get",
          params: payload,
        });

        if (this.loadingMore) {
          this.list = [...this.list, ...data.list.splice(1, data.list.length)];
        } else {
          this.list = [];
          this.list = data.list;
        }
        this.loadingMore = false;
        // this.list = data.list;
        this.hasNext = data.page.hasNext;
        if (this.hasNext) {
          this.cursor = data.page.next;
        }
        this.tableLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async handlePublish(item) {
      try {
        await this.$confirm(
          "Publishing your selected snapshot will consume some storage resources. Continue?",
          "Pubulish Snapshot"
        );
        this.$loading();
        await this.$http.post(`/snapshots/${item.id}`);
        this.$toast("Joining publish queue");
        this.getList();
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    async handleDelete(item) {
      try {
        await this.$confirm(
          "Since the selected Snapshot will be deleted, the published file will be unpinned. Continue?",
          "Delete Snapshot"
        );
        this.$loading();
        await this.$http.delete(`/snapshots/${item.id}`);
        this.$loading.close();
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    handleInput: debounce(function () {
      this.getList();
    }),
    onLoadMore() {
      if (this.tableLoading) return;
      this.loadingMore = true;
      this.getList();
    },
  },
  components: {
    bucketSnapshotsDetail,
  },
  watch: {
    childPath(val) {
      if (!val) {
        this.getList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.action-btn {
  padding: 0 !important;
}
.hash-link {
  display: block;
  min-width: 80px;
  color: #0b0817;
}

// .snapshot-name {
//   color: #0b0817;
// }
.status {
  text-transform: capitalize;
}
.main-wrap {
  position: relative;
  .pagination {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>