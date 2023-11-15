<template>
  <div class="al-c h-flex space-center mt-6 pos-r">
    <h3>{{ name }}</h3>
    <pie :id="name" :data="formatData" :type="type"></pie>
    <div class="center ta-c">
      <slot></slot>
    </div>
    <slot name="bottom"> </slot>
  </div>
</template>

<script>
import pie from "./pie.vue";
export default {
  components: {
    pie,
  },
  props: {
    name: {
      type: String,
      default: "IPFS",
    },
    resourceAppUsed: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    formatData() {
      let arr = [];
      console.log(this.resourceAppUsed);
      for (const key in this.resourceAppUsed) {
        arr.push({
          name: key,
          data: this.$utils.getFileSize(this.resourceAppUsed[key]),
          value: Number(this.resourceAppUsed[key]),
        });
      }
      let totalSize = arr.reduce((pre, it) => (pre += it.value), 0);
      arr = arr
        .filter((item) => item.value)
        .map((it) => {
          if (it.value == 0) return it;
          it.value = (it.value / totalSize).toFixed(4);
          return it;
        });
      console.log(arr);
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
