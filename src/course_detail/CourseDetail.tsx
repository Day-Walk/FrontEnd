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
import { useRecoilValue } from "recoil";
import { userId } from "../recoil/userInfo";
import NoImage from "../assets/NoImage.png";
import AlertModal from "../global_components/AlertModal/AlertModal";
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
  const token = localStorage.getItem("accessToken");
  const userIdState = useRecoilValue(userId);
  const [like, setLike] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handlePlaceClick = (p: Interfaces.CourseDetailPlace) => {
    setSelectedPlaceId(p.placeId);
    setSelectedPlace(p);
  };

  const fetchCourseDetail = async () => {
    try {
      const res = await api.get(
        `/course?courseId=${id}&userId=${userIdState}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCourseDetail(res.data.courseInfo);
    } catch (error) {
      console.error("course detail fetch error", error);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [id, like]);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!courseDetail) return;
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
            level: 6,
          };

          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;

          console.log("**", courseDetail);
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

  useEffect(() => {
    setLike(courseDetail?.like || false);
  }, [courseDetail]);

  const LikeIcon = () => {
    return like ? (
      <AiFillHeart color="#E96563" size={26} />
    ) : (
      <AiOutlineHeart size={26} />
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
        await api.post("/course-like", body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // 좋아요 취소
        await api.delete("/course-like", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: body,
        });
      }
      setMessage("코스 찜 리스트에 추가 완료!");
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

  return (
    <div className={style.courseDetailWrapper}>
      <div className={style.detailLeft}>
        <div>
          <div className={style.courseTitle}>
            <div className={style.headTitle}>
              <div>
                <span className={style.userName}>{courseDetail?.userName}</span>
                님의
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ fontSize: "20px" }}>
                  {courseDetail?.courseLike}&nbsp;
                </div>
                <button onClick={handleLike}>
                  <LikeIcon />
                </button>

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
          {courseDetail &&
            courseDetail.placeList?.length > 0 &&
            courseDetail.placeList.map((p, i) => {
              return (
                <div
                  key={i}
                  onClick={() => handlePlaceClick(p)}
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
                    <div className={style.address}>{p.address}</div>
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
