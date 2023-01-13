import Vue from "vue";
import { airdropRequest } from "./api";
import AirDrop from "@/components/airDrop/index.js";
Vue.use(AirDrop);

async function newUserDrop() {
  const token = localStorage.token;
  if (!token) {
    return;
  }
  // const data = await airdropRequest();
  // if (data) {
  //   Vue.prototype.$Dialog.getAirDrop(data);
  //   return true;
  // }

  const mockData = {
    type: 1,
    ipfs: 9999999,
    canShare: true,
    extra: "",
    ar: 0,
    traffic: 0,
    buildTime: 0,
  };
  const test = localStorage.getItem("airdrop1");
  if (mockData && !test) {
    localStorage.setItem("airdrop1", true);
    Vue.prototype.$Dialog.getAirDrop(mockData);
    return true;
  }
}
export { newUserDrop };
