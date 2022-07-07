import store from "@/store";
import { taskRequest } from "./api";

async function isAirDrop() {
  const data = await taskRequest();
  console.log(data.syncEvents);
  if (data.syncEvents[0]) {
    Vue.prototype.$Dialog.getFlowAirDrop();
  }
}

export { isAirDrop };
