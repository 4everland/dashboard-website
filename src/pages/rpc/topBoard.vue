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
            <span class="data-value">10</span>
            <span class="data-unit">K</span>
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
  data() {
    return {
      rpcData: [
        {
          title: "CU Usage (24hrs)",
          icon: require("/public/img/svg/rpc/cu.svg"),
          value: "",
        },
        {
          title: "Total Requests (24hrs)",
          icon: require("/public/img/svg/rpc/total.svg"),
          value: "",
        },
        {
          title: "Success Rate (24hrs)",
          icon: require("/public/img/svg/rpc/rate.svg"),
          value: "",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {},
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
