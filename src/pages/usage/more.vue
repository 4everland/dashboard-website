<style lang="scss">
.usage-more {
  .label {
    min-width: 100px;
    margin-top: 6px;
  }
}
</style>

<template>
  <div class="usage-more">
    <div
      class="mb-5 bdrs-10 d-flex lh-1"
      :class="form[it.key] > 0 ? 'bd-1 bg-hover-f8a' : 'bd-1n'"
      style="padding: 32px 40px"
      v-for="(it, i) in list"
      :key="i"
    >
      <label class="label fz-15 ta-r mr-3">{{ it.label }}:</label>
      <div class="flex-1" style="max-width: 700px">
        <div class="al-c">
          <usage-input
            v-model="form[it.key]"
            :min="0"
            :max="10000"
            :step="100"
          />
          <span class="ml-3 fz-14">{{ it.unit }}</span>
          <div class="ml-5">
            <v-btn
              @click="$set(form, it.key, txt)"
              class="mr-3 scale-9 tr-origin-0 op-7"
              outlined
              rounded
              color="primary"
              x-small
              v-for="txt in [200, 500, 1000]"
              :key="txt"
              >{{ txt }}</v-btn
            >
          </div>
        </div>
        <div class="" v-if="it.key == 'ipfs'">
          <ipfs-time />
        </div>
      </div>
    </div>
    <div class="mt-8 d-flex pt-4 bdt-1 bg-white pos-s btm-0">
      <div class="ml-auto mr-8 bg-f8a bdrs-8 pa-3 pl-5 pr-5 d-flex al-c">
        <span class="fz-18">Total:</span>
        <span class="red-1 ml-2 lh-1">
          <b
            class="fz-20"
            v-html="totalPrice.replace(/\.(\d+)/, `<b class='fz-15'>.$1</b>`)"
          ></b>
        </span>
        <span class="mt-1 gray-6 ml-2 fz-14">USD</span>
        <usage-preview :previewList="previewList" :list="list" />
        <v-btn
          color="primary"
          rounded
          class="ml-5"
          min-width="120"
          :disabled="totalPrice <= 0"
          @click="onPreview"
          >Preview</v-btn
        >
      </div>
    </div>

    <v-dialog v-model="showOrder" max-width="500">
      <e-dialog-close @click="showOrder = false" />
      <usage-order :list="previewList" :total="totalPrice" />
    </v-dialog>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      priceInfo: {},
      usageInfo: {},
      form: {},
      showOrder: false,
    };
  },
  computed: {
    list() {
      const info = this.priceInfo;
      return [
        {
          label: "Bandwidth",
          desc: "（Need to enter an integer multiple of 100.）",
          key: "bandwidth",
          unit: "GB",
          unitPrice: info.trafficPrice || 0,
        },
        {
          label: "Storage IPFS",
          key: "ipfs",
          unit: "GB",
          unitPrice: info.ipfsStoragePrice || 0,
        },
        {
          label: "Storage AR",
          key: "ar",
          unit: "MB",
          unitPrice: info.arStoragePrice || 0,
        },
        {
          label: "Build Minutes",
          key: "buildMinutes",
          unit: "Minutes",
          unitPrice: info.buildTimePrice || 0,
        },
      ];
    },
    previewList() {
      return this.list
        .map((it) => {
          const value = this.form[it.key];
          return {
            label: it.label,
            value,
            price: (value * it.unitPrice) / 100,
            unit: it.unit,
            until: "Until used up",
          };
        })
        .filter((it) => it.value > 0);
    },
    totalPrice() {
      return this.previewList
        .reduce((a, b) => {
          let price = b.price;
          // if()
          return a + price;
        }, 0)
        .toFixed(6)
        .replace(/0+$/, "")
        .replace(/\.$/, "");
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
    async getInfo() {
      try {
        this.$loading();
        const { data } = await this.$http.get("$v3/common/resource/price");
        for (const key in data) {
          data[key] = data[key] / 10e18;
        }
        console.log(data);
        this.priceInfo = data;

        const { data: usageInfo } = await this.$http.get(`$v3/usage`);
        this.usageInfo = usageInfo;
        this.$loading.close();
      } catch (error) {
        console.log(error);
        this.$confirm(error.message, {
          confirmText: "Try Again",
        })
          .then(() => {
            this.getInfo();
          })
          .catch(() => {
            this.$router.push("/usage/info");
          });
      }
    },
    onPreview() {
      if (!this.connectAddr) {
        this.showConnect();
        return;
      }
      this.showOrder = true;
    },
  },
};
</script>