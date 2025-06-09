import { atom } from "recoil";
export const userId = atom({
  key: "userId",
  default: localStorage.getItem("userId") || "",
});
