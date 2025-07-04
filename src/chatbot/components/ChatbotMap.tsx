import React, { useEffect, useState } from "react";
import { loadKakaoMap } from "../../KakaoMapLoader";
import { CustomOverlayMap, Map } from "react-kakao-maps-sdk";
import styles from "../Chatbot.module.css";
import * as Interfaces from "../interfaces/Interface";
import Loading from "../../global_components/Loading";

interface Location {
  lat: number;
  lng: number;
}

interface ChatbotMap {
  mapInfo: Interfaces.PlaceType[] | null;
  selectedMarker: Interfaces.MarkerInfo | null;
  setSelectedMarker: (value: Interfaces.MarkerInfo) => void;
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

  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 37.5714,
    lng: 126.9769,
  });

  const handleClickMarker = (
    location: Location,
    placeId: string,
    messageId: string,
  ) => {
    setMapCenter(location);
    setSelectedMarker({ location, placeId, messageId });
  };

  useEffect(() => {
    if (selectedMarker) setMapCenter(selectedMarker.location);
  }, [selectedMarker]);

  if (!loaded) {
    return <Loading />;
  }

  return (
    <Map
      center={mapCenter}
      style={{ width: "100%", height: "100%" }}
      level={3}
      isPanto={true}
      minLevel={8}
    >
      {mapInfo?.map((info, index) => {
        const isSelected = selectedMarker?.placeId === info.placeId;

        return (
          <CustomOverlayMap
            key={index}
            position={info.location}
            clickable={true}
            zIndex={isSelected ? 4 : 2}
          >
            <div
              className={`${styles.map_marker} ${
                isSelected ? styles.selected_marker : ""
              }`}
              onClick={() =>
                handleClickMarker(info.location, info.placeId, info.messageId)
              }
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
