<template>
  <div v-if="loading">
    <v-skeleton-loader type="article"></v-skeleton-loader>
  </div>
  <div v-else>
    <v-tabs v-model="tabIdx" class="bd-1 e-tabs-2">
      <v-tab v-for="(it, i) in typeList" :key="i">{{ it.label }}</v-tab>
    </v-tabs>
    <div class="al-c mt-5">
      <span class="color-1" v-if="curType.name == 'time'"> Hosting </span>
      <span class="color-1" v-else-if="curType.name == 'ar'">Bucket</span>
      <e-radio-btn
        v-else
        :options="['Hosting', 'Bucket']"
        v-model="platIdx"
      ></e-radio-btn>

      <span class="gray-6 fz-12 ml-auto">{{ curType.percTxt }}</span>
      <e-tooltip top>
        <v-icon
          slot="ref"
          color="#999"
          size="13"
          class="ml-1 mr-2"
          style="margin-bottom: 2px"
          >mdi-alert-circle</v-icon
        >
        <span>{{ curType.desc }} </span>
      </e-tooltip>
      <v-progress-linear
        class="bdrs-10 e-progress-1"
        style="width: 120px"
        :color="curType.color || 'primary'"
        :value="curType.perc || 0"
        height="6"
      ></v-progress-linear>
    </div>

    <div class="mt-7">
      <div class="pos-r mb-4" v-for="(it, i) in dataList" :key="i">
        <div
          class="bdrs-2"
          style="background: #f5f0ff; height: 30px"
          :style="{
            width: it.perc * 100 + '%',
          }"
        ></div>
        <div class="al-c pos-mask">
          <span class="fz-15 ml-2">{{ it.label }}</span>
          <span class="ml-auto mr-2 gray-6 fz-14">
            {{ it.val }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin-usage";

export default {
  mixins: [mixin],
  data() {
    return {
      tabIdx: 0,
      platIdx: 0,
      typeMap: {
        band: {
          k0: "usedBandwidth",
          k1: "bandWidthUsage",
        },
        time: {
          k0: "usedBuildTime",
        },
        ipfs: {
          k0: "usedStorage",
          k1: "storageUsage",
        },
        ar: {
          k1: "arUsage",
        },
      },
      list0: [],
      list1: [],
      loading: true,
    };
  },
  computed: {
    curType() {
      return this.typeList[this.tabIdx];
    },
    dataList() {
      let platIdx = this.platIdx;
      const { name } = this.curType;
      if (name == "time") platIdx = 0;
      else if (name == "ar") platIdx = 1;
      const list = platIdx == 0 ? this.list0 : this.list1;
      const key = this.typeMap[name][this.platIdx == 0 ? "k0" : "k1"];
      Array.sortArrayBy(list, key, true);
      let first = -1;
      return list.map((it) => {
        let val = it[key] || 0;
        let perc = 0;
        if (first == -1) {
          first = val;
          perc = val ? 1 : 0;
        } else {
          perc = val ? val / first : 0;
        }
        if (name == "time") val += " Min";
        else val = this.$utils.getFileSize(val);
        return {
          label: it.bucketName || it.projectName,
          val,
          perc,
        };
      });
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        await this.getUsage();
        const { data } = await this.$http2.get(
          "/project/resource/consume?type=BANDWIDTH"
        );
        this.list0 = data;
        // const {
        //   data: { list },
        // } = await this.$http.get("/bi/usages");
        // this.list1 = list;
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>