import React, { useEffect, useRef, useState } from "react";
import { loadKakaoMap } from "../../KakaoMapLoader";
import { CustomOverlayMap, Map } from "react-kakao-maps-sdk";
import { CongestionData } from "../CongestionMap";
import Marker from "./Marker";
import styles from "../Congestion.module.css";
import Loading from "../../global_components/Loading";
import useClickOutside from "../../utils/useClickOutside";

interface MapComponentProps {
  data: CongestionData[];
}

enum CongestionLevel {
  "붐빔" = "#EF4444",
  "약간 붐빔" = "#F97316",
  "보통" = "#EAB308",
  "여유" = "#22C55E",
}

const MapCompnent: React.FC<MapComponentProps> = ({ data }) => {
  const KAKAO_APPKEY = import.meta.env.VITE_KAKAOMAP_KEY;
  const [loaded, setLoaded] = useState(false);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

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
    setOpenDetail(true);
  };

  useEffect(() => {
    loadKakaoMap(KAKAO_APPKEY)
      .then(() => setLoaded(true))
      .catch((err) => console.error("카카오맵 로딩 실패", err));
  }, []);

  useClickOutside(markerRef, () => {
    setSelectedMarker(null);
    setOpenDetail(false);
  });

  if (!loaded) {
    return <Loading />;
  }

  return (
    <Map
      center={mapCenter}
      style={{ width: "100%", height: "100%" }}
      level={8}
      isPanto={true}
      onClick={() => setSelectedMarker(null)}
      minLevel={10}
    >
      {data.map((data) => (
        <CustomOverlayMap
          key={data.area_nm}
          position={{ lat: data.x, lng: data.y }}
          zIndex={selectedMarker?.area_nm === data.area_nm ? 100 : 1}
        >
          <Marker
            size={40}
            color={
              CongestionLevel[
                data.area_congest_lvl as keyof typeof CongestionLevel
              ]
            }
            onClick={() => handleClickMarker(data)}
            isGradient={true}
            style={
              selectedMarker?.area_nm === data.area_nm
                ? styles.selected_marker
                : ""
            }
          />
        </CustomOverlayMap>
      ))}

      {openDetail && selectedMarker && (
        <CustomOverlayMap
          position={{ lat: selectedMarker.x, lng: selectedMarker.y }}
          zIndex={1000}
        >
          <div className={styles.marker_info} ref={markerRef}>
            <div className={styles.detail_title}>위치정보</div>
            <div className={styles.detail_label}>장소이름</div>
            <div className={styles.detail_value}>{selectedMarker.area_nm}</div>
            <div className={styles.detail_label}>카테고리</div>
            <div className={styles.detail_value}>{selectedMarker.category}</div>
            <div className={styles.detail_label}>혼잡도</div>
            <div className={styles.detail_value}>
              {selectedMarker.area_congest_lvl}
            </div>
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
};

export default MapCompnent;
