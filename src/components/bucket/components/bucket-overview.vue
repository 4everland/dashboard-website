<template>
  <div class="overview-container">
    <div class="basic-statistics">
      <h3>Basic Statistics</h3>
      <div
        class="
          basic-statistics-content
          d-flex
          align-center
          justify-space-around
        "
      >
        <div class="basic-statistics-item first-item">
          <span class="item-title">Storage Usage</span>
          <span class="item-data">87.92</span>
        </div>
        <div class="basic-statistics-item">
          <span class="item-title">Past 30 days of traf</span>
          <span class="item-data">87.92 B</span>
        </div>
        <div class="basic-statistics-item">
          <span class="item-title">Past 30 days of visi</span>
          <span class="item-data">3,213</span>
        </div>
        <div class="basic-statistics-item">
          <span class="item-title">Files</span>
          <span class="item-data">1,674</span>
        </div>
        <div class="basic-statistics-item">
          <span class="item-title">Parts</span>
          <span class="item-data">0</span>
        </div>
      </div>
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
      <div class="basic-settings-content">
        <div class="basic-settings-item">
          <span class="item-title">Created At</span>
          <span class="item-data">Mar 21, 2022, 14:55</span>
        </div>
        <div class="basic-settings-item">
          <span class="item-title">Sync to AR</span>
          <span class="item-data">ON</span>
        </div>
        <div class="basic-settings-item">
          <span class="item-title">Custom Domain</span>
          <span class="item-data">Mar 21, 2022, 14:55</span>
        </div>
        <div class="basic-settings-item">
          <span class="item-title">Storage Class</span>
          <span class="item-data">IPFS</span>
        </div>
        <div class="basic-settings-item">
          <span class="item-title">Access Control List (ACL)</span>
          <span class="item-data">Mar 21, 2022, 14:55</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: true,
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
    };
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
        width: 20%;
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
      .basic-statistics-item:not(.first-item)::before {
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
    }
  }

  .basic-settings {
    .basic-settings-content {
      display: flex;
      flex-wrap: wrap;
      .basic-settings-item {
        width: 50%;
        padding: 20px 0;
        color: #0b0817;
        font-size: 16px;
        .item-title {
          display: inline-block;
          width: 200px;
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