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
          <span class="gray-7">Bulk CIDs</span>
        </v-list-item>
      </v-list>
    </e-menu>
    <v-dialog v-model="showDialog" max-width="500">
      <div class="pa-5">
        <h3 class="fz-20">Pin By CID</h3>
        <div class="fz-14 my-6">
          This function allows you to pin content to 4EVER storage using an
          IPFS Content Identifier. (CID)
        </div>
        <v-form ref="form" class="mt-6">
          <v-text-field
            persistent-placeholder
            label="Set Name"
            counter="30"
            maxlength="30"
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
          <!-- <div>
            <span class="fz-14 param-title mr-2">Origins(optional)</span>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="18" v-bind="attrs" v-on="on">
                  mdi-alert-circle-outline
                </v-icon>
              </template>
              <div style="width: 300px">
                A list of known sources (providers) of the data. Sent by a
                client in a pin request. Pinning service will try to connect to
                them to speed up data transfer.
              </div>
            </v-tooltip>
          </div>
          <template v-for="(item, index) in originList">
            <div class="mt-3 al-c" :key="index">
              <v-text-field
                placeholder="/ip4/203.0.113.142/tcp/4001/p2p/QmSourcePeerId"
                persistent-placeholder
                v-model="item.value"
                :rules="[v=>handleValidOrigin(v) || 'invalid']"
              ></v-text-field>
              <v-icon
                size="20"
                class="ml-4"
                color="primary"
                @click="handleAddOrigin"
                v-show="!index && originList.length < 20"
                >mdi-plus-circle-outline</v-icon
              >
              <v-icon
                size="20"
                class="ml-4"
                color="primary"
                @click="handleRemoveOrigin(index)"
                v-show="index"
                >mdi-minus-circle-outline</v-icon
              >
            </div>
          </template> -->

          <div class="d-flex justify-center al-c mt-8">
            <v-btn color="primary" @click="handleUpload"
              >Search and Pin</v-btn
            >
            <v-btn outlined class="ml-10" @click="showDialog = false">Cancel</v-btn>
          </div>
        </v-form>
      </div>
    </v-dialog>
    <v-dialog v-model="showMultipleDialog" max-width="550">
      <div class="pa-5">
        <h3>Bulk CIDs</h3>
        <div class="fz-14 my-3">
          The Bulk CIDs can be entered in a .txt file with one CID per line and
          uploaded for resolution.
        </div>
        <div v-if="!file">
          <div class="fz-14 gray-6 mt-2">
            Only a single .txt file is supported for uploading with one CID per
            line in the .txt file.
          </div>
          <div class="al-c mt-4 justify-center">

            <v-btn
              slot="ref"
              color="primary"
              width="150"
              @click="$refs.uploadInput.onClick()"
            >
              <img src="/img/svg/upload.svg" width="16" />
              <span class="ml-2">Upload</span>
            </v-btn>
            <v-btn class="ml-5" outlined @click="showMultipleDialog = false">Cancel</v-btn>
          </div>
        </div>
        <div v-else>
          <div>
            <span class="fz-14" style="color: #775da6">{{ file.name }}</span>
            <v-icon class="ml-3 cursor-p" size="20" @click="file = null"
              >mdi-trash-can-outline</v-icon
            >
          </div>
          <div class="mt-2 mb-5 al-c justify-space-between">
            <div class="fz-14 gray">
              Resolving completed!
              <span class="fw-b" style="color: #775da6">{{
                readerFileList.length
              }}</span>
              lines total, resolved
              <span class="fw-b" style="color: #775da6">{{
                readerFileSuccessList.length
              }}</span>
              valid CIDs.
            </div>
            <div
              class="cursor-p ml-4 fz-14"
              style="color: #34a9ff"
              @click="showFileView = true"
            >
              View List
            </div>
          </div>
          <v-form ref="mutipleForm">
            <v-text-field
              persistent-placeholder
              label="Set Name"
              counter="30"
              maxlength="30"
              v-model="mutipleForm.name"
            ></v-text-field>
            <!-- <div>
              <span class="fz-14 param-title mr-2">Origins(optional)</span>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon size="18" v-bind="attrs" v-on="on">
                    mdi-alert-circle-outline
                  </v-icon>
                </template>
                <div style="width: 300px">
                  A list of known sources (providers) of the data. Sent by a
                  client in a pin request. Pinning service will try to connect
                  to them to speed up data transfer.
                </div>
              </v-tooltip>
            </div>

            <template v-for="(item, index) in originList">
              <div class="mt-3 al-c" :key="index">
                <v-text-field
                  class="hide-msg"
                  persistent-placeholder
                  v-model="item.value"
                ></v-text-field>
                <v-icon
                  size="20"
                  class="ml-4"
                  color="primary"
                  @click="handleAddOrigin"
                  v-show="!index && originList.length < 20"
                  >mdi-plus-circle-outline</v-icon
                >
                <v-icon
                  size="20"
                  class="ml-4"
                  color="primary"
                  @click="handleRemoveOrigin(index)"
                  v-show="index"
                  >mdi-minus-circle-outline</v-icon
                >
              </div>
            </template> -->

            <div class="d-flex justify-center al-c mt-8">
               <v-btn color="primary" @click="handleMultipleUpload"
                >Search and Pin</v-btn
              >
              <v-btn outlined class="ml-10" @click="showMultipleDialog = false">Cancel</v-btn>
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
          <v-btn color="primary" @click="showFileView = false">DONE</v-btn>
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
const addr = MultiformatsMultiaddr.multiaddr('/ip4/203.0.113.142/tcp/4001acs')
const result = MultiformatsMultiaddr.isMultiaddr(addr)
console.log(result)
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
      },
      mutipleForm: {
        name: "",
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
      originList: [{ value: "" }],
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
    failedTasks() {
      return this.tasks.filter((it) => it.status == 4 || it.status == 2);
    },
  },
  created() {
    if (this.tasks.length) {
      this.showControl = true;
    }
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
    failedTasks(tasks) {
      if (tasks.length) {
        this.tasks
          .filter((it) => it.status != 3 && it.status != 4 && it.status != 2)
          .forEach((it) => it.abortPin());
      }
    },
    showMultipleDialog(val) {
      if (!val) {
        this.$refs.mutipleForm.reset();
        this.readerFileList = [];
        this.file = null;
        this.originList = [{ value: "" }];
      }
    },
    showDialog(val) {
      if (!val) {
        this.$refs.form.reset();
        this.originList = [{ value: "" }];
      }
    },
  },
  methods: {
    handleUpload() {
      const valid = this.$refs.form.validate();
      if (!valid) return;
      let origins = this.originList.map((it) => it.value);
      let form = { ...this.form };
      if (origins[0]) {
        form = { ...this.form, origins };
      }
      let task = new PinningServiceTaskWrapper(form, this.accessToken);
      this.tasks.push(task);
      this.showControl = true;
      this.processTask();
      this.showDialog = false;
    },
    handleMultipleUpload() {
      let origins = this.originList.map((it) => it.value);
      let mutipleForm = { ...this.mutipleForm };
      if (origins[0]) {
        mutipleForm = { ...this.mutipleForm, origins };
      }
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
    handleValidOrigin(v) {
      try {
        const addr = MultiformatsMultiaddr.multiaddr(v);
        return  MultiformatsMultiaddr.isMultiaddr(addr)
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    onReplace(params) {
      const tasks = params.map(
        (it) =>
          new PinningServiceTaskWrapper(it.pin, this.accessToken, it.requestid)
      );
      this.tasks = this.tasks.concat(tasks);
      this.showControl = true;
      this.processTask();
    },
    async startTask(task) {
      if (task.requestId) {
        await task.replacePin();
      } else {
        await task.addPin();
      }
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
      for (let i = 0; i < min; i++) {
        this.startTask(idles[i]);
      }
    },
    onRetry() {
      this.tasks.forEach((it) => {
        console.log(it);
        if (it.status == 4 || it.status == 2) it.resetStatus();
      });
      this.processTask();
    },
    handleAddOrigin() {
      if (this.originList.length >= 20) return;
      this.originList.push({ value: "" });
    },
    handleRemoveOrigin(i) {
      this.originList = this.originList.filter((it, index) => index != i);
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
      const readerFileList = arr.map((it) => {
        const valid =
          /^Qm[a-zA-Z0-9]{44}$/g.test(it.trim()) ||
          /^b[a-z0-9]{58}$/g.test(it.trim());
        return { cid: it.trim(), valid };
      });
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
.param-title {
  color: rgba(0, 0, 0, 0.6);
}
</style>