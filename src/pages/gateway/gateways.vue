<template>
  <div>
    <v-skeleton-loader
      type="article"
      v-if="balance === null || !isGetList"
    ></v-skeleton-loader>
    <div v-else-if="isLock">
      <div class="pa-3 mt-5 ta-c">
        <img src="/img/svg/gateway/lock.svg" width="180" />
      </div>
      <div class="d-flex f-center">
        <div style="max-width: 550px">
          As the 4EVERLAND account balance is less than 100u, the gateway
          service has been suspended. Once the balance is replenished, the
          service will be automatically resumed.
        </div>
      </div>
      <div class="ta-c mt-8">
        <v-btn color="primary" width="120" to="/resource/deposit"
          >Deposit</v-btn
        >
      </div>
    </div>
    <div v-else>
      <e-right-opt-wrap :top="-55">
        <gateway-generate />
      </e-right-opt-wrap>
      <div class="tips py-2 mr-3 mb-3 pr-5 al-c" v-show="isInsufficient">
        <v-icon slot="ref" size="22" color="#ff6d24" class="d-ib mx-3"
          >mdi-alert-circle-outline</v-icon
        >
        <span class="fz-13"
          >As the 4EVERLAND account balance is less than 100u, the gateway
          service has been suspended. Once the balance is replenished, the
          service will be automatically resumed.</span
        >
      </div>

      <div class="main-wrap">
        <v-data-table
          :loading="loading"
          item-key="id"
          :headers="headers"
          :items="list"
          hide-default-footer
        >
          <template v-slot:item.act="{ item }">
            <v-btn
              class="action-btn"
              text
              color="primary"
              @click="onDomain(item)"
              >Domain</v-btn
            >
            <v-btn class="action-btn" text color="primary" @click="onEdit(item)"
              >Edit</v-btn
            >
            <v-btn class="action-btn" text color="#999" @click="onDelete(item)"
              >Delete</v-btn
            >
          </template>
        </v-data-table>

        <div class="mt-8" v-if="!list.length">
          <e-empty :loading="loading">
            {{ loading ? "Loading..." : "No Data" }}
          </e-empty>
        </div>
        <e-pagi
          class="pa-5"
          @input="getList"
          v-model="page"
          :limit="10"
          :total="total"
        />
      </div>
    </div>
    <gateway-domain ref="gatewayDomain" />
    <gateway-edit ref="gatewayEdit" />
  </div>
</template>

<script>
// import GatewayGenerate from "@/views/gateway/gateway-generate";
// import GatewayDomain from "@/views/gateway/gateway-domain";
// import GatewayEdit from "@/views/gateway/gateway-edit";
export default {
  components: {
    GatewayGenerate: () => import("@/views/gateway/gateway-generate"),
    GatewayDomain: () => import("@/views/gateway/gateway-domain"),
    GatewayEdit: () => import("@/views/gateway/gateway-edit"),
  },
  data() {
    return {
      balance: null,
      headers: [
        { text: "Name", value: "name" },
        { text: "Access", value: "access" },
        { text: "Past 30 days  of Bandwidth", value: "bandwidth" },
        { text: "Created", value: "created" },
        { text: "Action", value: "act" },
      ],
      list: [
        // {
        //   name: "loq.4everland.link",
        //   access: "private",
        //   bandwidth: 2222,
        //   created: "2022-1-1",
        // },
        // {
        //   name: "ylq.4everland.link",
        //   access: "public",
        //   bandwidth: 2222,
        //   created: "2022-1-1",
        // },
      ],
      loading: false,
      page: 1,
      total: 0,
      isGetList: false,
    };
  },
  computed: {
    isLock() {
      return this.balance < 1 && !this.list.length;
      // return false;
    },
    isInsufficient() {
      return this.balance < 1 && this.list.length;
    },
  },
  watch: {
    // isLock(val) {
    //   if (!val) this.getList();
    // },
  },
  async mounted() {
    await this.getBalance();
    this.getList();
  },
  methods: {
    onDomain(item) {
      console.log(item);
      this.$refs.gatewayDomain.show(item);
    },
    onEdit(item) {
      console.log(item);
      this.$refs.gatewayEdit.show(item);
    },
    async onDelete(item) {
      console.log(item);
      try {
        let tip =
          "The following gateways will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4">${item.name}</p>`;
        await this.$confirm(tip, "Delete Gateway");
      } catch (error) {
        //
      }
    },
    async getList() {
      try {
        this.loading = true;
        const params = {
          page: this.page - 1,
          size: 10,
        };
        const { data } = await this.$http2.get("/domain/list", {
          params,
        });
        this.list = data.content.map((it) => {
          it.created = new Date(it.createAt * 1e3).format();
          it.name = it.createAt;
          return it;
        });
        this.total = data.numberOfElements;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
      this.isGetList = true;
    },
    async getBalance() {
      const {
        data: { balance },
      } = await this.$http.get("$v3/account/balance");
      this.balance = balance;
    },
  },
};
</script>
<style lang="scss" scoped>
.action-btn {
  padding: 0 !important;
  letter-spacing: 0;
}
.tips {
  color: #6a778b;
  font-size: 14px;
  color: #ff6d24;
  background: #ffeee4;
  border-radius: 6px;
  .icon {
    vertical-align: sub;
  }
}
</style>