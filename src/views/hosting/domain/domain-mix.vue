<template>
  <div>
    <div class="main-wrap">
      <v-data-table
        v-model="selected"
        :loading="loading"
        :show-select="list.length > 0"
        item-key="id"
        :headers="headers"
        :items="list"
        no-data-text=""
        loading-text=""
        hide-default-footer
        :checkbox-color="$color1"
        @click:row="onRow"
      >
        <template v-slot:item.domain="{ item }">
          <v-btn
            text
            x-small
            class="e-btn-text"
            :color="
              item.content == item.ipns || item.content == hashV0toV1(item.ipfs)
                ? 'success'
                : 'error'
            "
            :to="getPath(item)"
          >
            <b>{{ item.domain }}</b>
            <v-tooltip
              bottom
              v-if="
                !(
                  item.content == item.ipns ||
                  item.content == hashV0toV1(item.ipfs)
                )
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="ml-2"
                  small
                  color="#6C7789"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>Invalid Configuration</span>
            </v-tooltip>
          </v-btn>
        </template>
        <template v-slot:item.content="{ item }">
          {{ item.content ? item.content.cutStr(6, 4) : "--" }}
          <v-btn icon v-if="item.content">
            <v-icon
              small
              color="#999"
              @click.stop
              v-clipboard="item.content"
              @success="$toast('Copied!')"
              >mdi-content-copy</v-icon
            >
          </v-btn>
        </template>
      </v-data-table>
      <div class="mt-8" v-if="!list.length">
        <e-empty :loading="loading">
          {{ loading ? "Loading domains..." : "No domains" }}
        </e-empty>
      </div>

      <div class="mt-6" v-if="pageLen > 1">
        <v-pagination
          @input="onPage"
          v-model="page"
          :length="pageLen"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
          :total-visible="7"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { encode, decode, helpers } from "@ensdomains/content-hash";

export default {
  props: ["type", "active"],
  data() {
    return {
      headers: [
        { text: "", value: "domain" },
        {
          text: "Project Name",
          value: "projectName",
        },
        {
          text: "Content",
          value: "content",
        },
        { text: "CreateAt", value: "createTime" },
      ],
      list: [],
      page: 1,
      pageLen: 1,
      total: 0,
      selected: [],
      loading: false,
      curStep: 0,
      chooseProj: {},
      adding: false,
      domain: "",
      deleting: false,
      keyword: "",
    };
  },
  computed: {
    noticeMsg() {
      return this.$store.state.noticeMsg;
    },
  },
  watch: {
    active(val) {
      if (val) {
        this.getList();
      }
    },
    selected(val) {
      this.$setMsg({
        name: "domains-selected",
        data: { type: "sns", val },
      });
    },
    noticeMsg({ name, data }) {
      if (name == "domains-delete" && data.type == "sns") {
        this.getList();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getPath(item) {
      return `/hosting/project/${item.projectName || "project"}/${
        item.projectId
      }?tab=settings&sub=domains`;
    },
    onRow(it) {
      const url = this.getPath(it);
      this.$router.push(url);
    },
    onPage() {
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        this.headers[0].text = this.type.toUpperCase();
        const params = {
          page: this.page - 1,
          pageSize: 10,
          type: this.type,
        };

        const { data } = await this.$http.get(
          "$hosting/project/decentralized/domain",
          {
            params,
          }
        );
        this.list = data.domainList.map((it) => {
          it.createTime = new Date(it.createAt).format();
          return it;
        });
        this.pageLen = Math.max(1, Math.ceil(data.count / params.size));
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    hashV0toV1(baseHash) {
      const hash = /^Qm[a-zA-Z0-9]{44}/.test(baseHash)
        ? helpers.cidV0ToV1Base32(baseHash)
        : baseHash;
      return hash;
    },
  },
};
</script>
