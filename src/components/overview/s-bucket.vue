<template>
  <div>
    <v-data-table
      v-if="list.length || tableLoading"
      class="hide-bdb"
      :headers="headers"
      :items="list.slice(0, 5)"
      :loading="tableLoading"
      item-key="name"
      no-data-text=""
      loading-text=""
      hide-default-footer
      disable-pagination
      @click:row="onItem"
    >
      <template v-slot:item.name="{ item }">
        <v-btn x-small text color="primary" rounded class="e-btn-text">
          <b>{{ item.name }}</b>
        </v-btn>
      </template>
    </v-data-table>
    <div class="ta-c" :class="tableLoading ? 'mt-8' : 'mt-15'">
      <template v-if="!list.length">
        <e-empty
          :loading="tableLoading"
          :title="tableLoading ? '' : 'No buckets, Yet!'"
        >
          {{
            tableLoading
              ? `Loading buckets...`
              : `Create a bucket and store your files in IPFS.`
          }}
        </e-empty>
        <div class="mt-10" v-if="!tableLoading">
          <v-btn color="primary" rounded :to="bucketPath + '?new=bucket'"
            >Create a New Bucket</v-btn
          >
        </div>
      </template>
      <div v-else>
        <v-btn color="primary" rounded outlined :to="bucketPath"
          >View More</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "../bucket/storage-mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      headers: [
        { text: "Bucket Name", value: "name" },
        { text: "Domain", value: "defDomain" },
        { text: "CreateAt", value: "createAt" },
      ],
      bucketPath: "/bucket/storage/",
    };
  },
  methods: {
    onItem(it) {
      console.log(it);
      this.$router.push(`${this.bucketPath}${it.name}/`);
    },
  },
};
</script>