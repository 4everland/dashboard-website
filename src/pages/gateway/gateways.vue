<template>
  <div style="height: 100%">
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <v-skeleton-loader
      type="article"
      v-if="available === null || !isGetList"
    ></v-skeleton-loader>
    <div v-else-if="!available" class="activate">
      <div class="empty">
        <div class="pa-3 mt-5 ta-c">
          <img src="/img/svg/gateway/lock.svg" width="180" />
        </div>
        <div class="d-flex f-center">
          <div style="max-width: 550px">
            Activate your account to unlock the Dedicated Gateway.
          </div>
        </div>
        <div
          class="ta-c mt-8"
          :class="{
            hidden:
              teamInfo.isMember && teamInfo.access?.indexOf('RESOURCE') == -1,
          }"
        >
          <v-btn color="primary" width="120" @click="handleUpgrad"
            >Activate</v-btn
          >
        </div>
      </div>
    </div>
    <div v-else>
      <e-right-opt-wrap :top="-55">
        <gateway-generate
          @getList="getList"
          :listLength="maxGatewayList.length"
        />
      </e-right-opt-wrap>
      <div class="main-wrap">
        <v-data-table
          :loading="loading"
          item-key="id"
          :headers="headers"
          :items="list"
          hide-default-footer
        >
          <template #item.name="{ item }">
            <div class="al-c">
              <span>{{ item.name.cutStr(6, 6) }}.4everland.link</span>

              <v-btn
                class="e-btn-text ml-2"
                icon
                small
                @click.stop
                v-clipboard="item.name + '.4everland.link'"
                @success="$toast('Copied!')"
              >
                <img src="/img/svg/copy.svg" width="12" />
              </v-btn>
              <v-tooltip top v-if="item.is_bucket != 0">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="mr-2"
                    small
                    color="#6C7789"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-alert-circle-outline
                  </v-icon>
                </template>
                <span
                  >System allocated for bucket, not manually removable.
                </span>
              </v-tooltip>
            </div>
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
            <button
              class="action-btn"
              @click.stop="onRow(item)"
              :class="{ disable: item.is_bucket }"
              :disabled="item.is_bucket != 0"
            >
              Edit
            </button>
            <button
              class="action-btn ml-3"
              :class="{ disable: item.is_bucket }"
              @click.stop="onDelete(item)"
              :disabled="item.is_bucket != 0"
            >
              Delete
            </button>
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
import { bus } from "@/utils/bus";
export default {
  components: {
    GatewayGenerate,
  },
  data() {
    return {
      available: null,
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
      breadcrumbsItems: [
        {
          text: "Gateway",
          disabled: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["teamInfo"]),
    gatewayType() {
      return function (type) {
        return type == "public" ? "Open" : "Restricted";
      };
    },
    maxGatewayList() {
      return this.list.filter((it) => it.is_bucket == 0);
    },
  },
  async mounted() {
    await this.getFirstRecharge();
    this.getList();
  },
  methods: {
    async onDelete(item) {
      try {
        let tip =
          "The following gateways will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4" style="color:#6172F3">${item.name}.4everland.link</p>`;
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
    async getFirstRecharge() {
      const { data } = await this.$http.get(
        "$bill-consume/common/gateway/status"
      );
      this.available = data.available;
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
      this.$router.push("/billing/deposit");
    },
    handleUpgrad() {
      bus.$emit("showDialog");
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
.action-btn {
  cursor: pointer;
  color: var(--v-primary-base);
}
.action-btn.disable {
  color: gray;

  cursor: not-allowed;
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
.activate {
  height: 100%;
  position: relative;
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -90%);
  }
}
</style>
