<template>
  <div>
    <h3>Bucket Auth Tokens</h3>
    <div class="gray fz-14">Use the API key for Storage SDK</div>
    <div class="mt-5">
      <v-btn small rounded color="primary" @click="onAdd" :loading="adding"
        >Generate</v-btn
      >
    </div>
    <div class="mt-5">
      <v-data-table
        :headers="headers"
        :items="list"
        :loading="loading"
        hide-default-footer
      >
        <template v-slot:item.option="{ item }">
          <!-- <v-btn
            icon
            class="mr-2"
            v-clipboard="item.key"
            @success="$toast('Copied to clipboard !')"
          >
            <v-icon size="16">mdi-content-copy</v-icon>
          </v-btn> -->
          <v-btn color="error" icon @click="onDel(item)">
            <v-icon size="18">mdi-trash-can-outline</v-icon></v-btn
          >
        </template>
      </v-data-table>
    </div>

    <v-dialog v-model="showPop" max-width="500" persistent>
      <div class="pd-30">
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
          text: "",
          value: "option",
        },
      ],
      list: [],
      loading: false,
      adding: false,
      newInfo: {},
      showPop: false,
    };
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
  created() {
    this.getList();
  },
  methods: {
    async onAdd() {
      if (this.list.length >= 10)
        return this.$alert("You can add 10 keys at maximum.");
      try {
        this.adding = true;
        const { data } = await this.$http.post("/user/service-accounts");
        this.newInfo = data;
        this.showPop = true;
        this.getList();
      } catch (error) {
        //
      }
      this.adding = false;
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