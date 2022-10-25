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
        <gateway-generate @getList="getList" />
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
          <template #item.name="{ item }">
            <span>{{ item.name }}.4everland.link</span>
          </template>
          <template #item.scope="{ item }">
            <span style="text-transform: capitalize">{{ item.scope }}</span>
          </template>
          <template #item.bytes="{ item }">
            <span>{{ $utils.getFileSize(item.bytes) }}</span>
          </template>
          <template #item.created_at="{ item }">
            <span>{{ new Date(item.created_at * 1000).format() }}</span>
          </template>
          <template #item.act="{ item }">
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
      </div>
    </div>
    <gateway-domain ref="gatewayDomain" />
    <gateway-edit ref="gatewayEdit" @getList="getList" />
  </div>
</template>

<script>
import GatewayGenerate from "@/views/gateway/gateway-generate";
import GatewayDomain from "@/views/gateway/gateway-domain";
import GatewayEdit from "@/views/gateway/gateway-edit";
export default {
  components: {
    GatewayGenerate,
    GatewayDomain,
    GatewayEdit,
  },
  data() {
    return {
      balance: null,
      headers: [
        { text: "Name", value: "name" },
        { text: "Access", value: "scope" },
        { text: "Past 30 days  of Bandwidth", value: "bytes" },
        { text: "Created", value: "created_at" },
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
      isGetList: false,
    };
  },
  computed: {
    isLock() {
      return this.balance < 100 && !this.list.length;
    },
    isInsufficient() {
      return this.balance < 100 && this.list.length;
    },
  },
  async mounted() {
    await this.getBalance();
    this.getList();
  },
  methods: {
    onDomain(item) {
      this.$refs.gatewayDomain.show(item);
    },
    onEdit(item) {
      this.$refs.gatewayEdit.show(item);
    },
    async onDelete(item) {
      try {
        let tip =
          "The following gateways will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4">${item.name}.4everland.link</p>`;
        await this.$confirm(tip, "Delete Gateway");
        this.loading = true;
        await this.$http.delete(`$gateway/gateway/${item.name}`, { noTip: 1 });
        await this.getList();
      } catch (error) {
        //
        // console.log(error);
        if (error.code == "EXISTS_DOMAIN_ERR") {
          this.$alert(
            "It is only possible to delete gateways after custom domains have been removed."
          );
        }
      }
      this.loading = false;
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("$gateway/gateway/");
        this.list = data;
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