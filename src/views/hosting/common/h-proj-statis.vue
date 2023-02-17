<template>
  <div class="bd-1 bdc-d0 bdrs-8 pa-4 pos-r">
    <!-- <div
      class="bg-d0 pos-center"
      style="height: 40px; width: 1px"
      v-if="!asMobile"
    ></div> -->
    <v-row class="justify-space-around">
      <v-col class="flex-1" cols="12" :sm="2" v-for="(it, j) in info" :key="j">
        <div class="gray fz-14 ta-c">
          {{ it.title }}
        </div>
        <div class="color-1 mt-1 ta-c">
          <span class="fw-b fz-20">{{ it.num }}</span>
          <span class="fz-13 ml-2">{{ it.unit }}</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    info: Array,
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>