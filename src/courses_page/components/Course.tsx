import { useEffect, useState } from "react";
import style from "../Courses.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { MapPin } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import NoImage from "../../assets/NoImage.webp";
import { useUserStore } from "../../zustand/useUserStore";

interface CourseProps extends Interfaces.Course {
  showModal: (msg: string) => void;
}

const Course = ({ showModal, ...nowCourse }: CourseProps) => {
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  const [like, setLike] = useState<boolean>(course?.like || false);
  const courseId = nowCourse.courseId;
  const navigate = useNavigate();
  const userIdState = useUserStore((state) => state.userId);

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const dateOnly = nowCourse.createAt.split("T")[0];

  useEffect(() => {
    setLike(course?.like || false);
  }, [course]);

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
        showModal("코스 찜 리스트에 추가 완료!");
      } else {
        // 좋아요 취소
        await api.delete("/course-like", {
          data: body,
        });
        showModal("코스 찜이 취소되었습니다.");
      }
      setLike(!like);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      showModal("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCourseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(false);
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const clickPercent = (clickX / width) * 100;

    if (clickPercent <= 90) {
      // 클릭 위치가 왼쪽 90% 이내
      navigate(`/course/${courseId}`);
    } else {
      return;
    }
  };

  return (
    <div
      onClick={handleCourseClick}
      className={style.courseBlock}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={style.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={style.title}>
            "{course?.userName}" 님의{" "}
            <span style={{ color: "var(--color-main)" }}>{course?.title}</span>{" "}
            코스
          </div>
          <div style={{ marginLeft: "20px", fontSize: "14px", color: "#bbb" }}>
            {dateOnly}
          </div>
        </div>
        <div className={style.like}>
          <div>{course?.courseLike}&nbsp;</div>
          <div onClick={handleLike}>
            <LikeIcon />
          </div>
        </div>
      </div>
      <div className={style.coursePlaceList}>
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
                <div className={style.placeNameEllipsis}>{place.placeName}</div>
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
  );
};

export default Course;
