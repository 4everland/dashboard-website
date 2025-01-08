<template>
  <div class="al-c align-center justify-center">
    <div class="hours">
      <span class="d-ib label">{{ hours }}</span>
      <span>H :</span>
    </div>
    <div class="minutes">
      <span class="d-ib label">{{ minutes }}</span>
      <span>M :</span>
    </div>
    <div class="seconds">
      <span class="d-ib label">{{ seconds }}</span>
      <span>S</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    endTimeStamp: {
      type: Number,
      required: true,
      default: 1
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
      const _residueTimeStamp = Math.ceil(this.endTimeStamp - this.curTimeStamp);
      return _residueTimeStamp < 0 ? 0 : _residueTimeStamp;
    },
    hours() {
      const hours = Math.floor(this.residueTimeStamp / 3600);
      return hours < 10 ? "0" + hours : hours<0? "00" : hours;
    },
    minutes() {
      const mins = Math.floor(this.residueTimeStamp / 60) % 60;
      return mins < 10 ? "0" + mins : mins < 0? "00" : mins;
    },
    seconds() {
      const secs = this.residueTimeStamp % 60;
      return secs < 10 ? "0" + secs : secs < 0? "00" : secs;
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
          this.$emit("timeOver");

          clearInterval(this.timeInterval);
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
