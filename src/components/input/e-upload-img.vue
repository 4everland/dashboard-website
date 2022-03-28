<style lang="scss">
.e-upload-img {
  .item {
    width: 150px;
    height: 95px;
    border-radius: 5px;
    margin-right: 15px;
    margin-bottom: 15px;
  }
  .add-img {
    border: 1px solid rgba(0, 0, 0, 0.4);
    &:hover {
      border-color: rgba(0, 0, 0, 0.6);
    }
    &:active {
      border: 2px solid #2278cf;
    }
  }
}
@media screen and (max-width: 700px) {
  .e-upload-img {
    .item {
      width: 110px;
      height: 90px;
    }
  }
}
</style>

<template>
  <div class="d-flex al-start">
    <v-icon class="mr-2 mt-5">mdi-image</v-icon>
    <div>
      <div class="d-flex flex-wrap e-upload-img">
        <div class="bd-1 item pd-10 pos-r" v-for="(it, i) in imgList" :key="i">
          <img :src="it.src" class="wh100p img-contain" />
          <v-btn
            @click="onDel(i)"
            fab
            x-small
            color="error"
            class="pos-a"
            style="right: -5px; top: -5px"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>
        <div class="item add-img pos-r" v-if="files.length < limit">
          <v-icon size="30" class="pos-center">mdi-plus-thick</v-icon>
          <input
            ref="file"
            multiple
            type="file"
            :accept="accept"
            class="pos-mask op-0"
            @input="onInput"
          />
        </div>
      </div>
      <div class="gray fz-13">You can attach {{ limit }} images at maximum</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: "image/*",
    },
    limit: {
      type: Number,
      default: 3,
    },
    value: Array,
  },
  data() {
    return {
      files: [],
      imgList: [],
    };
  },
  watch: {
    value(val) {
      if (!val || val.length == 0) {
        this.files = [];
        this.imgList = [];
      }
    },
  },
  mounted() {},
  methods: {
    onDel(i) {
      this.imgList.splice(i, 1);
      this.files.splice(i, 1);
    },
    onInput(e) {
      this.getFiles(e.target);
      this.$refs.file.value = null;
    },
    getFiles(data) {
      if (!data) return;
      const { files = [] } = data;
      for (const file of files) {
        if (this.limit && this.files.length >= this.limit) break;
        if (!/image/.test(file.type)) continue;
        if (file.size > Math.pow(1024, 2) * 10) {
          this.$toast(`${file.name} is too larg (over 10MB)`);
          continue;
        }
        this.files.push(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.imgList.push({
            src: e.target.result,
            size: file.size,
          });
        };
      }
      this.$emit("input", this.files);
    },
  },
};
</script>