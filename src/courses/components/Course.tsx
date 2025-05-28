import { useEffect, useState } from "react";
import style from "../Courses.module.css";
import * as Interfaces from "../interfaces/Interfaces";

const Course = (nowCourse: Interfaces.Course) => {
  const [coursePages, setCoursePages] = useState<Interfaces.CourseListResponse>(
    Interfaces.dummyCourseList,
  );
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  return (
    <div className={style.courseBlock}>
      <div className={style.header}>
        <div className={style.title}>
          "{course?.userName}" 님의{" "}
          <span style={{ color: "var(--color-main)" }}>{course?.title}</span>{" "}
          코스
        </div>
        <div className={style.like}>
          <div>{course?.courseLike}</div>
          <div>{course?.like}</div>
        </div>
      </div>
      <div className={style.coursePlaceList}>
        {course?.placeList.map((place, idx) => (
          <div key={place.placeId} className={style.placeBlock}>
            <img
              src={place.imgUrl}
              alt={place.placeName}
              className={style.placeImg}
            />
            <div className={style.placeInfo}>
              <div className={style.idx}>{idx}</div>
              <div>{place.placeName}</div>
              <div className={style.address}>
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
