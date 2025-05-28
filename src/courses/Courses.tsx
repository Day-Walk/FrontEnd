import { useEffect, useState } from "react";
import style from "./Courses.module.css";
import Course from "./components/Course";
import * as Interfaces from "./interfaces/Interfaces";
import SearchBox from "./components/SearchBox";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

const Courses = () => {
  const [coursePagesData, setCoursePagesData] =
    useState<Interfaces.CourseListResponse>(Interfaces.dummyCourseList);

  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [coursePage, setCoursePage] = useState<Interfaces.CoursePage>(
    coursePagesData.courseList[nowPage - 1],
  );

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    setCoursePage(coursePagesData.courseList[value - 1]);
  };

  useEffect(() => {
    console.log(nowPage, "coursePage", coursePage);
  }, [nowPage, coursePage]);

  return (
    <div className={style.courseWrapper}>
      <div>코스 보기</div>
      <div>
        <SearchBox />
      </div>
      <div>
        {coursePage &&
          coursePage.page.map((c, i) => (
            <div
              className={i === 0 ? undefined : style.courseList}
              key={c.courseId}
            >
              <Course {...c} />
            </div>
          ))}
      </div>
      <div className={style.paginationWrapper}>
        <Stack spacing={2}>
          <Pagination
            count={coursePagesData.courseList.length}
            page={nowPage}
            onChange={handleChangePage}
          />
        </Stack>
      </div>
    </div>
  );
};

export default Courses;
