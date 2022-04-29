<style lang="scss">
.usage-info {
  label {
    width: 120px;
  }
}
</style>
<template>
  <div class="usage-info">
    <div class="d-flex mt-5" v-for="(it, i) in list" :key="i">
      <label class="ta-r fz-15 mr-1">{{ it.label }}:</label>
      <div style="width: 50%">
        <div class="pa-2">
          <v-progress-linear
            :value="30"
            height="10"
            rounded
          ></v-progress-linear>
          <p class="mt-2 fz-12 gray">
            {{ it.desc }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 ml-5">
      <v-btn color="primary" to="/usage/more" rounded>Get more</v-btn>
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
        },
        {
          label: "Build Minutes",
          desc: "（Free 250Minutes  per month,  0 GB purchased）（ Recharge used 50MB）",
        },
      ],
    };
  },
};
</script>