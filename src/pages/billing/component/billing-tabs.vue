<template>
  <div class="h-flex">
    <v-tabs
      v-model="tab"
      class="tabs-cpm"
      :centered="center"
      @change="handleChange"
    >
      <div class="d-flex tab-content">
        <v-tab
          active-class="active-tab"
          class="tab-cpm"
          v-for="item in tabs"
          :key="item"
          >{{ item }}
        </v-tab>
      </div>
    </v-tabs>
    <div class="flex-1">
      <slot :tab="tab"></slot>
      <component v-if="tabsCmpList.length" :is="tabsCmpList[tab]"></component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    noActive: {
      type: Boolean,
      default: false,
    },
    tabsCmpList: {
      type: Array,
      // required: true,
      default: () => {
        return [];
      },
    },
    center: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tab: 0,
    };
  },
  created() {
    this.tab = this.tabs.indexOf(this.$route.query.tab);
  },
  methods: {
    handleChange(val) {
      if (this.noActive) return;
      this.$router.push({
        query: {
          ...this.$route.query,
          tab: this.tabs[val],
        },
      });
    },
  },
};
</script>

<style>
.v-tabs-bar {
  background: transparent !important;
}
</style>
<style lang="scss" scoped>
.active-tab {
  background: #fff;
  font-weight: bold;
}
.tabs-cpm {
  height: 48px;
}

.v-tabs {
  flex: 0;
}

.tabs-cpm :deep .v-tabs-bar {
  display: flex;
  align-items: center;
}
.tab-content {
  background-color: #f1f5f9;
  border-radius: 8px;
  height: 48px;
  padding: 8px;
}

:deep .v-tabs-slider-wrapper .v-tabs-slider {
  background: transparent;
}
</style>
