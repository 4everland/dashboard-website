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
      <div>
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
      </div>
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
          <e-kv label="Sync to AR" min-width="120px" labelColor="#6c7789">
            <span
              :class="extraData.arweave.sync ? 'synced-ar' : 'no-synced-ar'"
              >{{ extraData.arweave.sync ? "ON" : "OFF" }}</span
            >
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
          <e-kv label="Storage Class" min-width="120px" labelColor="#6c7789">{{
            extraData.storageClass
          }}</e-kv>
        </v-col>
      </v-row>
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
      customDomainList: [],
      bucketName: "",
      basicStatisticsData: [],
      extraData: {},
      tableLoading: true,
    };
  },
  created() {
    // console.log(this.$route.path.split("/")[3]);
    this.bucketName = this.$route.path.split("/")[3];
    this.getData();
  },
  methods: {
    getData() {
      this.getBasicStatisticsData();
      this.getDomainData();
      this.getExtraData();
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
    async getDomainData() {
      try {
        const { data } = await this.$http({
          url: "/domains",
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
      } catch (err) {
        console.log(err, "err");
      }
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
};
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
}
.overview-container {
  .basic-statistics,
  .domain-names,
  .basic-settings {
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