import noWallet from "./index.vue";

export default {
  install: function (Vue) {
    const noWalletInstance = Vue.extend(noWallet);
    let noWalletInit;
    const initInstance = () => {
      noWalletInit = new noWalletInstance();
      let noWalletEl = noWalletInit.$mount().$el;
      document.body.appendChild(noWalletEl);
    };
    Vue.prototype.$Dialog = {
      getnoWallet(data) {
        if (!noWalletInit) {
          initInstance();
        }
        noWalletInit.getnoWallet(data);
      },
    };
  },
};
