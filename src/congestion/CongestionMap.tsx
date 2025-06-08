import React, { useEffect, useState } from "react";
import styles from "./Congestion.module.css";
import MapCompnent from "./components/MapComponent";
import { BorderButton, MainButton } from "../chatbot/components/Buttons";
import { Slider } from "@mui/material";
import Marker from "./components/Marker";
import axios from "axios";
import { RotateCcw } from "lucide-react";

export interface CongestionData {
  area_congest_lvl: string;
  area_congest_num: number;
  area_nm: string;
  category: string;
  congestion_color: string;
  x: number;
  y: number;
}

const CongestionMap = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const marks = [
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
  const markerText = ["붐빔", "약간붐빔", "보통", "여유"];
  const [realData, setRealData] = useState<CongestionData[]>();

  const getData = async () => {
    const url =
      "https://data.seoul.go.kr/SeoulRtd/getCategoryList?page=1&category=전체보기&count=all&sort=true";
    try {
      const res = await axios.get(url);
      setRealData(res.data.row);
    } catch (error) {
      console.error("API 호출 실패:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className={styles.wrapper}>
        {["실시간 혼잡도", "혼잡도 예측"].map((label, index) => {
          const ButtonComponent =
            tabIndex === index ? MainButton : BorderButton;
          return (
            <ButtonComponent
              key={index}
              onClick={() => {
                setTabIndex(index);
              }}
              style={{ height: "46px", borderRadius: "20px", width: "100%" }}
            >
              {label}
            </ButtonComponent>
          );
        })}
        <div className={styles.refresh_button} onClick={getData}>
          새로고침
          <RotateCcw size={16} color="#333" />
        </div>
        {tabIndex === 1 && (
          <Slider
            marks={marks}
            defaultValue={1}
            step={null}
            valueLabelDisplay="auto"
            max={12}
            min={1}
            style={{ width: "320px" }}
          ></Slider>
        )}
        <hr color="#e5e5e5" style={{ width: "100%" }} />
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

      <MapCompnent realData={realData ?? []} />
    </>
  );
};

export default CongestionMap;
