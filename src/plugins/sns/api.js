import Vue from "vue";
import solanaAirDrop from "@/components/solana/solanaAirDrop.js";
Vue.use(solanaAirDrop);
export async function taskRequest() {
  const { data } = await Vue.prototype.$http.get("/solana/task", {
    params: {
      _auth: 1,
    },
  });
  return data;
}

export async function taskReport(theSlotBefore, theSlotAfter) {
  const { data } = await Vue.prototype.$http.post(
    "/solana/task",
    { theSlotBefore, theSlotAfter },
    {
      params: {
        _auth: 1,
      },
    }
  );
  if (data.reached) {
    Vue.prototype.$Dialog.getSolanaAirDrop();
  }

  return data;
}
