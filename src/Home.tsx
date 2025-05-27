import { useEffect, useRef } from "react";
import { loadKakaoMap } from "./KakaoMapLoader";

declare global {
  interface Window {
    kakao: any;
  }
}

const Home = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => {
        if (mapRef.current && !mapInstance.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;
        }
      })
      .catch(console.error);
  }, []);

  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default Home;
