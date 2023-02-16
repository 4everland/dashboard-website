<template>
  <div class="pinning-service-container">
    <e-right-opt-wrap :top="-75">
      <v-row>
        <v-col :md="3">
          <v-btn color="primary" @click="getAccessToken"> Access Token </v-btn>
        </v-col>
        <v-col :md="4" style="max-width: 230px">
          <v-select
            class="hide-msg bd-1"
            dense
            solo
            :items="items"
            v-model="state"
            @change="onChange"
          />
        </v-col>
        <v-col :md="5">
          <v-text-field
            class="hide-msg bd-1"
            prepend-inner-icon="mdi-magnify"
            solo
            dense
            placeholder="Search"
            v-model="searchKey"
            @input="handleInput"
          />
        </v-col>
      </v-row>
    </e-right-opt-wrap>
    <div class="pos-r">
      <pinning-service-upload
        class="mb-7"
        :accessToken="accessToken"
        @getList="getList({}, true)"
      ></pinning-service-upload>
      <v-data-table
        class="hide-bdb"
        fixed-header
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        show-select
        v-model="seletedRecords"
        item-key="requestid"
        checkbox-color="#34A9FF"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:item.name="{ item }">
          <span>{{ item.pin.name }}</span>
        </template>
        <template v-slot:item.size="{ item }">
          <span>{{ $utils.getFileSize(item.info.dag_size) }}</span>
        </template>
        <template v-slot:item.hash="{ item }">
          <span>{{ item.pin.cid.cutStr(20, 10) }}</span>
        </template>
        <template v-slot:item.status="{ item }">
          <span class="pinning-status">{{ item.status }}</span>
        </template>
      </v-data-table>

      <div class="ta-c mt-8" v-if="!list.length">
        <e-empty :loading="tableLoading">
          {{ tableLoading ? `Loading files...` : `No files` }}
        </e-empty>
      </div>
      <bottom-detector
        v-if="list.length"
        :loadingMore="loadingMore"
        @arriveBottom="handleLoadMore"
        :noMore="noMore"
      ></bottom-detector>

      <operation-bar ref="operationBar">
        <v-checkbox
          v-model="checked"
          @change="handleChangeCheck"
          class="px-4"
          color="#34A9FF"
        ></v-checkbox>
        <v-btn
          style="border-color: #6c7789"
          outlined
          class="ml-4"
          @click="handleDelete"
        >
          <span class="gray">Delete</span>
        </v-btn>
      </operation-bar>
    </div>

    <v-dialog v-model="showPop" max-width="500" persistent>
      <div class="pd-30">
        <h3>Access Token Generated</h3>
        <div class="mt-6" @click="$copy(accessToken)">
          <p>{{ accessToken }}</p>
          <div class="pd-10 bd-1 bdrs-3 mt-3 d-flex al-c hover-1">
            <span class="el-label-1 fz-14">{{
              accessToken.cutStr(20, 10)
            }}</span>
            <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
          </div>
        </div>
        <div class="mt-6 ta-c">
          <v-btn color="primary" @click="resetAccessToken">Reset</v-btn>
          <v-btn color="primary" @click="showPop = false">Done</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { bus } from "../../utils/bus";
import PinningServiceUpload from "@/views/bucket/components/pinning-service-upload.vue";
import { PinningServiceDeleteTaskWrapper } from "@/views/bucket/task";
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
  components: {
    PinningServiceUpload,
  },
  data() {
    return {
      state: "queued,pinned,pinning,failed",
      items: [
        { text: "All", value: "queued,pinned,pinning,failed" },
        { text: "Queued", value: "queued" },
        { text: "Pinned", value: "pinned" },
        { text: "Pinning", value: "pinning" },
        { text: "Failed", value: "failed" },
      ],
      searchKey: "",
      showPop: false,
      accessToken: "",
      tableLoading: false,
      loadingMore: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "IPFS CID", value: "hash" },
        { text: "Last Modified", value: "created" },
        { text: "Pin Status", value: "status" },
      ],
      list: [],
      seletedRecords: [],
      total: 0,
      limit: 10,
      checked: false,
      deleteTasks: [],
      processLimit: 10,
      noMore: false,
      showControl: false,
    };
  },
  computed: {
    compeleted() {
      return !this.deleteTasks.some((it) => it.status != 3 && it.status != 4);
    },
  },
  watch: {
    seletedRecords: {
      handler(val) {
        if (val.length) {
          bus.$emit("showOperationBar", true);
          this.fileInfoDrawer = true;
          this.$refs.operationBar.isShow = this.checked = true;
        } else {
          bus.$emit("showOperationBar", false);
          this.$refs.operationBar.isShow = this.checked = false;
        }
      },
      deep: true,
    },
    compeleted(val) {
      if (val) this.getList({}, true);
    },
  },
  async created() {
    await this.getAccessToken();
    await this.getList();
  },
  methods: {
    handleInput: debounce(function () {
      this.getList();
    }),
    async getList(params = {}, state) {
      try {
        this.tableLoading = true;
        const { data } = await this.$http.get("$pinningService/pins", {
          params: {
            status: this.state,
            name: this.searchKey,
            limit: this.limit,
            ...params,
          },
          headers: {
            Authorization: "Bearer " + this.accessToken,
          },
        });
        if (Object.keys(params).length == 0) {
          this.total = data.count;
        }

        if (!data.results.length || data.results.length < this.limit) {
          this.noMore = true;
        }
        if (state) {
          this.list = data.results;
          this.noMore = false;
        } else {
          const list = [...this.list, ...data.results];
          this.list = list;
        }
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    onChange() {
      this.getList({}, true);
    },
    async handleLoadMore() {
      this.loadingMore = true;
      const lastRecord = this.list[this.list.length - 1];
      await this.getList({ before: lastRecord.created });
      this.loadingMore = false;
    },
    handleDelete() {
      this.deleteTasks = this.seletedRecords.map(
        (it) =>
          new PinningServiceDeleteTaskWrapper(it.requestid, this.accessToken)
      );
      this.processTask();
      this.seletedRecords = [];
    },
    async startTask(item) {
      await item.startDelete();
      this.processTask();
    },
    processTask() {
      const processing = this.deleteTasks.filter((it) => it.status == 1).length;
      const idles = this.deleteTasks.filter((it) => it.status == 0);
      if (processing >= this.processLimit) return;
      const min =
        idles.length > this.processLimit
          ? this.processLimit - processing
          : idles.length;

      for (let i = 0; i < min; i++) {
        this.startTask(idles[i]);
      }
    },
    handleChangeCheck(val) {
      if (!val) return (this.seletedRecords = []);
    },
    async getAccessToken() {
      try {
        const { data } = await this.$http.get(
          "/user/ipfs-pinning-service/token"
        );
        this.accessToken = data.accessToken;
      } catch (error) {
        console.log(error);
      }
    },
    async resetAccessToken() {
      try {
        const { data } = await this.$http.post(
          "/user/ipfs-pinning-service/token"
        );
        this.accessToken = data.accessToken;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pinning-status {
  text-transform: capitalize;
}
</style>