<style lang="scss">
.circular-0 {
  .v-progress-circular__underlay {
    stroke: #e5e9ea;
  }
}
</style>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="7">
        <pay-act />
      </v-col>
      <v-col cols="12" md="5">
        <pay-balance />
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <div class="pa-5">
        <div class="al-c hover-1" @click="$navTo('/resource/allocation')">
          <span class="gray-5">Resource Allocation</span>
          <span class="gray fz-14 ml-auto">More</span>
          <v-icon>mdi-chevron-right</v-icon>
        </div>
        <div class="pa-5" v-if="!usageInfo">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </div>
        <v-row class="mt-4" v-else>
          <v-col
            v-for="(it, i) in typeList"
            :key="i"
            cols="6"
            md="3"
            class="ta-c"
          >
            <div class="al-c f-center mb-3">
              <span>{{ it.label }}</span>
              <e-tooltip top>
                <v-icon slot="ref" color="#999" size="14" class="ml-2"
                  >mdi-alert-circle</v-icon
                >
                <span>{{ it.desc }} </span>
              </e-tooltip>
            </div>
            <v-progress-circular
              class="circular-0"
              :rotate="-90"
              :size="130"
              :width="20"
              :value="it.perc"
              :color="it.color"
            >
              <span class="fz-17 gray-3">{{ it.perc }}%</span>
            </v-progress-circular>
            <div class="mt-3 gray-6 fz-14 mb-1">
              <p>{{ it.percTxt }}</p>
            </div>
            <div
              class="mb-2 fz-12 gray"
              :class="{
                'op-0': !it.expired,
              }"
            >
              {{ it.expired || "0" }}
            </div>
            <div class="fz-15">
              <e-link :href="'/resource/subscribe?i=' + i">{{
                it.expired ? "Expansion" : "Purchase"
              }}</e-link>
              <e-link
                :href="'/resource/subscribe?t=1&i=' + i"
                v-if="it.expired"
                class="ml-3"
                >Renewal</e-link
              >
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import mixin from "./mixin-usage";

export default {
  mixins: [mixin],
  mounted() {
    this.getUsage();
  },
  methods: {},
};
</script>