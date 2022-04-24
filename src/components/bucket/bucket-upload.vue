<template>
  <div class="uploder-container">
    <span @click="isDrawers = true"> TaskList </span>
    <div class="choose-dir">
      <h3 class="choose-dir-title">Upload To</h3>
      <!-- Switch Current Dir -->
      <v-btn
        :color="curDir == 'Current' ? 'primary' : ''"
        rounded
        :outlined="curDir == 'Current' ? false : true"
        @click="curDir = 'Current'"
      >
        <img src="img/svg/upload.svg" width="16" />
        <span class="ml-2">Current</span>
      </v-btn>
      <v-btn
        :color="curDir == 'Specified' ? 'primary' : ''"
        :outlined="curDir == 'Specified' ? false : true"
        rounded
        class="ml-7"
        @click="curDir = 'Specified'"
      >
        <img src="img/svg/upload.svg" width="16" />
        <span class="ml-2">Specified</span>
      </v-btn>

      <div class="current-dir px-2 mt-10" v-if="curDir == 'Current'">
        {{ path }}
      </div>
      <div class="specified-dir d-flex align-center mt-7" v-else>
        <div class="appoint-dir d-flex align-center">{{ path }}</div>
        <v-text-field
          class="hide-msg bd-1 specified-dir-input"
          dense
          solo
          height="50"
        ></v-text-field>
      </div>
    </div>
    <div class="files-upload-container">
      <h3 class="title">Files to Upload</h3>
      <!-- upload-area -->
      <div class="files-to-upload">
        <input-upload v-model="files" ref="uploadInput"></input-upload>
      </div>

      <!-- upload-list -->
      <div class="table-container">
        <div class="total-files-info">
          <span
            >Number of Files:
            {{ this.$store.state.upload.uploadFiles.length }}</span
          >
          <span class="ml-13">Total Size: {{ totalSize }} </span>
        </div>
        <v-data-table
          :headers="headers"
          :items="list"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.action="{ item }">
            <span
              style="cursor: pointer; color: #34a9ff"
              @click="$refs.uploadInput.handleRemove(item.id)"
              >Remove</span
            >
          </template>
        </v-data-table>

        <template v-if="list.length == 0">
          <e-empty :loading="false">
            {{ false ? `Loading files...` : `No folders or files` }}
          </e-empty>
        </template>
        <div class="table-footer py-8">
          <v-pagination
            v-if="length > 1"
            v-model="page"
            :length="length"
            @input="handleSkip"
          ></v-pagination>
        </div>
        <div
          class="upload-opreation d-flex justify-center"
          v-if="list.length !== 0"
        >
          <v-btn rounded color="primary" @click="onConfirm">
            <span class="ml-2">upload</span>
          </v-btn>
          <v-btn rounded color="primary" class="ml-7">
            <span class="ml-2">cancel</span>
          </v-btn>
        </div>
        {{ info }}
      </div>
    </div>

    <navigation-drawers
      :drawer.sync="isDrawers"
      @handleCancelUpload="handleCancelUpload"
      @handleRetryUpload="handleRetryUpload"
    ></navigation-drawers>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { Upload } from "@aws-sdk/lib-storage";

export default {
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isDrawers: false,
      curDir: "Current",
      files: [],
      sequence: [],
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "name",
        },
        { text: "Size", value: "size", sortable: false, align: "center" },
        { text: "Type", value: "type", sortable: false, align: "center" },
        { text: "Status", value: "status", sortable: false, align: "center" },
        { text: "Action", value: "action", sortable: false, align: "center" },
      ],
      page: 1,
      curTask: {},
    };
  },

  computed: {
    path() {
      const arr = this.$route.path.split("/");
      const idx = arr.findIndex((item) => item == "storage");
      const path = "bucket://" + arr.slice(idx + 1, arr.length).join("/");
      this.UPDATE_PATH(path);
      return path;
    },
    list() {
      return this.$store.state.upload.uploadFiles
        .slice((this.page - 1) * 10, this.page * 10)
        .map((item) => {
          return {
            name: (item.name || "").cutStr(20, 10),
            size: this.$utils.getFileSize(item.size),
            id: item.id,
            type: item.type,
            status: "Ready for Upload",
            actions: "",
          };
        });
    },
    length() {
      return Math.ceil(this.$store.state.upload.uploadFiles.length / 10);
    },
    totalSize() {
      const totalSize = this.$store.state.upload.uploadFiles.reduce(
        (pre, current) => {
          return pre + current.size;
        },
        0
      );
      return this.$utils.getFileSize(totalSize);
    },
  },
  methods: {
    ...mapMutations(["UPDATE_PATH", "PUT_EXECUTION", "STOP_TASK"]),
    ...mapActions(["updateUploadFiles"]),
    handleSkip(item) {
      this.page = item;
    },
    handleUpload() {
      this.isDrawers = true;
    },
    createTask(file, id) {
      const { Bucket, Prefix } = this.info;
      const params = {
        Bucket,
        Key: Prefix + file.name,
        Body: file,
        ContentType: file.type,
      };
      return new Promise((resolve) => {
        try {
          const task = new Upload({
            client: this.$s3,
            queueSize: 3,
            params,
          });
          this.$store.dispatch("updateStatus", { progress: 0 + "%", id });
          task.on("httpUploadProgress", (e) => {
            let progress = ((e.loaded / e.total) * 100) | 0;
            console.log(e, id);
            if (progress == 100)
              return this.$store.dispatch("updateStatus", {
                progress: "Uploaded",
                id,
              });

            this.$store.dispatch("updateStatus", {
              progress: progress + "%",
              id,
            });
          });
          task
            .done()
            .then(() => {
              // this.$store.dispatch("updateStatus", {
              //   progress: "Uploaded",
              //   id,
              // });
              resolve();
            })
            .catch((err) => {
              console.log(err, id);
              //  判断取消了 或者报错
              this.STOP_TASK(id);

              resolve();
            });
          // resolve();
          this.curTask[id] = task;
        } catch (error) {
          console.log(error);
          if (error) {
            console.log("task", error.name);
            if (
              error.name == "XMinioAdminBucketQuotaExceeded" ||
              error.name == "MalformedXML"
            ) {
              let msg = error.message;
              if (error.name == "MalformedXML") msg = "Bucket quota exceeded";
              setTimeout(() => {
                this.$alert(msg);
              }, 20);
            }
          }
          console.log("error2");
          // resolve(error);
        }
      });
    },
    async limitLoad(urls, handler, limit) {
      let sequence = [].concat(urls);
      let promise = [];
      promise = sequence.splice(0, limit).map((url, index) => {
        return handler(url, url.id).then(() => {
          return index;
        });
      });
      let p = Promise.race(promise).catch((error) => {
        console.log(error);
      });
      for (let i = 0; i < sequence.length; i++) {
        p = p.then((res) => {
          promise[res] = handler(sequence[i], sequence[i].id).then(() => {
            return res;
          });
          return Promise.race(promise).catch((error) => {
            console.log(error);
          });
        });
      }
    },
    async onConfirm() {
      this.isDrawers = true;
      this.PUT_EXECUTION();
      await this.limitLoad(
        this.$store.state.upload.uploadFiles,
        this.createTask,
        2
      );
      this.updateUploadFiles([]);
    },
    handleCancelUpload(id) {
      if (this.curTask[id]) {
        this.curTask[id].abort();
        console.log("取消上传了");
      } else {
        this.STOP_TASK(id);
      }
    },
    handleRetryUpload(id) {
      console.log(id);
      let file = this.$store.state.upload.originFiles.find((it) => it.id == id);
      this.limitLoad([file], this.createTask, 2);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
  color: #0b0817 !important;
}

>>> .v-input {
  height: 50px;
  border: none;
}

.choose-dir {
  width: 100%;
  padding: 30px;
  height: 240px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  .choose-dir-title {
    font-size: 18px;
    color: #0b0817;
    line-height: 20px;
    margin-bottom: 30px;
  }
  .current-dir {
    height: 25px;
    line-height: 25px;
    color: #0b0817;
    font-size: 18px;
    font-weight: 400;
  }
  .specified-dir {
    border: 1px solid #d0dae9;
    .appoint-dir {
      height: 25px;
      line-height: 25px;
      color: #0b0817;
      font-size: 18px;
      font-weight: 400;
      padding: 0 21px 0 18px;
      border-right: 1px solid #d0dae9;
    }
    .specified-dir-input {
      border: none;
    }
  }
}

.files-upload-container {
  padding: 30px;
  margin-top: 30px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);

  .title {
    margin-bottom: 13px;
    font-size: 18px;
    color: #0b0817;
  }

  .table-container {
    .total-files-info {
      margin-bottom: 11px;
      font-size: 16px;
      font-weight: 400;
      color: #6a778b;
      line-height: 22px;
    }
  }
}
</style>