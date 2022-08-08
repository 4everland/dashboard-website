<template>
  <div class="ml-5 mt-5" v-if="!meta.hideNav">
    <div class="d-flex al-c">
      <div class="d-flex al-c">
        <v-btn icon v-if="asMobile" @click="onMenu">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <e-link :href="firstItem.href" v-if="firstItem">
          <b class="mr-3" :class="asMobile ? 'fz-18' : 'fz-25'">{{
            firstItem.text
          }}</b>
        </e-link>
      </div>
      <template v-if="breadItems.length">
        <v-icon size="20" color="#aaa">mdi-chevron-right</v-icon>
        <v-breadcrumbs :items="breadItems" class="pa-0 ml-3">
          <template v-slot:divider>
            <v-icon size="20" color="#aaa">mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </template>
    </div>
    <div class="gray-8 fz-14 mt-1" v-if="meta.subTitle">
      {{ meta.subTitle }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    path() {
      return this.$route.path;
    },
    pathArr() {
      return this.path.split("/");
    },
    meta() {
      return this.$route.meta || {};
    },
    navItems() {
      const { params } = this.$route;
      const { title, group, links } = this.meta;
      let items = [];
      if (links) {
        items = links.map((_it) => {
          const it = { ..._it };
          for (const key in params) {
            if (it.text) it.text = it.text.replace(`{${key}}`, params[key]);
            if (it.to) it.to = it.to.replace(`{${key}}`, params[key]);
          }
          if (!it.path) it.path = this.path;
          it.exact = true;
          return it;
        });
      }
      // bucket storage ar
      else if (/^\/bucket\/(arweave|storage)/.test(this.path)) {
        const isAr = /^\/bucket\/arweave/.test(this.path);
        let to = isAr ? "/bucket/arweave" : "/bucket/storage/";
        items = [
          {
            text: isAr ? "AR History" : "Buckets",
            to,
            exact: true,
          },
        ];
        if (isAr) to += "/";
        const arr = this.path.replace(to, "").split("/");
        for (const i in arr) {
          const text = decodeURIComponent(arr[i]);
          if (!text) break;
          to += text + (arr[i + 1] == "" ? "" : "/");
          if (isAr && i < arr.length - 1) {
            continue;
          }
          items.push({
            text,
            to,
            // exact: i < arr.length - 1,
            exact: true,
            disabled: i == arr.length - 1,
          });
        }
      } else if (group && title) {
        items.push({
          text: title,
          to: this.path,
        });
      }
      return items;
    },
    firstItem() {
      let { title = "" } = this.meta;
      if (title == "Overview") {
        const info = this.$store.state.userInfo;
        if (info.username) title = "Hi " + info.username.cutStr(6, 4);
      } else if (this.navItems.length) {
        title = "";
      }
      if (title)
        return {
          text: title,
        };
      if (this.navItems.length) {
        const item = { ...this.navItems[0] };
        console.log(item.to);
        item.href = this.breadItems.length ? item.to : "";
        return item;
      }
    },
    breadItems() {
      return this.navItems.slice(1);
    },
  },
  watch: {
    navItems() {
      this.setNavItems();
    },
  },
  mounted() {
    this.setNavItems();
  },
  methods: {
    onMenu() {
      this.$setMsg({
        name: "showDrawer",
      });
    },
    setNavItems() {
      this.$setState({
        navItems: this.navItems,
      });
    },
  },
};
</script>