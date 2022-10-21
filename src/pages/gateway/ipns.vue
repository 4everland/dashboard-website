<template>
  <div>
    <e-right-opt-wrap :top="-74">
      <div class="al-c">
        <ipns-create @getList="getList" />
        <!-- <v-btn color="primary" class="ml-3">
          <img src="/img/svg/gateway/auth.svg" width="12" />
          <span class="ml-1">Auth Token</span>
        </v-btn> -->
        <div class="ml-3">
          <v-text-field
            class="hide-msg bd-1"
            dense
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="keyword"
            @input="getList"
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
      <template #item.key="{ item }">
        <!-- <a
          :href="$utils.getCidLink(item.key)"
          class="hash-link"
          style="color: #0b0817"
          target="_blank"
          v-if="item.key"
          @click.stop
          >{{ item.key.cutStr(5, 8) }}</a
        > -->
        <span>{{ item.key.cutStr(5, 8) }}</span>
        <v-btn
          v-if="item.key"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="item.key"
          @success="$toast('Copied to clipboard !')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
      </template>
      <template #item.value="{ item }">
        <!-- <a
          :href="$utils.getCidLink(item.value)"
          class="hash-link"
          style="color: #0b0817"
          target="_blank"
          v-if="item.value"
          @click.stop
          >{{ item.value.cutStr(5, 8) }}</a
        > -->

        <span>{{ item.value.cutStr(5, 8) }}</span>
        <v-btn
          v-if="item.value"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="item.value"
          @success="$toast('Copied to clipboard !')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
        <span v-else>--</span>
      </template>

      <template #item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt * 1000).format() }}</span>
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
        { text: "IPNS", value: "key" },
        { text: "IPFS CID Published", value: "value" },
        { text: "Created", value: "createdAt" },
        { text: "Action", value: "act" },
      ],
      list: [],
      loading: false,
      keyword: "",
      cursor: 0,
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
      this.$refs.ipnsPublish.show(item);
    },
    async onDelete(item) {
      console.log(item);
      try {
        let tip =
          "The following IPNS will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4">${item.name}</p>`;
        await this.$confirm(tip, "Delete IPNS");
        await this.$http2.delete(`$ipns/ipns/${item.key}`);
        this.getList();
      } catch (error) {
        //
      }
    },
    async getList() {
      try {
        let params = {
          cursor: this.cursor,
          keyword: this.keyword,
        };
        this.loading = true;
        const { data } = await this.$http2.get("$ipns/ipns", {
          params,
        });
        this.list = data.list;
        console.log(data);
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