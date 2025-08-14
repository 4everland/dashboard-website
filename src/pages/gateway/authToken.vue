<template>
  <div>
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div v-if="!onChain">
      <div class="pa-3 mt-5 ta-c">
        <img src="/img/svg/gateway/lock.svg" width="180" />
      </div>
      <div class="d-flex f-center">
        <div style="max-width: 550px">
          Activate your account to unlock the IPNS Manager API.
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
    <div v-else>
      <e-right-opt-wrap :top="-65">
        <div class="btn-wrap d-flex justify-end">
          <v-btn
            color="primary"
            width="120"
            @click="handleGenerate"
            v-if="list.length < 1"
          >
            <!-- <v-icon size="16">mdi-plus-circle-outline</v-icon> -->
            <img src="/img/svg/add1.svg" width="12" />
            <span class="ml-2">Generate</span>
          </v-btn>
        </div>
      </e-right-opt-wrap>
      <!-- <div class="fz-14 gray pl-1 mb-4">Use the API key for Storage SDK</div> -->

      <div class="main-wrap">
        <div class="mt-5">
          <v-data-table
            :headers="headers"
            :items="list"
            item-key="key"
            :loading="loading"
            hide-default-footer
          >
            <template v-slot:item.action="{ item }">
              <v-btn color="error" icon @click="onDel(item)">
                <v-icon size="18">mdi-trash-can-outline</v-icon></v-btn
              >
            </template>
          </v-data-table>
          <e-empty v-if="!loading && !list.length">No Tokens</e-empty>
        </div>
      </div>

      <v-dialog v-model="showPop" max-width="500" persistent>
        <div class="pd-30">
          <h3>API Key Generated</h3>
          <div
            class="mt-6"
            v-for="(it, i) in infoList"
            :key="i"
            @click="$copy(it.value, it.label + ' Copied!')"
          >
            <p>{{ it.label }}</p>
            <div class="pd-10 bd-1 bdrs-3 mt-3 d-flex al-c hover-1">
              <span class="el-label-1 fz-14">{{
                it.value.cutStr(20, 10)
              }}</span>
              <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
            </div>
          </div>

          <div class="mt-6 ta-c">
            <v-btn color="primary" @click="showPop = false">Done</v-btn>
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      headers: [
        {
          text: "API Key",
          value: "key",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      list: [],
      loading: false,
      newInfo: {},
      showPop: false,
      breadcrumbsItems: [
        {
          text: "Auth Token",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["teamInfo"]),
    ...mapState({
      onChain: (s) => s.onChain,
    }),
    infoList() {
      const info = this.newInfo;
      return [
        {
          label: "API Key",
          value: info.key || "",
        },
      ];
    },
  },
  methods: {
    handleUpgrad() {
      bus.$emit("showDialog");
    },
    async handleGenerate() {
      // if (this.list.length >= 1)
      //   return this.$alert("You can add 1 keys at maximum.");
      try {
        const { data } = await this.$http.post("$ipns/api-keys");
        this.newInfo = data;
        this.showPop = true;
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    async getList() {
      try {
        this.loading = true;
        this.list = [];
        const { data } = await this.$http.get("$ipns/api-keys");
        console.log(data);
        if (data.key) {
          this.list.push(data);
        }
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async onDel(it) {
      try {
        await this.$confirm(
          `The API Key(${it.key.cutStr(
            10,
            10
          )}) will be permanently deleted, are you sure you want to continue?`
        );
        this.$loading();
        await this.$http.delete("$ipns/api-keys");
        this.getList();
        this.$toast("Deleted successfully");
      } catch (error) {
        //
      }
      this.$loading.close();
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
</style>