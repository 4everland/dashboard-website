<template>
  <div class="pinning-service-container">
    <e-right-opt-wrap :top="-75">
      <v-row>
        <v-col :md="3">
          <v-btn color="primary" @click="getAccessToken"> Access Token </v-btn>
        </v-col>
        <v-col :md="4" style="max-width: 230px">
          <v-select
            class="hide-msg bd-1"
            dense
            solo
            :items="items"
            v-model="state"
            @change="handleChange"
          />
        </v-col>
        <v-col :md="5">
          <v-text-field
            class="hide-msg bd-1"
            prepend-inner-icon="mdi-magnify"
            solo
            dense
            placeholder="Search"
            v-model="searchKey"
            @input="handleInput"
          />
        </v-col>
      </v-row>
    </e-right-opt-wrap>
    <div>
      <pinning-service-upload></pinning-service-upload>
      <v-data-table
        class="hide-bdb"
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        item-key="id"
        no-data-text=""
        loading-text=""
        hide-default-footer
      >
        <template v-slot:item.name="{ item }">
          <span>{{ item.name.cutStr(20, 10) }}</span>
        </template>
        <template v-slot:item.hash="{ item }">
          <span>{{ item.hash.cutStr(20, 10) }}</span>
        </template>
        <template #item.action="{ item }">
          <v-btn color="primary" text @click="handleDelete(item)">delete</v-btn>
        </template>
      </v-data-table>
      <div class="ta-c mt-8" v-if="!list.length">
        <e-empty :loading="tableLoading">
          {{ tableLoading ? `Loading files...` : `No files` }}
        </e-empty>
      </div>
    </div>

    <v-dialog v-model="showPop" max-width="500" persistent>
      <div class="pd-30">
        <h3>Access Token Generated</h3>
        <div class="mt-6" @click="$copy(accessToken)">
          <p>{{ accessToken }}</p>
          <div class="pd-10 bd-1 bdrs-3 mt-3 d-flex al-c hover-1">
            <span class="el-label-1 fz-14">{{
              accessToken.cutStr(20, 10)
            }}</span>
            <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
          </div>
        </div>
        <div class="mt-6 ta-c">
          <v-btn color="primary" @click="resetAccessToken">Reset</v-btn>
          <v-btn color="primary" @click="showPop = false">Done</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import PinningServiceUpload from "@/views/bucket/components/pinning-service-upload.vue";
export default {
  components: {
    PinningServiceUpload,
  },
  data() {
    return {
      state: 1,
      items: [
        { text: "All", value: 1 },
        { text: "Queued", value: 2 },
        { text: "Pinned", value: 3 },
        { text: "Pinning", value: 4 },
        { text: "Failed", value: 5 },
      ],
      searchKey: "",
      showPop: false,
      accessToken: "",
      tableLoading: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "IPFS CID", value: "hash" },
        { text: "Last Modified", value: "updateAt" },
        { text: "Pin Status", value: "status" },
        { text: "Action", value: "action", align: "center" },
      ],
      list: [
        {
          name: "img1.png",
          size: 111000,
          hash: "bafybeiciv6dit3s2ij5n3vlwnthsqmbauhkveotvnhmnulozvqbbo7f6ea",
          updateAt: "2022-1-1",
          status: 1,
        },
        {
          name: "img1.png",
          size: 111000,
          hash: "bafybeiciv6dit3s2ij5n3vlwnthsqmb2uhkveotvnhmnulozvqbbo7f6ea",
          updateAt: "2022-1-1",
          status: 1,
        },
        {
          name: "img1.png",
          size: 111000,
          hash: "bafybeiciv6dit3s2ij5n3vlwnthsqmbauhk3eotvnhmnulozvqbbo7f6ea",
          updateAt: "2022-1-1",
          status: 1,
        },
        {
          name: "img1.png",
          size: 111000,
          hash: "bafybeiciv6dit3s2ij5n3vlwnthsqmbauh4veotvnhmnulozvqbbo7f6ea",
          updateAt: "2022-1-1",
          status: 1,
        },
      ],
    };
  },
  async created() {
    // await this.getAccessToken()
    // await this.getList()
  },
  methods: {
    handleInput() {
      console.log(1);
    },
    async getList() {
      try {
        const { data } = await this.$http.get("$pinning-service/pins", {
          headers: {
            Authorization: "Bearer " + this.accessToken,
          },
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async handleDelete(item) {
      try {
        await this.$http.delete(`$pinning-service/pins/${item.requestId}`, {
          headers: {
            Authorization: "Bearer " + this.accessToken,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getAccessToken() {
      try {
        const { data } = await this.$http.get(
          "/user/ipfs-pinning-service/token"
        );
        this.accessToken = data.accessToken;
      } catch (error) {
        console.log(error);
      }
    },
    async resetAccessToken() {
      try {
        const { data } = await this.$http.post(
          "/user/ipfs-pinning-service/token"
        );
        this.accessToken = data.accessToken;
      } catch (error) {
        console.log(error);
      }
    },
    async handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>