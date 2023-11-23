<template>
  <div>
    <div class="d-flex al-c mb-2">
      <e-right-opt-wrap style="width: 100%" :top="-60">
        <e-radio-btn
          class="ml-auto"
          minWidth="110px"
          minHeight="32px"
          :options="typeList"
          v-model="typeIdx"
        ></e-radio-btn>
      </e-right-opt-wrap>
    </div>
    <api-list v-if="typeIdx == 0" />
    <api-status v-if="typeIdx == 1" />
  </div>
</template>

<script>
import apiList from "./list.vue";
import apiStatus from "./status.vue";
export default {
  name: "RpcIndex",
  components: {
    apiList,
    apiStatus,
  },
  data() {
    return {
      typeList: ["API Lists", "Stats"],
      typeIdx: 0,
    };
  },
  created() {},
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
