<template>
  <div class="main-wrap">
    <div class="al-c justify-space-between">
      <div class="fz-14 gray">
        <v-icon size="14" color="#6C7789">mdi-alert-circle</v-icon>
        <span class="ml-1"
          >The publish will fail if the file in the folder is changed after the
          snapshot, deleting the snapshot will automatically unpin it!</span
        >
      </div>
      <div class="ml-auto" style="min-width: 150px">
        <v-text-field
          class="hide-msg bd-1"
          dense
          solo
          clearable
          label="Search"
          prepend-inner-icon="mdi-magnify"
          v-model="searchKey"
        ></v-text-field>
      </div>
    </div>
    <v-data-table
      class="mt-5 data-table"
      :headers="header"
      :items="list"
      item-key="id"
      hide-default-footer
      disable-pagination
      height="700"
    >
      <template v-slot:item.name="{ item }">
        <v-btn
          color="#000"
          class="e-btn-text"
          text
          x-small
          @click="onRow(item)"
        >
          <v-icon v-if="!item.isFile" size="18" class="mr-2">mdi-folder</v-icon>
          <b>{{ item.name.cutStr(5, 5) }}</b></v-btn
        >
      </template>
      <template #item.action="{ item }">
        <span
          class="action-btn"
          style="color: #775da6"
          @click="handlePublish(item.id)"
          >Publish</span
        >
        <span class="action-btn ml-2" @click="handleDelete(item.id)"
          >Delete</span
        >
      </template>
    </v-data-table>

    <div class="pd-20 gray ta-c fz-16 mt-5" v-show="list.length">
      <v-btn outlined class="mr-5">Previous</v-btn>
      <v-btn min-width="100" outlined :disabled="!hasNext">Next</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
  data() {
    return {
      header: [
        { text: "Name", value: "name" },
        { text: "IPFS CID", value: "hash" },
        { text: "Size", value: "size" },
        { text: "Publish", value: "status" },
        { text: "Create", value: "createAt" },
        { text: "Action", value: "action" },
      ],
      list: [
        {
          name: "snapshots",
          hash: "js323mzzjfvcalslfkjfdsasd",
          size: "212KB",
          status: "Published",
          createAt: "2022-1-2 10:31:33",
          isFile: false,
          id: 23434,
        },
      ],
      searchKey: "",
      cursor: 0,
      prefix: "",
      hasNext: false,
    };
  },
  activated() {
    this.$router
      .push({
        path: this.$route.path.split("/").slice(0, 4).join("/") + "/",
        query: { tab: "snapshots" },
      })
      .catch((err) => err);
  },
  created() {
    this.getList();
  },
  methods: {
    onRow(item) {
      if (item.isFile) return;
      this.$router.push(this.$route.path + item.name + "/" + location.search);
    },
    async getList() {
      try {
        let payload = { cursor: this.cursor, prefix: this.prefix };
        const { data, page } = await this.$http.get("/snapshots", payload);
        this.list = data;
        this.cursor = page.next;
        this.hasNext = page.hasNext;
      } catch (error) {
        console.log(error);
      }
    },
    async handlePublish(id) {
      try {
        await this.$http.post(`/snapshots/${id}`);
      } catch (err) {
        console.log(error);
      }
    },
    async handleDelete(id) {
      try {
        await this.$http.delete(`/snapshots/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.action-btn {
  color: #6c7789;
  cursor: pointer;
}
</style>