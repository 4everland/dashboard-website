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
    document.ondrop = (ev) => {
      ev.preventDefault();
      this.getFiles(ev.dataTransfer);
    };
    document.onpaste = (ev) => {
      this.getFiles(ev.clipboardData);
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
    getFiles(data) {
      if (this.disabled) return;
      if (!data) return;
      const { files = [] } = data;
      for (const file of files) {
        // console.log(file);
        if (this.limit && this.files.length >= this.limit) break;
        // if (!/image/.test(file.type)) continue;
        // if (!file.type) continue;
        if (file.size > Math.pow(1024, 2) * 300) {
          this.$toast(`${file.name} is too larg (over 300MB)`);
          continue;
        }
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