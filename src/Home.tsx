import { useEffect } from "react";
import { loadKakaoMap } from "./KakaoMapLoader";

declare global {
  interface Window {
    kakao: any;
  }
}

const Home = () => {
  useEffect(() => {
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        new window.kakao.maps.Map(container, options);
      })
      .catch(console.error);
  }, []);

  return <div id="map" style={{ width: "100vw", height: "100vh" }} />;
};

export default Home;
