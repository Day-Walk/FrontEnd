import React, { useEffect, useRef, useState } from "react";
import { loadKakaoMap } from "../../KakaoMapLoader";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import styles from "../Chatbot.module.css";

interface MapInfo {
  lat: number;
  lng: number;
}

interface ChatbotMap {
  mapInfo?: MapInfo[];
  selectedMarker: { lat: number; lng: number } | null;
  setSelectedMarker: (value: { lat: number; lng: number }) => void;
}

const ChatbotMap: React.FC<ChatbotMap> = ({
  mapInfo,
  selectedMarker,
  setSelectedMarker,
}) => {
  const KAKAO_APPKEY = import.meta.env.VITE_KAKAOMAP_KEY;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadKakaoMap(KAKAO_APPKEY)
      .then(() => setLoaded(true))
      .catch((err) => console.error("카카오맵 로딩 실패", err));
  }, []);

  // const [mapCenter, setMapCenter] = useState<MapInfo>(
  //   mapInfo ? { lat: 37.5714, lng: 126.9769 } : mapInfo[0],
  // );
  const [mapCenter, setMapCenter] = useState<MapInfo>({
    lat: 37.5714,
    lng: 126.9769,
  });

  const handleClickMarker = (location: { lat: number; lng: number }) => {
    setMapCenter(location);
    setSelectedMarker(location);
    console.log(location);
  };

  useEffect(() => {
    if (selectedMarker) setMapCenter(selectedMarker);
  }, [selectedMarker]);

  if (!loaded) {
    return <div>카카오맵 로딩 중...</div>;
  }

  return (
    <Map
      center={mapCenter}
      style={{ width: "100%", height: "100%" }}
      level={3}
      isPanto={true}
    >
      {mapInfo?.map((info, index) => (
        <CustomOverlayMap
          key={index}
          position={info}
          // position={{ lat: 37.5714, lng: 126.9769 }}
          clickable={true}
        >
          <div
            className={`${styles.map_marker} ${selectedMarker === info ? styles.selected_marker : ""}`}
            onClick={() => handleClickMarker(info)}
          >
            {index + 1}
          </div>
        </CustomOverlayMap>
      ))}
    </Map>
  );
};

export default ChatbotMap;
