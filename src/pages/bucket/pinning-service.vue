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
            @change="getList"
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
        @getList="getList"
      ></pinning-service-upload>
      <v-data-table
        class="hide-bdb"
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        show-select
        v-model="seletedRecords"
        item-key="requestid"
        checkbox-color="#34A9FF"
        no-data-text=""
        loading-text=""
        hide-default-footer
      >
        <template v-slot:item.name="{ item }">
          <span>{{ item.pin.name }}</span>
        </template>
        <template v-slot:item.hash="{ item }">
          <span>{{ item.pin.cid.cutStr(20, 10) }}</span>
        </template>
        <template v-slot:item.status="{ item }">
          <span class="pinning-status">{{ item.status }}</span>
        </template>
      </v-data-table>
      <div class="pd-20 gray ta-c fz-16 mt-5" v-if="list.length">
        <v-btn
          outlined
          class="mr-5"
          @click="handlePrevious"
          :disabled="disabledPrevious"
          >Previous</v-btn
        >
        <v-btn
          min-width="100"
          outlined
          @click="handleNext"
          :disabled="disabledNext"
          >Next</v-btn
        >
      </div>
      <div class="ta-c mt-8" v-if="!list.length">
        <e-empty :loading="tableLoading">
          {{ tableLoading ? `Loading files...` : `No files` }}
        </e-empty>
      </div>

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
          @click="handleDelete()"
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

    <pinning-service-control></pinning-service-control>
  </div>
</template>

<script>
import { bus } from "../../utils/bus";
import PinningServiceUpload from "@/views/bucket/components/pinning-service-upload.vue";
import PinningServiceControl from "@/views/bucket/components/pinning-service-control.vue";
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
    PinningServiceControl,
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
      curPage: 1,
      limit: 10,
      checked: false,
    };
  },
  computed: {
    disabledNext() {
      return this.total - this.curPage * this.limit <= 0;
    },
    disabledPrevious() {
      return this.curPage == 1;
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
  },
  async created() {
    await this.getAccessToken();
    await this.getList();
  },
  methods: {
    handleInput: debounce(function () {
      this.getList();
    }),
    async getList(params = {}) {
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
          this.curPage = 1;
        }
        this.list = data.results;
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    handleNext() {
      this.curPage++;
      const lastRecord = this.list[this.limit - 1];
      this.getList({ before: lastRecord.created });
    },
    handlePrevious() {
      this.curPage--;
      const firstRecord = this.list[0];
      this.getList({ after: firstRecord.created });
    },
    async handleDelete(item) {
      try {
        await this.$http.delete(`$pinningService/pins/${item.requestId}`, {
          headers: {
            Authorization: "Bearer " + this.accessToken,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleChangeCheck(val) {
      if (!val) return (this.seletedRecords = []);
    },
    async getAccessToken() {
      this.tableLoading = true;
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