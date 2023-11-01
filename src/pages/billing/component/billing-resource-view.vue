<template>
  <div class="resource-view h-flex space-btw pa-4">
    <div class="al-c">
      <img width="16" :src="curResource.img" alt="" />
      <span class="fz-14 ml-3">{{ curResource.name }}</span>
    </div>
    <div>
      <div class="used-resource al-c">
        <img src="/img/svg/new-billing/manage.svg" width="16" alt="" />
        <span class="fz-12 ml-1">{{ view.total }} Total</span>
      </div>
      <div class="residu-resource al-c">
        <img src="/img/svg/new-billing/residu.svg" width="16" alt="" />
        <span class="fz-12 mx-1">Remaining</span>
        <span class="fz-12">{{ view.remaining }}</span>
      </div>
      <v-progress-linear
        class="mt-1"
        style="border-radius: 8px"
        :value="view.percent"
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
      switch (this.view.type) {
        case "IPFS_STORAGE":
          return {
            name: "IPFS",
            img: "/img/svg/hosting/h-ipfs.svg",
          };
        case "AR_STORAGE":
          return {
            name: "Arweave",
            img: "/img/svg/hosting/h-ar.svg",
          };
        case "TRAFFIC":
          return {
            name: "Bandwidth",
            img: "/img/svg/overview/bandwidth.svg",
          };
        case "BUILD_TIME":
          return {
            name: "Build Minutes",
            img: "/img/svg/overview/buildtime.svg",
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
