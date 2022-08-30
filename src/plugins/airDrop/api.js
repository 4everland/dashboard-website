import Vue from "vue";

export async function airdropRequest() {
  const { data } = await Vue.prototype.$http.get("$auth/events/airdrop/detail");

  return data;
}
