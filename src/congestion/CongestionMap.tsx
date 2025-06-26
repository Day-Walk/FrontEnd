import React, { useEffect, useState } from "react";
import styles from "./Congestion.module.css";
import MapCompnent from "./components/MapComponent";
import { Slider } from "@mui/material";
import Marker from "./components/Marker";
import axios from "axios";
import { RotateCcw } from "lucide-react";
import { api } from "../utils/api";
import Loading from "../global_components/Loading";

export interface CongestionData {
  area_congest_lvl: string;
  area_congest_num: number;
  area_nm: string;
  category?: string;
  congestion_color?: string;
  x: number;
  y: number;
}
const MARKS = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 6, label: "6" },
  { value: 12, label: "12" },
];
type MarkerValue = 0 | 1 | 2 | 3 | 6 | 12;

const CongestionMap = () => {
  const [loading, setLoading] = useState(false);
  const [markerValue, setMarkerValue] = useState<MarkerValue>(0);

  const markerText = ["붐빔", "약간붐빔", "보통", "여유"];
  const [data, setData] = useState<CongestionData[]>([]);
  const [congestionDatas, setCongestionDatas] = useState<
    Record<MarkerValue, CongestionData[]>
  >({
    0: [],
    1: [],
    2: [],
    3: [],
    6: [],
    12: [],
  });

  const getData = async () => {
    setLoading(true);
    const url =
      "https://data.seoul.go.kr/SeoulRtd/getCategoryList?page=1&category=전체보기&count=all&sort=true";
    try {
      const res = await axios.get(url);
      setData(res.data.row);
    } catch (error) {
      console.error("API 호출 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCrowdData = async (markerValue: MarkerValue) => {
    setLoading(true);
    try {
      const res = await api.get("/crowd", {
        params: {
          hour: markerValue,
        },
      });
      setCongestionDatas((prev) => ({
        ...prev,
        [markerValue]: res.data.crowdLevel.row,
      }));
      setData(res.data.crowdLevel.row);
    } catch (error) {
      console.error("혼잡도 예측 데이터 호출 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPredictedDateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() + markerValue);

    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시`;
  };

  useEffect(() => {
    if (markerValue === 0) {
      getData();
      return;
    }
    if (congestionDatas[markerValue].length > 0) {
      setData(congestionDatas[markerValue]);
    } else {
      getCrowdData(markerValue);
    }
  }, [markerValue]);

  // 정시되면 데이터 갱신해야 됨
  useEffect(() => {
    if (markerValue !== 0) return;

    let currentHour = new Date().getHours();

    const interval = setInterval(() => {
      const now = new Date();
      const nowHour = now.getHours();
      const nowMinute = now.getMinutes();

      if (nowHour !== currentHour || nowMinute === 0) {
        currentHour = nowHour;
        setCongestionDatas((prev) => ({
          ...prev,
          0: [],
        }));
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [markerValue]);
  return (
    <>
      {loading && <Loading />}
      <div
        style={{ width: "100%", height: "100%" }}
        className={loading ? styles.loading : ""}
      >
        <div className={styles.wrapper}>
          <div
            className={styles.refresh_button}
            onClick={() => {
              markerValue === 0 ? getData() : getCrowdData(markerValue);
            }}
          >
            새로고침
            <RotateCcw size={16} color="#333" />
          </div>

          <div style={{ width: "100%" }}>
            <div style={{ fontSize: "14px", color: "#888" }}>시간</div>
            <div style={{ width: "100%", padding: "0 10px" }}>
              <Slider
                marks={MARKS}
                defaultValue={0}
                step={null}
                valueLabelDisplay="auto"
                max={12}
                min={0}
                style={{ width: "100%", color: "#00b493" }}
                value={markerValue}
                onChange={(e, value) => {
                  setMarkerValue(value as MarkerValue);
                }}
              ></Slider>
            </div>
          </div>
          <div style={{ width: "100%", lineHeight: "1.5" }}>
            {markerValue !== 0 && (
              <>
                예측 시간은 {new Date().getHours()}시 기준입니다.
                <br />
                <br />
              </>
            )}
            현재&nbsp;
            <span style={{ fontWeight: "bold", color: "#E96563" }}>
              {markerValue === 0 ? (
                "실시간 혼잡도"
              ) : (
                <>
                  {getPredictedDateTime()}의 <br />
                  예측 혼잡도
                </>
              )}
            </span>
            를 보여주고 있습니다.
          </div>

          <hr color="#e5e5e5" style={{ width: "100%" }} />
          <div style={{ width: "100%", fontWeight: 600 }}>마커 색상 안내</div>
          <div className={styles.marker_wrapper}>
            <Marker color="#EF4444" size={40} shadow={true} />
            <Marker color="#F97316" size={40} shadow={true} />
            <Marker color="#EAB308" size={40} shadow={true} />
            <Marker color="#22C55E" size={40} shadow={true} />
          </div>
          <div className={styles.marker_wrapper}>
            {markerText.map((text, index) => (
              <div key={index}>{text}</div>
            ))}
          </div>
        </div>
        <MapCompnent data={data ?? []} />
      </div>
    </>
  );
};

export default CongestionMap;
