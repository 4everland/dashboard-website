<template>
  <div class="resource-view h-flex space-btw py-4 px-2">
    <div class="d-flex al-start">
      <div class="al-c justify-center pa-2" style="background: #fff">
        <img width="16" :src="curResource.img" alt="" />
      </div>
      <span class="ml-2 fw-b">{{ curResource.name }}</span>
    </div>

    <div>
      <div>
        <div class="al-c" v-if="showConversionResource">
          <v-tooltip top max-width="300" nudge-top="5">
            <template v-slot:activator="{ on, attrs }">
              <div class="land-to-resource fz-12 al-c" v-bind="attrs" v-on="on">
                <span>{{ transformVal }}</span>
                <span>
                  {{ view.type == "IPFS_STORAGE" ? "* 1 mo" : "" }}
                </span>
              </div>
            </template>
            <div style="line-height: normal" class="py-2">
              The estimated resources usable with the current LAND balance.
            </div>
          </v-tooltip>
          <v-tooltip
            top
            max-width="300"
            nudge-top="5"
            v-if="view.type == 'IPFS_STORAGE'"
          >
            <template v-slot:activator="{ on, attrs }">
              <img
                class="ml-1"
                width="16"
                v-bind="attrs"
                v-on="on"
                src="/img/svg/overview/help.svg"
                alt=""
              />
            </template>
            <div style="line-height: normal" class="py-2">
              The computation method for IPFS consumption is Time * Space. This
              value is only an estimate of the storage that LAND balance can
              consume in one month. The final charge will still be based on the
              actual storage used
            </div>
          </v-tooltip>
        </div>

        <div class="resource-size d-flex al-end">
          <div class="consume-resource">
            <span class="consume-used fw-b">{{ curResource.used.num }}</span>
            <span class="fz-12" style="margin-left: 2px">{{
              curResource.used.unit
            }}</span>
          </div>
          <div class="sparator">/</div>
          <div class="total-resource fz-12">{{ curResource.total }}</div>
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
import { mapGetters } from "vuex";
export default {
  props: {
    view: {
      type: Object,
      required: true,
    },
    transformData: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["balance"]),
    curResource() {
      let obj = {
        total: this.$utils.getFileSize(this.view.total),
        used: this.$utils.getFileSize(this.view.used, true),
      };
      switch (this.view.type) {
        case "IPFS_STORAGE":
          return {
            name: "IPFS",
            img: "/img/svg/overview/ipfs-icon.svg",
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
            img: "/img/svg/overview/rpc.svg",
            total: this.$utils.getNumCount(this.view.total) + "CUs",
            used: {
              num: this.$utils.getNumCount(this.view.used, true).num,
              unit: this.$utils.getNumCount(this.view.used, true).unit + "CUs",
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
      if (this.transformData && this.transformData.value) {
        total = total + this.transformData.value.toNumber();
      }
      return (this.view.used / total) * (100).toFixed(0);
    },
    transformVal() {
      if (this.transformData && this.transformData.transformVal) {
        return "+" + this.transformData.transformVal;
      }
      return "";
    },
    showConversionResource() {
      return this.balance.land > 0;
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
    cursor: help;
  }

  .consume-resource {
    line-height: 24px;
    .consume-used {
      font-family: "DIN Alternate";
      font-size: 24px;
    }
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

.v-tooltip__content {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
}
// .v-tooltip__content::after {
//   display: block;
//   content: "";
//   position: absolute;
//   left: 50%;
//   transform: translateX(-50%);
//   bottom: -20px;
//   // border: 10px solid transparent;
//   // border-top-color: rgba(0, 0, 0, 0.9);
// }
</style>
