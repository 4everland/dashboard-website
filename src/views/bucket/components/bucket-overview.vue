<template>
  <div class="overview-container">
    <div class="basic-statistics bg-white">
      <h3>Basic Statistics</h3>
      <v-row class="basic-statistics-content">
        <template v-if="!basicStatisticsData.length">
          <v-col v-for="i in 5" :key="i" sm cols class="basic-statistics-item">
            <v-skeleton-loader type="sentences"></v-skeleton-loader>
          </v-col>
        </template>
        <v-col
          v-for="item in basicStatisticsData"
          :key="item.name"
          sm="4"
          md
          cols="6"
          class="basic-statistics-item"
        >
          <div class="item-title text-center text-md-left">{{ item.name }}</div>
          <div class="item-data text-center text-md-left">
            <span>{{
              typeof item.value == "object" ? item.value.num : item.value
            }}</span>
            <span v-if="item.value != 'object'" class="item-unit ml-2 fz-14">{{
              item.value.unit
            }}</span>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="domain-names bg-white">
      <h3>Domain Names</h3>
      <!-- <div>
        <v-data-table
          class="hide-bdb"
          :headers="headers"
          :items="domainList"
          :loading="tableLoading"
          item-key="name"
          no-data-text=""
          loading-text=""
          hide-default-footer
          disable-pagination
        >
          <template #item.systemAllo="{ item }">
            <span
              >{{ item.systemAlloc ? "Assign Domain" : "Custom Domain" }}
            </span>
          </template>
          <template #item.isHttps="{ item }">
            <span>{{ item.isHttps ? "Supported" : "No Supported" }} </span>
          </template>
          <template #item.globalEdgeNetwork="{ item }">
            <span
              >{{ item.globalEdgeNetwork ? "Supported" : "No Supported" }}
            </span>
          </template>
        </v-data-table>
        <template v-if="domainList.length == 0">
          <e-empty :loading="false">
            {{ false ? `Loading domain...` : `No domain` }}
          </e-empty>
        </template>
      </div> -->
      <div>
        <div class="gray fz-14">These domains are assigned to your bucket.</div>
        <div class="mt-5 d-flex">
          <v-text-field
            outlined
            dense
            v-model.trim="domain"
            @keyup.enter="onAdd"
            placeholder="my.bucket.com"
          >
          </v-text-field>
          <v-btn
            min-width="100"
            @click="onAdd"
            :disabled="!domain"
            :loading="adding"
            color="primary"
            class="ml-4"
            style="margin-top: 2px"
          >
            Add
          </v-btn>
        </div>
      </div>
      <template v-for="item in domainArr">
        <domain :key="item.id" :info="item" @getList="getData"> </domain>
      </template>
    </div>
    <div class="basic-settings bg-white">
      <h3>Basic Settings</h3>
      <v-row
        v-if="JSON.stringify(extraData) == '{}'"
        class="basic-settings-content"
      >
        <v-col sm="6" cols class="basic-settings-item" v-for="i in 4" :key="i">
          <v-skeleton-loader type="sentences" class="pr-8"></v-skeleton-loader>
        </v-col>
      </v-row>

      <v-row class="basic-settings-content" v-else>
        <v-col sm="6" cols class="basic-settings-item">
          <e-kv label="Created At" min-width="120px" labelColor="#6c7789">{{
            extraData.createdAt
          }}</e-kv>
        </v-col>
        <v-col sm="6" cols class="basic-settings-item">
          <e-kv label="Sync to Arweave" min-width="120px" labelColor="#6c7789">
            <v-switch
              class="mt-0 hide-msg"
              v-model="isAr"
              dense
              :loading="arLoading"
              :disabled="arLoading"
              @click.stop.prevent="onSyncBucket()"
            ></v-switch>
          </e-kv>
        </v-col>
        <v-col sm="6" cols class="basic-settings-item">
          <e-kv label="Custom Domain" min-width="120px" labelColor="#6c7789">
            <h-domain
              v-if="customDomainList.length"
              class="item-data mr-2"
              :val="customDomainList.length ? customDomainList[0].domain : '--'"
            />
            <span v-if="!customDomainList.length">--</span>
            <e-menu offset-y open-on-hover v-if="customDomainList.length > 1">
              <v-btn slot="ref" color="warning" elevation="0" x-small
                >+{{ customDomainList.length - 1 }}</v-btn
              >
              <div class="bg-white pd-10 fz-14">
                <div
                  class="pd-5"
                  v-for="(row, j) in customDomainList.slice(1)"
                  :key="j"
                >
                  <h-domain :val="customDomainList[1 + j].domain" />
                </div>
              </div>
            </e-menu>
          </e-kv>
        </v-col>
        <v-col sm="6" class="basic-settings-item">
          <e-kv label="Type" min-width="120px" labelColor="#6c7789">{{
            extraData.arweave.sync ? "Arweave" : "IPFS"
          }}</e-kv>
        </v-col>
        <v-col
          sm="6"
          class="basic-settings-item"
          v-if="!extraData.arweave.sync"
        >
          <e-kv
            label="Dedicated Gateway"
            min-width="120px"
            labelColor="#6c7789"
            >{{ bucketDefaultGateWay }}</e-kv
          >
        </v-col>
      </v-row>
    </div>
    <div class="delete bg-white">
      <h3>Delete Bucket</h3>
      <div class="mt-4 al-c space-btw">
        <span class="mr-4 gray"
          >Caution: This bucket will be permanently deleted, including any
          linked domains. Please ensure that the bucket is empty before
          proceeding with the deletion!</span
        >
        <v-btn small outlined color="red" @click="onDelete"> Delete</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import HDomain from "@/views/hosting/common/h-domain";
import Domain from "@/views/bucket/domain/domain.vue";
export default {
  name: "bucket-overview",
  props: {
    active: Boolean,
  },
  data() {
    return {
      headers: [
        { text: "Type", value: "systemAllo", sortable: false },
        { text: "Bucket Domain Name", value: "domain", sortable: false },
        { text: "HTTPS", value: "isHttps", sortable: false },
        {
          text: "Global Edge Network",
          value: "globalEdgeNetwork",
          sortable: false,
        },
      ],
      domainList: [],
      domainArr: [],
      customDomainList: [],
      bucketName: "",
      basicStatisticsData: [],
      extraData: {},
      tableLoading: true,
      arLoading: false,
      isAr: false,
      domain: "",
      adding: false,
    };
  },
  created() {
    this.bucketName = this.$route.path.split("/")[3];
    this.getData();
  },
  computed: {
    ...mapState({
      s3: (s) => s.moduleS3.s3,
    }),
    ...mapGetters(["bucketDefaultGateWay"]),
  },

  methods: {
    getData() {
      this.getBasicStatisticsData();
      this.getDomainData();
      this.getExtraData();
      this.getDomainList();
    },
    // get basicStatistics Data
    async getBasicStatisticsData() {
      this.basicStatisticsData = [];
      try {
        const { data } = await this.$http.get(
          `/bi/overview/${this.bucketName}`
        );
        for (const item in data) {
          switch (item) {
            case "storageUsage":
              // console.log(this.basicStatisticsData);
              this.basicStatisticsData.push({
                name: "Storage Usage",
                value: this.$utils.getFileSize(data[item], true),
              });
              break;
            case "trafficPast30d":
              this.basicStatisticsData.push({
                name: "Traffic within 30 Days",
                value: this.$utils.getFileSize(data[item], true),
              });
              break;
            case "visitsPast30d":
              this.basicStatisticsData.push({
                name: "Visits within 30 Days",
                value: data[item],
              });
              break;
            case "files":
              this.basicStatisticsData.push({
                name: "Files",
                value: data[item],
              });
              break;
            default:
              this.basicStatisticsData.push({
                name: "Fragments",
                value: data[item],
              });
              break;
          }
        }
      } catch (error) {
        console.log(error, "err");
      }
    },

    async getDomainList() {
      try {
        const { data } = await this.$http({
          methods: "get",
          url: "$bucektDomain/domain/v1/list",
          params: {
            businessId: this.bucketName,
            businessType: 1,
          },
        });
        this.domainArr = data.content;
      } catch (error) {
        console.log(error);
      }
    },
    async getDomainData() {
      try {
        const { data } = await this.$http({
          url: "$bucektDomain/domain/bucket/list",
          methods: "get",
          params: {
            bucketName: this.bucketName,
            displaySysAssign: 1,
          },
        });
        data.list.forEach((item) => {
          item.isHttps =
            item.systemAlloc ||
            Number(item.certificateExpiredAt) > new Date().getTime() / 1000;
        });
        this.tableLoading = false;
        this.domainList = data.list;
        this.customDomainList = data.list.filter((it) => !it.systemAlloc);
      } catch (err) {
        console.log(err, "err");
      }
    },
    async getExtraData() {
      try {
        const { data } = await this.$http({
          url: "/buckets/extra",
          methods: "get",
          params: {
            name: this.bucketName,
          },
        });
        this.$setState({
          curBucketInfo: data.list[0],
        });

        data.list[0].createdAt = new Date(
          Number(data.list[0].createdAt * 1000)
        ).format();
        this.extraData = data.list[0];
        this.isAr = this.extraData.arweave.sync;
      } catch (err) {
        console.log(err, "err");
      }
    },
    async onAdd() {
      try {
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value “${this.domain}” is an unqualified domain name.`
          );
        }
        this.adding = true;
        await this.$http.post("$bucektDomain/domain/bucket", {
          domain: this.domain,
          bucketName: this.bucketName,
        });
        await this.getData();
        this.$toast("Added successfully");
        this.domain = "";
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    async syncBucket(name, sync) {
      try {
        this.arLoading = true;
        await this.$http.post("/arweave/buckets/" + name, {
          sync,
        });
        this.arLoading = false;
      } catch (error) {
        this.arLoading = false;
        console.log(error);
      }
    },

    async onDelete() {
      try {
        let html = `The following bucket will be permanently deleted. Are you sure you want to continue?`;
        await this.$confirm(html, `Remove Bucket`);
        await this.bucketEmpty(this.bucketName);
        await this.delBucket(this.bucketName);
        this.$toast("delete successfully!");
        this.$router.push("/bucket/storage/");
      } catch (err) {
        if (err.message) this.$alert(err.message);
      }
    },
    async bucketEmpty(name) {
      let params = {
        cursor: 0,
        prefix: "",
        bucket: name,
      };
      const { data } = await this.$http({
        url: "/snapshots",
        methods: "get",
        params: params,
      });
      if (data.list.length)
        throw new Error("The bucket you tried to delete is not empty");
    },
    delBucket(Bucket) {
      return new Promise((resolve, reject) => {
        this.s3.deleteBucket(
          {
            Bucket,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
    },

    async onSyncBucket() {
      try {
        if (this.arLoading) return;
        this.arLoading = true;
        if (!this.isAr) {
          await this.$confirm(
            "When you close sync to AR, it will become closing status, and you won't be able to properly close it until all your files have been synchronized. Are you sure you want to close it?"
          );
        } else {
          await this.beforeArSync();
        }
        await this.syncBucket(this.bucketName, this.isAr);
        await this.getExtraData();
        await this.$sleep(500);
      } catch (error) {
        this.isAr = !this.isAr;
        console.log(error);
      }
      this.arLoading = false;
    },
    async beforeArSync() {
      const skey = "arTipOff";
      if (localStorage[skey]) return;
      const html =
        `<ul>` +
        "<li>Supports all AR public gateway access</li>" +
        "<li class='mt-2'>Permanent storage is not removable, and file sizes are limited to 100M</li>" +
        "<li class='mt-2'>Consumes AR storage</li>" +
        "</ul>";
      const fn = (data) => {
        if (data.form1.noShow) localStorage[skey] = 1;
      };
      return this.$confirm(html, "Sync to AR", {
        comp1: "no-show-form",
      })
        .then((data) => {
          fn(data);
          return data;
        })
        .catch((data) => {
          fn(data);
          throw new Error();
        });
    },
  },
  watch: {
    active(value) {
      if (value) {
        this.tableLoading = true;
        this.basicStatisticsData = [];
        this.domainList = [];
        this.extraData = {};
        this.getData();
      }
    },
  },
  components: {
    HDomain,
    Domain,
  },
};
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
}
.overview-container {
  .basic-statistics,
  .domain-names,
  .basic-settings,
  .delete {
    padding: 23px 30px 29px;
    margin-bottom: 30px;
    border-radius: 10px;
    border: 1px solid #d0dae9;
    box-sizing: border-box;
  }
  .basic-statistics {
    background: #f8fafb;
    .basic-statistics-content {
      flex-wrap: wrap;
      .basic-statistics-item {
        position: relative;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        font-size: 14px;
        color: #6c7789;
        box-sizing: border-box;
        .item-title {
          margin-bottom: 7px;
        }
        .item-data {
          color: #ff8833;
          font-size: 30px;
          line-height: 35px;
          .item-unit {
            color: #0b0817;
          }
        }
      }
      // .basic-statistics-item::before {
      //   content: "";
      //   display: block;
      //   position: absolute;
      //   left: 0;
      //   top: 50%;
      //   transform: translateY(-50%);
      //   width: 1px;
      //   height: 29px;
      //   background: #d0dae9;
      // }
      // .basic-statistics-item:first-of-type::before {
      //   display: none;
      // }
    }
  }

  .basic-settings {
    .basic-settings-content {
      margin: 0;
      .basic-settings-item {
        // width: 50%;
        padding: 20px 0;
        color: #0b0817;
        font-size: 14px;
        .synced-ar {
          color: #3195ff;
        }
      }
    }
  }
}
</style>
