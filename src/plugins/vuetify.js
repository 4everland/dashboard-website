import Vue from "vue";
import Vuetify from "vuetify/lib";

import light from "./themes/light";
import dark from "./themes/dark";

import "./extend";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    // dark: true,
    themes: {
      light,
      dark,
    },
  },
});

export default vuetify;
