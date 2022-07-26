import store from "@/store";
import { taskRequest } from "./api";

async function isAirDrop() {
  const data = await taskRequest();
  if (data.syncEvents[0]) {
    const Obj = JSON.parse(data.syncEvents[0].params);
    Vue.prototype.$Dialog.getFlowAirDrop(Obj.image);
  }
}

export { isAirDrop };
