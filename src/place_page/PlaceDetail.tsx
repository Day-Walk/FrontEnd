import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./PlaceDetail.module.css";
import PlaceModal from "../course_detail/components/PlaceModal";
import { CustomMarker } from "./components/CustomMarker";
import { api } from "../utils/api";
import NoImage from "../assets/NoImage.png";
declare global {
  interface Window {
    kakao: any;
  }
}

const PlaceDetail = () => {
  const { placeId } = useParams();
  console.log(placeId);
  // if (loading) return <div>로딩 중...</div>;
  // if (error) return <div>{error}</div>;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => {
        if (mapRef.current && !mapInstance.current) {
          // // const firstPlace = courseDetail?.placeList[0];
          // const center = firstPlace
          //   ? new window.kakao.maps.LatLng(
          //       firstPlace.location.lat,
          //       firstPlace.location.lng,
          //     )
          //   : new window.kakao.maps.LatLng(37.5665, 126.978);
          const center = new window.kakao.maps.LatLng(37.5665, 126.978);

          const options = {
            center,
            level: 6,
          };

          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;

          // courseDetail?.placeList.forEach((place, index) => {
          //   CustomMarker(
          //     map,
          //     place,
          //     index,
          //     selectedPlaceId,
          //     () => handlePlaceClick(place),
          //     style.mapMarker,
          //     style.selectedMarker,
          //   );
          // });
        }
      })
      .catch(console.error);
  }, []);

  if (!placeId) {
    return <div>Error : 장소 ID가 없습니다.</div>;
  }

  return (
    <div className={style.courseDetailWrapper}>
      <div>
        {placeId && (
          <PlaceModal placeId={placeId ? placeId : ""} isPlaceOnly={true} />
        )}
      </div>
      <div className={style.detailRight}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};
export default PlaceDetail;
