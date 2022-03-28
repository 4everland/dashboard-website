<template>
  <div>
    <v-dialog
      v-model="showPop"
      max-width="550"
      eager
      :persistent="files.length > 0"
    >
      <e-dialog-close @click="showPop = false" v-show="!uploading" />
      <div class="pd-20">
        <div class="d-flex al-end">
          <h3>Upload</h3>
          <span class="gray ml-3" v-if="files.length > 1">
            {{ files.length }} files Total ({{ totalSize }})
          </span>
        </div>
        <div class="mt-5">
          <e-upload ref="upload" v-model="files" :disabled="disabled">
            <div style="min-height: 190px" v-show="files.length > 0">
              <v-data-table
                class="elevation-1"
                :headers="headers"
                :items="list"
                hide-default-footer
                fixed-header
                disable-pagination
                :height="files.length > (asMobile ? 2 : 5) ? '50vh' : null"
              >
                <template v-slot:item.name="{ item }">
                  <span :class="{ 'warn-1': item.exist }">{{ item.name }}</span>
                </template>
                <template v-slot:item.action="{ item }">
                  <template v-if="uploading">
                    <v-progress-circular
                      size="24"
                      :width="3"
                      :color="curIdx > item.index ? 'success' : 'primary'"
                      :indeterminate="curIdx == item.index && progress == 0"
                      :value="
                        curIdx > item.index
                          ? 100
                          : curIdx == item.index
                          ? progress
                          : 0
                      "
                    ></v-progress-circular>
                  </template>
                  <template v-else>
                    <v-btn icon @click="onDel(item.index)">
                      <v-icon size="18">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </template>
                </template>
              </v-data-table>
            </div>

            <template #hint>
              <div class="mt-5 warn-1 fz-14" v-if="overLen">
                The highlight file{{ overLen > 1 ? "s" : "" }} already exist{{
                  overLen > 1 ? "" : "s"
                }}, continuing to upload will overwrite it.
              </div>
            </template>
          </e-upload>
        </div>

        <div class="mt-5 ta-c">
          <div class="mb-5 gray fz-14" v-if="uploading">
            {{ sucNum }}/ {{ files.length }} uploaded
          </div>

          <v-btn
            v-if="!uploading"
            outlined
            rounded
            width="90"
            @click="onClear"
            >{{ files.length ? "Clear" : "Cancel" }}</v-btn
          >
          <v-btn
            color="primary"
            rounded
            class="ml-6"
            :disabled="!files.length"
            @click="onConfirm"
            >{{ confirmTxt }}</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { Upload } from "@aws-sdk/lib-storage";

export default {
  props: {
    value: Boolean,
    info: Object,
    tableList: Array,
  },
  data() {
    return {
      showPop: false,
      files: [],
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Size",
          value: "size",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      progress: 0,
      curIdx: 0,
      sucNum: 0,
      uploading: false,
      isPause: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    overLen() {
      return this.list.filter((it) => {
        return this.tableList.filter((row) => row.name == it.name).length > 0;
      }).length;
    },
    list() {
      return this.files.map((it, index) => {
        return {
          name: (it.name || "").cutStr(10, 10),
          size: this.$utils.getFileSize(it.size),
          index,
          exist: this.tableList.filter((row) => row.name == it.name).length > 0,
        };
      });
    },
    disabled() {
      const { path } = this.$route;
      return !/\/storage\/.+\/$/.test(path) || this.uploading;
    },
    totalSize() {
      let size = 0;
      this.files.forEach((it) => {
        size += it.size;
      });
      return this.$utils.getFileSize(size);
    },
    confirmTxt() {
      return this.uploading ? "Abort" : "Confirm";
    },
  },
  watch: {
    files(val) {
      if (val.length) this.showPop = true;
    },
  },
  methods: {
    onDel(i) {
      this.files.splice(i, 1);
    },
    onAdd() {
      this.$refs.upload.onClick();
    },
    onClear() {
      if (!this.files.length) this.showPop = false;
      else this.files = [];
    },
    async onConfirm() {
      if (this.uploading) {
        this.isPause = true;
        this.uploading = false;
        this.curTask.abort();
        return;
      }
      this.uploading = true;
      this.isPause = false;
      this.curIdx = 0;
      this.sucNum = 0;
      const { Bucket, Prefix } = this.info;
      for (const file of this.files) {
        if (this.isPause) break;
        this.progress = 0;
        const params = {
          Bucket,
          Key: Prefix + file.name,
          Body: file,
          ContentType: file.type,
        };
        try {
          const task = new Upload({
            client: this.$s3,
            queueSize: 3,
            params,
          });
          this.curTask = task;
          task.on("httpUploadProgress", (e) => {
            this.progress = ((e.loaded / e.total) * 100) | 0;
            console.log(e);
          });
          await task.done();
          this.sucNum += 1;
          this.onUpdate();
        } catch (error) {
          if (error) console.log("task", error.message);
        }
        this.curIdx += 1;
      }
      this.$emit("uploaded");
      if (this.sucNum) {
        this.$toast(
          `${this.sucNum} file${
            this.sucNum > 1 ? "s" : ""
          } uploaded successfully`
        );
        this.onUpdate(8000);
      }
      if (this.isPause) {
        if (this.sucNum) this.files.splice(0, this.sucNum);
        return;
      }
      await this.$sleep(300);
      this.showPop = false;
      await this.$sleep(300);
      this.uploading = false;
      this.files = [];
    },
    async onUpdate(delay = 2000) {
      await this.$sleep(delay);
      this.$setMsg({
        name: "updateUsage",
      });
    },
  },
};
</script>
