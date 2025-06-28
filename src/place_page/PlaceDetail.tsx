import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./PlaceDetail.module.css";
import PlaceModal from "../course_detail/components/PlaceModal";
import { CustomMarker } from "./components/CustomMarker";
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
  // 상태 정의
  const [lat, setLat] = useState<number>(37.5665);
  const [lng, setLng] = useState<number>(126.978);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // localStorage에서 초기값 불러오기
  useEffect(() => {
    const storedLat = localStorage.getItem("placeLat");
    const storedLng = localStorage.getItem("placeLng");
    if (storedLat && storedLng) {
      setLat(Number(storedLat));
      setLng(Number(storedLng));
    }
    setIsReady(true); // 좌표 로딩 완료
  }, []);

  useEffect(() => {
    if (!lat || !lng) return;
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => setIsMapLoaded(true))
      .catch(console.error);
  }, [lat, lng]);
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstance.current) return;

    const center = new window.kakao.maps.LatLng(lat, lng);
    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 4,
    });
    mapInstance.current = map;
  }, [isMapLoaded, lat, lng]);

  // 마커 생성 (lat/lng 변경 시 CustomMarker 재실행)
  useEffect(() => {
    console.log("mapInstance.current:", mapInstance.current);
    console.log("isReady:", isReady);
    console.log("lat/lng:", lat, lng);
    if (!mapInstance.current || !isReady || !placeId) return;

    const map = mapInstance.current;
    const position = new window.kakao.maps.LatLng(lat, lng);

    // 이전 마커 제거
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // 새로운 마커 생성 및 등록
    console.log("CustomMarker 호출됨");
    const overlay = CustomMarker(
      map,
      {
        placeId: placeId,
        location: {
          lat,
          lng,
        },
      },
      0,
      placeId,
      style.mapMarker,
      style.mapMarker,
    );

    markerRef.current = overlay; // 이제 올바르게 overlay 저장됨
    map.setCenter(position);
  }, [lat, lng, isReady, isMapLoaded]);

  // 장소 선택 시 실행 (좌표 + localStorage 동시 업데이트)
  const handleSelectLocation = (location: { lat: number; lng: number }) => {
    setLat(location.lat);
    setLng(location.lng);
    localStorage.setItem("placeLat", location.lat.toString());
    localStorage.setItem("placeLng", location.lng.toString());
    console.log("선택한 위치:", location);
  };

  if (!placeId) {
    return <div>Error : 장소 ID가 없습니다.</div>;
  }

  return (
    <div className={style.courseDetailWrapper}>
      <div>
        {placeId && (
          <PlaceModal
            placeId={placeId ? placeId : ""}
            isPlaceOnly={true}
            onSelectLocation={handleSelectLocation}
          />
        )}
      </div>
      <div className={style.detailRight}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};
export default PlaceDetail;
