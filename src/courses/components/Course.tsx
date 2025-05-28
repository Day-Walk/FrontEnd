import { useEffect, useState } from "react";
import style from "../Courses.module.css";
import * as Interfaces from "../interfaces/Interfaces";

const Course = (nowCourse: Interfaces.Course) => {
  const [coursePages, setCoursePages] = useState<Interfaces.CourseListResponse>(
    Interfaces.dummyCourseList,
  );
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  return (
    <>
      <div>
        <div>
          {course?.userName} 님의 {course?.title} 코스
        </div>
        <div>
          <div>{course?.courseLike}</div>
          <div>{course?.like ? true : false}</div>
        </div>
      </div>
      <div className={style.coursePlaceList}>
        {course?.placeList.map((place) => (
          <div key={place.placeId}>
            <img src={place.imgUrl} alt={place.placeName} />
            <div>{place.placeName}</div>
            <div>{place.address}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Course;
