// store/useCongestionStore.ts
import { create } from "zustand";
import { CongestionData, MarkerValue } from "../congestion/CongestionMap";

interface CongestionStore {
  congestionData: Record<MarkerValue, CongestionData[]>;
  // string -> yyyyMMddHH 형식
  lastFetched: Record<MarkerValue, string>;
  setCongestionData: (hour: MarkerValue, data: CongestionData[]) => void;
  clearData: (hour?: MarkerValue) => void;
}

function getCurrentDateHourString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");

  return `${yyyy}${MM}${dd}${HH}`;
}

export const useCongestionStore = create<CongestionStore>((set) => ({
  congestionData: {
    0: [],
    1: [],
    2: [],
    3: [],
    6: [],
    12: [],
  },
  lastFetched: {
    0: "",
    1: "",
    2: "",
    3: "",
    6: "",
    12: "",
  },
  setCongestionData: (hour, data) =>
    set((state) => ({
      congestionData: { ...state.congestionData, [hour]: data },
      lastFetched: {
        ...state.lastFetched,
        [hour]: getCurrentDateHourString(),
      },
    })),
  clearData: (hour) =>
    set((state) => {
      if (hour === undefined) {
        return {
          congestionData: {
            0: [],
            1: [],
            2: [],
            3: [],
            6: [],
            12: [],
          },
          lastFetched: {
            0: "",
            1: "",
            2: "",
            3: "",
            6: "",
            12: "",
          },
        };
      } else {
        return {
          congestionData: {
            ...state.congestionData,
            [hour]: [],
          },
          lastFetched: {
            ...state.lastFetched,
            [hour]: "",
          },
        };
      }
    }),
}));
