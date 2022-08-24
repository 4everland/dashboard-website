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
            <v-btn color="primary" to="/resource/subscribe">Subscribe</v-btn>
            <v-btn color="primary" outlined class="ml-4" to="/resource/deposit"
              >Deposit</v-btn
            >

            <v-btn plain color="#444" class="ml-6" to="/resource/withdraw">
              Withdraw
            </v-btn>
            <span class="gray">|</span>
            <v-btn plain color="#444" to="/resource/bills">
              Billing Details
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
  },
};
</script>