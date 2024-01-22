<template>
  <div>
    <v-skeleton-loader v-if="!loaded" type="article"></v-skeleton-loader>
    <div v-else>
      <div v-if="rollupList.length == 0">
        <div class="pa-3 mt-5 ta-c">
          <img src="@/assets/imgs/raas/empty.svg" width="160" />
        </div>
        <div class="d-flex f-center">
          <div style="max-width: 550px">
            Haven't created Rollup? (What's RaaS?)
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
        <div class="raas-tit">Submission Successful!</div>
        <div class="raas-stit">
          Please be patient as we review your submission. An email will follow
          upon approval.
        </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRollupList } from "@/api/raas.js";
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      loaded: false,
      rollupList: [],
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
          this.$router.push("billing/deposit");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
