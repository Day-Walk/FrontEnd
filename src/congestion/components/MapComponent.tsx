import React, { useEffect, useState } from "react";
import { loadKakaoMap } from "../../KakaoMapLoader";
import { CustomOverlayMap, Map } from "react-kakao-maps-sdk";
import { CongestionData } from "../CongestionMap";
import Marker from "./Marker";
import styles from "../Congestion.module.css";

interface MapComponentProps {
  realData: CongestionData[];
}

enum CongestionLevel {
  "붐빔" = "#EF4444",
  "약간 붐빔" = "#F97316",
  "보통" = "#EAB308",
  "여유" = "#22C55E",
}

const MapCompnent: React.FC<MapComponentProps> = ({ realData }) => {
  const KAKAO_APPKEY = import.meta.env.VITE_KAKAOMAP_KEY;
  const [loaded, setLoaded] = useState(false);

  const [selectedMarker, setSelectedMarker] = useState<CongestionData | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState({
    lat: 37.5714,
    lng: 126.9769,
  });
  const handleClickMarker = (selectedData: CongestionData) => {
    setSelectedMarker(selectedData);
    setMapCenter({ lat: selectedData.x, lng: selectedData.y });
    console.log(selectedData);
  };

  useEffect(() => {
    loadKakaoMap(KAKAO_APPKEY)
      .then(() => setLoaded(true))
      .catch((err) => console.error("카카오맵 로딩 실패", err));
  }, []);

  if (!loaded) {
    return <div>카카오맵 로딩 중...</div>;
  }

  return (
    <Map
      center={mapCenter}
      style={{ width: "100%", height: "100%" }}
      level={3}
      isPanto={true}
      onClick={() => setSelectedMarker(null)}
    >
      {realData?.map((data, index) => (
        <CustomOverlayMap
          key={data.area_nm}
          position={{ lat: data.x, lng: data.y }}
        >
          <Marker
            size={40}
            color={
              CongestionLevel[
                data.area_congest_lvl as keyof typeof CongestionLevel
              ]
            }
            onClick={() => {
              handleClickMarker(data);
            }}
            isGradient={true}
            style={
              selectedMarker?.area_nm === data.area_nm
                ? styles.selected_marker
                : ""
            }
          />
          {selectedMarker?.area_nm === data.area_nm && (
            <div className={styles.marker_info}>
              <div>장소이름 : {selectedMarker.area_nm}</div>
              <div>카테고리 : {selectedMarker.category}</div>
              <div>혼잡도 : {selectedMarker.area_congest_lvl}</div>
            </div>
          )}
        </CustomOverlayMap>
      ))}
    </Map>
  );
};

export default MapCompnent;
