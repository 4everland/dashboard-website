<template>
  <div class="resource-view h-flex space-btw pa-4">
    <div class="al-c">
      <div class="al-c justify-center pa-2" style="background: #fff">
        <img width="16" :src="curResource.img" alt="" />
      </div>
      <span class="fz-14 ml-2">{{ curResource.name }}</span>
    </div>
    <div>
      <div class="used-resource al-c">
        <img src="/img/svg/new-billing/manage.svg" width="16" alt="" />
        <span class="fz-12 ml-1"
          >{{ curResource.total }}
          {{ curResource.name == "Arweave" ? "Total" : "/ Month" }}</span
        >
      </div>
      <div class="residu-resource al-c fz-12">
        <img src="/img/svg/new-billing/residu.svg" width="16" alt="" />
        <span style="margin: 0 2px">Remaining</span>
        <span>{{ curResource.remaining }}</span>
      </div>
      <v-progress-linear
        class="mt-1"
        style="border-radius: 8px"
        :value="curResource.percent"
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
  },

  computed: {
    curResource() {
      let info = {
        total: this.$utils.getFileSize(this.view.total),
        used: this.$utils.getFileSize(this.view.used),
        remaining:
          this.$utils.getFileSize(this.view.remaining, true).num < 0
            ? 0 + " B"
            : this.$utils.getFileSize(this.view.remaining, true).num +
              " " +
              this.$utils.getFileSize(this.view.remaining, true).unit,
        percent: this.view.percent,
      };
      switch (this.view.type) {
        case "IPFS_STORAGE":
          return {
            name: "IPFS",
            img: "/img/svg/overview/ipfs-icon.svg",
            ...info,
          };
        case "AR_STORAGE":
          return {
            name: "Arweave",
            img: "/img/svg/hosting/h-ar.svg",
            ...info,
          };
        case "TRAFFIC":
          return {
            name: "Bandwidth",
            img: "/img/svg/overview/bandwidth.svg",
            ...info,
          };
        case "BUILD_TIME":
          return {
            name: "Build Minutes",
            img: "/img/svg/overview/buildtime.svg",
            total: this.$utils.getNumCount(this.view.total) + "Mins",
            used: this.$utils.getNumCount(this.view.used),
            remaining:
              this.$utils.getNumCount(this.view.remaining) < 0
                ? 0
                : this.$utils.getNumCount(this.view.remaining) + "Mins",
            percent: this.view.percent,
          };
        default:
          return {
            name: "IPFS",
            img: "/img/svg/hosting/h-ipfs.svg",
          };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-view {
  border-radius: 4px;
  background: #f8fafc;
  height: 144px;
  .used-resource {
    color: #0f172a;
  }
  .residu-resource {
    color: #64748b;
  }
}
</style>
