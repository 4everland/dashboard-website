<template>
  <div class="step-progress">
    <svg
      style="overflow: initial"
      xmlns="http://www.w3.org/2000/svg"
      width="494"
      height="198"
      viewBox="0 0 494 198"
      fill="none"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #0fe1f8; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #1102fc; stop-opacity: 1" />
        </linearGradient>
      </defs>
      <path
        v-for="(segment, index) in pathSegments"
        :key="index"
        :d="segment.d"
        :stroke="segment.points <= currentPoints ? '#0fe1f8' : '#2B364F'"
        stroke-width="8"
        stroke-linecap="round"
      />

      <circle
        v-for="(step, index) in steps"
        :key="index"
        :cx="step.cx"
        :cy="step.cy"
        r="10"
        :fill="step.points <= currentPoints ? '#4caf50' : '#ccc'"
        stroke="#333"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    currentPoints: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      steps: [
        { cx: 140, cy: 4, points: 10 },
        { cx: 320, cy: 4, points: 20 },
        { cx: 474, cy: 4, points: 30 },
        { cx: 474, cy: 99, points: 40 },
        { cx: 300, cy: 99, points: 50 },
        { cx: 20, cy: 99, points: 70 },
        { cx: 200, cy: 194, points: 80 },
        { cx: 300, cy: 194, points: 100 },
      ],
      pathSegments: [
        { d: "M4 4H140", points: 10 },
        { d: "M140 4H320", points: 20 },
        { d: "M320 4H474", points: 30 },
        {
          d: "M474 4C482.837 4 490 11.1634 490 20V83C490 91.8366 482.837 99 474 99H300",
          points: 40,
        },
        { d: "M300 99H20", points: 50 },
        {
          d: "M20 99C11.1634 99 4 106.163 4 115V178C4 186.837 11.1634 194 20 194H200",
          points: 70,
        },
        { d: "M200 194H300", points: 80 },
        { d: "M300 194H490", points: 100 },
      ],
    };
  },
};
</script>

<style scoped>
.step-progress {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(14, 108, 198, 0);
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
}
</style>
