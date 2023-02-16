<template>
  <div>
    <e-menu offset-y open-on-hover nudge-bottom="11">
      <v-btn slot="ref" color="primary">
        <img src="/img/svg/upload.svg" width="16" />
        <span class="ml-2">Upload</span>
        <v-icon size="18">mdi-chevron-down</v-icon>
      </v-btn>
      <v-list dense>
        <v-list-item link @click="showDialog = true">
          <span class="gray-7">Selected CID</span>
        </v-list-item>
        <v-list-item link @click="showMultipleDialog = true">
          <span class="gray-7">Multiple Upload CID</span>
        </v-list-item>
      </v-list>
    </e-menu>

    <v-dialog v-model="showDialog" max-width="550">
      <div class="pa-5">
        <h3>Pin By CID</h3>
        <div class="fz-14 my-3">
          This function allows you to pin content to 4EVERLAND bucket using an
          IPFS Content Identifier. (CID)
        </div>
        <div class="fz-14 mb-10 gray-6">
          The IPFS network is large and it may take some time for our IPFS nodes
          to locate and fetch your content.
        </div>
        <v-form ref="form">
          <v-text-field
            persistent-placeholder
            label="Set Name"
            counter="30"
            :rules="[(v) => (v && v.length <= 30) || 'name only 30 char']"
            v-model="form.name"
          ></v-text-field>
          <v-text-field
            persistent-placeholder
            label="IPFS CID"
            v-model="form.cid"
            :rules="[
              (v) => !!(v || '').trim() || 'Invalid CID',
              (v) =>
                /^([A-Za-z0-9]{46}|[A-Za-z0-9]{59})$/.test(v)
                  ? true
                  : 'Invalid CID',
            ]"
          ></v-text-field>
          <v-textarea
            persistent-placeholder
            name="input-7-1"
            label="Origins"
            v-model="form.origins"
          ></v-textarea>
          <div class="d-flex justify-center al-c mt-8">
            <v-btn outlined @click="showDialog = false">Cancel</v-btn>
            <v-btn color="primary" class="ml-10" @click="handleUpload"
              >Search and Pin</v-btn
            >
          </div>
        </v-form>
      </div>
    </v-dialog>
    <v-dialog v-model="showMultipleDialog" max-width="550">
      <div class="pa-5">
        <h3>Pin By CID</h3>
        <div class="fz-14 my-3">
          This function allows you to pin content to 4EVERLAND bucket using an
          IPFS Content Identifier. (CID)
        </div>
        <div v-if="!file">
          <div class="al-c mt-7">
            <v-btn outlined @click="$refs.uploadInput.onClick()"
              >Upload File</v-btn
            >
          </div>
          <div class="fz-14 gray-6 mt-3">
            only support single file name suffix .text
          </div>
        </div>
        <div v-else>
          <div>
            <span class="fz-14 gray-6">{{ file.name }}</span>
            <v-icon class="ml-3 cursor-p" size="20" @click="file = null"
              >mdi-trash-can</v-icon
            >
          </div>
          <p class="my-3">
            <span class="fz-14"
              >Parse successfully , all counts is {{ readerFileList.length }},
              parse useful {{ readerFileSuccessList.length }} cid!</span
            >
            <span
              class="cursor-p ml-4 fz-14"
              style="color: blue"
              @click="showFileView = true"
              >View List</span
            >
          </p>
          <v-form ref="mutipleForm">
            <v-text-field
              persistent-placeholder
              label="Set Name"
              counter="30"
              :rules="[(v) => (v && v.length <= 30) || 'name only 30 char']"
              v-model="mutipleForm.name"
            ></v-text-field>

            <v-textarea
              persistent-placeholder
              name="input-7-1"
              label="Origins"
              v-model="mutipleForm.origins"
            ></v-textarea>
            <div class="d-flex justify-center al-c mt-8">
              <v-btn outlined @click="showMultipleDialog = false">Cancel</v-btn>
              <v-btn color="primary" class="ml-10" @click="handleMultipleUpload"
                >Search and Pin</v-btn
              >
            </div>
          </v-form>
        </div>
      </div>
    </v-dialog>
    <input-upload
      v-model="files"
      ref="uploadInput"
      accept=".txt"
      supportReapt
    ></input-upload>
    <v-dialog v-model="showFileView" max-width="600" persistent>
      <div class="pa-5">
        <h3>File View</h3>
        <div class="al-c justify-end">
          <v-btn
            small
            color="primary"
            outlined
            @click="viewInvalid = !viewInvalid"
            >{{ viewInvalid ? "View All CID" : "View Invalid CID" }}</v-btn
          >
        </div>
        <div class="mt-4" style="height: 500px; overflow: scroll">
          <v-simple-table :fixed-header="true">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Line</th>
                  <th class="text-left">Content</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in fileViewList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td :style="{ color: !item.valid ? 'red' : '#000' }">
                    {{ item.cid }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
        <div class="mt-6 ta-c">
          <v-btn color="primary" @click="showFileView = false">Done</v-btn>
        </div>
      </div>
    </v-dialog>
    <pinning-service-control
      @close="showControl = false"
      @retryUpload="onRetry"
      :tasks="tasks"
      v-show="showControl"
    ></pinning-service-control>
  </div>
</template>

<script>
import { PinningServiceTaskWrapper } from "../task";
import PinningServiceControl from "@/views/bucket/components/pinning-service-control.vue";
import InputUpload from "@/views/bucket/components/input-upload";
export default {
  props: {
    accessToken: String,
  },
  data() {
    return {
      showDialog: false,
      showFileView: false,
      showMultipleDialog: false,
      form: {
        name: "",
        cid: "",
        origins: "",
      },
      mutipleForm: {
        name: "",
        origins: "",
      },
      isMultipleUpload: false,
      files: [],
      file: null,
      readerFileList: [],
      loading: false,
      viewInvalid: false,
      processLimit: 10,
      tasks: [],
      showControl: false,
    };
  },
  computed: {
    readerFileSuccessList() {
      return this.readerFileList.filter((it) => it.valid);
    },
    readerFileFailedList() {
      return this.readerFileList.filter((it) => !it.valid);
    },
    fileViewList() {
      if (this.viewInvalid) {
        return this.readerFileFailedList;
      }
      return this.readerFileList;
    },
    compeleted() {
      return !this.tasks.some((it) => it.status != 3 && it.status != 4);
    },
  },

  watch: {
    files(val) {
      this.file = val[0];
    },
    async file(val) {
      if (!val) return;
      const result = await this.getFileContent(val);
      this.parseContentCid(result);
    },
    compeleted(val) {
      if (val) this.$emit("getList");
    },
    showMultipleDialog(val) {
      if (!val) {
        this.$refs.mutipleForm.reset();
        this.readerFileList = [];
        this.file = null;
      }
    },
    showDialog(val) {
      if (!val) this.$refs.form.reset();
    },
  },
  methods: {
    handleUpload() {
      const valid = this.$refs.form.validate();
      if (!valid) return;
      let form = { ...this.form };
      if (form.origins) {
        form.origins = form.origins.split("\n");
      } else {
        this.$delete(form, "origins");
      }
      let task = new PinningServiceTaskWrapper(form, this.accessToken);
      this.tasks.push(task);
      this.showControl = true;
      this.processTask();
      this.showDialog = false;
    },
    handleMultipleUpload() {
      let mutipleForm = { ...this.mutipleForm };
      mutipleForm.origins = mutipleForm.origins
        ? mutipleForm.origins.split("\n")
        : "".split("\n");
      const tasks = this.readerFileSuccessList.map(
        (it) =>
          new PinningServiceTaskWrapper(
            { cid: it.cid, ...mutipleForm },
            this.accessToken
          )
      );
      this.tasks = this.tasks.concat(tasks);
      this.showControl = true;
      this.processTask();
      this.showMultipleDialog = false;
    },
    async startTask(task) {
      await task.addPin();
      this.processTask();
    },
    processTask() {
      const processing = this.tasks.filter((it) => it.status == 1);
      if (processing.length >= this.processLimit) return;
      const idles = this.tasks.filter((it) => it.status == 0);
      const min =
        idles.length > this.processLimit
          ? this.processLimit - processing.length
          : idles.length;
      console.log(min);
      for (let i = 0; i < min; i++) {
        this.startTask(idles[i]);
      }
    },
    onRetry() {
      this.tasks.forEach((it) => {
        console.log(it);
        if (it.status == 4) it.resetStatus();
      });

      this.processTask();
    },
    getFileContent(file) {
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target.result;
            resolve(content);
          };
          reader.readAsText(file);
        } catch (error) {
          reject(error);
        }
      });
    },
    parseContentCid(content) {
      let arr = content.split("\n");
      console.log(arr);
      const readerFileList = arr.map((it) => {
        const valid =
          /^Qm[a-zA-Z0-9]{44}$/g.test(it.trim()) ||
          /^b[a-z0-9]{58}$/g.test(it.trim());
        return { cid: it.trim(), valid };
      });
      console.log(readerFileList);
      this.readerFileList = readerFileList;
    },
  },
  components: {
    InputUpload,
    PinningServiceControl,
  },
};
</script>

<style lang="scss" scoped>
</style>