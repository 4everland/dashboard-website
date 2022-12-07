import AirDrop from "./index.vue";
import Vuetify from "vuetify/lib";
export default {
  install: function (Vue) {
    const AirDropInstance = Vue.extend(AirDrop);
    let AirDropInit;
    const initInstance = () => {
      AirDropInit = new AirDropInstance();
      AirDropInit.$vuetify = new Vuetify().framework;
      let AirDropEl = AirDropInit.$mount().$el;
      document.body.appendChild(AirDropEl);
    };
    Vue.prototype.$Dialog = {
      getAirDrop(data) {
        if (!AirDropInit) {
          initInstance();
        }
        AirDropInit.getAirDrop(data);
      },
    };
  },
};
