<style scoped lang="scss">
.e-upload {
  margin: 20px 0 30px;
  .add-img {
    padding: 20px 10px;
    border: 3px dashed #ddd;
    .description {
      margin: 0 auto;
      width: 402px;
      color: #495667;
    }
  }
}
.files-to-upload {
  width: 100%;
  padding: 20px;
  margin-bottom: 47px;
  box-sizing: border-box;
  background: #f8fafb;
  border-radius: 10px;
  border: 1px solid #d0dae9;

  .upload-header {
    .drag-area {
      flex: 1;
    }
    .upload-rules {
      margin-left: 17px;
      width: 400px;
      > p {
        margin-top: 8px;
        font-size: 15px;
        font-weight: 500;
        color: #6a778b;
        line-height: 22px;
      }
    }
  }

  .upload-tips {
    padding: 10px 10px;
    margin: 15px 0;
    font-size: 14px;
    font-weight: 400;
    color: #ff6d24;
    background: #ffeee4;
    border-radius: 6px;
  }
}
</style>

<template>
  <div>
    <div class="e-upload">
      <!-- <slot></slot> -->

      <div class="upload-header d-flex justify-space-between align-center">
        <div class="add-img pos-r bdrs-10 drag-area">
          <div class="ta-c">
            <img src="../../../../public/img/icon/bucket_upload.svg" alt="" />
            <p class="description fw-b fz-20">
              Drag and drop one or more files or folders here to select them.
            </p>
          </div>
          <!-- webkitdirectory -->
          <input
            ref="file"
            style="visibility: hidden"
            :webkitdirectory="isUploadDir ? true : false"
            multiple
            type="file"
            :accept="accept"
            class="pos-mask op-0 z--1"
            @input="onInput"
          />
        </div>

        <div class="upload-rules">
          <h3>File naming conventions</h3>
          <p>
            1. The file name must be UTF-8-encoded and cannot contain emojis.
          </p>
          <p>2. The file name is case-sensitive.</p>
          <p>3. The file name must range from 1 to 1,023 bytes in length.</p>
          <p>
            4. The file name cannot start with a forward slash (/) or two
            consecutive backslashes (\).
          </p>
        </div>
      </div>

      <div class="upload-tips d-flex align-center">
        <v-icon slot="ref" size="22" color="#ff6d24" class="pa-1 d-ib ml-2"
          >mdi-alert-circle-outline</v-icon
        >
        <span class="ml-2">
          If the name of the file to upload is the same as that of an existing
          file, the existing file is overwritten.
        </span>
      </div>
      <div class="upload-opreation">
        <v-btn rounded color="primary" @click="onClick(false)">
          <span class="ml-2">Select Files</span>
        </v-btn>
        <v-btn rounded color="primary" class="ml-7" @click="onClick(true)">
          <span class="ml-2"> Select Folders</span>
        </v-btn>
      </div>
      <!-- <slot name="hint"></slot> -->
      <!-- <p class="ta-c mt-5" v-if="!disabled">
        <v-btn text @click="onClick">
          <span class="gray">
            Drag, Paste or <span class="color-1">Click to upload files</span>
          </span>
        </v-btn>
      </p> -->
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
      isUploadDir: false,
    };
  },
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
      // console.log(files, "fles");
      this.getFiles({ files });
    };
    // document.onpaste = async (ev) => {
    //   const files = await this.scanFiles(ev.clipboardData);
    //   this.getFiles({ files });
    // };
  },
  methods: {
    onInput(e) {
      this.getFiles(e.target);
      this.$refs.file.value = null;
    },
    onClick(value) {
      this.isUploadDir = value;
      this.$nextTick(() => {
        this.$refs.file.click();
      });
    },
    async scanFiles(e) {
      const { items = [], files = [] } = e;
      // console.log(items, files);
      const [item] = items;
      // console.log(item);
      if (!item || !item.webkitGetAsEntry) return files;
      const entry = item.webkitGetAsEntry();
      if (!entry) return files;
      return entry.isFile ? files : this.getEntryDirectoryFiles(entry);
    },
    async getEntryDirectoryFiles(entry) {
      // console.log(111, entry);
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
              // console.log(entries, "entries");
              for (let i = 0; i < entries.length; i++) {
                await internalProces(entries[i], path + item.name + "/", res);
              }
              resolve(res);
            }, reject);
            // console.log(dirReader, "dirReader");
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
      // console.log(files);
      let arr = Array.from(files);
      const isEmoji =
        arr.filter((it) => {
          return it.webkitRelativePath == ""
            ? this.isEmojiCharacter(it.name)
            : this.isEmojiCharacter(it.webkitRelativePath);
        }).length > 0;
      // console.log(isEmoji);
      if (isEmoji)
        return this.$alert(
          "The file name or folder name cannot contain emojis."
        );
      for (const file of files) {
        // console.log(file);
        if (this.limit && this.files.length >= this.limit) break;
        // if (!/image/.test(file.type)) continue;
        // if (!file.type) continue;
        const isRepeat =
          this.files.filter((it) => {
            return (
              it.name == file.name &&
              it.size == file.size &&
              it.lastModified == file.lastModified
            );
          }).length > 0;
        if (isRepeat) continue;
        file.id = this.genID(8);
        // console.log(file);
        this.files.unshift(file);
      }
      if (this.files.length) {
        this.$setMsg({
          name: "file-upload",
        });
      }
      this.emitInput();
    },
    emitInput() {
      // console.log(this.files);
      // const isEmoji = this.files.findIndex((item) => {
      //   if (item.webkitRelativePath == "") {
      //     return this.isEmojiCharacter(item.name);
      //   } else {
      //     return this.isEmojiCharacter(item.webkitRelativePath);
      //   }
      // });
      // console.log(isEmoji);
      // if (isEmoji !== -1) {
      //   this.files = [];
      //   return this.$alert("The folder name cannot contain emojis.");
      // }
      this.$emit("input", this.files);
    },
    handleRmoveAll() {
      this.files = [];
    },
    handleRemove(id) {
      this.files.splice(
        this.files.findIndex((item) => item.id == id),
        1
      );
    },

    genID(length) {
      return Number(
        Math.random().toString().substr(3, length) + Date.now()
      ).toString(36);
    },

    isEmojiCharacter(substring) {
      for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          if (ls == 0x20e3) {
            return true;
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true;
          } else if (0x2b05 <= hs && hs <= 0x2b07) {
            return true;
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true;
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true;
          } else if (
            hs == 0xa9 ||
            hs == 0xae ||
            hs == 0x303d ||
            hs == 0x3030 ||
            hs == 0x2b55 ||
            hs == 0x2b1c ||
            hs == 0x2b1b ||
            hs == 0x2b50
          ) {
            return true;
          }
        }
      }
    },
  },
};
</script>