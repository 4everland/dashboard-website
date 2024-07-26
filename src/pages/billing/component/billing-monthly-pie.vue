<template>
  <div class="billing-mothly-pie">
    <h2 class="fz-18">
      Billing details for
      {{ new Date(curInfo.timestamp * 1000).format("yy-MM") }}
    </h2>

    <half-pie :curInfo="dataOptions"></half-pie>
    <div class="legend mt-3">
      <div class="al-c space-btw" v-for="item in dataOptions" :key="item.name">
        <div>
          <span
            class="d-ib"
            :style="{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: item.color,
            }"
          ></span>
          <span class="ml-1 fz-14">{{ item.name }}</span>
        </div>

        <div class="fz-12" style="color: #64748b">
          <!-- <span>{{ item.resourceUsed }}</span>
          + -->
          <span>{{ $utils.formatLand(item.landUsed) }} LAND</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import halfPie from "./half-pie.vue";
export default {
  components: {
    halfPie,
  },
  props: {
    curInfo: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    dataOptions() {
      const arr = this.curInfo.info.map((it) => {
        let name = "IPFS";
        let color = "#000";
        let resourceUsed = "0";
        switch (it.resourceType) {
          case "AR_STORAGE":
            name = "Arweave";
            color = "#000";
            resourceUsed = this.$utils.getFileSize(it.resourceUsed);
            break;
          case "BUILD_TIME":
            name = "Build Time";
            color = "#F3CC5C";
            resourceUsed =
              this.$utils.getNumCount(it.resourceUsed / 60) + "Mins";
            break;
          case "TRAFFIC":
            name = "Bandwidth";
            color = "#9AD3DC";
            resourceUsed = this.$utils.getFileSize(it.resourceUsed);
            break;
          case "COMPUTE_UNIT":
            name = "RPC Requests";
            color = "#8098F9";
            resourceUsed = this.$utils.getNumCount(it.resourceUsed) + "CUs";
            break;
          case "AI_RPC":
            name = "AI RPC";
            color = "#6172F3";
            resourceUsed =
              this.$utils.formatLand(it.resourceUsed, false, false) + "LAND";
            break;
          case "RAAS":
            name = "RaaS";
            color = "#F78E69";
            resourceUsed = this.$utils.getFileSize(it.resourceUsed);
            break;
          case "ASS_NODE":
            name = "ASS Node";
            color = "#70707B";
            resourceUsed = this.$utils.getFileSize(it.resourceUsed);
            break;
          default:
            name = "IPFS";
            color = "#57B9BC";
            resourceUsed = this.$utils.getFileSize(it.resourceUsed);
            break;
        }
        return {
          value: Number(it.landUsed),
          color,
          name,
          landUsed: it.landUsed,
          resourceUsed,
        };
      });
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
.billing-mothly-pie {
  width: 100%;
}
#pie {
  width: 100%;
  height: 200px;
}
</style>
