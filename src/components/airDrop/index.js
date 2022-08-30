import AirDrop from "./index.vue";
export default {
  install: function (Vue) {
    const AirDropInstance = Vue.extend(AirDrop);
    let AirDropInit;
    const initInstance = () => {
      AirDropInit = new AirDropInstance();
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
