<template>
  <div class="pinning-service-container">
    <div class="pos-r">
      <div class="al-c justify-space-between flex-wrap">
        <div class="al-c">
          <pinning-service-upload
            class="mb-4"
            ref="pinningServiceUpload"
            :accessToken="accessToken"
            @getList="getList({}, true)"
          ></pinning-service-upload>
          <v-btn class="mb-4 ml-3" color="primary" text @click="handleOpenPage">
            <img src="/img/svg/bucket/ipfs-sync.svg" alt="" />
            <span class="ml-2">IPFS Migrator</span>
          </v-btn>
        </div>
        <div class="al-c mb-4">
          <v-btn color="primary" @click="handleGetToken">
            <v-icon size="16" class="mr-2">mdi-key-outline</v-icon>
            <span>Access Token</span>
          </v-btn>
          <v-select
            style="max-width: 230px"
            class="hide-msg bd-1 ml-4"
            dense
            solo
            :items="items"
            v-model="state"
            @change="onChange"
          />
          <v-text-field
            style="max-width: 230px"
            class="hide-msg bd-1 ml-4"
            prepend-inner-icon="mdi-magnify"
            solo
            dense
            placeholder="Search"
            v-model="searchKey"
            @input="handleInput"
          />
        </div>
      </div>
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
          <span>{{ item.pin.name.cutStr(3, 5) }}</span>
        </template>
        <template v-slot:item.size="{ item }">
          <span>{{ $utils.getFileSize(item.info.dag_size) }}</span>
        </template>

        <template #item.created="{ item }">
          <span>{{ new Date(item.created).format() }}</span>
        </template>
        <template v-slot:item.hash="{ item }">
          <div class="al-c">
            <a
              :href="$utils.getCidLink(item.pin.cid)"
              class="hash-link d-block"
              style="color: #0b0817; min-width: 50px; max-width: 100px"
              target="_blank"
              @click.stop="onStop"
              >{{ item.pin.cid.cutStr(3, 5) }}</a
            >
            <v-btn
              class="e-btn-text ml-2"
              icon
              small
              @click.stop
              v-clipboard="item.pin.cid"
              @success="$toast('Copied!')"
            >
              <img src="/img/svg/copy.svg" width="12" />
            </v-btn>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          <span
            class="pinning-status"
            :style="{ color: pinStatusColor(item.status) }"
            >{{ item.status }}</span
          >
          <v-tooltip top v-if="item.status == 'failed'">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="ml-4" size="18" v-bind="attrs" v-on="on"
                >mdi-alert-circle-outline</v-icon
              >
            </template>
            <span>{{ item.info.failed_message }}</span>
          </v-tooltip>
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

        <v-btn
          style="border-color: #6c7789"
          outlined
          class="ml-4"
          @click="handleReplace"
          v-show="allFailedRecords"
        >
          <span class="gray">Repin</span>
        </v-btn>
      </operation-bar>
    </div>

    <v-dialog v-model="showPop" max-width="500" persistent>
      <div class="pd-30">
        <h3>Access Token</h3>
        <div class="mt-3" @click="$copy(accessToken)">
          <div class="fz-14 gray">
            Be sure to keep the unique token for the pinning service safe. The
            token cannot be deleted, but it can be reset if it has been
            compromised.
          </div>
          <div class="pd-10 bd-1 bdrs-3 mt-5 d-flex al-c hover-1">
            <span class="el-label-1 fz-14">{{
              accessToken.cutStr(20, 10)
            }}</span>
            <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
          </div>
        </div>
        <div class="mt-6 ta-c">
          <v-btn outlined @click="resetAccessToken">Reset</v-btn>
          <v-btn color="primary" class="ml-8" @click="showPop = false"
            >Done</v-btn
          >
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
        { text: "CreateAt", value: "created" },
        { text: "Pin Status", value: "status" },
      ],
      list: [],
      seletedRecords: [],
      total: 0,
      limit: 20,
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
    pinStatusColor() {
      return function (status) {
        if (status == "queued") return "#34A9FF";
        if (status == "failed") return "#FF5656";
        return "#000";
      };
    },
    allFailedRecords() {
      return (
        this.seletedRecords.length &&
        !this.seletedRecords.some((it) => it.status != "failed")
      );
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
    async handleGetToken() {
      await this.getAccessToken();
      this.showPop = true;
    },
    handleInput: debounce(function () {
      this.getList({}, true);
    }),
    async getList(params = {}, state) {
      try {
        this.tableLoading = true;
        const { data } = await this.$http.get("$pinningService/pins", {
          params: {
            status: this.state,
            name: this.searchKey,
            limit: this.limit,
            match: "partial",
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
    async handleReplace() {
      const replaceRecords = [...this.seletedRecords];
      this.$refs.pinningServiceUpload.onReplace(replaceRecords);
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
        await this.$confirm(
          "The previous token will become invalid after the token has been reset. Are you sure you want to proceed?",
          "Tips",
          {
            cancelText: "Cancel",
            confirmText: "Reset",
          }
        );
        this.$loading();
        const { data } = await this.$http.post(
          "/user/ipfs-pinning-service/token"
        );
        this.$loading.close();
        this.accessToken = data.accessToken;
      } catch (error) {
        console.log(error);
      }
    },
    handleOpenPage() {
      window.open("https://ipfsmigrator.4everland.app/");
    },
  },
};
</script>

<style lang="scss" scoped>
.pinning-status {
  text-transform: capitalize;
}
</style>
