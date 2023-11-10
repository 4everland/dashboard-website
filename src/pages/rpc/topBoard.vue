<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" v-for="(item, index) in rpcData" :key="index">
        <div class="top-item">
          <div class="d-flex al-c">
            <img :src="item.icon" width="24" alt="" />
            <span class="top-tit">{{ item.title }}</span>
          </div>
          <div class="data-box">
            <span class="data-value">{{ item.value }}</span>
            <span class="data-unit" v-if="index == 0">K</span>
            <span class="data-unit" v-if="index == 2">%</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "RpcTopBoard",
  components: {},
  props: {
    overViewData: {
      type: Object,
      default() {
        return {
          rate: 0,
          requests: 0,
          usage: 0,
        };
      },
    },
  },
  data() {
    return {
      rpcData: [
        {
          title: "CU Usage ",
          defaultTitle: "CU Usage ",
          icon: require("/public/img/svg/rpc/cu.svg"),
          value: "0",
          key: "usage",
        },
        {
          title: "Total Requests ",
          defaultTitle: "Total Requests ",
          icon: require("/public/img/svg/rpc/total.svg"),
          value: "0",
          key: "requests",
        },
        {
          title: "Success Rate ",
          defaultTitle: "Success Rate ",
          icon: require("/public/img/svg/rpc/rate.svg"),
          value: "0",
          key: "rate",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    setOverView(days = 1) {
      this.rpcData.forEach((item) => {
        item.value = this.overViewData[item.key];
        if (days == 1) {
          item.title = item.defaultTitle + "(24hrs)";
        } else {
          item.title = item.defaultTitle + "(one Month)";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.top-item {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  padding: 24px;
  .top-tit {
    color: #54576a;
    font-size: 16px;
    font-weight: 700;
    margin-left: 4px;
  }
  .data-box {
    text-align: right;
    margin-top: 40px;
    .data-value {
      color: #000;
      font-size: 40px;
      font-weight: 700;
    }
    .data-unit {
      color: #000;
      font-size: 14px;
      font-weight: 400;
      margin-left: 8px;
    }
  }
}
</style>
