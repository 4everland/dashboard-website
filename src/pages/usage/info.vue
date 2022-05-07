<style lang="scss">
.usage-info {
  .label {
    width: 120px;
  }
  .m-progress {
    .v-progress-linear {
      background: #f9fbfc;
      .v-progress-linear__background {
        display: none;
      }
      &,
      & .v-progress-linear__determinate {
        border-radius: 100px;
      }
    }
  }
}
</style>

<template>
  <div class="usage-info">
    <div class="main-wrap auto pa-3">
      <div class="d-flex mt-8 mb-8 lh-1" v-for="(it, i) in list" :key="i">
        <div class="label ta-r fz-15 mr-1 pos-r">
          <span>{{ it.label }}:</span>
          <e-tooltip top v-if="it.tip">
            <v-icon :color="$color2" size="18" slot="ref"
              >mdi-alert-circle</v-icon
            >
            <span>{{ it.tip }}</span>
          </e-tooltip>
        </div>
        <div style="width: 50%">
          <div class="ml-2">
            <div class="m-progress">
              <v-progress-linear
                :color="it.color || 'primary'"
                :value="30"
                height="14"
                rounded
              ></v-progress-linear>
            </div>
            <p class="mt-3 fz-12 gray">
              {{ it.desc }}
            </p>
          </div>
        </div>
        <div class="color-1 fz-13 ml-2">30/100 {{ it.unit || "GB" }}</div>
        <span class="gray ml-2 fz-13">{{ it.rechargeTip }}</span>
      </div>
    </div>

    <div class="mt-5 ml-5 ta-r">
      <v-btn color="primary" to="/usage/more" rounded>Get more >></v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          label: "Bandwidth",
          desc: "（Free 100GB per month,  0 GB purchased）",
        },
        {
          label: "Storage IPFS",
        },
        {
          label: "Storage AR",
          tip: "AR is permanent storage.",
          // color: "#6acbff",
        },
        {
          label: "Build Minutes",
          desc: "（Free 250Minutes  per month,  0 GB purchased）",
          unit: "Minutes",
          rechargeTip: "（ Recharge used 50MB）",
        },
      ],
    };
  },
};
</script>