import { atom } from "recoil";
export const userId = atom({
  key: "userId",
  default: localStorage.getItem("userId") || "",
});

export const userName = atom({
  key: "userName",
  default: localStorage.getItem("userName") || "",
});
