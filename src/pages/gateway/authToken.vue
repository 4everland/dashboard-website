<template>
  <div>
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
            <span class="el-label-1 fz-14">{{ it.value.cutStr(20, 10) }}</span>
            <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
          </div>
        </div>

        <div class="mt-6 ta-c">
          <v-btn color="primary" @click="showPop = false">Done</v-btn>
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
          value: info.key || "",
        },
      ];
    },
  },
  methods: {
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
</style>