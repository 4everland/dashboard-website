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
      <template #item.access="{ item }">
        <a
          :href="$utils.getCidLink(item.access)"
          class="hash-link"
          style="color: #0b0817"
          target="_blank"
          v-if="item.access"
          @click.stop
          >{{ item.access.cutStr(5, 4) }}</a
        >
        <v-btn
          v-if="item.access"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="item.access"
          @success="$toast('Copied to clipboard !')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
      </template>
      <template #item.cid="{ item }">
        <a
          :href="$utils.getCidLink(item.cid)"
          class="hash-link"
          style="color: #0b0817"
          target="_blank"
          v-if="item.cid"
          @click.stop
          >{{ item.cid.cutStr(5, 4) }}</a
        >
        <v-btn
          v-if="item.cid"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="item.cid"
          @success="$toast('Copied to clipboard !')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
      </template>
      <template v-slot:item.act="{ item }">
        <v-btn class="action-btn" text color="primary" @click="onPublish(item)"
          >Publish</v-btn
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
    <ipns-publish ref="ipnsPublish" @getList="getList" />
  </div>
</template>

<script>
import IpnsCreate from "@/views/gateway/ipns-create";
import IpnsPublish from "@/views/gateway/ipns-publish";
export default {
  components: {
    IpnsCreate,
    IpnsPublish,
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Access", value: "access" },
        { text: "IPFS CID Published", value: "cid" },
        { text: "Created", value: "created" },
        { text: "Action", value: "act" },
      ],
      list: [
        {
          name: "123",
          access: "222",
          cid: "bafkreiagia52kyfjcawgkzf6e76wycj6vdyf2hmafj4qrhq24aelin4pwy",
          created: "1992-3-3",
          ttl: 0,
          id: 2,
        },
        {
          name: "123",
          access: "222",
          cid: "bafkreiagia52kyfjcawgkzf6e76wycj6vdyf2hmafj4qrhq24aelin4pwy",
          created: "1992-3-3",
          ttl: 1,
          id: 3,
        },
      ],
      loading: false,
      keyword: "",
      page: 1,
      total: 0,
    };
  },
  mounted() {
    // this.getList();
  },
  methods: {
    onPublish(item) {
      console.log(item);
      this.$refs.ipnsPublish.show(item);
    },
    async onDelete(item) {
      console.log(item);
      try {
        let tip =
          "The following IPNS will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4">${item.name}</p>`;
        await this.$confirm(tip, "Delete IPNS");
        await this.$http2.delete(`/ipns/${item.key}`);
        this.getList();
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
<style lang="scss" scpoed>
.action-btn {
  padding: 0 !important;
  letter-spacing: 0;
}
</style>