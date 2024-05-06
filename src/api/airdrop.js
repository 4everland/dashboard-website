import http from "@/api";

const request = http;

export function fetchTaskList(params) {
  return request.get("$auth/4everpass/newbie", {
    params,
  });
}

export function fetchTaskCard() {
  return request.get("$auth/4everpass");
}

export function fetchNext(id) {
  return request.get(`$auth/4everpass/${id}/next`);
}

export function fetchClaim(id) {
  return request.post(`$auth/4everpass/${id}/claim`);
}
