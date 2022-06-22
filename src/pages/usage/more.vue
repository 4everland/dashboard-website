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
            @input="getPrice(it, $event)"
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
          :loading="feeLoading"
          @click="onPreview"
          >Preview</v-btn
        >
      </div>
    </div>

    <v-dialog v-model="showOrder" max-width="500">
      <e-dialog-close @click="showOrder = false" />
      <usage-order :list="previewList" :total="totalPrice">
        <v-btn
          color="primary"
          rounded
          block
          depressed
          @click="onApprove"
          v-if="!isApproved"
          >{{ isApproved ? "Approved" : "Approve" }}</v-btn
        >
        <v-btn
          v-else
          color="primary"
          rounded
          block
          class="mt-4"
          @click="onSubmit"
          >Submit</v-btn
        >
      </usage-order>
    </v-dialog>
  </div>
</template>

<script>
import mixin from "./mixin";

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
      priceInfo: {},
      usageInfo: {},
      form: {},
      showOrder: false,
      feeForm: {},
      feeLoading: false,
    };
  },
  computed: {
    list() {
      const info = this.priceInfo;
      return [
        {
          label: "Bandwidth",
          id: ResourceType.Bandwidth,
          desc: "（Need to enter an integer multiple of 100.）",
          key: "bandwidth",
          unit: "GB",
          unitPrice: info.trafficUnitPrice || 0,
        },
        {
          label: "Storage IPFS",
          id: ResourceType.IPFSStorage,
          key: "ipfs",
          unit: "GB",
          unitPrice: info.ipfsStorageUnitPrice || 0,
        },
        {
          label: "Storage AR",
          id: ResourceType.ARStorage,
          key: "ar",
          unit: "MB",
          unitPrice: info.arStorageUnitPrice || 0,
        },
        {
          label: "Build Minutes",
          id: ResourceType.BuildingTime,
          key: "buildMinutes",
          unit: "Minutes",
          unitPrice: info.buildTimeUnitPrice || 0,
        },
      ];
    },
    previewList() {
      return this.list
        .map((it) => {
          const value = this.form[it.key] || 0;
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
        .toFixed(4)
        .replace(/0+$/, "")
        .replace(/\.$/, "");
    },
  },
  mounted() {
    const form = {
      ipfsMon: 1,
    };
    this.list.forEach((it) => {
      form[it.key] = 0;
    });
    this.form = form;
    this.getInfo();
  },
  methods: {
    async getPrice(it, val) {
      let fee = 0;
      this.feeForm[it.id] = 0;
      if (!val) return;
      try {
        if (!this.curContract) {
          this.showConnect();
          return;
        }
        console.log("get price", it, val);
        let base = Math.pow(1024, it.id == ResourceType.ARStorage ? 2 : 3);
        if (it.id == ResourceType.BuildingTime) {
          base = 60;
        }
        let amount = base * val;
        this.feeLoading = true;
        if (it.id == ResourceType.IPFSStorage) {
          fee = await this.curContract.DstChainPayment.ipfsAlloctionsFee(
            this.providerAddr,
            this.uuid,
            amount,
            86400 * 30 * this.form.ipfsMon
          );
          fee = [fee[0], fee[1]];
        } else {
          fee = await this.curContract.DstChainPayment.getValueOf(
            this.providerAddr,
            it.id,
            amount
          );
        }
        this.feeForm[it.id] = fee; // for submit
        fee = this.formatToken(fee.length == 2 ? fee[0].add(fee[1]) : fee, 4);
        console.log(it.key, fee);
      } catch (error) {
        this.onErr(error);
      }
      this.feeLoading = false;
    },
    async getInfo() {
      try {
        this.$loading();
        const { data } = await this.$http.get("$v3/common/resource/price");
        for (const key in data) {
          let m = key == "buildTimeUnitPrice" ? 60 : Math.pow(1024, 3);
          if (key == "arStorageUnitPrice") m = Math.pow(1024, 2);
          if (/ipfs/i.test(key)) m *= 86400 * 30;
          data[key] = (data[key] * m * 100) / 1e18;
        }
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
    async onSubmit() {
      try {
        const form = this.feeForm;
        const payloads = [];
        let totalFee = null;
        for (const key in form) {
          const val = form[key];
          if (!val) continue;
          const values = key == ResourceType.IPFSStorage ? val : [val];
          for (const fee of values) {
            totalFee = totalFee ? totalFee.add(fee) : fee;
            console.log(key, totalFee);
          }
          payloads.push({
            resourceType: key,
            values,
          });
        }
        if (!totalFee) {
          throw new Error("No Fee");
        }

        console.log(payloads);
        this.$loading();
        await this.checkAccount();
        const nonce = Math.floor(Date.now() / 1000);
        const params = [this.providerAddr, nonce, this.uuid, payloads];
        if (!this.isPolygon) {
          totalFee = totalFee.div(1e12);
          console.log("totalFee", totalFee.toString());
          const response = await this.client.estimate(
            this.connectAddr,
            totalFee.toString()
          );
          const maxSlippage = response.getMaxSlippage();
          console.log("response", response.toObject(), maxSlippage);
          const feeMsg = await this.curContract[this.chainKey].calcFee(
            ...params
          );
          console.log("feeMsg", feeMsg.toString());
          params.push(maxSlippage);
          params.push({
            value: feeMsg,
          });
        }
        console.log("pay", params, this.curContract[this.chainKey]);
        let target = this.curContract[this.chainKey];
        let tx;
        if (this.isPolygon) {
          tx = await target.pay(params);
        } else {
          tx = await target.pay(...params);
        }
        console.log("tx", tx);
        const receipt = await tx.wait(1);
        console.log("receipt", receipt);
        this.$loading.close();
        this.showOrder = false;
        this.$router.replace("/usage/billing");
      } catch (error) {
        this.onErr(error);
      }
    },
  },
};
</script>