<style lang="scss">
.e-tabs-2 {
  .v-tabs-slider-wrapper {
    padding: 0 15px;
  }
}
</style>

<template>
  <div>
    <e-right-opt-wrap>
      <v-btn to="/resource/pricing" outlined small>Pricing</v-btn>
    </e-right-opt-wrap>
    <v-skeleton-loader type="article" v-if="!usageInfo" />
    <template v-else>
      <div class="pos-s z-1" style="top: 60px" v-show="!noTabs">
        <v-tabs v-model="tabIdx" class="bdrs-6 shadow-2 e-tabs-2">
          <v-tab @click="onTab" v-for="(it, i) in list" :key="i">{{
            it.label
          }}</v-tab>
        </v-tabs>
      </div>
      <v-card
        class="mt-5 shadow-2 trans-200 shadow-23"
        :class="{
          'shadow-3': i == chooseIdx,
        }"
        :ref="'card' + i"
        v-for="(it, i) in list"
        :key="i"
      >
        <div class="pa-5">
          <div class="al-c">
            <img :src="`/img/svg/overview/${it.icon}`" width="16" />
            <span class="ml-3 fz-15">{{ it.label }}</span>
          </div>
          <div class="mt-6 al-c">
            <e-kv class="flex-1" valueClass="al-c" :label="it.label + ':'">
              <span>{{ it.percTxt }}</span>
              <e-tooltip top v-if="it.expireLabel">
                <v-icon slot="ref" color="#999" size="13" class="ml-2"
                  >mdi-alert-circle</v-icon
                >
                <div>
                  <div>Including free {{ it.freeTxt }}.</div>
                  <div>
                    {{ it.expireLabel }}:
                    {{
                      it.expireTime
                        ? new Date(it.expireTime * 1e3).format("date")
                        : "Permanent"
                    }}.
                  </div>
                </div>
              </e-tooltip>
              <span v-else-if="it.freeTxt" class="gray fz-12 ml-2"
                >(Including free {{ it.freeTxt }})</span
              >
            </e-kv>
            <e-kv
              v-if="!it.expireLabel"
              class="flex-1"
              label="Expiration date:"
            >
              <span v-if="it.expireTime">{{
                new Date(it.expireTime * 1e3).format("date")
              }}</span>
            </e-kv>
          </div>
          <div class="mt-6 al-c" v-if="it.key == 'ipfs'">
            <e-radio-btn
              :options="['Expansion', 'Renewal']"
              v-model="ipfsIdx"
            ></e-radio-btn>
            <e-tooltip top>
              <v-icon slot="ref" color="#999" size="14" class="ml-3"
                >mdi-help-circle</v-icon
              >
              <div>
                {{
                  ipfsIdx == 0
                    ? "Expand storage capacity without changing the expiration date. "
                    : "Extend expiration date without changing the storage capacity."
                }}
              </div>
            </e-tooltip>
          </div>
          <div class="mt-6" v-show="it.key == 'ipfs' && ipfsIdx == 1">
            <e-kv label="Pick plan:" center>
              <pay-choose-num
                :options="it.monOpts"
                unit="Mth"
                @input="onIpfsTime"
              ></pay-choose-num>
            </e-kv>
          </div>
          <div class="mt-6" v-show="it.key != 'ipfs' || ipfsIdx == 0">
            <e-kv label="Pick plan:" center>
              <pay-choose-num
                @input="onChooseNum($event, it)"
                :options="it.opts"
                :unit="it.unit"
              ></pay-choose-num>
            </e-kv>
          </div>
          <div class="mt-6 al-c">
            <e-kv label="Picked:" center class="flex-1">
              <span class="color-1 fz-18"> {{ it.selectTxt || "-" }} </span>
            </e-kv>
            <e-kv
              label="Expiration date:"
              center
              class="flex-1"
              v-if="it.key == 'ipfs'"
            >
              <span class="color-1 fz-18">
                {{
                  !form.ipfs && !ipfsTime
                    ? "-"
                    : new Date(it.expireTime * 1e3 + ipfsTime * 1e3).format(
                        "date"
                      )
                }}
              </span>
            </e-kv>
          </div>
        </div>
      </v-card>
      <div class="pa-3 mt-3 gray fz-14">
        <p>Tips：</p>
        <p>
          1. Please Note: The price calculator provides a reference price, but
          the specific deduction depends on the order result.
        </p>
        <p>
          2. In pay-per-use billing mode, the amount shown in the price
          calculator is rounded to two decimal places if any, and the third
          place is rounded off. If the rounded amount is less than 0.01USDC, it
          will be displayed as 0.01USDC.
        </p>
      </div>
      <div style="height: 50vh" v-if="!noTabs"></div>

      <pay-confirm
        label="Configuration costs"
        :price="totalPrice"
        @submit="onSubmit"
        :loading="feeLoading"
      >
        <usage-preview :previewList="previewList" :list="list" />
      </pay-confirm>
    </template>
  </div>
</template>

<script>
import mixin from "@/components/pay/mixin";
import { mapState } from "vuex";
const Mb = Math.pow(1024, 2);
const Gb = Math.pow(1024, 3);

const ResourceType = {
  BuildingTime: 1,
  Bandwidth: 2,
  ARStorage: 3,
  IPFSStorage: 4,
};

export default {
  mixins: [mixin],
  data() {
    return {
      tabIdx: 0,
      chooseIdx: -1,
      priceInfo: {},
      usageInfo: null,
      form: {},
      ipfsIdx: 0,
      feeForm: {},
      chooseMap: {},
      feeLoading: false,
      scrollMap: [],
      ipfsTime: 0,
    };
  },
  computed: {
    ...mapState({
      noTabs: (s) => s.clientHeight > 1300,
      scrollTop: (s) => s.scrollTop,
    }),
    list() {
      const price = this.priceInfo;
      const info = this.usageInfo;
      if (!info) return [];
      const chooseMap = this.chooseMap;
      let ipfsVal = chooseMap["ipfs"] || "";
      if (chooseMap.ipfsRenewal) {
        ipfsVal += (ipfsVal ? " , " : "") + chooseMap.ipfsRenewal;
      }
      return [
        {
          label: "Bandwidth",
          icon: "bandwidth.svg",
          id: ResourceType.Bandwidth,
          key: "bandwidth",
          opts: [100 * Gb, 200 * Gb, 300 * Gb],
          unit: "GB",
          selected: chooseMap["bandwidth"],
          unitPrice: price.trafficUnitPrice || 0,
          unitPricePer: price.trafficUnitPricePer + "U / 100GB",
          expireTime: info.freeBandwidthExpired,
          expireLabel: "Free expiration date",
          ...this.getPerc(
            info.usedFreeBandwidth + info.usedPurchasedBandwidth,
            info.freeBandwidth + info.purchasedBandwidth,
            "GB",
            info.freeBandwidth,
            this.form.bandwidth
          ),
        },
        {
          label: "Build Minutes",
          icon: "buildtime.svg",
          id: ResourceType.BuildingTime,
          key: "buildMinutes",
          opts: [500, 1000, 1500],
          unit: "Min",
          selected: chooseMap["buildMinutes"],
          unitPrice: price.buildTimeUnitPrice || 0,
          unitPricePer: price.buildTimeUnitPricePer + "U / 100Min",
          expireTime: info.freeBuildMinutesExpired,
          expireLabel: "Free expiration date",
          ...this.getPerc(
            parseInt(
              info.usedFreeBuildMinutes + info.usedPurchasedBuildMinutes
            ),
            info.freeBuildMinutes + info.purchasedBuildMinutes,
            "Minutes",
            info.freeBuildMinutes,
            this.form.buildMinutes
          ),
        },
        {
          label: "IPFS Storage",
          icon: "ipfs.svg",
          id: ResourceType.IPFSStorage,
          key: "ipfs",
          opts: [100 * Gb, 200 * Gb, 300 * Gb],
          monOpts: [1, 3, 6],
          unit: "GB",
          selected: ipfsVal,
          unitPrice: price.ipfsStorageUnitPrice || 0,
          unitPricePer: price.ipfsStorageUnitPricePer + "U / 100GB / Mth",
          expireTime: info.ipfsStorageExpired,
          ...this.getPerc(
            info.usedIpfsStorage,
            info.ipfsStorage,
            "GB",
            info.ipfsDefaultStorage,
            this.form.ipfs
          ),
        },
        {
          label: "Arweave",
          icon: "ar.svg",
          id: ResourceType.ARStorage,
          key: "ar",
          opts: [100 * Mb, 200 * Mb, 300 * Mb],
          unit: "GB",
          selected: chooseMap["ar"],
          unitPrice: price.arStorageUnitPrice || 0,
          unitPricePer: price.arStorageUnitPricePer + "U / 100MB",
          expireLabel: "Expiration date",
          ...this.getPerc(
            info.usedArStorage,
            info.arStorage,
            "GB",
            info.arDefaultStorage,
            this.form.ar
          ),
        },
      ];
    },
    minPrice() {
      return this.isPolygon ? 0.01 : 20;
    },
    previewList() {
      // console.log(this.feeForm);
      const list = [];
      for (const id in this.feeForm) {
        const isIpfs = id == ResourceType.IPFSStorage;
        const fee = this.feeForm[id];
        const item = this.list.find((it) => it.id == id);
        const num = this.form[item.key] || 0;
        let price = num * item.unitPrice;
        if (fee) price = this.getFee(fee);
        if (!price) continue;
        const row = {
          type: isIpfs ? "Expansion" : "Purchase",
          label: item.label,
          value: this.chooseMap[item.key],
          price,
        };
        let renewPrice = 0;
        if (isIpfs) {
          renewPrice = this.getFee(fee[1]);
          if (renewPrice) {
            row.price -= renewPrice;
          }
        }
        if (row.price) list.push(row);
        if (renewPrice) {
          list.push({
            ...row,
            type: "Renewal",
            value: this.chooseMap.ipfsRenewal,
            price: renewPrice,
          });
        }
      }
      return list;
    },
    totalPrice() {
      let price = this.previewList.reduce((a, b) => {
        let price = b.price;
        return a + price;
      }, 0);
      return this.$utils.cutFixed(price, 4);
    },
    ipfsExpired() {
      return this.usageInfo.ipfsExpired;
    },
  },
  watch: {
    scrollTop(val) {
      let toIdx = 0;
      for (const i in this.scrollMap) {
        const top = this.scrollMap[i] - 50;
        if (val >= top) toIdx = i;
      }
      this.tabIdx = toIdx * 1;
    },
  },
  mounted() {
    const form = {};
    this.list.forEach((it) => {
      form[it.key] = 0;
    });
    this.form = form;
    this.getInfo();
  },
  methods: {
    setChooseMap(key, val) {
      this.chooseMap = {
        ...this.chooseMap,
        [key]: val,
      };
    },
    onIpfsTime(e) {
      this.setChooseMap("ipfsRenewal", e.text);
      this.ipfsTime = e.val;
      this.getPrice(ResourceType.IPFSStorage, this.form.ipfs);
    },
    onChooseNum(e, it) {
      this.setChooseMap(it.key, e.text);
      this.form[it.key] = e.val;
      this.getPrice(it.id, e.val);
    },
    onSubmit() {
      if (this.totalPrice < 0.01) {
        return this.$alert(
          `Configuration costs cannot be less than 0.01 USDC.`
        );
      }
      const form = {};
      for (const key in this.feeForm) {
        const val = this.feeForm[key];
        if (!val) continue;
        form[key] = Array.isArray(val) ? val.map((it) => it._hex) : val._hex;
      }
      const orderInfo = {
        totalPrice: this.totalPrice,
        list: this.previewList,
        feeForm: form,
      };
      localStorage.orderInfo = JSON.stringify(orderInfo);
      this.$setState({
        orderInfo,
      });
      this.$navTo("/resource/subscribe/order");
    },
    onTab() {
      this.$nextTick(() => {
        const top = this.scrollMap[this.tabIdx] || 0;
        window.scrollTo(0, top);
      });
    },
    getPerc(used, total, unit = "GB", free = 0, buy) {
      const getSize = this.$utils.getFileSize;
      let percTxt = "";
      let freeTxt = "";
      let selectTxt = "";
      // if (total == free) free = 0;
      if (unit == "GB") {
        used = getSize(used);
        const totalObj = getSize(total);
        percTxt = `${used} / ${totalObj}`;
        if (free) freeTxt = getSize(free);
        if (buy) selectTxt = used + " / " + getSize(buy + total);
      } else {
        percTxt = `${used} Min / ${total} Min`;
        if (free) freeTxt = free + " Min";
        if (buy) {
          buy = parseInt(buy / 60);
          selectTxt = `${used} Min / ${buy + total} Min`;
        }
      }
      let perc = (used * 100) / total;
      perc = this.$utils.cutFixed(perc, 2);
      return {
        perc,
        percTxt,
        freeTxt,
        selectTxt,
      };
    },
    getCardTop() {
      this.$nextTick(() => {
        const arr = [];
        for (const i in this.list) {
          const el = this.$refs["card" + i][0].$el;
          arr[i] = el.offsetTop - 60;
        }
        this.scrollMap = arr;
      });
    },
    async getInfo() {
      try {
        const { data } = await this.$http.get("$v3/common/resource/price");
        for (const key in data) {
          let m = key == "buildTimeUnitPrice" ? 60 : Math.pow(1024, 3);
          if (key == "arStorageUnitPrice") m = Math.pow(1024, 2);
          if (/ipfs/i.test(key)) m *= 86400 * 30;
          data[key] = data[key] / 1e18;
          data[key + "Per"] = this.$utils.cutFixed(data[key] * m * 100, 4);
        }
        this.priceInfo = data;

        const { data: usageInfo } = await this.$http.get(`$v3/usage`);
        usageInfo.purchasedBuildMinutes = parseInt(
          usageInfo.purchasedBuildMinutes
        );
        this.usageInfo = usageInfo;
        this.getCardTop();
        const { i, t } = this.$route.query;
        this.ipfsIdx = t == 1 ? 1 : 0;
        if (i > -1) {
          this.tabIdx = i * 1;
          this.onTab();
          this.chooseIdx = this.tabIdx;
          setTimeout(() => {
            this.chooseIdx = -1;
          }, 500);
        }
      } catch (error) {
        this.$confirm(error.message, {
          confirmText: "Try Again",
        })
          .then(() => {
            this.getInfo();
          })
          .catch(() => {
            this.$router.push("/resource");
          });
      }
    },
    async getPrice(resId, val) {
      console.log("get price", resId);
      if (!this.curContract) {
        this.showConnect();
        return;
      }
      let fee = 0;
      if (!val && (resId != ResourceType.IPFSStorage || !this.ipfsTime)) {
        this.feeForm[resId] = 0;
        return;
      }
      try {
        let amount = val;
        this.feeLoading = true;
        if (resId == ResourceType.IPFSStorage) {
          // console.log("ipfs", amount, this.ipfsTime);
          fee = await this.curContract.DstChainPayment.ipfsAlloctionsFee(
            this.providerAddr,
            this.uuid,
            amount,
            this.ipfsTime
          );
          fee = [fee[0], fee[1]];
        } else {
          fee = await this.curContract.DstChainPayment.getValueOf(
            this.providerAddr,
            resId,
            amount
          );
        }
        this.feeForm = {
          ...this.feeForm,
          [resId]: fee,
        };
        fee = this.getFee(fee);
        console.log("price", fee);
      } catch (error) {
        console.log("get price error");
        this.onErr(error, true)
          .then(() => {
            this.getPrice(resId, val);
          })
          .catch(() => {
            this.$router.replace("/resource");
          });
      }
      this.feeLoading = false;
    },
    getFee(fee) {
      if (!fee) return 0;
      return (
        this.formatToken(fee.length == 2 ? fee[0].add(fee[1]) : fee, 4) * 1
      );
    },
  },
};
</script>