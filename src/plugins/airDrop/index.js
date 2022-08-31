import Vue from "vue";
import { airdropRequest } from "./api";
import AirDrop from "@/components/airDrop/index.js";
Vue.use(AirDrop);

async function isAirDrop() {
  const data = await airdropRequest();
  if (data) {
    Vue.prototype.$Dialog.getAirDrop(data);
  }
  // const mockData = {
  //   type: 1,
  //   ipfs: 9999999,
  //   canShare: true,
  //   extra: "",
  //   ar: 0,
  //   traffic: 0,
  //   buildTime: 0,
  // };
  // Vue.prototype.$Dialog.getAirDrop(mockData);
}
export { isAirDrop };
