<template>
  <div>
    <v-skeleton-loader v-if="!loaded" type="article"></v-skeleton-loader>
    <div v-else>
      <div>
        <div class="text-center">
          <img src="@/assets/imgs/raas/success.svg" width="160" alt="" />
        </div>
        <template v-if="this.detailData.status == 0">
          <div class="raas-tit">Submission Successful!</div>
          <div class="raas-stit">
            Please be patient as we review your submission. An email will follow
            upon approval.
          </div>
        </template>
        <template v-if="this.detailData.status == 1">
          <div class="raas-tit">Review approved!</div>
          <div class="raas-stit">
            Rollup creation begins after LAND payment.
          </div>
        </template>
        <template
          v-if="this.detailData.status == 2 || this.detailData.status == 5"
        >
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
                <v-img
                  :src="
                    detailData.favicon ||
                    require('@/assets/imgs/raas/Avatar.png')
                  "
                ></v-img>
              </v-avatar>
            </span>
          </div>
          <div class="un-line item">
            <span>Chain Name</span>
            <span>{{ detailData.chainName }}</span>
          </div>
          <div class="un-line item">
            <span>Chain ID</span>
            <span>{{ detailData.chainId }}</span>
          </div>
          <div class="un-line item">
            <span>Duration</span>
            <span>{{ detailData.expirationTime }} Days</span>
          </div>
          <div class="un-line item">
            <span>Email </span>
            <span>{{ detailData.email }}</span>
          </div>
          <div class="un-line item">
            <span>X</span>
            <span>{{ detailData.xId }}</span>
          </div>
          <div class="un-line item">
            <span>Telegram </span>
            <span>{{ detailData.telegram }}</span>
          </div>
          <div
            class="d-flex space-btw al-c mt-10"
            v-if="this.detailData.status != 0"
          >
            <span style="color: #64748b; font-size: 14px; font-weight: 400">
              {{ this.detailData.status == 1 ? "Amount" : "Payment" }}:
              {{ land }} LAND (${{ $land }})</span
            >
            <v-btn
              v-if="this.detailData.status == 1"
              elevation="0"
              :loading="loading"
              min-width="130"
              color="primary"
              class="ml-4"
              @click="onPay"
              >Pay</v-btn
            >

            <span
              v-if="this.detailData.status == 2"
              style="color: #64748b; font-size: 14px; font-weight: 400"
            >
              {{ timeFormat(this.detailData.paymentTime) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRollupDetail, sendTransaction } from "@/api/raas.js";

import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      loaded: false,
      detailData: {},
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
    this.getDetail();
  },

  methods: {
    async getDetail() {
      const id = this.$route.params.id;
      const { data } = await fetchRollupDetail(id);
      this.loaded = true;
      this.detailData = data;
      const land = Number(data.land) / 1e18;
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
          "Notice",
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
        if (Number(balance) >= Number(this.detailData.land) / 1e18) {
          await sendTransaction({
            rollupId: this.detailData.id,
          });
          this.getDetail();
        } else {
          this.$confirm(
            "Insufficient LAND balance. Please deposit before proceeding",
            "Notice",
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
