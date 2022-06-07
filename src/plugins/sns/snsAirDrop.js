import Axios from "axios";
import store from "@/store";
import { taskRequest, taskReport } from "./api";
var theSlotBefore = "";
var theSlotAfter = "";
var slotTarget = null;
async function isSolana() {
  const data = await taskRequest();
  if (!data.open) {
    return;
  }
  slotTarget = data.task.slotTarget;
  const solana = store.state.userInfo.solana;
  if (solana) {
    const Array = await getSignaturesForAddress();
    checkBlock(Array);
  }
}
async function getSignaturesForAddress(signature) {
  const account = store.state.userInfo.solana.address;
  let Param = {
    limit: 1000,
    commitment: "confirmed",
  };
  if (signature) {
    Param.before = signature;
  }
  try {
    const { data } = await Axios.post(process.env.VUE_APP_SOLANA_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [account, Param],
    });
    const array = data.result;
    return array;
  } catch (error) {
    console.log(error);
    setTimeout(async () => {
      const signature = theSlotBefore;
      const Array = await getSignaturesForAddress(signature);
      checkBlock(Array);
    }, 11000);
  }
}
async function checkBlock(array) {
  if (!array) {
    return;
  }
  const length = array.length;
  let flag = array.find((element, index) => {
    element.index = index;
    return element.slot <= slotTarget;
  });
  if (flag) {
    theSlotAfter = flag.signature;
    if (flag.index != 0) {
      let beforeIndex = flag.index - 1;
      theSlotBefore = array[beforeIndex].signature;
    }
    await taskReport(theSlotBefore, theSlotAfter);
  } else if (length == 1000) {
    const signature = array[length - 1].signature;
    theSlotBefore = signature;
    const Array = await getSignaturesForAddress(signature);
    checkBlock(Array);
  } else {
    if (length != 0) {
      theSlotBefore = array[0].signature;
    }
    await taskReport(theSlotBefore, theSlotAfter);
  }
}

export { isSolana };
