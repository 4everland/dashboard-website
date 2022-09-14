<template>
  <div class="main-wrap">
    <div class="al-c justify-space-between">
      <div>this is description.......</div>

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
      class="mt-5"
      :headers="header"
      :items="list"
      item-key="hash"
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
        <v-btn color="primary">Publish</v-btn>
        <v-btn color="primary">Delete</v-btn>
      </template>
    </v-data-table>

    <div class="pd-20 gray ta-c fz-16 mt-5">
      <v-btn outlined class="mr-5">Previous</v-btn>
      <v-btn min-width="100" outlined>Next</v-btn>
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
        },
      ],
      searchKey: "",
    };
  },
  activated() {
    this.$router.push({
      path: "/bucket/storage/dsdsdsds/",
      query: { tab: "snapshots" },
    });
  },
  methods: {
    onRow(item) {
      if (item.isFile) return;
      this.$router.push(this.$route.path + item.name + "/" + location.search);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>