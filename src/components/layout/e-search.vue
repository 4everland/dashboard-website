<template>
  <e-wrap class="pb-0" :class="asMobile ? '' : 'pt-0'">
    <div class="pos-r">
      <v-btn @click="onMenu" icon v-if="asMobile">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <div
        class="right-0"
        v-show="showSearch"
        :class="asMobile ? 'y-center' : 'pos-a top-0 mt-4'"
      >
        <v-text-field
          class="hide-msg bd-1"
          dense
          solo
          clearable
          label="Search"
          prepend-inner-icon="mdi-magnify"
          v-model="searchKey"
        ></v-text-field>
      </div>
    </div>
  </e-wrap>
</template>

<script>
export default {
  data() {
    return {
      searchKey: "",
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    path() {
      return this.$route.path;
    },
    showSearch() {
      return /^\/storage\//.test(this.path) && /\/$/.test(this.path);
    },
  },
  watch: {
    searchKey(searchKey) {
      this.$setState({
        searchKey,
      });
    },
    path() {
      this.searchKey = "";
    },
  },
  methods: {
    onMenu() {
      this.$setMsg({
        name: "showDrawer",
      });
    },
  },
};
</script>