<template>
  <div>
    <v-tabs v-model="tabIdx" class="bd-1 e-tabs-2">
      <v-tab v-for="(it, i) in typeList" :key="i">{{ it.label }}</v-tab>
    </v-tabs>
    <div class="al-c mt-5">
      <span class="color-1" v-if="curType.key == 'time'"> Hosting </span>
      <span class="color-1" v-else-if="curType.key == 'ar'">Bucket</span>
      <e-radio-btn
        v-else
        :options="['Hosting', 'Bucket']"
        v-model="platIdx"
      ></e-radio-btn>
    </div>

    <div class="mt-7">
      <div class="pos-r mb-4" v-for="(it, i) in dataList" :key="i">
        <div
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
export default {
  data() {
    return {
      tabIdx: 0,
      platIdx: 0,
      typeList: [
        {
          label: "Bandwidth",
          key: "band",
          k0: "usedBandwidth",
          k1: "bandWidthUsage",
        },
        {
          label: "Build Minutes",
          key: "time",
          k0: "usedBuildTime",
        },
        {
          label: "IPFS",
          // type: "IPFS_STORAGE",
          key: "ipfs",
          k0: "usedStorage",
          k1: "storageUsage",
        },
        {
          label: "Arweave",
          key: "ar",
          k1: "arUsage",
        },
      ],
      list0: [],
      list1: [],
    };
  },
  computed: {
    curType() {
      return this.typeList[this.tabIdx];
    },
    dataList() {
      let platIdx = this.platIdx;
      const { key } = this.curType;
      if (key == "time") platIdx = 0;
      else if (key == "ar") platIdx = 1;
      const list = platIdx == 0 ? this.list0 : this.list1;
      const k = this.curType[this.platIdx == 0 ? "k0" : "k1"];
      Array.sortArrayBy(list, k, true);
      let first = -1;
      return list.map((it) => {
        let val = it[k] || 0;
        let perc = 0;
        if (first == -1) {
          first = val;
          perc = val ? 1 : 0;
        } else {
          perc = val ? val / first : 0;
        }
        if (key == "time") val += " Min";
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
    this.getHosting();
  },
  methods: {
    async getHosting() {
      try {
        const { data } = await this.$http2.get(
          "/project/resource/consume?type=BANDWIDTH"
        );
        this.list0 = data;
      } catch (error) {
        //
      }
    },
  },
};
</script>