import http from "@/api";

const request = http;

export function fetchTaskList(params) {
  return request.get("$auth/4everpass/newbie", {
    params,
  });
}
