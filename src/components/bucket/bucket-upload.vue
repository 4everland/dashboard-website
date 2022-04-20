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
      <div class="specified-dir d-flex align-center mt-10" v-else>
        <div class="px-2 d-flex align-center">{{ path }}</div>
        <v-text-field
          class="hide-msg bd-1 specified-dir-input"
          dense
          solo
          height="50"
        ></v-text-field>
      </div>
    </div>

    <div class="files-to-upload">
      <div class="drag-area">
        <input-upload v-model="files" ref="uploadInput"></input-upload>
      </div>
    </div>

    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="list"
        class="elevation-1"
        hide-default-footer
      >
        <template #item.action="{ item }">
          <span
            style="cursor: pointer"
            @click="$refs.uploadInput.handleRemove(item.index)"
            >Remove</span
          >
        </template>
      </v-data-table>

      <div class="table-footer d-flex align-center justify-space-between pt-6">
        <div>
          <span
            >Number of Files:
            {{ this.$store.state.upload.uploadFiles.length }}</span
          >
          <span class="ml-10">Total Size: {{ totalSize }} </span>
        </div>
        <v-pagination
          v-if="length > 1"
          v-model="page"
          :length="length"
          @input="handleSkip"
        ></v-pagination>
      </div>
      <div>
        <v-btn @click="onConfirm">upload</v-btn>
        <v-btn>cancel</v-btn>
        {{ info }}
      </div>
    </div>
    <navigation-drawers :drawer.sync="isDrawers"></navigation-drawers>
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
        .map((item, index) => {
          return {
            name: (item.name || "").cutStr(20, 10),
            size: this.$utils.getFileSize(item.size),
            index,
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
    ...mapMutations(["UPDATE_PATH", "PUT_EXECUTION"]),
    ...mapActions(["updateUploadFiles"]),
    handleSkip(item) {
      this.page = item;
    },
    handleUpload() {
      this.isDrawers = true;
    },
    createTask(file, i) {
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
          // this.curTask = task;
          this.$store.dispatch("updateStatus", { progress: 0 + "%", i });
          task.on("httpUploadProgress", (e) => {
            let progress = ((e.loaded / e.total) * 100) | 0;
            // console.log(e);
            this.$store.dispatch("updateStatus", {
              progress: progress + "%",
              i,
            });
          });
          task
            .done()
            .then(() => {
              this.$store.dispatch("updateStatus", { progress: "Uploaded", i });
              resolve();
            })
            .catch((err) => {
              console.log(err, file.name);
              resolve();
            });
          // resolve();
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
      const sequence = [].concat(urls);
      let promise = [];
      promise = sequence.splice(0, limit).map((url, index) => {
        return handler(url, index).then(() => {
          return index;
        });
      });
      let p = Promise.race(promise).catch((error) => {
        console.log(error);
      });
      for (let i = 0; i < sequence.length; i++) {
        p = p.then((res) => {
          promise[res] = handler(sequence[i], i + limit).then(() => {
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
        5
      );
      this.updateUploadFiles([]);
    },
  },
};
</script>

<style lang="scss" scoped>
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

    .specified-dir-input {
      border: none;
    }
  }
}
</style>