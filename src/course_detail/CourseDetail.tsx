import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./CourseDetail.module.css";
import * as Interfaces from "./interfaces/Interface";
import { Star, Share2 } from "lucide-react";
import PlaceModal from "./components/PlaceModal";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { CustomMarker } from "./components/CustomMarker";
import { api } from "../utils/api";
import NoImage from "../assets/NoImage.webp";
import AlertModal from "../global_components/AlertModal/AlertModal";
import { Loading1 } from "../loading/Loading";
import { useUserStore } from "../zustand/useUserStore";
declare global {
  interface Window {
    kakao: any;
  }
}

const CourseDetail = () => {
  const { id } = useParams();

  // if (loading) return <div>로딩 중...</div>;
  // if (error) return <div>{error}</div>;

  const [courseDetail, setCourseDetail] =
    useState<Interfaces.CourseDetail | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
  const [selectedPlace, setSelectedPlace] =
    useState<Interfaces.CourseDetailPlace | null>(null);
  const userIdState = useUserStore((state) => state.userId);

  const [like, setLike] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const detailLeftRef = useRef<HTMLDivElement>(null);

  const scrollToListItem = (index: number) => {
    const scrollContainer = detailLeftRef.current;
    if (!scrollContainer) return;

    const items = scrollContainer.querySelectorAll(
      `.${style.placeBlock}, .${style.placeBlockClick}`,
    );
    if (index < 0) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = items[index] as HTMLElement | undefined;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePlaceClick = (p: Interfaces.CourseDetailPlace, index: number) => {
    setSelectedPlaceId(p.placeId);
    setSelectedPlace(p);
    scrollToListItem(index - 1);
  };

  const fetchCourseDetail = async () => {
    try {
      const res = await api.get(`/course?courseId=${id}&userId=${userIdState}`);
      setCourseDetail(res.data.courseInfo);
      setLoading(false);
    } catch (error) {
      console.error("course detail fetch error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [id, like]);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerOverlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const [mapInstanceReady, setMapInstanceReady] = useState(false);

  // 마커 렌더링 함수
  const renderMarkers = () => {
    if (!window.kakao || !mapInstance.current) return;

    const map = mapInstance.current;

    // 기존 마커 제거
    markerOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markerOverlaysRef.current = [];

    const placeLength = courseDetail?.placeList?.length ?? 0;
    const placeListTmp = courseDetail?.placeList;

    if (placeListTmp) {
      placeListTmp.forEach((place, index) => {
        const overlay = CustomMarker(
          map,
          place,
          index,
          selectedPlaceId,
          () => handlePlaceClick(place, index),
          style.mapMarker,
          style.selectedMarker,
          // duplicates.some((d) => d.placeId === place.placeId)
          //   ? style.duplicateMarker
          //   : "",
        );
        markerOverlaysRef.current.push(overlay);
      });
    }
  };

  useEffect(() => {
    if (
      !window.kakao ||
      !mapInstance.current ||
      !courseDetail?.placeList?.length
    )
      return;

    const firstPlace = courseDetail?.placeList[0];
    const center = new window.kakao.maps.LatLng(
      firstPlace.location.lat,
      firstPlace.location.lng,
    );

    mapInstance.current.setCenter(center);
  }, [courseDetail]);

  useEffect(() => {
    if (!courseDetail) return;
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => {
        if (mapRef.current && !mapInstance.current) {
          const firstPlace = courseDetail?.placeList?.[0] || null;
          const center = firstPlace
            ? new window.kakao.maps.LatLng(
                firstPlace.location.lat,
                firstPlace.location.lng,
              )
            : new window.kakao.maps.LatLng(37.5665, 126.978);

          const options = {
            center,
            level: 5,
          };

          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;
        }
        setMapInstanceReady(true);
      })
      .catch(console.error);
    setLoading(false);
  }, [courseDetail]);

  useEffect(() => {
    if (!window.kakao || !selectedPlace || !mapInstance.current) return;

    const newCenter = new window.kakao.maps.LatLng(
      selectedPlace.location.lat,
      selectedPlace.location.lng,
    );

    mapInstance.current.setCenter(newCenter);
  }, [selectedPlace]);

  useEffect(() => {
    if (mapInstanceReady && courseDetail?.placeList?.length) {
      renderMarkers();
    }
  }, [mapInstanceReady, courseDetail, selectedPlaceId]);

  useEffect(() => {
    setLike(courseDetail?.like || false);
  }, [courseDetail]);

  const LikeIcon = () => {
    return like ? (
      <AiFillHeart color="#E96563" size={24} style={{ cursor: "pointer" }} />
    ) : (
      <AiOutlineHeart size={24} style={{ cursor: "pointer" }} />
    );
  };

  const handleLike = async () => {
    const body = {
      userId: userIdState,
      courseId: id,
    };

    try {
      if (!like) {
        // 좋아요 등록
        await api.post("/course-like", body);
        setMessage("코스 찜 리스트에 추가 완료!");
      } else {
        // 좋아요 취소
        await api.delete("/course-like", {
          data: body,
        });
        setMessage("코스 찜 리스트에 취소 완료!");
      }
      setShowModal(true);
      setLike(!like);
    } catch (error) {
      setMessage("좋아요 처리 중 오류가 발생했습니다.");
      console.error("좋아요 처리 실패:", error);
      setShowModal(true);
    }
  };

  if (!id) {
    return <div>Error : 코스 ID가 없습니다.</div>;
  }

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 20,
        }}
      >
        <Loading1 />
      </div>
    );
  }

  return (
    <div className={style.courseDetailWrapper}>
      <div className={style.detailLeft} ref={detailLeftRef}>
        <div>
          <div className={style.courseTitle}>
            <div className={style.headTitle}>
              <div>
                <span className={style.userName}>{courseDetail?.userName}</span>
                님의
              </div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div style={{ fontSize: "20px" }}>
                  {courseDetail?.courseLike}&nbsp;
                </div>
                <button onClick={handleLike} style={{ marginTop: "4px" }}>
                  <LikeIcon />
                </button>
              </div>
            </div>
            <div>{courseDetail?.title} 코스</div>
          </div>
          <div>{courseDetail?.like}</div>
        </div>
        <div>
          {courseDetail &&
            courseDetail.placeList?.length > 0 &&
            courseDetail.placeList.map((p, i) => {
              return (
                <div
                  key={i}
                  onClick={() => handlePlaceClick(p, i)}
                  className={
                    selectedPlaceId == p.placeId
                      ? style.placeBlockClick
                      : style.placeBlock
                  }
                >
                  <div className={style.idx}>{i + 1}</div>
                  <div>
                    {p.imgUrl ? (
                      <img
                        src={p.imgUrl}
                        alt={p.placeName}
                        className={style.placeImg}
                      />
                    ) : (
                      <img src={NoImage} className={style.placeImg} />
                    )}
                  </div>
                  <div className={style.placeInfo}>
                    <div className={style.placeCategory}>
                      <div className={style.category}>{p.subCategory}</div>
                      <div className={style.stars}>
                        <Star size={20} fill="#fabd55" color="#fabd55" />
                        <span>&nbsp;{p.stars.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className={style.placeName}>{p.placeName}</div>
                    <div className={style.address}>
                      {p.address?.split(" ").slice(0, 2).join(" ")}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className={style.detailRight}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {selectedPlaceId && selectedPlaceId.length > 0 && (
          <PlaceModal
            placeId={selectedPlaceId ? selectedPlaceId : ""}
            isPlaceOnly={false}
          />
        )}
      </div>
      {showModal && (
        <AlertModal message={message} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
export default CourseDetail;
