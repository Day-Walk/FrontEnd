import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./CourseDetail.module.css";
import GetCourseDetail from "./components/GetCourseDetail";
import * as Interfaces from "./interfaces/Interface";
import { Star } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

const CourseDetail = () => {
  const { id } = useParams();
  // if (!id) {
  //   return <div>Error : 코스 ID가 없습니다.</div>;
  // }
  // const { data, loading, error } = GetCourseDetail(id);

  // if (loading) return <div>로딩 중...</div>;
  // if (error) return <div>{error}</div>;

  const [courseDetail, setCourseDetail] =
    useState<Interfaces.CourseDetail | null>(
      Interfaces.dummyCourseDetail.courseInfo,
    );
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<Interfaces.CourseDetailPlace | null>(null);
  const handlePlaceClick = (p: Interfaces.CourseDetailPlace) => {
    setSelectedPlaceId(p.placeId);
    setSelectedPlace(p);
  };

  useEffect(() => {
    console.log(selectedPlaceId);
  }, [selectedPlaceId]);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => {
        if (mapRef.current && !mapInstance.current) {
          const firstPlace = courseDetail?.placeList[0];
          const center = firstPlace
            ? new window.kakao.maps.LatLng(
                firstPlace.location.lat,
                firstPlace.location.lng,
              )
            : new window.kakao.maps.LatLng(37.5665, 126.978);

          const options = {
            center,
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;

          courseDetail?.placeList.forEach((place) => {
            const markerPosition = new window.kakao.maps.LatLng(
              place.location.lat,
              place.location.lng,
            );

            new window.kakao.maps.Marker({
              map,
              position: markerPosition,
              title: place.placeName,
            });
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className={style.courseDetailWrapper}>
      <div className={style.detailLeft}>
        <h1>Course Detail : {id}</h1>
        <div>{courseDetail?.userName}님의</div>
        <div>{courseDetail?.title} 코스</div>
        <div>
          {courseDetail?.placeList.map((p, i) => (
            <div
              key={p.placeId}
              onClick={() => handlePlaceClick(p)}
              className={
                selectedPlaceId == p.placeId
                  ? style.placeBlockClick
                  : style.placeBlock
              }
            >
              <div className={style.idx}>{i + 1}</div>
              <img
                src={p.imgUrl}
                alt={p.placeName}
                className={style.placeImg}
              />
              <div className={style.placeInfo}>
                <div className={style.placeCategory}>
                  <div className={style.category}>{p.subCategory}</div>
                  <div className={style.stars}>
                    <Star size={20} fill="#fabd55" color="#fabd55" />
                    {p.stars}
                  </div>
                </div>
                <div className={style.placeName}>{p.placeName}</div>
                <div className={style.address}>{p.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={style.detailRight}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {selectedPlace && (
          <div className={style.placeModal}>
            <button
              className={style.slideInButton}
              onClick={() => setSelectedPlace(null)}
            >
              ◀
            </button>
            <img
              src={selectedPlace.imgUrl}
              alt={selectedPlace.placeName}
              className={style.modalImg}
            />
            <div className={style.modalContent}>
              <h3>{selectedPlace.placeName}</h3>
              <p>{selectedPlace.address}</p>
              <p>⭐ {selectedPlace.stars.toFixed(1)}</p>
              <button onClick={() => setSelectedPlace(null)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CourseDetail;
