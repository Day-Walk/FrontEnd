import { useEffect, useState } from "react";
import style from "./Courses.module.css";
import Course from "./components/Course";
import * as Interfaces from "./interfaces/Interfaces";

const Courses = () => {
  const [coursePages, setCoursePages] = useState<Interfaces.CourseListResponse>(
    Interfaces.dummyCourseList,
  );
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      <div>코스 보기</div>
      <div>
        {coursePages &&
          coursePages.courseList.map((page) =>
            page.page.map((c) => <Course {...c} />),
          )}
      </div>
    </>
  );
};

export default Courses;
