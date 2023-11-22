<template>
  <div class="resource-counter-content" ref="refIpt">
    <billing-tabs
      :tabs="tabs"
      :noActive="true"
      class="mt-4 pos-r"
      style="height: 100%"
    >
      <template #default="{ tab }">
        <v-tabs-items
          :value="tab"
          class="pt-0"
          style="height: 100%; box-sizing: border-box"
        >
          <v-tab-item class="px-4" style="height: 100%">
            <div class="table-header d-flex">
              <div class="text-left flex-1"></div>
              <div class="text-left flex-1">Unit Price</div>
              <div class="text-left flex-1">Expected Value</div>
            </div>
            <div class="body">
              <div
                v-for="item in resourcePriceList"
                :key="item.resourceName"
                class="flex-1 d-flex fz-14 table-body-item"
              >
                <div class="flex-1 pa-4 fw-b">{{ item.resourceName }}</div>
                <div class="flex-1 pa-4">{{ item.unitPrice }}</div>
                <div class="flex-1 pa-4">{{ item.value }}</div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item style="height: 100%">
            <div class="h-flex space-btw" style="height: 100%">
              <div
                class="pa-4 d-flex flex-wrap al-end"
                style="overflow: auto; gap: 10px"
              >
                <resource-row-cpm
                  v-for="item in resourceTagsConfig"
                  :key="item.name"
                  :tags="item.tags"
                  :unit="item.unit"
                  :items="item.items"
                  :name="item.name"
                  @countPrice="countPrice"
                ></resource-row-cpm>
              </div>

              <div class="price-calculator pa-4 al-c space-btw">
                <div>
                  <div class="fw-b">Estimated requirement:</div>
                  <div>
                    <span class="price fw-b mr-1">{{
                      totalPrice.toString()
                    }}</span>
                    <span class="unit fz-14">LAND</span>
                  </div>
                </div>
                <div class="input-btn cursor-p fw-b" @click="handleInputLand">
                  Input
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </billing-tabs>
  </div>
</template>

<script>
import { BigNumber } from "ethers";
import { mapState } from "vuex";
import billingTabs from "./billing-tabs.vue";
import resourceRowCpm from "./resource-row-cpm.vue";
import { parseEther } from "ethers/lib/utils";
export default {
  components: {
    billingTabs,
    resourceRowCpm,
  },
  data() {
    return {
      tabs: ["Resource", "calculator"],
      resourcePriceList: [
        {
          resourceName: "IPFS Storage",
          unitPrice: "2000 MD/1000 LAND",
          value: "2500000 MD",
        },
        {
          resourceName: "Arweave",
          unitPrice: "1 GB/1000 LAND",
          value: "300 GB",
        },
        {
          resourceName: "BindWidth",
          unitPrice: "20 GB/1000 LAND",
          value: "502 GB",
        },
        {
          resourceName: "Build Minutes",
          unitPrice: "500 Mins/1000 LAND",
          value: "500000 Mins",
        },
        {
          resourceName: "RPC Requests",
          unitPrice: "5 CUs/LAND",
          value: "500000 CUs",
        },
      ],
      resourceTagsConfig: [
        {
          name: "IPFS Storage",
          tags: [
            {
              text: "30GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "80GB",
              value: 80 * Math.pow(1024, 3),
            },
            {
              text: "500GB",
              value: 500 * Math.pow(1024, 3),
            },
          ],
          unit: Math.pow(1024, 3),
          items: [
            {
              text: "MB",
              value: Math.pow(1024, 2),
            },
            { text: "GB", value: Math.pow(1024, 3) },
            {
              text: "TB",
              value: Math.pow(1024, 4),
            },
          ],
        },
        {
          name: "IPFS Storage Days",
          tags: [
            {
              text: "180Days",
              value: 180 * 86400,
            },
            {
              text: "365Days",
              value: 365 * 86400,
            },
            {
              text: "1096Days",
              value: 1096 * 86400,
            },
          ],
          unit: 86400,
          items: [{ text: "Days" }],
        },
        {
          name: "Arweave",
          tags: [
            {
              text: "500MB",
              value: 500 * Math.pow(1024, 2),
            },
            {
              text: "30GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "100GB",
              value: 100 * Math.pow(1024, 3),
            },
          ],
          unit: Math.pow(1024, 3),
          items: [
            {
              text: "MB",
              value: Math.pow(1024, 2),
            },
            { text: "GB", value: Math.pow(1024, 3) },
            {
              text: "TB",
              value: Math.pow(1024, 4),
            },
          ],
        },
        {
          name: "BindWidth",
          tags: [
            {
              text: "500MB",
              value: 500 * Math.pow(1024, 2),
            },
            {
              text: "30GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "100GB",
              value: 100 * Math.pow(1024, 3),
            },
          ],
          unit: Math.pow(1024, 3),
          items: [
            {
              text: "MB",
              value: Math.pow(1024, 2),
            },
            { text: "GB", value: Math.pow(1024, 3) },
            {
              text: "TB",
              value: Math.pow(1024, 4),
            },
          ],
        },
        {
          name: "Build Minutes",
          tags: [
            { text: "500 Min", value: 500 * 60 },
            {
              text: "1800 Min",
              value: 1800 * 60,
            },
            {
              text: "3600 Min",
              value: 3600 * 60,
            },
          ],
          unit: 60,
          items: [{ text: "Mins" }],
        },
      ],
      ipfsPrice: BigNumber.from("0"),
      arPrice: BigNumber.from("0"),
      bandwidthPrice: BigNumber.from("0"),
      buildMinPrice: BigNumber.from("0"),
      recordIpfsSize: BigNumber.from("0"),
      recordIpfsSeconds: BigNumber.from("0"),
    };
  },
  computed: {
    ...mapState({
      ipfsUnitPrice: (s) => s.moduleResource.ipfsUnitPrice,
      arUnitPrice: (s) => s.moduleResource.arUnitPrice,
      bandwidthUnitPrice: (s) => s.moduleResource.bandwidthUnitPrice,
      buildMinUnitPrice: (s) => s.moduleResource.buildMinUnitPrice,
      rpcUnitPrice: (s) => s.moduleResource.rpcUnitPrice,
    }),

    totalPrice() {
      return this.ipfsPrice
        .add(this.arPrice)
        .add(this.bandwidthPrice)
        .add(this.buildMinPrice)
        .div(parseEther("1"));
    },
  },
  created() {
    this.$store.dispatch("getPrice");
  },

  methods: {
    countPrice(payload) {
      switch (payload.type) {
        case "IPFS Storage":
          this.recordIpfsSize = BigNumber.from(payload.value.toString());
          this.ipfsPrice = this.recordIpfsSize
            .mul(this.recordIpfsSeconds)
            .mul(this.ipfsUnitPrice);
          break;
        case "IPFS Storage Days":
          this.recordIpfsSeconds = BigNumber.from(payload.value.toString());
          this.ipfsPrice = this.recordIpfsSize
            .mul(this.recordIpfsSeconds)
            .mul(this.ipfsUnitPrice);
          break;
        case "Arweave":
          this.arPrice = BigNumber.from(payload.value.toString()).mul(
            this.arUnitPrice
          );
          break;
        case "BindWidth":
          this.bandwidthPrice = BigNumber.from(payload.value.toString()).mul(
            this.bandwidthUnitPrice
          );
          break;
        case "Build Minutes":
          this.buildMinPrice = BigNumber.from(payload.value.toString()).mul(
            this.buildMinUnitPrice
          );
          break;
        default:
          break;
      }
      console.log(payload);
    },

    handleInputLand() {
      let estimatePrice = BigNumber.from("1");
      let fixNumber = BigNumber.from("0");
      const totalPrice = this.totalPrice.toString();
      if (totalPrice.length > 6) {
        if (Number(totalPrice.slice(-6)) > 0) {
          fixNumber = BigNumber.from("1");
        }
        estimatePrice = BigNumber.from(totalPrice).div(1e6).add(fixNumber);
      }

      this.$emit("estimateInput", estimatePrice.toString());

      this.showPop = false;
    },
  },
};
</script>

<style lang="scss" scoped>
:deep .v-tabs-items {
  border-radius: 8px !important;
}

.resource-counter-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  justify-content: space-between;
  background: #fff;
  :deep table {
    border-spacing: 0 16px !important;
  }
  :deep td {
    padding: 16px !important;
    margin: 10px 0 !important;
  }
}
.price-calculator {
  width: 100%;
  height: 88px;
  border-top: 1px solid #cbd5e1;
  border-radius: 0px 0px 8px 8px;
  box-sizing: border-box;
  background: #fff;
  .price {
    letter-spacing: 0.56px;
    font-family: "DIN Alternate";
    font-size: 28px;
  }
  .unit {
    color: #64748b;
  }
  .input-btn {
    padding: 11px 24px 10px 25px;

    color: #735ea1;
    border-radius: 4px;
    border: 1.5px solid #735ea1;
  }
}
.table-header {
  border-radius: 4px;
  > div {
    background: #f1f5f9;
    padding: 12px 16px;
    font-size: 14px;
    color: #64748b;
  }
}
.table-body-item {
  border-bottom: 1px solid #cbd5e1;
}
.table-body-item:last-of-type {
  border-bottom: none;
}
</style>
