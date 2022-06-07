import solanaAirDrop from "./solanaAirDrop.vue";
export default {
  install: function (Vue) {
    const solanaAirDropInstance = Vue.extend(solanaAirDrop);
    let solanaAirDropInit;
    const initInstance = () => {
      // 实例化vue实例
      solanaAirDropInit = new solanaAirDropInstance();
      let solanaAirDropEl = solanaAirDropInit.$mount().$el;
      document.body.appendChild(solanaAirDropEl);
    };
    Vue.prototype.$Dialog = {
      getSolanaAirDrop() {
        if (!solanaAirDropInit) {
          initInstance();
        }
        solanaAirDropInit.getSolanaAirDrop();
      },
    };
  },
};
