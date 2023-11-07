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
            <span class="fz-24 fw-b">{{ view.used.size }}</span>
            <span class="fz-12 ml-1">{{ view.used.unit }}</span>
          </div>
          <div class="sparator">/</div>
          <div class="total-resource fz-12">{{ view.total }}</div>
        </div>
        <div class="land-to-resource fz-12">
          +{{ transformDate }}
          {{ view.type == "IPFS_STORAGE" ? "(1month)" : "" }}
        </div>
      </div>
      <v-progress-linear
        class="mt-1"
        style="border-radius: 8px"
        :value="100"
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
      type: String,
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
        case "COMPUTE_UNIT":
          return {
            name: "RPC Requests",
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
