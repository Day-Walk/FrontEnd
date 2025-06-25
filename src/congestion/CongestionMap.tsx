import React, { useEffect, useState } from "react";
import styles from "./Congestion.module.css";
import MapCompnent from "./components/MapComponent";
import { BorderButton, MainButton } from "../chatbot/components/Buttons";
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
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 6,
    label: "6",
  },
  {
    value: 12,
    label: "12",
  },
];

const CongestionMap = () => {
  const [tabIndex, setTabIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [markerValue, setMarkerValue] = useState<number>(1);

  const markerText = ["붐빔", "약간붐빔", "보통", "여유"];
  const [data, setData] = useState<CongestionData[]>([]);

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

  const getCrowdData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/crowd", {
        params: {
          hour: markerValue,
        },
      });
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
    getData();
  }, []);

  useEffect(() => {
    if (tabIndex === 1) {
      getCrowdData();
    } else {
      getData();
    }
  }, [markerValue, tabIndex]);
  return (
    <>
      {loading && <Loading />}
      <div
        style={{ width: "100%", height: "100%" }}
        className={loading ? styles.loading : ""}
      >
        <div className={styles.wrapper}>
          <div className={styles.refresh_button} onClick={getData}>
            새로고침
            <RotateCcw size={16} color="#333" />
          </div>
          <div
            style={{
              width: "100%",
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            {["실시간 혼잡도", "예측 혼잡도"].map((label, index) => {
              const ButtonComponent =
                tabIndex === index ? MainButton : BorderButton;
              return (
                <ButtonComponent
                  key={index}
                  onClick={() => {
                    setTabIndex(index);
                  }}
                  style={{
                    height: "46px",
                    borderRadius: "20px",
                    width: "100%",
                    flex: 1,
                  }}
                  fontColor={tabIndex !== index ? "#888" : "#fff"}
                >
                  {label}
                </ButtonComponent>
              );
            })}
          </div>
          {tabIndex === 1 && (
            <>
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: "14px", color: "#888" }}>시간</div>
                <div style={{ width: "100%", padding: "0 10px" }}>
                  <Slider
                    marks={MARKS}
                    defaultValue={1}
                    step={null}
                    valueLabelDisplay="auto"
                    max={12}
                    min={1}
                    style={{ width: "100%", color: "#00b493" }}
                    value={markerValue}
                    onChange={(e, value) => {
                      setMarkerValue(value as number);
                    }}
                  ></Slider>
                </div>
              </div>
              <div style={{ width: "100%", lineHeight: "1.5" }}>
                예측 시간은 {new Date().getHours()}시 기준입니다.
                <br />
                <br /> 현재&nbsp;
                <span style={{ fontWeight: "bold", color: "#E96563" }}>
                  {getPredictedDateTime()}
                </span>
                의 <br />
                예측 혼잡도를 보여주고 있습니다.
              </div>
            </>
          )}
          <hr color="#e5e5e5" style={{ width: "100%" }} />
          <div style={{ width: "100%" }}>마커 색상 안내</div>
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
