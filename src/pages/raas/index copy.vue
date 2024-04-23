<template>
  <div>
    <v-skeleton-loader v-if="!loaded" type="article"></v-skeleton-loader>
    <div v-else>
      <div v-if="rollupList.length == 0">
        <div class="pa-3 mt-5 ta-c">
          <img src="@/assets/imgs/raas/empty.svg" width="160" />
        </div>
        <div class="d-flex f-center">
          <div style="max-width: 550px" class="top-tips">
            <!-- Haven't created Rollup? (What's RaaS?) -->
            Haven't created Rollup?
          </div>
        </div>
        <div class="ta-c mt-8">
          <v-btn color="primary" width="120" @click="onCreate">Create</v-btn>
        </div>
      </div>
      <div v-else>
        <div class="text-center">
          <img src="@/assets/imgs/raas/success.svg" width="160" alt="" />
        </div>
        <template v-if="this.rollupList[0].status == 0">
          <div class="raas-tit">Submission Successful!</div>
          <div class="raas-stit">
            Please be patient as we review your submission. An email will follow
            upon approval.
          </div>
        </template>
        <template v-if="this.rollupList[0].status == 1">
          <div class="raas-tit">Review approved!</div>
          <div class="raas-stit">
            Rollup creation begins after LAND payment.
          </div>
        </template>
        <template v-if="this.rollupList[0].status == 2">
          <div class="raas-tit">Payment completed!</div>
          <div class="raas-stit">Rollup creation in progress...</div>
        </template>
        <div
          class="main-wrap mt-6"
          :style="{
            'min-height': 'auto',
          }"
        >
          <div class="un-line preview">Preview</div>
          <div class="un-line item">
            <span>Chain Logo</span>
            <span>
              <v-avatar>
                <v-img :src="rollupList[0].chainLogo"></v-img>
              </v-avatar>
            </span>
          </div>
          <div class="un-line item">
            <span>Chain Name</span>
            <span>{{ rollupList[0].chainName }}</span>
          </div>
          <div class="un-line item">
            <span>Chain ID</span>
            <span>{{ rollupList[0].chainId }}</span>
          </div>
          <div class="un-line item">
            <span>Duration</span>
            <span>{{ rollupList[0].expirationTime }} Days</span>
          </div>
          <div class="un-line item">
            <span>Email </span>
            <span>{{ rollupList[0].email }}</span>
          </div>
          <div class="un-line item">
            <span>X</span>
            <span>{{ rollupList[0].xId }}</span>
          </div>
          <div class="un-line item">
            <span>Telegram </span>
            <span>{{ rollupList[0].telegram }}</span>
          </div>
          <div
            class="d-flex space-btw al-c mt-10"
            v-if="this.rollupList[0].status != 0"
          >
            <span style="color: #64748b; font-size: 14px; font-weight: 400">
              {{ this.rollupList[0].status == 1 ? "Amount" : "Payment" }}:
              {{ land }} LAND (${{ $land }})</span
            >
            <v-btn
              v-if="this.rollupList[0].status == 1"
              elevation="0"
              :loading="loading"
              min-width="130"
              color="primary"
              class="ml-4"
              @click="onPay"
              >Pay</v-btn
            >

            <span
              v-if="this.rollupList[0].status == 2"
              style="color: #64748b; font-size: 14px; font-weight: 400"
            >
              {{ timeFormat(this.rollupList[0].paymentTime) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRollupList, sendTransaction } from "@/api/raas.js";
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      loaded: false,
      rollupList: [],
      loading: false,
      land: 0,
      $land: 0,
    };
  },
  computed: {
    ...mapGetters(["balance"]),
    ...mapState({
      originBalance: (s) => s.moduleResource.originBalance,
    }),
  },
  created() {
    this.$store.dispatch("getBalance");
  },
  mounted() {
    this.getList();
  },

  methods: {
    async getList() {
      const { data } = await fetchRollupList();
      this.loaded = true;
      this.rollupList = data.detail;
      const land = Number(this.rollupList[0].land) / 1e18;
      console.log(land);
      this.land = this.numberWithCommas(land);
      this.$land = this.numberWithCommas(land / 1e6);
    },
    async onCreate() {
      const balance = this.originBalance / 1e18;
      if (Number(balance) >= 1000000000) {
        this.$router.push("/raas/create");
      } else {
        this.$confirm(
          "To create a Rollup, ensure your account balance exceeds 1,000,000,000 LAND (1,000 USD). Please deposit before proceeding.",
          "Tips",
          {
            cancelText: "Cancel",
            confirmText: "Deposit",
          }
        ).then(async () => {
          this.$router.push("/billing/deposit");
        });
      }
    },
    async onPay() {
      this.loading = true;
      const balance = this.originBalance / 1e18;
      try {
        if (Number(balance) >= Number(this.rollupList[0].land) / 1e18) {
          await sendTransaction({
            rollupId: this.rollupList[0].id,
          });
          this.getList();
        } else {
          this.$confirm(
            "Insufficient LAND balance. Please deposit before proceeding",
            "Tips",
            {
              cancelText: "Cancel",
              confirmText: "Deposit",
            }
          ).then(async () => {
            this.$router.push("/billing/deposit");
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    timeFormat(timestamp) {
      let year = new Date(timestamp * 1e3).getUTCFullYear();
      let month =
        new Date(timestamp * 1e3).getUTCMonth() + 1 > 9
          ? new Date(timestamp * 1e3).getUTCMonth() + 1
          : "0" + (new Date(timestamp * 1e3).getUTCMonth() + 1);
      let date =
        new Date(timestamp * 1e3).getUTCDate() > 9
          ? new Date(timestamp * 1e3).getUTCDate()
          : "0" + new Date(timestamp * 1e3).getUTCDate();

      let hours =
        new Date(timestamp * 1e3).getUTCHours() > 9
          ? new Date(timestamp * 1e3).getUTCHours()
          : "0" + new Date(timestamp * 1e3).getUTCHours();

      let minutes =
        new Date(timestamp * 1e3).getUTCMinutes() > 9
          ? new Date(timestamp * 1e3).getUTCMinutes()
          : "0" + new Date(timestamp * 1e3).getUTCMinutes();

      let seconds =
        new Date(timestamp * 1e3).getUTCSeconds() > 9
          ? new Date(timestamp * 1e3).getUTCSeconds()
          : "0" + new Date(timestamp * 1e3).getUTCSeconds();

      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        " (UTC)"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.top-tips {
  color: #64748b;
  text-align: center;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.raas-tit {
  color: #0f172a;
  text-align: center;
  font-family: "SF Pro Text";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.raas-stit {
  color: #64748b;
  text-align: center;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.preview {
  font-size: 20px;
  font-weight: bold;
  padding: 16px 0;
}
.un-line {
  border-bottom: 1px solid #cbd5e1;
}
.item {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    color: #64748b;
  }
  span:last-child {
    color: #0f172a;
    font-weight: bold;
  }
}
</style>
