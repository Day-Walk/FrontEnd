import React, { useEffect, useState } from "react";
import { loadKakaoMap } from "../../KakaoMapLoader";
import { Map } from "react-kakao-maps-sdk";

const MapCompnent = () => {
  const KAKAO_APPKEY = import.meta.env.VITE_KAKAOMAP_KEY;
  const [loaded, setLoaded] = useState(false);

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
      center={{ lat: 37.5714, lng: 126.9769 }}
      style={{ width: "100%", height: "100%" }}
      level={3}
      isPanto={true}
    ></Map>
  );
};

export default MapCompnent;
