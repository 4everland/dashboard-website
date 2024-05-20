<template>
  <div class="progress-box">
    <v-img
      max-height="180"
      max-width="180"
      src="@/assets/imgs/raas/empty.svg"
    ></v-img>
    <div class="progress-text my-4">
      Rollup deployment in progress, currently at {{ progress }}%
    </div>
    <v-progress-linear
      :value="progress"
      height="8px"
      rounded
    ></v-progress-linear>
  </div>
</template>

<script>
import { fetchProgress } from "@/api/raas.js";
export default {
  name: "DashboardWebsiteProgress",

  data() {
    return {
      id: "",
      progress: 0,
      timer: null,
    };
  },

  mounted() {
    this.id = this.$route.params.id;

    this.getProgress();
  },
  destroyed() {
    clearTimeout(this.timer);
  },

  methods: {
    async getProgress() {
      const { data } = await fetchProgress(this.id);
      this.progress = data.progress;
      if (data.progress != "100") {
        this.timer = setTimeout(() => {
          this.getProgress();
        }, 10000);
      } else {
        this.$router.push("/raas");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-box {
  width: 100%;
  height: 100%;
  max-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  .progress-text {
    color: #475569;
    font-family: "SF Pro Text";
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
</style>
