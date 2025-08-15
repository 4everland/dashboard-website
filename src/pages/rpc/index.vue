<template>
  <div style="height: 100%">
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div v-if="!onChain" class="activate">
      <div class="empty">
        <div class="pa-3 mt-5 ta-c">
          <img src="/img/svg/gateway/lock.svg" width="180" />
        </div>
        <div class="d-flex f-center">
          <div style="max-width: 550px">
            Activate your account to unlock the RPC.
          </div>
        </div>
        <div
          class="ta-c mt-8"
          :class="{
            hidden:
              teamInfo.isMember && teamInfo.access?.indexOf('RESOURCE') == -1,
          }"
        >
          <v-btn color="primary" width="120" @click="handleUpgrad"
            >Activate</v-btn
          >
        </div>
      </div>
    </div>
    <div v-else>
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
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
import { mapState, mapGetters } from "vuex";
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
      breadcrumbsItems: [
        {
          text: "RPC",
          disabled: true,
        },
      ],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["teamInfo"]),
    ...mapState({
      onChain: (s) => s.onChain,
    }),
  },
  methods: {
    handleUpgrad() {
      bus.$emit("showDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
.activate {
  height: 100%;
  position: relative;
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -90%);
  }
}
</style>
