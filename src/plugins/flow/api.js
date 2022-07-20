import Vue from "vue";
import flowAirDrop from "@/components/flow/flowAirDrop.js";
Vue.use(flowAirDrop);
export async function taskRequest() {
  const { data } = await Vue.prototype.$http.get("/events/overview", {
    params: {
      _auth: 1,
    },
  });

  return data;
}
