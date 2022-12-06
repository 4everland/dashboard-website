<template>
  <v-card>
    <div class="pa-5">
      <div class="al-c">
        <span class="gray-5">Balance</span>
        <e-tooltip top>
          <v-icon slot="ref" color="#999" size="14" class="ml-2"
            >mdi-help-circle</v-icon
          >
          <span
            >Query results and actual results may differ due to synchronization
            delay issue on the chain network.
          </span>
        </e-tooltip>
      </div>
      <div style="height: 190px">
        <v-skeleton-loader
          class="pt-4"
          type="article"
          v-if="!autoList.length || balance === null"
        ></v-skeleton-loader>
        <div class="pt-7" v-else>
          <div class="d-flex al-end lh-1">
            <span class="fz-30">{{ balance }}</span>
            <span class="gray-6 ml-3">USDC</span>
          </div>
          <div class="mt-6 al-c">
            <v-btn color="primary" to="/resource/subscribe">Purchase</v-btn>
            <v-btn color="primary" outlined class="ml-4" to="/resource/deposit"
              >Deposit</v-btn
            >
            <v-btn plain color="#444" class="ml-2" to="/resource/withdraw">
              Withdraw
            </v-btn>
            <span class="gray">|</span>
            <v-btn plain color="#444" to="/resource/bills">
              Billing Details
            </v-btn>
            <span class="gray">|</span>
            <v-btn plain color="#444" @click="showVoucher = true">
              Resource Airdrop
            </v-btn>
          </div>
          <div class="mt-9 pb-2 al-c hide-msg">
            <e-kv label="Auto-deduction:">
              <v-switch
                v-model="isAuto"
                @click.native.stop="getAutoList(true)"
              ></v-switch>
            </e-kv>
          </div>
        </div>
      </div>
    </div>

    <v-dialog max-width="600px" v-model="showAutoPop">
      <div class="pa-5">
        <h3>Tips</h3>
        <div class="gray-6 mt-3 pa-3 fz-14 bg-f7">
          The selective resource-related deduction allows you to choose which
          resources to deduct from your wallet based on your resource
          maintenance requirements.
        </div>
        <div class="pa-5" v-if="autoLoading">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </div>
        <div class="pa-5 mt-3" v-else>
          <div class="al-c mb-6" v-for="(it, i) in autoList" :key="i">
            <span
              class="fz-15"
              :class="{
                gray: !it.isOn,
              }"
              >{{ it.name }}</span
            >
            <div class="hide-msg ml-auto">
              <v-switch v-model="it.isOn" :loading="autoLoading"></v-switch>
            </div>
          </div>
        </div>
        <div class="ta-c">
          <v-btn outlined @click="showAutoPop = false">Cancel</v-btn>
          <v-btn
            color="primary"
            class="ml-5"
            :disabled="!isChanged"
            @click="onConfirmAuto"
            >Confirm</v-btn
          >
        </div>
      </div>
    </v-dialog>
    <v-dialog max-width="600px" v-model="showVoucher">
      <div class="pa-5">
        <h3>Redeem Voucher</h3>

        <div class="mt-8 pos-r">
          <span class="label fz-14">Resource Voucher</span>
          <v-text-field
            class="post-input"
            persistent-placeholder
            autofocus
            v-model="voucherCode"
            placeholder="Enter the resource voucher code"
          >
          </v-text-field>
          <span
            class="fz-14 bg-hover-f9 commit"
            :class="{ disabled: disabled }"
            @click="handleCommit"
          >
            Commit
          </span>
          <decode-status
            v-if="showDecode"
            :statusText="statusText"
            :status="validStatus"
            class="mb-6"
          >
            <v-expansion-panels
              class="mt-4"
              flat
              v-if="validStatus"
              v-model="openPanels"
            >
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <e-kv
                    min-width="110px"
                    :label="item.label"
                    v-for="item in validResult"
                    :key="item.label"
                    class="mt-3"
                  >
                    {{ item.value }}
                  </e-kv>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </decode-status>

          <div class="al-c justify-center mt-8">
            <v-btn outlined width="180" tile @click="showVoucher = false"
              >Cancel</v-btn
            >
            <v-btn
              color="primary"
              width="180"
              class="ml-6"
              tile
              :disabled="validStatus != 2"
              @click="handleClaim"
              :loading="claimLoading"
              >Claim</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      showAutoPop: false,
      autoMap: {},
      autoList: [],
      isAuto: true,
      autoLoading: true,
      balance: null,
      showVoucher: false,
      voucherCode: "",
      statusText: {
        1: "Checking availability...",
        2: "Available!",
        3: "Unavailable！This voucher has expired.",
      },
      validStatus: 1,
      openPanels: 1,
      validResult: [],
      disabled: false,
      showDecode: false,
      claimLoading: false,
    };
  },
  computed: {
    isChanged() {
      let res = false;
      for (const it of this.autoList) {
        if (it.isOn != this.autoMap[it.key]) res = true;
      }
      return res;
    },
  },
  mounted() {
    this.getBalance();
    this.getAutoList();
    // setTimeout(() => {
    //   this.validStatus = 2;
    // }, 5000);
  },
  methods: {
    async getBalance() {
      const {
        data: { balance },
      } = await this.$http.get("$v3/account/balance");
      this.balance = this.$utils.cutFixed(balance, 4);
    },
    async onConfirmAuto() {
      try {
        const allClose = !this.autoList.find((it) => it.isOn);
        if (allClose) {
          await this.$confirm(
            `If you disable the auto-deduction feature of your wallet balance then your product will be out of service when the limit of purchased resources has been reached.`
          );
        }
        this.$loading();
        const body = this.autoList.map((it) => {
          return {
            resourceType: it.type,
            enable: it.isOn ? 1 : 0,
          };
        });
        await this.$http.put("$v3/account/balance/decision", body);
        await this.getAutoList();
        this.$loading.close();
        this.showAutoPop = false;
      } catch (error) {
        //
      }
    },
    async getAutoList(isPop) {
      if (isPop) {
        this.showAutoPop = true;
        this.autoLoading = true;
      }
      try {
        const { data } = await this.$http.get("$v3/account/balance/decision");
        const nameMap = {
          ipfsStorage: ["IPFS Storage", "IPFS_STORAGE"],
          arStorage: ["AR Storage", "AR_STORAGE"],
          buildTime: ["Build minutes", "BUILD_TIME"],
          traffic: ["Bandwidth", "TRAFFIC"],
        };
        const list = [];
        let isAuto = false;
        for (const key in data) {
          const isOn = data[key];
          if (isOn) isAuto = true;
          const arr = nameMap[key];
          list.push({
            key,
            name: arr[0],
            type: arr[1],
            isOn,
          });
        }
        this.isAuto = isAuto;
        this.autoList = list;
        this.autoMap = data;
      } catch (error) {
        console.log(error);
      }
      this.autoLoading = false;
    },
    async handleCommit() {
      this.openPanels = 1;

      if (this.disabled) return;
      if (!this.voucherCode) return;
      try {
        this.showDecode = true;
        this.disabled = true;
        this.validStatus = 1;
        const { data } = await this.$http.get(
          `$resource/voucher/verify/${this.voucherCode}`,
          {
            noTip: 1,
          }
        );
        this.disabled = false;
        if (data.voucherType == 0)
          throw new Error(
            "Unavailable! This is a resource voucher, please enter a  gift voucher code."
          );
        this.validStatus = 2;

        let result = [
          {
            label: "Voucher Type",
            value: "Resource Voucher",
          },
        ];

        for (const item in data) {
          if (item == "expiredTime") {
            result.push({
              label: "Expiry Date",
              value: new Date(data[item] * 1000).format(),
            });
          }
        }
        let voucherLimit = JSON.parse(data.voucherLimit);

        result.push({
          label: "Voucher Amount",
          value: this.getResourceVoucher(voucherLimit),
        });
        this.validResult = result;
      } catch (error) {
        this.validStatus = 3;
        this.disabled = false;
        console.log(error);
        this.statusText[3] = error.message;
      }
    },
    async handleClaim() {
      try {
        if (!this.voucherCode) return;
        this.claimLoading = true;
        const { data } = await this.$http.post(
          `$resource/voucher/resource/claim/${this.voucherCode}`,
          {},
          {
            noTip: 1,
          }
        );
        console.log(data);
        this.$emit("getUsage");
        this.showVoucher = false;
        this.$toast("Claim Successfully");
      } catch (error) {
        console.log(error);
      }
      this.claimLoading = false;
    },
    getResourceVoucher(voucherLimit) {
      console.log(voucherLimit["IPFS_EFFECTIVE_TIME"]);
      const ipfsExpire = voucherLimit["IPFS_EFFECTIVE_TIME"];
      const type = [
        "IPFS",
        "IPFS_EFFECTIVE_TIME",
        "Arweave",
        "Bandwidth",
        "Build Minutes",
      ];
      let resource = type
        .map((it) => {
          let size = null;
          if (it == "Build Minutes") {
            size = voucherLimit[it] ? voucherLimit[it] / 60 + "Min" : 0;
          } else if (it == "IPFS_EFFECTIVE_TIME") {
            size = 0;
          } else {
            size = voucherLimit[it]
              ? this.$utils.getFileSize(voucherLimit[it], true).num +
                this.$utils.getFileSize(voucherLimit[it], true).unit
              : 0;
          }
          return {
            resource: it,
            size,
          };
        })
        .filter((it) => it.size != 0);
      console.log(resource);
      resource = resource.map((it) => {
        if (it.resource == "IPFS") {
          return (
            it.resource +
            " " +
            it.size +
            (ipfsExpire ? " until " + new Date(ipfsExpire * 1000).format() : "")
          );
        }
        return it.resource + " " + it.size;
      });
      console.log(resource);

      return resource.join(", ");
    },
  },
  watch: {
    validStatus(val) {
      if (val == 2) {
        this.openPanels = 0;
      }
    },
    showVoucher(val) {
      if (!val) {
        this.voucherCode = "";
        this.validStatus = 1;
        this.showDecode = false;
      }
    },
  },
};
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.post-input ::v-deep .v-input__prepend-outer {
  margin: 0 !important;
  margin-right: 5px !important;
  width: 100px !important;
}
.post-input {
  font-size: 14px !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.post-input .v-input__prepend-outer::v-deep {
  margin: 0 !important;
}
.commit {
  position: absolute;
  right: 10px;
  top: 35px;
  color: #775da6;
}
.label {
  display: block;
  color: #6c7789;
  margin-bottom: 10px;
}
::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
.disabled {
  color: gray;
}
</style>