<template>
  <div>
    <e-right-opt-wrap :top="-65">
      <div class="btn-wrap d-flex justify-end">
        <v-btn color="primary" @click="handleGetMasterKey">
          <v-icon size="16" color="primay">mdi-key-outline</v-icon>
          <span class="ml-2">Master Key</span>
        </v-btn>
        <v-btn class="ml-2" color="primary" width="120" @click="handleGenerate">
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
          item-key="ApiKey"
          :loading="loading"
          hide-default-footer
        >
          <template v-slot:item.action="{ item }">
            <v-btn color="error" icon @click="onDel(item)">
              <v-icon size="18">mdi-trash-can-outline</v-icon></v-btn
            >
          </template>
        </v-data-table>

        <e-empty v-if="!loading && !list.length">No Keys</e-empty>
      </div>
    </div>
    <div class="fz-14 ta-c mt-3">
      Learn More About
      <a
        href="https://docs.4everland.org/storage/bucket/bucket-api-s3-compatible"
        target="__blank"
      >
        S3 compatible bucket api</a
      >.
    </div>

    <v-dialog v-model="showPop" max-width="500" persistent>
      <div class="pd-30">
        <h3>API Key Generated</h3>
        <div
          class="mt-6"
          v-for="(it, i) in infoList"
          :key="i"
          @click="$copy(it.value)"
        >
          <p>{{ it.label }}</p>
          <div class="pd-10 bd-1 bdrs-3 mt-3 d-flex al-c hover-1">
            <span class="el-label-1 fz-14">{{ it.value.cutStr(20, 10) }}</span>
            <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
          </div>
        </div>

        <v-alert dense text outlined color="#A6632C" class="fz-14 mt-6">
          API Secret is only visible upon generation
        </v-alert>

        <div class="mt-6 ta-c">
          <v-btn color="primary" @click="showPop = false">Done</v-btn>
        </div>
      </div>
    </v-dialog>

    <v-dialog v-model="masterKeyShowPop" max-width="500" persistent>
      <div class="pd-30">
        <h3>Master Key</h3>

        <div class="fz-14 mt-3 el-label-1">
          Be sure to keep the unique master key for the Bucket safe. The master
          key cannot be deleted, but it can be reset if it has been compromised.
        </div>
        <div class="mt-6" v-for="(it, i) in masterKeyList" :key="i">
          <p>{{ it.label }}</p>
          <div
            class="pd-10 bd-1 bdrs-3 mt-3 d-flex al-c hover-1"
            v-clipboard="() => it.value"
            @success="$toast(it.label + ' Copied!')"
          >
            <span class="el-label-1 fz-14">{{ it.value.cutStr(20, 10) }}</span>
            <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>

            <v-btn
              class="ml-2 action-btn-reload"
              :loading="resetLoading"
              text
              @click.stop="handleResetMasterKey"
              v-if="it.label == 'API Secret'"
            >
              <v-icon size="18" color="rgba(0,0,0,0.54)">mdi-refresh</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- <v-alert dense text outlined color="#A6632C" class="fz-14 mt-6">
          API Secret is only visible upon generation
        </v-alert> -->

        <div class="mt-6 ta-c">
          <v-btn color="primary" @click="masterKeyShowPop = false">Done</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
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
      masterKeyShowPop: false,
      masterKeyInfo: {},
      resetLoading: false,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    infoList() {
      const info = this.newInfo;
      return [
        {
          label: "API Key",
          value: info.accessKey || "",
        },
        {
          label: "API Secret",
          value: info.secretKey || "",
        },
      ];
    },
    masterKeyList() {
      const info = this.masterKeyInfo;
      return [
        {
          label: "API Key",
          value: info.accessKey || "",
        },
        {
          label: "API Secret",
          value: info.secretKey || "",
        },
      ];
    },
  },
  methods: {
    async handleGenerate() {
      if (this.list.length >= 10)
        return this.$alert("You can add 10 keys at maximum.");
      try {
        const { data } = await this.$http.post("/user/service-accounts");
        this.newInfo = data;
        this.showPop = true;
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    async handleGetMasterKey() {
      try {
        const { data } = await this.$http.get("/user/account");
        this.masterKeyInfo = data;
        this.masterKeyShowPop = true;
      } catch (error) {
        console.log(error);
      }
    },
    async handleResetMasterKey() {
      try {
        this.resetLoading = true;

        await this.$http.post("/user/account");
        await this.handleGetMasterKey();
      } catch (error) {
        console.log(error);
      }
      this.resetLoading = false;
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/user/service-accounts");
        this.list = data.accounts.map((key) => {
          return {
            key,
          };
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async onDel(it) {
      console.log(11);
      try {
        await this.$confirm(
          `The API Key(${it.key.cutStr(
            10,
            10
          )}) will be permanently deleted, are you sure you want to continue?`
        );
        this.$loading();
        await this.$http.delete("/user/service-accounts/" + it.key);
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
.action-btn-reload {
  width: 16px !important;
  min-width: 16px !important;
  height: 16px !important;
  padding: 0 !important;
}
.action-btn-reload .v-btn__loader {
  width: 16px;
}
.theme--light.v-btn:hover::before {
  opacity: 0 !important;
}
</style>
