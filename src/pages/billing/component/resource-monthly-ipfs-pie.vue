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
import { BigNumber } from "ethers";
import pie from "./pie.vue";
import { formatEther, parseEther } from "ethers/lib/utils";
export default {
  components: {
    pie,
  },
  props: {
    name: {
      type: String,
      default: "IPFS",
    },
    data: {
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
      for (const key in this.data) {
        arr.push({
          name: key,
          data: this.data[key],
          value: Number(this.data[key]),
        });
      }
      let totalSize = arr.reduce((pre, it) => {
        return pre.add(BigNumber.from(it.data));
      }, BigNumber.from("0"));

      arr = arr.map((it) => {
        if (it.value == "0") return it;
        it.value = Number(
          Number(formatEther(parseEther(it.data).div(totalSize))).toFixed(4)
        );
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
