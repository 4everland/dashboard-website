<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      width="900"
      class="drawer-container ov-a"
      stateless
      fixed
      right
      temporary
    >
      <div class="d-flex justify-space-between pr-6">
        <span class="fw-b fz-18">Task List</span>
        <span class="fw-b" @click="$emit('update:drawer', false)">close</span>
      </div>
      <div class="tips py-3">
        Tip：If you refresh or close the browser, the ongoing upload task is
        canceled and all upload records are cleared.
      </div>
      <div class="task-content">
        <div class="d-flex task-list-tabs">
          <div
            class="px-10 py-5"
            :class="currentTab == 0 ? 'active' : ''"
            @click="currentTab = 0"
          >
            Upload Task
          </div>
          <div
            class="px-10 py-5 ml-2"
            :class="currentTab == 1 ? 'active' : ''"
            @click="currentTab = 1"
          >
            Delete Folder
          </div>
        </div>

        <div class="upload-task" v-show="currentTab == 0">
          <ul class="status-tabs d-flex align-center">
            <li
              class="status-tab"
              @click="status = 0"
              :class="status == 0 ? 'active' : ''"
            >
              <span>All</span>
              <span>({{ all.length }})</span>
            </li>
            <li
              class="status-tab"
              :class="status == 1 ? 'active' : ''"
              @click="status = 1"
            >
              <span>Uploading</span> <span>({{ uploading.length }})</span>
            </li>
            <li
              class="status-tab"
              @click="status = 2"
              :class="status == 2 ? 'active' : ''"
            >
              <span>Stop</span> <span>({{ stopped.length }})</span>
            </li>
            <li
              class="status-tab"
              @click="status = 3"
              :class="status == 3 ? 'active' : ''"
            >
              <span>Uploaded</span> <span>({{ uploaded.length }})</span>
            </li>
            <li
              class="status-tab"
              @click="status = 4"
              :class="status == 4 ? 'active' : ''"
            >
              <span>Upload Failed</span> <span>({{ failed.length }})</span>
            </li>
          </ul>

          <div>
            <v-btn rounded color="primary" class="my-5">
              <span>Stop Uploading</span>
            </v-btn>
          </div>

          <div class="table-container">
            <v-data-table
              :headers="headers"
              :items="list.slice((this.page - 1) * 10, this.page * 10)"
              class="elevation-1 task-table"
              hide-default-footer
            >
              <template #item.name="{ item }">
                <span class="name">{{ item.name }}</span>
              </template>

              <template #item.status="{ item }">
                <span v-if="item.status == 'Uploaded'" style="color: #ff8843">{{
                  item.status
                }}</span>
                <span
                  v-else-if="item.status == 'Stopped'"
                  style="color: #6a778b"
                  >{{ item.status }}</span
                >
                <span v-else style="color: #34a9ff">{{ item.status }}</span>
              </template>
              <template #item.action="{ item }">
                <span
                  class="opeartion"
                  v-show="
                    item.status == 'Upload Failed' || item.status == 'Stopped'
                  "
                  @click="handleRetryUpload(item.id)"
                  >Retry</span
                >

                <span
                  class="opeartion"
                  v-show="
                    item.status !== 'Uploaded' && item.status !== 'Stopped'
                  "
                  @click="handleCancelUpload(item.id)"
                  >Cancel</span
                >
                <span class="opeartion" v-show="item.status == 'Uploaded'"
                  >Share</span
                >
                <span
                  class="opeartion"
                  v-show="
                    item.status == 'Uploaded' ||
                    item.status == 'Stopped' ||
                    item.status == 'Upload Failed'
                  "
                  @click="handleClearRecords(item.id)"
                  >Clear Records</span
                >

                <!-- <span style="cursor: pointer">Cancel</span> -->
              </template>
            </v-data-table>
            <template v-if="length == 0">
              <e-empty :loading="false">
                {{ false ? `Loading files...` : `No folders or files` }}
              </e-empty>
            </template>
            <div class="table-footer d-flex align-center justify-center pt-6">
              <v-pagination
                v-if="length > 1"
                v-model="page"
                :length="length"
                @input="handleSkip"
              ></v-pagination>
            </div>
          </div>
        </div>
        <div v-show="currentTab == 1">232323</div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
    drawer: {
      type: Boolean,
      default: true,
    },
    prefix: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      status: 0,
      currentTab: 0,
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "name",
        },
        { text: "Upload To", value: "path", sortable: false, align: "center" },
        { text: "Status", value: "status", sortable: false, align: "center" },
        { text: "Action", value: "action", sortable: false, align: "center" },
      ],
      page: 1,
    };
  },
  created() {},
  computed: {
    ...mapGetters(["all", "uploading", "stopped", "uploaded", "failed"]),
    list() {
      return this.$store.state.upload.executionFiles.filter((it) => {
        if (this.status == 0) return it;
        if (this.status == 1) return /(Preparing)|%/.test(it.status);
        if (this.status == 2) return it.status == "Stopped";
        if (this.status == 3) return it.status == "Uploaded";
        if (this.status == 4) return it.status == "Uploaded Failed";
      });
    },
    length() {
      return Math.ceil(this.list.length / 10);
    },
  },
  methods: {
    ...mapMutations(["CLEAR_RECORDS"]),
    HandleChangeTab(value) {
      this.currentTab = value;
    },
    handleChangeStatus(value) {
      this.status = value;
    },
    handleSkip(item) {
      this.page = item;
    },
    handleClearRecords(id) {
      // let index = this.$store.state.upload.executionFiles.findIndex((i) => {
      //   return i.id == id;
      // });
      this.CLEAR_RECORDS(id);
      // console.log(i == "165 (13).jpg");
    },
    handleCancelUpload(id) {
      // let index = this.$store.state.upload.executionFiles.findIndex((i) => {
      //   return i.name == name;
      // });
      this.$emit("handleCancelUpload", id);
    },
    handleRetryUpload(id) {
      this.$emit("handleRetryUpload", id);
    },
  },
};
</script>
<style >
.task-table td {
  padding: 20px 0 !important;
  font-size: 16px !important;
}
</style>
<style lang="scss" scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
  color: #0b0817 !important;
}
.name {
  color: #34a9ff;
}
.opeartion {
  color: #34a9ff;
  font-size: 16px;
  padding: 0 5px;
  cursor: pointer;
}
.v-tab {
  font-size: 14px;
  font-weight: 400;
  color: #6a778b;
  border-bottom: 1px solid #d0dae9;
}
.v-tab.v-tab--active {
  color: #34a9ff;
}
.v-tab.v-tab--active span:nth-of-type(1) {
  font-size: 20px;
}
.drawer-container {
  padding: 24px 0 24px 24px;
  bottom: 0;
  box-sizing: border-box;
  border-radius: 20px 0 0 20px;
  height: 100vh !important;
  .tips {
    color: #6a778b;
    font-size: 14px;
  }
  .task-content {
    background: #f8fafb;
    border-radius: 8px 0 0 8px;
    padding: 18px 0 21px 19px;
    .task-list-tabs {
      > div {
        font-size: 18px;
        color: #6c7789;
        border-radius: 20px 20px 0 0;
        background: #f8fafb;
        cursor: pointer;
      }
      .active {
        color: #0b0817;
        font-weight: bold;
        background: #fff;
      }
    }
    .upload-task {
      padding: 30px 0 0 25px;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
      background: #fff;
      .status-tabs {
        list-style: none;
        border-bottom: 1px solid #d0dae9;
        .status-tab {
          font-size: 14px;
          padding: 10px 20px;
          cursor: pointer;
        }
        .active {
          position: relative;
          color: #34a9ff;
        }
        .active span:nth-of-type(1) {
          font-size: 16px;
        }
        .active::after {
          content: "";
          display: block;
          position: absolute;
          height: 2px;
          width: 30px;
          background: #34a9ff;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
