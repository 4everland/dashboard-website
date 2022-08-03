import Vue from "vue";
import solanaAirDrop from "@/components/solana/solanaAirDrop.js";
Vue.use(solanaAirDrop);
export async function taskRequest() {
  const { data } = await Vue.prototype.$http.get("$auth/solana/task");
  return data;
}

export async function taskReport(theSlotBefore, theSlotAfter) {
  const { data } = await Vue.prototype.$http.post("$auth/solana/task", {
    theSlotBefore,
    theSlotAfter,
  });
  if (data.reached) {
    Vue.prototype.$Dialog.getSolanaAirDrop();
  }

  return data;
}
