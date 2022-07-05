import store from "@/store";
import { taskRequest, taskReport } from "./api";

async function isSolana() {
  const data = await taskRequest();
}

export { isSolana };
