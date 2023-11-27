<template>
  <div class="al-c h-flex space-center mt-6">
    <h3>{{ name }}</h3>
    <div style="width: 100%" class="pos-r">
      <pie :id="name" :data="finalData" :type="type"></pie>
      <div class="center ta-c h-flex">
        <span class="fw-b">Recently added</span>
        <span class="fz-12">
          {{ $utils.getFileSize(totalSize) }}
        </span>
      </div>
    </div>

    <div class="fz-12 ta-c" v-if="name == 'Arweave'">
      Arweave files smaller than 150KB are excluded.
    </div>
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
      for (const key in this.resourceAppUsed) {
        arr.push({
          name: key,
          data: this.$utils.getFileSize(this.resourceAppUsed[key]),
          value: Number(this.resourceAppUsed[key]),
        });
      }
      return arr;
    },
    finalData() {
      return this.formatData
        .filter((item) => item.value)
        .map((it) => {
          if (it.value == 0) return it;
          it.value = (it.value / this.totalSize).toFixed(4);
          return it;
        });
    },
    totalSize() {
      return this.formatData.reduce((pre, it) => (pre += it.value), 0);
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
