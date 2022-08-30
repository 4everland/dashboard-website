import Vue from "vue";
import store from "@/store";
import { airdropRequest } from "./api";
import AirDrop from "@/components/airDrop/index.js";
Vue.use(AirDrop);

async function isAirDrop() {
  const data = await airdropRequest();
  console.log(data);
  if (data) {
    Vue.prototype.$Dialog.getAirDrop(data);
  }
}

export { isAirDrop };
