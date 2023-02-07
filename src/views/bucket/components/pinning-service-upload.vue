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
            :rules="[(v) => v.length <= 30 || 'name only 30 char']"
            v-model="form.name"
          ></v-text-field>
          <v-text-field
            v-if="!isMultipleUpload"
            persistent-placeholder
            label="IPFS CID"
            v-model="form.cid"
          ></v-text-field>
          <div v-else>
            <div class="fz-14">IPFS CID</div>
            <div>
              <v-btn
                class="mt-4"
                small
                outlined
                @click="$refs.uploadInput.onClick()"
                >Upload File</v-btn
              >
              <input-upload
                v-model="files"
                ref="uploadInput"
                accept=".txt"
                supportReapt
              ></input-upload>
            </div>
          </div>
          <v-text-field
            persistent-placeholder
            label="Origins"
            v-model="form.origins"
          ></v-text-field>

          <div class="ta-r fz-14">
            <span
              class="cursor-p gray-6"
              v-if="!isMultipleUpload"
              @click="isMultipleUpload = true"
              >Multiple Upload</span
            >
            <span
              class="cursor-p gray-6"
              v-else
              @click="isMultipleUpload = false"
              >Cid Upload</span
            >
          </div>
          <div class="d-flex justify-center al-c mt-8">
            <v-btn outlined @click="showDialog = false">Cancel</v-btn>
            <v-btn color="primary" class="ml-10">Search and Pin</v-btn>
          </div>
        </v-form>
      </div>
    </v-dialog>

    <v-dialog v-model="showFileView" max-width="550"></v-dialog>
  </div>
</template>

<script>
import InputUpload from "@/views/bucket/components/input-upload";
export default {
  data() {
    return {
      showDialog: true,
      showFileView: false,
      form: {
        name: "",
        cid: "",
      },
      isMultipleUpload: false,
      files: [],
      file: {},
      loading: false,
    };
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.isMultipleUpload = false;
      }
    },
    files(val) {
      console.log(val);
      this.file = val[0];
    },
    async file(val) {
      const result = await this.getFileContent(val);
      this.parseContentCid(result);
    },
  },
  methods: {
    onChange(e) {
      console.log(e);
    },
    handleMultipleUpload() {},
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
    },
  },
  components: {
    InputUpload,
  },
};
</script>

<style lang="scss" scoped>
</style>