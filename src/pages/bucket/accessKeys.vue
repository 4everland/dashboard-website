<template>
  <div>
    <e-right-opt-wrap :top="-55">
      <div class="btn-wrap d-flex justify-end">
        <v-btn color="primary" width="120" @click="showDialog = true">
          <!-- <v-icon size="16">mdi-plus-circle-outline</v-icon> -->
          <img src="/img/svg/add1.svg" width="12" />
          <span class="ml-2">Generate</span>
        </v-btn>
        <v-btn outlined class="ml-5" min-width="36" width="120">
          <img src="/img/svg/delete.svg" width="12" />
          <span class="ml-2">Delete</span>
        </v-btn>
      </div>
    </e-right-opt-wrap>
    <div class="main-wrap">
      <div class="mt-5">
        <v-data-table
          :headers="headers"
          :items="list"
          item-key="ApiKey"
          @click:row="onRow"
          :loading="loading"
          v-model="select"
          show-select
          checkbox-color="$color"
          hide-default-footer
        >
        </v-data-table>
      </div>

      <v-dialog v-model="showDialog" max-width="500">
        <div class="pd-30" v-if="!isGenerate">
          <div>
            <h3>Generate Access Key</h3>
            <div class="gray fz-14">Set a Name</div>
          </div>
          <v-text-field
            class="my-5"
            dense
            v-model="keyName"
            :counter="30"
            :rules="rules"
            @update:error="handleError"
          ></v-text-field>
          <div class="d-flex justify-center">
            <v-btn color="primary" width="120" @click="showDialog = false">
              <span class="ml-2">Cancel</span>
            </v-btn>
            <v-btn color="primary" width="120" class="ml-5">
              <span class="ml-2" @click="handleGenerate">Create</span>
            </v-btn>
          </div>
        </div>

        <div class="pd-30" v-else>
          <h3>API Key Generated</h3>
          <div
            class="mt-6"
            v-for="(it, i) in infoList"
            :key="i"
            v-clipboard="it.value"
            @success="$toast(it.label + ' copied to clipboard !')"
          >
            <p>{{ it.label }}</p>
            <div class="pd-10 bd-1 bdrs-3 mt-3 d-flex al-c hover-1">
              <span class="el-label-1 fz-14">{{
                it.value.cutStr(20, 10)
              }}</span>
              <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
            </div>
          </div>

          <v-alert dense text outlined color="#A6632C" class="fz-14 mt-6">
            API Secret is only visible upon generation
          </v-alert>

          <div class="mt-6 ta-c">
            <v-btn color="primary" @click="showDialog = false">Done</v-btn>
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Key Name",
          value: "keyName",
        },
        {
          text: "API Key",
          value: "ApiKey",
        },
        {
          text: "Generate",
          value: "CreateAt",
        },
      ],
      list: [],
      select: [],
      keyName: "",
      loading: false,
      showDialog: true,
      isGenerate: false,
      rules: [
        function (value) {
          if (value.length > 30) {
            return "The name cannot be longer than 30 characters.";
          }
          if (value.indexOf(" ") != -1) {
            return "has kgg";
          }
          return true;
        },
      ],
      newInfo: {},
      isError: false,
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
  },
  methods: {
    handleError(val) {
      this.isError = val;
    },
    async handleGenerate() {
      if (this.isError) return;
      if (this.list.length >= 10)
        return this.$alert("You can add 10 keys at maximum.");
      try {
        const { data } = await this.$http.post("/user/service-accounts");
        console.log(data);
        this.newInfo = data;
        this.isGenerate = true;
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/user/service-accounts");
        console.log(data);
        this.list = data.accounts.map((it) => {
          return { ApiKey: it };
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
    onRow(row) {
      console.log(row);
      this.select.push(row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>