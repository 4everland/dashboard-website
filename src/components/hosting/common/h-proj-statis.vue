<template>
  <div class="bd-1 bdc-d0 bdrs-8 pa-4 pos-r">
    <div
      class="bg-d0 pos-center"
      style="height: 40px; width: 1px"
      v-if="!asMobile"
    ></div>
    <v-row>
      <v-col cols="12" md="6" class="al-c" v-for="(arr, i) in info" :key="i">
        <div
          class="flex-1"
          :class="i == 0 || asMobile ? 'pl-2' : 'pl-4'"
          v-for="(it, j) in arr"
          :key="j"
        >
          <div class="gray fz-14">
            {{ it.title }}
          </div>
          <div class="color-1 mt-1">
            <span class="fw-b fz-20">{{ it.num }}</span>
            <span class="fz-13 ml-2">{{ it.unit }}</span>
          </div>
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