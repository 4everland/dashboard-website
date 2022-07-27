import flowAirDrop from "./flowAirDrop.vue";
export default {
  install: function (Vue) {
    const flowAirDropInstance = Vue.extend(flowAirDrop);
    let flowAirDropInit;
    const initInstance = () => {
      flowAirDropInit = new flowAirDropInstance();
      let flowAirDropEl = flowAirDropInit.$mount().$el;
      document.body.appendChild(flowAirDropEl);
    };
    Vue.prototype.$Dialog = {
      getFlowAirDrop(img) {
        if (!flowAirDropInit) {
          initInstance();
        }
        flowAirDropInit.getFlowAirDrop(img);
      },
    };
  },
};
