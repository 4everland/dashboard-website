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
          The gateway service has been suspended because the balance on the
          4EVERLAND account is less than $100. The service will automatically
          resume when the balance is restored.
        </div>
      </div>
      <div
        class="ta-c mt-8"
        :class="{
          hidden:
            teamInfo.isMember && teamInfo.access?.indexOf('RESOURCE') == -1,
        }"
      >
        <v-btn color="primary" width="120" @click="handleDeposit"
          >Deposit</v-btn
        >
      </div>
    </div>
    <div v-else>
      <e-right-opt-wrap :top="-55">
        <gateway-generate
          @getList="getList"
          :isInsufficient="isInsufficient"
          :listLength="list.length"
        />
      </e-right-opt-wrap>
      <div class="tips py-2 mb-3 pr-5 al-c" v-show="isInsufficient">
        <v-icon slot="ref" size="22" color="#ff6d24" class="d-ib mx-3"
          >mdi-alert-circle-outline</v-icon
        >
        <span class="fz-13"
          >The gateway service has been suspended because the balance on the
          4EVERLAND account is less than $100. The service will automatically
          resume when the balance is restored.</span
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
            <span style="text-transform: capitalize">{{
              gatewayType(item.scope)
            }}</span>
          </template>
          <template #item.bytes="{ item }">
            <span>{{ $utils.getFileSize(item.bytes) }}</span>
          </template>
          <template #item.created_at="{ item }">
            <span>{{ new Date(item.created_at * 1000).format() }}</span>
          </template>
          <template #item.act="{ item }">
            <span class="action-btn" @click.stop="onRow(item)">Edit</span>
            <span class="action-btn ml-3" @click.stop="onDelete(item)"
              >Delete</span
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
    <!-- <gateway-domain ref="gatewayDomain" /> -->
    <!-- <gateway-edit ref="gatewayEdit" @getList="getList" /> -->
  </div>
</template>

<script>
import GatewayGenerate from "@/views/gateway/gateway-generate";
import { mapGetters } from "vuex";
export default {
  components: {
    GatewayGenerate,
  },
  data() {
    return {
      balance: null,
      headers: [
        { text: "Name", value: "name" },
        { text: "Access", value: "scope" },
        { text: "Past 30 days  of Bandwidth", value: "bytes" },
        { text: "Type", value: "type" },
        { text: "CreateAt", value: "created_at" },
        { text: "Action", value: "act" },
      ],
      list: [],
      loading: false,
      isGetList: false,
    };
  },
  computed: {
    ...mapGetters(["teamInfo"]),
    isLock() {
      return this.balance < 99 && !this.list.length;
    },
    isInsufficient() {
      return this.balance < 99 && (this.list.length ? true : false);
    },
    gatewayType() {
      return function (type) {
        return type == "public" ? "Open" : "Restricted";
      };
    },
  },
  async mounted() {
    await this.getBalance();
    this.getList();
  },
  methods: {
    // onDomain(item) {
    //   this.$refs.gatewayDomain.show(item);
    // },
    // onEdit(item) {
    //   this.$refs.gatewayEdit.show(item);
    // },
    async onDelete(item) {
      try {
        let tip =
          "The following gateways will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4" style="color:#775DA6">${item.name}.4everland.link</p>`;
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
        data.forEach((it) => (it.type = "IPFS"));
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
    onRow(row) {
      this.$router.push(`/gateway/list/${row.name}?tab=settings`);
    },
    handleDeposit() {
      if (this.teamInfo.isMember && !this.teamInfo.teamOwnerWallet) {
        return this.$alert(
          "This feature is not currently supported as the owner account is not bound to a wallet, please try again after binding a wallet."
        );
      }
      this.$router.push("/resource/deposit");
    },
  },
};
</script>
<style lang="scss" scoped>
$color1: #775da6;
.action-btn {
  cursor: pointer;
  color: $color1;
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
