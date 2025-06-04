import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./CourseDetail.module.css";
import GetCourseDetail from "./components/GetCourseDetail";
import * as Interfaces from "./interfaces/Interface";
import { Star, Share2 } from "lucide-react";
import PlaceModal from "./components/PlaceModal";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { CustomMarker } from "./components/CustomMarker";
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
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
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
            level: 7,
          };

          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;

          courseDetail?.placeList.forEach((place, index) => {
            CustomMarker(
              map,
              place,
              index,
              selectedPlaceId,
              () => handlePlaceClick(place),
              style.mapMarker,
              style.selectedMarker,
            );
          });
        }
      })
      .catch(console.error);
  }, [courseDetail, selectedPlaceId]);

  useEffect(() => {
    if (!window.kakao || !selectedPlace || !mapInstance.current) return;

    const newCenter = new window.kakao.maps.LatLng(
      selectedPlace.location.lat,
      selectedPlace.location.lng,
    );

    mapInstance.current.setCenter(newCenter);
  }, [selectedPlace]);

  return (
    <div className={style.courseDetailWrapper}>
      <div className={style.detailLeft}>
        {/* <h1>Course Detail : {id}</h1> */}
        <div>
          <div className={style.courseTitle}>
            <div className={style.headTitle}>
              <div>
                <span className={style.userName}>{courseDetail?.userName}</span>
                님의
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ fontSize: "16px" }}>
                  {courseDetail?.courseLike}&nbsp;
                </div>
                {courseDetail?.like ? (
                  <AiFillHeart size={26} color="#E96563" />
                ) : (
                  <AiOutlineHeart size={26} color="#E96563" />
                )}

                <span>
                  <Share2 size={24} />
                </span>
              </div>
            </div>
            <div>{courseDetail?.title} 코스</div>
          </div>
          <div>{courseDetail?.like}</div>
        </div>
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
                    <span>&nbsp;{p.stars}</span>
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
        {selectedPlaceId && selectedPlaceId.length > 0 && (
          <PlaceModal placeId={selectedPlaceId ? selectedPlaceId : ""} />
        )}
      </div>
    </div>
  );
};
export default CourseDetail;
