<template>
  <div class="overview-container">
    <div class="basic-statistics">
      <h3>Basic Statistics</h3>
      <v-row class="basic-statistics-content">
        <v-col v-if="!basicStatisticsData.length">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-col>

        <v-col
          v-for="item in basicStatisticsData"
          :key="item.name"
          sm
          cols
          class="basic-statistics-item"
        >
          <div class="item-title">{{ item.name }}</div>
          <div class="item-data">
            <span>{{
              typeof item.value == "object" ? item.value.num : item.value
            }}</span>
            <span v-if="item.value != 'object'" class="item-unit ml-2 fz-14">{{
              item.value.unit
            }}</span>
          </div>
          <!-- <span class="item-data">{{ typeof item.value == 'Object' ? item.value. : }}</span> -->
        </v-col>
      </v-row>
    </div>
    <div class="domain-names">
      <h3>Domain Names</h3>
      <div>
        <v-data-table
          class="hide-bdb"
          :headers="headers"
          :items="list"
          :loading="tableLoading"
          item-key="name"
          no-data-text=""
          loading-text=""
          hide-default-footer
          disable-pagination
        >
        </v-data-table>
      </div>
    </div>
    <div class="basic-settings">
      <h3>Basic Settings</h3>
      <v-row class="basic-settings-content">
        <v-col md="6" sm="12" cols="12" class="basic-settings-item">
          <span class="item-title">Created At</span>
          <span class="item-data">Mar 21, 2022, 14:55</span>
        </v-col>
        <v-col md="6" cols="12" class="basic-settings-item">
          <span class="item-title">Sync to AR</span>
          <span class="item-data">ON</span>
        </v-col>
        <v-col md="6" cols="12" class="basic-settings-item">
          <span class="item-title">Custom Domain</span>
          <span class="item-data mr-2">hahahha.link</span>
          <e-menu offset-y offset-x open-on-hover>
            <v-btn slot="ref" color="warning" elevation="0" x-small rounded
              >+1</v-btn
            >
            <div class="bg-white pd-10 fz-14">
              <p>2323</p>
              <p>2323</p>
              <p>2323</p>
            </div>
          </e-menu>
        </v-col>
        <v-col md="6" cols="12" class="basic-settings-item">
          <span class="item-title">Storage Class</span>
          <span class="item-data">IPFS</span>
        </v-col>
        <v-col md="6" cols="12" class="basic-settings-item">
          <span class="item-title">Access Control List (ACL)</span>
          <span class="item-data">Mar 21, 2022, 14:55</span>
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
        { text: "Type", value: "type" },
        { text: "Bucket Domain Name", value: "name" },
        { text: "HTTPS", value: "isHttps" },
        { text: "Global Edge Network", value: "isGlobalNetwork" },
      ],
      list: [
        {
          type: "Assign Domain",
          name: "newbucket.4everland.store",
          isHttps: "Supported",
          isGlobalNetwork: "Supported",
        },
        {
          type: "Custom Domain",
          name: "yuliao.cn",
          isHttps: "Supported",
          isGlobalNetwork: "Supported",
        },
      ],

      bucketName: "",
      basicStatisticsData: [],
      tableLoading: true,
    };
  },
  created() {
    console.log(this.$route.path.split("/")[3]);
    this.bucketName = this.$route.path.split("/")[3];
    this.getData();
  },
  methods: {
    getData() {
      this.getBasicStatisticsData();
      this.getDomainData();
      this.getExtraData();
    },
    async getBasicStatisticsData() {
      try {
        const { data } = await this.$http.get(
          `/bi/overview/${this.bucketName}`
        );
        for (const item in data) {
          switch (item) {
            case "storageUsage":
              console.log(this.basicStatisticsData);
              this.basicStatisticsData.push({
                name: "Storage Usage",
                value: this.$utils.getFileSize(data[item], true),
              });
              break;
            case "trafficPast30d":
              this.basicStatisticsData.push({
                name: "Past 30 days of traffic",
                value: this.$utils.getFileSize(data[item], true),
              });
              break;
            case "visitsPast30d":
              this.basicStatisticsData.push({
                name: "Past 30 days of visits",
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
                name: "Parts",
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
            name: this.bucketName,
            displaySysAssign: 1,
          },
        });
        this.tableLoading = false;
        this.domainList = data;
        console.log(data, "domainData-0-----");
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
        console.log(data, "extraData-0-----");
      } catch (err) {
        console.log(err, "err");
      }
    },
  },
  watch: {
    active(value) {
      if (value) {
        this.tableLoading = true;
        this.basicStatisticsData = {};
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
      .basic-statistics-item::before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 29px;
        background: #d0dae9;
      }
      .basic-statistics-item:first-of-type::before {
        display: none;
      }
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
        .item-title {
          display: inline-block;
          // width: 200px;
          color: #6c7789;
        }
        .item-data {
          margin-left: 34px;
        }
      }
    }
  }
}
</style>