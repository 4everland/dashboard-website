<template>
  <div :id="domId" style="width: 100%; height: 100%; min-height: 300px"></div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    data: {
      type: Array,
    },
  },
  computed: {
    domId() {
      return "pie" + this.id;
    },
    colorList() {
      return { HOSTING: "#809AF4", BUCKET: "#5066CA", GATEWAY: "#94ADF6" };
    },
    options() {
      return {
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return `
              <div class="al-c">
                <span class="d-ib" style="width: 8px; height: 8px; background: ${params.color}; border-radius:50%"></span>
                <span class="ml-1">${params.name}</span>
                <span class="ml-2 fw-b fz-20" style="font-family: DIN Alternate;">${params.percent}%</span></div>
              <div class="mt-1 fz-12" style="color: #64748B">
                <span>${params.data.data}</span>
              </div>
          `;
          },
          show: this.length ? true : false,
        },
        series: [
          {
            type: "pie",
            minAngle: 10,
            radius: ["55%", "90%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              // position: "center",
            },
            itemStyle: {
              color: (colors) => {
                // if (this.landConsume == 0n) return "#94A3B8";
                if (!this.length) return "#94A3B8";
                return colors.data.color;
              },
            },
            data: this.dataOptions,
          },
        ],
      };
    },
    dataOptions() {
      if (!this.length) return [{ value: 0, name: "" }];
      return this.data.map((it) => {
        return { ...it, color: this.colorList[it.name] };
      });
    },
    length() {
      return this.data.filter((it) => it.value != "0").length;
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById(this.domId));
    this.myChart.setOption(this.options);
    const fn = window.onresize;
    window.onresize = () => {
      fn();
      this.myChart.resize();
    };
  },
  watch: {
    dataOptions() {
      this.myChart.setOption(this.options);
    },
  },
};
</script>

<style lang="scss" scoped></style>
