import Vue from "vue";
import Vuetify from "vuetify/lib";

import light from "./themes/light";
import dark from "./themes/dark";

import "./extend";

Vue.use(Vuetify);
console.log(Vuetify);
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
});

export default vuetify;
