import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MapPin } from "lucide-react";
import NoImage from "../../assets/NoImage.webp";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import AlertModal from "../../global_components/AlertModal/AlertModal";
import { useUserStore } from "../../zustand/useUserStore";

const LikeCourseList = (nowCourse: Interfaces.Course) => {
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  // const [like, setLike] = useState<boolean>(true);
  const [like, setLike] = useState<boolean>(nowCourse.like ?? true);

  useEffect(() => {
    if (course?.like !== undefined) {
      setLike(course.like);
    }
  }, [course]);
  const courseId = nowCourse.courseId;
  const navigate = useNavigate();
  const userIdState = useUserStore((state) => state.userId);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   setLike(course?.like || true);
  // }, [course]);

  const LikeIcon = () => {
    return like ? (
      <AiFillHeart color="#E96563" size={22} style={{ cursor: "pointer" }} />
    ) : (
      <AiOutlineHeart size={22} style={{ cursor: "pointer" }} />
    );
  };

  const handleLike = async () => {
    const body = {
      userId: userIdState,
      courseId: courseId,
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
        setMessage("코스 찜이 취소되었습니다.");
      }
      setShowModal(true);
      setLike(!like);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      setMessage("좋아요 처리 중 오류가 발생했습니다.");
      setShowModal(true);
    }
  };

  const handleCourseClick = () => {
    navigate(`/course/${courseId}`);
  };

  return (
    <>
      <div className={style.courseBlock}>
        <div className={style.header}>
          <div onClick={handleCourseClick} className={style.title}>
            "{course?.userName}" 님의{" "}
            <span style={{ color: "var(--color-main)" }}>{course?.title}</span>{" "}
            코스
          </div>
          <div onClick={handleLike} className={style.like}>
            <div className={style.likeNum}>{course?.courseLike}&nbsp;</div>
            <div>
              <LikeIcon />
            </div>
          </div>
        </div>
        <div onClick={handleCourseClick} className={style.coursePlaceList}>
          {course?.placeList.map((place, idx) => (
            <div key={place.placeId} className={style.placeBlock}>
              {place.imgUrl ? (
                <img
                  src={place.imgUrl}
                  alt={place.placeName}
                  className={style.placeImg}
                />
              ) : (
                <img src={NoImage} className={style.placeImg} />
              )}

              <div className={style.placeInfo}>
                <div className={style.idx}>{idx + 1}</div>
                {place.placeName.length < 9 ? (
                  <div className={style.placeName}>{place.placeName}</div>
                ) : (
                  <div className={style.placeNameEllipsis}>
                    {place.placeName}
                  </div>
                )}

                <div className={style.address}>
                  <MapPin
                    size={14}
                    style={{ filter: " drop-shadow(0 0 4px #333)" }}
                  />
                  {place.address.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <AlertModal message={message} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default LikeCourseList;
