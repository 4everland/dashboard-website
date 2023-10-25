<template>
  <div>
    <div class="select-box">
      <v-row>
        <v-col v-for="item in 3" :key="item">
          <div style="background-color: #fff">
            <v-select
              class="hide-msg"
              outlined
              :items="items"
              item-text="name"
              item-value="key"
              dense
              @change="handleChangeSelect"
              v-model="seleted"
            ></v-select>
          </div>
        </v-col>
      </v-row>
    </div>
    <top-board />

    <v-row class="mt-2">
      <v-col cols="12">
        <div class="api-list">
          <div class="d-flex al-c mb-8 justify-space-between">
            <span class="list-tit">Trends</span>
            <e-radio-btn
              class="ml-auto"
              minWidth="110px"
              minHeight="24px"
              :options="typeList"
              v-model="typeIdx"
            ></e-radio-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import topBoard from "./topBoard.vue";

export default {
  name: "RpcStatus",
  components: {
    topBoard,
  },
  data() {
    return {
      typeList: ["Requests", "CU"],
      typeIdx: 0,
      items: ["111", "222", "333"],
    };
  },
  created() {},
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.select-box {
  width: 100%;
  padding: 20px 0;
  position: sticky;
  top: 59px;
}
.select-box-sticky {
  background-color: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  padding: 20px;
}
.api-list {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  padding: 24px;
  .list-tit {
    color: #000;
    font-size: 24px;
    font-weight: 400;
  }
  .empty-box {
    text-align: center;
    padding: 90px 0;
    .empty-tips {
      color: #64748b;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      max-width: 640px;
      margin: 0 auto;
      margin-top: 24px;
    }
  }
  .list-box {
    .list-item {
      padding: 24px;
      justify-content: space-between;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }
  }
}
</style>
