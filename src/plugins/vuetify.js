import Vue from "vue";
import Vuetify from "vuetify/lib";

import light from "./themes/light";
import dark from "./themes/dark";

import CUSTOM_ICONS from "@/icons/index";

import "./extend";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    // dark: true,
    themes: {
      light,
      dark,
    },
    options: {
      customProperties: true,
    },
  },
  icons: {
    values: CUSTOM_ICONS,
  },
});

export default vuetify;
