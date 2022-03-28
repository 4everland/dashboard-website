<template>
  <div class="pd-20 ta-c">
    <v-skeleton-loader type="article" v-if="loading" />
    <v-row v-else>
      <v-col cols="12" md="6" lg="4" v-for="(it, i) in usageList" :key="i">
        <h4 class="mb-3">{{ it.title }}</h4>
        <v-progress-circular
          :class="'circular-' + i"
          :rotate="-90"
          :size="136"
          :width="12"
          :value="it.value"
          :color="it.color"
        >
          <b class="fz-25">{{ it.used }}</b>
          <sub class="gray ml-1">{{ it.unit }}</sub>
        </v-progress-circular>
        <div class="mt-3">{{ it.total }} {{ it.unit }}</div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      info: (s) => s.usageInfo,
      noticeMsg: (s) => s.noticeMsg,
      token: (s) => s.token(),
    }),
    usageList() {
      const info = this.info;
      return [
        {
          title: "IPFS Storage",
          total: info.ipfsTotal,
          used: info.ipfsUsed,
          value: parseInt((info.ipfsUsed * 100) / info.ipfsTotal),
          unit: "MB",
          color: "primary",
        },
        {
          title: "AR Storage",
          total: info.arTotal,
          used: info.arUsed,
          value: parseInt((info.arUsed * 100) / info.arTotal),
          unit: "MB",
          color: "success",
        },
      ];
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    if (this.token) {
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      try {
        await this.$store.dispatch("getUsageInfo");
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>