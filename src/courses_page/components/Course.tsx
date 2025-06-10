import { useEffect, useState } from "react";
import style from "../Courses.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { Heart, MapPin } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Course = (nowCourse: Interfaces.Course) => {
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  const [like, setLike] = useState<boolean>(course?.like || false);
  const courseId = nowCourse.courseId;
  const navigate = useNavigate();

  const LikeIcon = () => {
    return like ? (
      <AiFillHeart color="#E96563" size={30} />
    ) : (
      <AiOutlineHeart size={30} />
    );
  };

  const handleCourseClick = () => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className={style.courseBlock}>
      <div className={style.header}>
        <div onClick={handleCourseClick} className={style.title}>
          "{course?.userName}" 님의{" "}
          <span style={{ color: "var(--color-main)" }}>{course?.title}</span>{" "}
          코스
        </div>
        <div className={style.like}>
          <div>{course?.courseLike}&nbsp;</div>
          <div onClick={() => setLike(!like)}>
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
              <div
                className={style.placeImg}
                style={{ backgroundColor: "#6e6e6e" }}
              ></div>
            )}

            <div className={style.placeInfo}>
              <div className={style.idx}>{idx + 1}</div>
              {place.placeName.length < 9 ? (
                <div className={style.placeName}>{place.placeName}</div>
              ) : (
                <div className={style.placeNameEllipsis}>{place.placeName}</div>
              )}

              <div className={style.address}>
                <MapPin size={14} />
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
