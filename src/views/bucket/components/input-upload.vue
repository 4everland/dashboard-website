<template>
  <div>
    <div ref="eUpload">
      <input
        ref="file"
        style="visibility: hidden"
        :webkitdirectory="isUploadDir"
        multiple
        type="file"
        :accept="accept"
        class="pos-mask op-0 z--1"
        @input="onInput"
      />
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
      console.log(files);
      let arr = Array.from(files);

      const isEmoji =
        arr.filter((it) => {
          return it.webkitRelativePath == ""
            ? this.isEmojiCharacter(it.name)
            : this.isEmojiCharacter(it.webkitRelativePath);
        }).length > 0;
      if (isEmoji)
        return this.$alert(
          "The file name or folder name cannot contain emojis."
        );

      for (const file of files) {
        // console.log(file);
        if (this.limit && this.files.length >= this.limit) break;
        console.log(file);
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
        // if (file.name !== ".DS_Store") {
        //   this.files.unshift(file);
        // }
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
            let ls = substring.charCodeAt(i + 1);
            var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          let ls = substring.charCodeAt(i + 1);
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