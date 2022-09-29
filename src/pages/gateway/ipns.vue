<template>
  <div>
    <e-right-opt-wrap :top="-74">
      <div class="al-c">
        <ipns-create />
        <v-btn color="primary" class="ml-3">
          <img src="/img/svg/gateway/auth.svg" width="12" />
          <span class="ml-1">Auth Token</span>
        </v-btn>
        <div class="ml-3">
          <v-text-field
            class="hide-msg bd-1"
            dense
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="keyword"
          ></v-text-field>
        </div>
      </div>
    </e-right-opt-wrap>
    <v-data-table
      :loading="loading"
      item-key="id"
      :headers="headers"
      :items="list"
      hide-default-footer
    >
      <template v-slot:item.act="{ item }">
        <v-btn text color="primary" x-small @click="onPublish(item)"
          >Publish</v-btn
        >
        <v-btn text color="#999" x-small @click="onDelete(item)">Delete</v-btn>
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
</template>

<script>
import IpnsCreate from "@/views/gateway/ipns-create";

export default {
  components: {
    IpnsCreate,
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Access", value: "access" },
        { text: "Past 30 days  of Bandwidth", value: "bandwidth" },
        { text: "Created", value: "created" },
        { text: "Action", value: "act" },
      ],
      list: [],
      loading: false,
      keyword: "",
      page: 1,
      total: 0,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    onPublish(item) {
      console.log(item);
    },
    async onDelete(item) {
      console.log(item);
      try {
        let tip =
          "The following IPNS will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4">${item.name}</p>`;
        await this.$confirm(tip, "Delete IPNS");
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
    },
  },
};
</script>