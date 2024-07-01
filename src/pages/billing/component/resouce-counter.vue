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
          <v-tab-item class="px-4 pt-4 pb-4" style="height: 100%">
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
                <div class="flex-1 pa-4">
                  {{ item.unitPrice }} {{ item.unit }}
                </div>
                <div class="flex-1 pa-4">
                  <span>
                    {{
                      ((inputVal * 1e6) / item.unitPrice).toFixed(
                        item.resourceName == "RPC Requests" ? 0 : 2
                      )
                    }}</span
                  >

                  {{ item.expectedUnit }}
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item style="height: 100%">
            <div class="h-flex space-btw" style="height: 100%">
              <div
                class="pa-4 d-flex flex-wrap al-end"
                style="overflow: auto; gap: 0 10px"
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

              <div class="price-calculator al-c space-btw">
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
import { formatEther, parseEther } from "ethers/lib/utils";
export default {
  components: {
    billingTabs,
    resourceRowCpm,
  },
  props: {
    inputVal: {
      default: 0,
    },
  },
  data() {
    return {
      tabs: ["Resource", "Calculator"],

      resourceTagsConfig: [
        {
          name: "IPFS Storage",
          tags: [
            {
              text: "30 GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "80 GB",
              value: 80 * Math.pow(1024, 3),
            },
            {
              text: "500 GB",
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
              text: "180 Days",
              value: 180 * 86400,
            },
            {
              text: "365 Days",
              value: 365 * 86400,
            },
            {
              text: "1096 Days",
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
              text: "500 MB",
              value: 500 * Math.pow(1024, 2),
            },
            {
              text: "30 GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "100 GB",
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
          name: "Bandwidth",
          tags: [
            {
              text: "500 MB",
              value: 500 * Math.pow(1024, 2),
            },
            {
              text: "30 GB",
              value: 30 * Math.pow(1024, 3),
            },
            {
              text: "100 GB",
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
          name: "Build Time",
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
        {
          name: "RPC Request",
          tags: [
            { text: "10K CUs", value: 1e4 },
            {
              text: "500K CUs",
              value: 5e5,
            },
            {
              text: "1M CUs",
              value: 1e6,
            },
          ],
          unit: 1e3,
          items: [
            {
              text: "K CUs",
              value: 1e3,
            },
            { text: "M CUs", value: 1e6 },
          ],
        },
      ],
      ipfsPrice: BigNumber.from("0"),
      arPrice: BigNumber.from("0"),
      bandwidthPrice: BigNumber.from("0"),
      buildMinPrice: BigNumber.from("0"),
      recordIpfsSize: BigNumber.from("0"),
      recordIpfsSeconds: BigNumber.from("0"),
      rpcPrice: BigNumber.from("0"),
    };
  },
  computed: {
    ...mapState({
      ipfsUnitPrice: (s) => s.moduleResource.ipfsUnitPrice,
      arUnitPrice: (s) => s.moduleResource.arUnitPrice,
      bandwidthUnitPrice: (s) => s.moduleResource.bandwidthUnitPrice,
      buildMinUnitPrice: (s) => s.moduleResource.buildMinUnitPrice,
      rpcUnitPrice: (s) => s.moduleResource.rpcUnitPrice,
      aiRpcUnitPrice: (s) => s.moduleResource.aiRpcUnitPrice,
    }),

    totalPrice() {
      return this.ipfsPrice
        .add(this.arPrice)
        .add(this.bandwidthPrice)
        .add(this.rpcPrice)
        .add(this.buildMinPrice)
        .div(parseEther("1"));
    },

    resourcePriceList() {
      return [
        {
          resourceName: "IPFS Storage",
          unitPrice: Math.round(
            Number(
              formatEther(
                this.ipfsUnitPrice.mul(1024 * 1024 * 1024 * 86400 * 30)
              )
            )
          ),
          unit: "LAND/GB/Month",
          expectedUnit: "GB * 1 Month",
        },
        {
          resourceName: "Arweave",
          unitPrice: Math.round(
            Number(formatEther(this.arUnitPrice.mul(1024 * 1024 * 1024)))
          ),
          unit: "LAND/GB",
          expectedUnit: "GB",
        },
        {
          resourceName: "Bandwidth",
          // unitPrice: "20 GB/1000 LAND",
          unitPrice: Math.round(
            Number(formatEther(this.bandwidthUnitPrice.mul(1024 * 1024 * 1024)))
          ),
          unit: "LAND/GB",
          expectedUnit: "GB",
        },
        {
          resourceName: "Build Time",
          unitPrice: Math.round(
            Number(formatEther(this.buildMinUnitPrice.mul(60)))
          ),
          unit: "LAND/Minutes",
          expectedUnit: "Minutes",
        },
        {
          resourceName: "RPC Requests",
          unitPrice: Number(formatEther(this.rpcUnitPrice)),
          unit: "LAND/CU",
          expectedUnit: "CUs",
        },
        // {
        //   resourceName: "AI RPC",
        //   unitPrice: Number(formatEther(this.aiRpcUnitPrice)),
        //   unit: "LAND",
        //   expectedUnit: "LAND",
        // },
      ];
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
        case "Bandwidth":
          this.bandwidthPrice = BigNumber.from(payload.value.toString()).mul(
            this.bandwidthUnitPrice
          );
          break;
        case "Build Time":
          this.buildMinPrice = BigNumber.from(payload.value.toString()).mul(
            this.buildMinUnitPrice
          );
          break;
        case "RPC Request":
          this.rpcPrice = BigNumber.from(payload.value.toString()).mul(
            this.rpcUnitPrice
          );
          break;
        default:
          break;
      }
      // console.log(payload);
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
  padding: 9px 16px;
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
</style>
