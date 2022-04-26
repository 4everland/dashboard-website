<style lang="scss">
.e-upload {
  margin: 20px 0 30px;
  .add-img {
    padding: 60px 0;
    border: 3px dashed #ddd;
  }
}
</style>

<template>
  <div>
    <div class="e-upload">
      <slot></slot>

      <div class="add-img pos-r bdrs-10" v-ripple v-show="files.length == 0">
        <div class="ta-c">
          <p>
            <v-icon size="60" color="#bbb">mdi-cloud-upload-outline</v-icon>
          </p>
        </div>
        <!-- webkitdirectory -->
        <input
          ref="file"
          multiple
          type="file"
          :accept="accept"
          class="pos-mask op-0 z--1"
          @input="onInput"
        />
      </div>
      <slot name="hint"></slot>
      <p class="ta-c mt-5" v-if="!disabled">
        <v-btn text @click="onClick">
          <span class="gray">
            Drag, Paste or <span class="color-1">Click to upload files</span>
          </span>
        </v-btn>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: "*", //image/*
    },
    limit: {
      type: Number,
      default: 0,
    },
    value: Array,
    disabled: Boolean,
  },
  data() {
    return {
      files: [],
    };
  },
  computed: {},
  watch: {
    value(val) {
      if (!val || val.length == 0) {
        this.files = [];
      }
    },
  },
  mounted() {
    document.ondragover = (ev) => ev.preventDefault();
    document.ondrop = async (ev) => {
      ev.preventDefault();
      // this.getFiles(ev.dataTransfer);
      const files = await this.scanFiles(ev.dataTransfer);
      this.getFiles({ files });
    };
    document.onpaste = async (ev) => {
      const files = await this.scanFiles(ev.clipboardData);
      this.getFiles({ files });
    };
  },
  methods: {
    onInput(e) {
      this.getFiles(e.target);
      this.$refs.file.value = null;
    },
    onClick() {
      this.$refs.file.click();
    },
    async scanFiles(e) {
      const { items = [], files = [] } = e;
      const [item] = items;
      if (!item || !item.webkitGetAsEntry) return files;
      const entry = item.webkitGetAsEntry();
      if (!entry) return files;
      return entry.isFile ? files : this.getEntryDirectoryFiles(entry);
    },
    async getEntryDirectoryFiles(entry) {
      let res = [];
      var internalProces = (item, path, res) => {
        if (item.isFile) {
          return new Promise((resolve) => {
            item.file((file) => {
              file.path = path + file.name;
              var newFile = new File([file], file.path, { type: file.type });
              res.push(newFile);
              resolve(res);
            });
          });
        } else if (item.isDirectory) {
          return new Promise((resolve, reject) => {
            var dirReader = item.createReader();
            dirReader.readEntries(async (entries) => {
              for (let i = 0; i < entries.length; i++) {
                await internalProces(entries[i], path + item.name + "/", res);
              }
              resolve(res);
            }, reject);
          });
        }
      };
      await internalProces(entry, "", res);
      return res;
    },
    getFiles(data) {
      if (this.disabled) return;
      if (!data) return;
      const { files = [] } = data;
      for (const file of files) {
        // console.log(file);
        if (this.limit && this.files.length >= this.limit) break;
        // if (!/image/.test(file.type)) continue;
        // if (!file.type) continue;
        // if (file.size > Math.pow(1024, 2) * 300) {
        //   this.$toast(`${file.name} is too larg (over 300MB)`);
        //   continue;
        // }
        const isRepeat =
          this.files.filter((it) => {
            return (
              it.name == file.name &&
              it.size == file.size &&
              it.lastModified == file.lastModified
            );
          }).length > 0;
        if (isRepeat) continue;
        this.files.push(file);
      }
      if (this.files.length) {
        this.$setMsg({
          name: "file-upload",
        });
      }
      this.emitInput();
    },
    emitInput() {
      this.$emit("input", this.files);
    },
  },
};
</script>