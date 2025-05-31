import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./CourseDetail.module.css";
import GetCourseDetail from "./components/GetCourseDetail";
import * as Interfaces from "./interfaces/Interface";

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
        <div>
          {courseDetail?.placeList.map((p, i) => (
            <div key={p.placeId} className={style.placeBlock}>
              <img
                src={p.imgUrl}
                alt={p.placeName}
                className={style.placeImg}
              />
              <div className={style.placeInfo}>
                <div className={style.idx}>{i + 1}</div>
                <div className={style.placeName}>{p.placeName}</div>
                <div className={style.address}>{p.address}</div>
                <div className={style.category}>
                  {p.category} / {p.subCategory}
                </div>
                <div className={style.stars}>평점: {p.stars}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        ref={mapRef}
        style={{ width: "calc(100% - 400px)", height: "100%" }}
      />
    </div>
  );
};
export default CourseDetail;
