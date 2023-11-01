<template>
  <div :id="domId" style="width: 100%; height: 100%; min-height: 300px"></div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      option: {
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["50%", "90%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              // position: "center",
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: 40,
            //     fontWeight: "bold",
            //   },
            // },
            // labelLine: {
            //   show: false,
            // },
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
            ],
          },
        ],
      },
    };
  },
  computed: {
    domId() {
      return "pie" + this.id;
    },
  },
  mounted() {
    var myChart = echarts.init(document.getElementById(this.domId));
    myChart.setOption(this.option);
    const fn = window.onresize;
    window.onresize = () => {
      fn();
      myChart.resize();
    };
  },
};
</script>

<style lang="scss" scoped></style>
