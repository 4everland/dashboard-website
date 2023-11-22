<template>
  <div class="al-c">
    <div class="hours mr-2">
      <span class="d-ib label">{{ hours }}</span>
      <span class="fz-14">Hours</span>
    </div>
    <div class="minutes mr-2">
      <span class="d-ib label">{{ minutes }}</span>
      <span class="fz-14">Mins</span>
    </div>
    <div class="seconds">
      <span class="d-ib label">{{ seconds }}</span>
      <span class="fz-14">Sec</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    endTimeStamp: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      curTimeStamp: +new Date() / 1e3,
      timeInterval: null,
    };
  },
  computed: {
    residueTimeStamp() {
      return Math.ceil(this.endTimeStamp - this.curTimeStamp);
    },
    hours() {
      const hours = Math.floor(this.residueTimeStamp / 3600);
      return hours < 10 ? "0" + hours : hours;
    },
    minutes() {
      const mins = Math.floor(this.residueTimeStamp / 60) % 60;
      return mins < 10 ? "0" + mins : mins;
    },
    seconds() {
      const secs = this.residueTimeStamp % 60;
      return secs < 10 ? "0" + secs : secs;
    },
  },

  created() {
    this.initInterval();
  },
  methods: {
    initInterval() {
      if (this.residueTimeStamp < 0) return;
      this.timeInterval = setInterval(() => {
        this.curTimeStamp = +new Date() / 1e3;
        if (this.residueTimeStamp < 0) {
          clearInterval(this.timeInterval);
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  padding: 8px 4px;
  margin-right: 4px;
  font-size: 20px;
  color: #fff;
  font-family: "DIN Alternate";
  border-radius: 4px;
  background: #735ea1;
}
</style>
