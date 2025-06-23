import React, { useEffect, useState } from "react";
import { loadKakaoMap } from "../../KakaoMapLoader";
import { CustomOverlayMap, Map } from "react-kakao-maps-sdk";
import styles from "../Chatbot.module.css";
import * as Interfaces from "../interfaces/Interface";

interface Location {
  lat: number;
  lng: number;
}

interface ChatbotMap {
  mapInfo: Interfaces.PlaceType[] | null;
  selectedMarker: Location | null;
  setSelectedMarker: (value: Location) => void;
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

  const [mapCenter, setMapCenter] = useState<Location>(
    mapInfo && mapInfo.length > 0
      ? selectedMarker
        ? selectedMarker
        : mapInfo[0].location
      : { lat: 37.5714, lng: 126.9769 },
  );

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
      {mapInfo?.map((info, index) => {
        const isSelected =
          selectedMarker?.lat === info.location.lat &&
          selectedMarker?.lng === info.location.lng;

        return (
          <CustomOverlayMap
            key={index}
            position={info.location}
            clickable={true}
          >
            <div
              className={`${styles.map_marker} ${
                isSelected ? styles.selected_marker : ""
              }`}
              onClick={() => handleClickMarker(info.location)}
            >
              {index + 1}
            </div>
          </CustomOverlayMap>
        );
      })}
    </Map>
  );
};

export default ChatbotMap;
