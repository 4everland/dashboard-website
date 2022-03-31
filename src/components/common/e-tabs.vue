<template>
  <div v-if="asMobile">
    <v-expansion-panels v-model="curIdx">
      <v-expansion-panel v-for="(it, i) in list" :key="i">
        <v-expansion-panel-header>
          {{ it.text }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <component
            :is="it.comp"
            v-bind="it.props"
            :info="info"
            :active="i == curIdx"
            v-if="it.comp && activeIdxList.includes(i)"
          ></component>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

  <div v-else class="e-settings" :class="vertical ? 'd-flex' : ''">
    <div>
      <v-tabs
        :class="vertical ? '' : 'v3-tabs'"
        color="black"
        v-model="curIdx"
        :height="vertical ? null : 44"
        hide-slider
        :vertical="vertical"
      >
        <v-tab v-for="(it, i) in list" :key="i">
          {{ it.text }}
        </v-tab>
      </v-tabs>
    </div>
    <div class="" :class="vertical ? 'flex-1' : 'main-wrap pa-5 bg-white'">
      <component
        :is="it.comp"
        v-bind="it.props"
        :info="info"
        :active="curItem.comp == it.comp"
        v-show="curItem.comp == it.comp"
        v-for="(it, i) in activeList"
        :key="i"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    info: Object,
    defTab: Number,
    vertical: Boolean,
  },
  data() {
    const tabKey = this.vertical ? "sub" : "tab";
    return {
      initPath: "",
      tabKey,
      curIdx: 0,
      activeIdxList: [0],
    };
  },
  watch: {
    curIdx(val) {
      if (this.path != this.initPath) return;
      if (!this.activeIdxList.includes(val)) {
        this.activeIdxList.push(val);
      }
      const it = this.list[val];
      const query = { ...this.$route.query };
      const tabVal = it.text.replace(" ", "_").toLowerCase();
      if (query[this.tabKey] == tabVal) return;
      query[this.tabKey] = tabVal;
      if (!this.vertical) {
        delete query.sub;
      }
      this.$router.replace({
        query,
      });
    },
    "$route.query.tab"() {
      if (!this.vertical) this.curIdx = this.getIdx();
    },
    "$route.query.sub"() {
      if (this.vertical) this.curIdx = this.getIdx();
    },
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    path() {
      return this.$route.path;
    },
    curItem() {
      return this.list[this.curIdx] || {};
    },
    activeList() {
      return this.list.filter((_, i) => {
        return this.activeIdxList.includes(i);
      });
    },
  },
  mounted() {
    this.initPath = this.path;
    this.curIdx = this.getIdx();
  },
  methods: {
    getIdx() {
      const tab = this.$route.query[this.tabKey] || this.defTab;
      let curIdx = 0;
      if (tab > -1) curIdx = tab * 1;
      else if (tab) {
        this.list.forEach((it, i) => {
          if (it.text.toLowerCase() == tab.replace("_", " ").toLowerCase())
            curIdx = i * 1;
        });
      }
      return curIdx;
    },
  },
};
</script>

<style lang="scss">
.e-settings {
  .theme--light.v-tabs > .v-tabs-bar {
    background-color: transparent;
  }
  .v3-tabs {
    .v-slide-group__content {
      padding-top: 4px;
      padding-left: 2px;
    }
    .v-tab--active {
      background: #fff;
      box-shadow: 0 0 4px rgb(205 205 205 / 50%);
      font-weight: bold;
      pointer-events: none;
      &,
      &:before {
        border-radius: 12px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
  .main-wrap {
    margin-left: 2px;
    min-height: 70vh;
  }
}
</style>