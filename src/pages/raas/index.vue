<template>
  <div style="height: 100%">
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <v-skeleton-loader v-if="!loaded" type="article"></v-skeleton-loader>
    <div v-else style="height: 100%">
      <div v-if="rollupList.length == 0" class="raas-home">
        <Empty @onCreate="onCreate" />
      </div>
      <div v-else>
        <e-right-opt-wrap style="width: 100%" :top="-60">
          <v-btn color="primary" width="120" @click="onCreate">
            <v-icon> mdi-plus </v-icon>
            Create</v-btn
          >
        </e-right-opt-wrap>
        <rollup-list class="mt-5" :rollup-data="rollupData" />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRollupList, sendTransaction } from "@/api/raas.js";
import { mapGetters, mapState } from "vuex";
import Empty from "./component/empty.vue";
import rollupList from "./component/rollup-list.vue";
import { bus } from "@/utils/bus";

export default {
  components: { Empty, rollupList },
  data() {
    return {
      loaded: false,
      rollupData: null,
      rollupList: [],
      loading: false,
      land: 0,
      $land: 0,
      breadcrumbsItems: [
        {
          text: "RaaS",
          disabled: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["balance"]),
    ...mapState({
      originBalance: (s) => s.moduleResource.originBalance,
      onChain: (s) => s.onChain,
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
      const params = {
        page: 0,
        size: 100,
      };
      const { data } = await fetchRollupList(params);
      this.loaded = true;
      this.rollupData = data;
      this.rollupList = data.detail;
      const land = Number(this.rollupList[0].land) / 1e18;
      this.land = this.numberWithCommas(land);
      this.$land = this.numberWithCommas(land / 1e6);
    },
    async onCreate() {
      if (!this.onChain) {
        this.$confirm("Activate your account to get started", "Notice", {
          cancelText: "Cancel",
          confirmText: "Activate",
        }).then(async () => {
          bus.$emit("showDialog");
        });
      } else {
        this.$router.push("/raas/create");
      }

      // let limitBalance = 1000000000;
      // if (process.env.NODE_ENV == "development") {
      //   limitBalance = 10000000;
      // }
      // const balance = this.originBalance / 1e18;
      // if (Number(balance) >= limitBalance) {
      //   this.$router.push("/raas/create");
      // } else {
      //   this.$confirm(
      //     "To create a Rollup, ensure your account balance exceeds 1,000,000,000 LAND (1,000 USD). Please deposit before proceeding.",
      //     "Notice",
      //     {
      //       cancelText: "Cancel",
      //       confirmText: "Deposit",
      //     }
      //   ).then(async () => {
      //     this.$router.push("/billing/deposit");
      //   });
      // }
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
@media screen and (max-width: 960px) {
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
.raas-home {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}
</style>
