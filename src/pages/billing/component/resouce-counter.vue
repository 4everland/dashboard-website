<template>
  <div class="resource-counter-container d-flex">
    <div class="resource-counter-content" v-show="showPop" ref="refIpt">
      <billing-tabs :tabs="tabs" :noActive="true" class="mt-4">
        <template #default="{ tab }">
          <v-tabs-items :value="tab" class="mt-4 pt-0">
            <v-tab-item class="px-4">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left"></th>
                      <th class="text-left">Unit Price</th>
                      <th class="text-left">Expected Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in resourcePriceList" :key="item.name">
                      <td>{{ item.resourceName }}</td>
                      <td>{{ item.unitPrice }}</td>
                      <td>{{ item.value }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
            <v-tab-item>
              <div class="px-4">
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

              <div class="price-calculator pa-4 mt-3 al-c space-btw">
                <div>
                  <div class="fw-b">Estimated requirement:</div>
                  <div>
                    <span class="price fw-b mr-1">{{
                      totalPrice.toString()
                    }}</span>
                    <span class="unit fz-14">LAND</span>
                  </div>
                </div>
                {{ arPrice.toString() }}
                <div class="input-btn cursor-p fw-b">Input</div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </template>
      </billing-tabs>
    </div>
    <div
      class="resource-tag ml-3 justify-center cursor-p al-c"
      @click="showPop = !showPop"
    >
      <span class="fw-b fz-14">Calculator</span>
    </div>
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
      showPop: false,
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
  mounted() {
    document.addEventListener("click", (e) => {
      if (e.target.contains(this.$refs.refIpt)) {
        this.showPop = false;
      }
    });
  },
  methods: {
    countPrice(payload) {
      console.log(payload.type);
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
  },
};
</script>

<style lang="scss" scoped>
:deep .v-tabs-items {
  border-radius: 8px !important;
}
.resource-counter-container {
  z-index: 100;
  position: absolute;
  right: 0;
  top: 5%;
}

.resource-counter-content {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  justify-content: space-between;
  border: 1px solid #cbd5e1;
  box-shadow: 0px 4px 8px 0px rgba(15, 23, 42, 0.25);
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
  border-radius: 0px 0px 8px 8px;
  background: #f3e8ff;
  .price {
    letter-spacing: 0.56px;
    font-family: "DIN Alternate";
    font-size: 28px;
  }
  .unit {
    color: #64748b;
  }
  .input-btn {
    padding: 15px 38px 14px 39px;
    color: #735ea1;
    border-radius: 4px;
    border: 1.5px solid #735ea1;
  }
}
.resource-tag {
  width: 40px;
  height: 123px;
  border-radius: 4px 0px 0px 4px;
  border: 1px solid #cbd5e1;
  border-right: none;
  background: linear-gradient(
      0deg,
      rgba(243, 232, 255, 0.25) 0%,
      rgba(243, 232, 255, 0.25) 100%
    ),
    #fff;
  span {
    transform: rotate(-90deg);
  }
}
</style>
