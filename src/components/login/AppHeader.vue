<template>
  <div>
    <v-app-bar
      fixed
      app
      elevate-on-scroll
      :elevation="4"
      color="#fff"
      height="100"
    >
      <v-container class="d-flex align-center">
        <v-btn
          text
          color="transparent"
          href="https://4everland.org/"
          class="always-active mr-8"
        >
          <logo />
        </v-btn>
        <v-spacer />
        <v-menu
          v-for="item in links"
          :key="item.text"
          open-on-hover
          bottom
          transition="slide-y-transition"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn
              class="hidden-sm-and-down nav-btn text-subtitle-1 ma-2"
              plain
              replace
              :href="item.href"
              :target="item.target"
              :ripple="false"
              color="#495667"
              v-bind="attrs"
              v-on="on"
            >
              <span>
                {{ item.text }}
                <v-icon v-if="item.childs">{{ mdiChevronDown }}</v-icon>
              </span>
            </v-btn>
          </template>
          <v-list v-if="item.childs">
            <v-list-item v-for="child in item.childs" :key="child.text">
              <v-btn
                class="hidden-sm-and-down nav-btn text-subtitle-1"
                plain
                :href="child.href"
                :target="child.target"
                :ripple="false"
              >
                <span>
                  {{ child.text }}
                </span>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          class="hidden-md-and-up"
          text
          icon
          @click.stop="showDrawer = !showDrawer"
        >
          <v-icon>{{ mdiMenu }}</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer v-model="showDrawer" right temporary fixed>
      <v-list>
        <template v-for="item in links">
          <v-list-group v-if="item.childs" :key="item.text" no-action>
            <template #activator>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="child in item.childs"
              :key="child.text"
              :href="child.href"
              :target="child.target"
            >
              <v-list-item-title>
                <span>
                  {{ child.text }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :href="item.href"
            :target="item.target"
          >
            <v-list-item-title>
              <span>
                {{ item.text }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import {
  mdiMenu,
  mdiGithub,
  mdiChevronDown,
  mdiChevronRight,
  mdiWallet,
} from "@mdi/js";
import Logo from "./Logo.vue";

export default {
  components: { Logo },
  data() {
    return {
      mdiMenu,
      mdiGithub,
      mdiChevronDown,
      mdiChevronRight,
      mdiWallet,
      showDrawer: false,
      links: [
        {
          text: "Blogs",
          href: "https://medium.com/4everland",
          target: "_blank",
        },
        {
          text: "Docs",
          href: "https://docs.4everland.org/",
          target: "_blank",
        },
        {
          text: "Community",
          href: "http://discord.gg/4everland",
          target: "_blank",
        },
      ],
    };
  },
};
</script>
<style scoped>
.always-active {
  opacity: 1 !important;
}
.v-btn--active,
.nav-btn:hover {
  color: #2a7eed;
}
/deep/ .v-btn__content {
  opacity: 1 !important;
}
/deep/ .nav-btn .v-btn__content {
  opacity: 1 !important;
}
</style>
