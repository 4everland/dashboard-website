<template>
  <div class="overview-container">
    <div class="basic-statistics">
      <h3>Basic Statistics</h3>
      <v-row class="basic-statistics-content">
        <v-col
          v-for="item in basicStatisticsData"
          :key="item.name"
          xl=""
          lg=""
          md=""
          cols="auto"
          class="basic-statistics-item"
        >
          <span class="item-title">{{ item.name }}</span>
          <span class="item-data">{{ item.data }}</span>
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
        <v-col
          lg="6"
          xl="6"
          md="6"
          sm="12"
          cols="12"
          class="basic-settings-item"
        >
          <span class="item-title">Created At</span>
          <span class="item-data">Mar 21, 2022, 14:55</span>
        </v-col>
        <v-col
          lg="6"
          xl="6"
          md="6"
          sm="12"
          cols="12"
          class="basic-settings-item"
        >
          <span class="item-title">Sync to AR</span>
          <span class="item-data">ON</span>
        </v-col>
        <v-col
          lg="6"
          xl="6"
          md="6"
          sm="12"
          cols="12"
          class="basic-settings-item"
        >
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
        <v-col
          lg="6"
          xl="6"
          md="6"
          sm="12"
          cols="12"
          class="basic-settings-item"
        >
          <span class="item-title">Storage Class</span>
          <span class="item-data">IPFS</span>
        </v-col>
        <v-col
          lg="6"
          xl="6"
          md="6"
          sm="12"
          cols="12"
          class="basic-settings-item"
        >
          <span class="item-title">Access Control List (ACL)</span>
          <span class="item-data">Mar 21, 2022, 14:55</span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
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
      basicStatisticsData: [
        { name: "Storage Usage", data: "87.92" },
        { name: "Past 30 days of traf", data: "87.92 B" },
        { name: "Past 30 days of visi", data: "87.92" },
        { name: "Files", data: "87.92" },
        { name: "Parts", data: "87.92" },
      ],
    };
  },
  created() {
    // this.getData();
  },
  methods: {
    async getData() {
      const result = await this.$http.get("/bi/charts/line");
      console.log(result);
    },
  },
};
</script>

<style lang="scss" scoped>
.overview-container {
  .basic-statistics,
  .domain-names,
  .basic-settings {
    padding: 23px 30px 29px;
    margin-bottom: 30px;
    border-radius: 10px;
    border: 1px solid #d0dae9;
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