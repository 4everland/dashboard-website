<template>
  <div class="resource-view h-flex space-btw py-4 px-2">
    <div class="al-c">
      <img width="16" :src="curResource.img" alt="" />
      <span class="fz-14 ml-4">{{ curResource.name }}</span>
    </div>

    <div>
      <div class="al-c space-btw">
        <div class="resource-size d-flex al-c">
          <div class="consume-resource">
            <span class="fz-24 fw-b">{{ curResource.used.num }}</span>
            <span class="fz-12 ml-1">{{ curResource.used.unit }}</span>
          </div>
          <div class="sparator">/</div>
          <div class="total-resource fz-12">{{ curResource.total }}</div>
        </div>
        <div class="land-to-resource fz-12" v-if="showTransform">
          <span>+{{ transformDate.transformVal }}</span>
          <span>
            {{ view.type == "IPFS_STORAGE" ? "(1month)" : "" }}
          </span>
        </div>
      </div>
      <v-progress-linear
        class="mt-1"
        style="border-radius: 8px"
        :value="percent"
        color="#775DA6"
        height="4"
      >
      </v-progress-linear>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    view: {
      type: Object,
      required: true,
    },
    transformDate: {
      type: Object,
    },
    showTransform: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    curResource() {
      let obj = {
        total: this.$utils.getFileSize(this.view.total),
        used: this.$utils.getFileSize(this.view.used, true),
      };
      switch (this.view.type) {
        case "IPFS_STORAGE":
          return {
            name: "IPFS",
            img: "/img/svg/hosting/h-ipfs.svg",
            ...obj,
          };
        case "AR_STORAGE":
          return {
            name: "Arweave",
            img: "/img/svg/hosting/h-ar.svg",
            ...obj,
          };
        case "TRAFFIC":
          return {
            name: "Bandwidth",
            img: "/img/svg/overview/bandwidth.svg",
            ...obj,
          };
        case "BUILD_TIME":
          return {
            name: "Build Minutes",
            img: "/img/svg/overview/buildtime.svg",
            total: this.$utils.getNumCount(this.view.total) + "Mins",
            used: {
              num: this.$utils.getNumCount(this.view.used, true).num,
              unit: this.$utils.getNumCount(this.view.used, true).unit + "Mins",
            },
          };
        case "COMPUTE_UNIT":
          return {
            name: "RPC Requests",
            img: "/img/svg/overview/buildtime.svg",
            total: this.$utils.getNumCount(this.view.total) + "Cus",
            used: {
              num: this.$utils.getNumCount(this.view.used, true).num,
              unit: +this.$utils.getNumCount(this.view.used, true).unit + "Cus",
            },
          };
        default:
          return {
            name: "IPFS",
            img: "/img/svg/hosting/h-ipfs.svg",
            ...obj,
          };
      }
    },
    percent() {
      if (this.view.total == 0) return 0;
      let total = this.view.total;
      if (this.showTransform) {
        total = total + this.transformDate.value.toNumber();
      }
      return (this.view.used / total) * (100).toFixed(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-view {
  border-radius: 4px;
  background: #f8fafc;
  height: 144px;

  .land-to-resource {
    color: #775da6;
  }

  .consume-resource {
    line-height: 24px;
  }
  .sparator {
    margin: 0 2px;
  }
  .resource-size {
    line-height: 24px;
    .total-resource {
      color: #64748b;
    }
  }
}
</style>
