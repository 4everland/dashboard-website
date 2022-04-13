<template>
  <div v-if="!s3">
    <v-skeleton-loader
      class="mt-2"
      type="article"
      max-width="500"
    ></v-skeleton-loader>
  </div>
  <div v-else>
    <div class="btn-wrap">
      <v-btn color="primary" @click="showPop = true">
        <!-- <v-icon size="16">mdi-plus-circle-outline</v-icon> -->
        <img src="img/svg/add1.svg" width="12" />
        <span class="ml-2">Add</span>
      </v-btn>
      <v-btn
        @click="onDelete"
        :loading="deleting"
        outlined
        class="ml-5"
        min-width="36"
        v-show="selected.length"
      >
        <img src="img/svg/delete.svg" width="12" />
        <span class="ml-2">Delete</span>
      </v-btn>
    </div>
    <div class="mt-4">
      <v-data-table
        class="hide-bdb"
        :headers="headers"
        :items="list"
        :loading="loading"
        v-model="selected"
        :show-select="list.length > 0"
        item-key="domain"
        no-data-text=""
        loading-text=""
        hide-default-footer
        :checkbox-color="$color1"
        @click:row="onRow"
      >
        <template v-slot:item.domain="{ item }">
          <v-btn
            :to="getPath(item)"
            :color="item.valid ? 'success' : 'error'"
            rounded
            text
            x-small
          >
            <b>{{ item.domain }}</b></v-btn
          >
        </template>
        <!-- <template v-slot:item.bucketName="{ item }">
          <v-btn
            color="primary"
            rounded
            text
            small
            :to="`/storage/${item.bucketName}/`"
          >
            <b>{{ item.bucketName }}</b></v-btn
          >
        </template> -->
      </v-data-table>

      <div class="mt-8" v-if="!list.length">
        <e-empty :loading="loading">
          {{ loading ? "Loading domains..." : "No domains" }}
        </e-empty>
      </div>
    </div>

    <v-dialog v-model="showPop" max-width="520">
      <div class="pd-30">
        <h3>Add Domain</h3>
        <v-window v-model="curStep">
          <v-window-item :value="0">
            <div class="gray mt-2 fz-14">
              Select a bucket to add your domain to
            </div>
            <div class="bd-1 mt-6">
              <div v-if="!bucketList">
                <v-skeleton-loader type="article" />
              </div>
              <template v-else>
                <div class="d-flex al-c bdb-1">
                  <v-icon class="ml-4">mdi-magnify</v-icon>
                  <input
                    type="text"
                    v-model="keyword"
                    placeholder="Search For Bucket"
                    class="flex-1 pd-10"
                    style="height: 54px; outline: none"
                  />
                </div>
                <div class="ov-a" style="max-height: 40vh">
                  <div
                    class="d-flex al-c pd-15"
                    :class="{
                      'bdt-1': i > 0,
                    }"
                    v-for="(it, i) in resBucketList"
                    :key="i"
                  >
                    <v-icon size="14">mdi-folder-multiple</v-icon>
                    <span class="ml-2 fz-15">{{ it.name }}</span>
                    <v-btn
                      small
                      rounded
                      color="primary"
                      class="ml-auto"
                      @click="onSelect(it)"
                      >Select</v-btn
                    >
                  </div>
                </div>
                <div class="d-flex al-c bdt-1 pa-3">
                  <v-btn
                    text
                    small
                    color="primary"
                    to="/bucket/storage/?new=bucket"
                  >
                    <v-icon size="16">mdi-folder-multiple-plus</v-icon>
                    <span class="ml-1">Create a new bucket</span>
                  </v-btn>
                </div>
              </template>
            </div>
          </v-window-item>
          <v-window-item :value="1">
            <div class="mt-5">
              <p><b>Bucket</b>：{{ chooseBucket.name }}</p>
              <p class="gray fz-14">
                Enter the domain that you would like to add:
              </p>
            </div>
            <div class="mt-5">
              <v-text-field
                dense
                outlined
                autofocus
                v-model.trim="domain"
                placeholder="mywebsite.com"
                @keyup.enter="onAdd"
              />
            </div>
          </v-window-item>
        </v-window>

        <div class="ta-c mt-8">
          <v-btn outlined rounded width="90" @click="showPop = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            rounded
            width="90"
            class="ml-6"
            v-if="curStep > 0"
            :loading="adding"
            @click="onAdd"
          >
            Confirm
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      s3: (s) => s.s3,
    }),
    resBucketList() {
      return (this.bucketList || []).filter((it) => {
        return new RegExp(this.keyword, "i").test(it.name);
      });
    },
  },
  data() {
    return {
      headers: [
        { text: "Domain", value: "domain" },
        { text: "Bucket", value: "bucketName" },
        { text: "NameServer", value: "nameServers" },
        { text: "CreateAt", value: "createAt" },
      ],
      list: [],
      selected: [],
      loading: false,
      showPop: false,
      curStep: 0,
      chooseBucket: {},
      bucketList: null,
      adding: false,
      domain: "",
      deleting: false,
      keyword: "",
      selectBucket: null,
    };
  },
  watch: {
    showPop(val) {
      if (val) {
        this.curStep = 0;
        this.getBuckets();
      }
    },
    "$route.path"(val) {
      if (val == "/bucket/domains") {
        this.getList();
        this.checkNew();
      }
    },
    s3() {
      this.checkNew();
    },
  },
  mounted() {
    this.getList();
    this.checkNew();
  },
  methods: {
    getPath(item) {
      return `/bucket/domain/${item.domain}`;
    },
    onRow(it) {
      const url = this.getPath(it);
      this.$router.push(url);
    },
    checkNew() {
      const { bucket } = this.$route.query;
      if (bucket && this.s3) {
        this.selectBucket = bucket;
        setTimeout(() => {
          this.showPop = true;
        }, 100);
      }
    },
    async onDelete() {
      try {
        const suffix = this.selected.length > 1 ? "s" : "";
        let html = `The following domain${suffix} will be permanently deleted along with associated <b>aliases</b> and <b>certs</b>. 
          <br>Are you sure you want to continue?`;
        html += '<ul class="mt-5 gray">';
        for (const it of this.selected) {
          html += `<li class="mt-2">${it.domain}</li>`;
        }
        html += "</ul>";
        await this.$confirm(html, `Delete Domain${suffix}`);
        const ids = this.selected.map((it) => it.domain).join(",");
        this.deleting = true;
        await this.$http.delete("/domains/" + ids);
        this.$toast(
          this.selected.length + ` domain${suffix} deleted successfully`
        );
        await this.getList();
        this.selected = [];
      } catch (error) {
        //
      }
      this.deleting = false;
    },
    getBuckets() {
      this.s3.listBuckets({}, (err, data) => {
        if (err) return this.onErr(err);
        this.bucketList = data.Buckets.map((it) => {
          return {
            name: it.Name,
            createAt: it.CreationDate.format(),
          };
        });
        if (this.selectBucket) {
          const item = this.bucketList.filter(
            (it) => it.name == this.selectBucket
          )[0];
          if (item) this.onSelect(item);
          this.selectBucket = null;
        }
      });
    },
    onSelect(it) {
      this.chooseBucket = it;
      this.curStep = 1;
    },
    async onAdd() {
      try {
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value “${this.domain}” is not a fully qualified domain name.`
          );
        }
        this.adding = true;
        await this.$http.post("/domains", {
          domain: this.domain,
          bucketName: this.chooseBucket.name,
        });
        this.showPop = false;
        // this.getList();
        this.$router.push(`/bucket/domain/${this.domain}`);
        this.$toast("Added successfully");
        this.domain = "";
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    async getList() {
      try {
        this.loading = true;
        this.selected = [];
        const { data } = await this.$http.get("/domains");
        this.list = data.list.map((it) => {
          it.createAt = new Date(it.createdAt * 1e3).format();
          return it;
        });
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>