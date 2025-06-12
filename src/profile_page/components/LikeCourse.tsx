import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import Course from "./LikeCourseComp";
import * as Interfaces from "../interfaces/Interfaces";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";
import { api } from "../../utils/api";

const LikeCourse = () => {
  const [coursePagesData, setCoursePagesData] =
    useState<Interfaces.CourseListResponse>();

  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [coursePage, setCoursePage] = useState<Interfaces.CoursePage>();
  // coursePagesData.courseList[nowPage - 1],

  const userIdState = useRecoilValue(userId);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("userIdState", userIdState);
      try {
        const response = await api.get<Interfaces.CourseListResponse>(
          `/course-like/user?userId=${userIdState}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCoursePagesData(response.data);
        setCoursePage(response.data.courseList[nowPage - 1]);
        setLoading(false);
        console.log("Fetched courses:", response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    setCoursePage(coursePagesData?.courseList[value - 1]);
  };

  return (
    <div className={style.courseWrapper}>
      <div className={style.subTitle}>찜한 코스</div>
      {coursePage ? (
        <>
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
                count={coursePagesData?.courseList.length}
                page={nowPage}
                onChange={handleChangePage}
              />
            </Stack>
          </div>
        </>
      ) : (
        <div style={{ margin: "30px 10px", color: "#aaa" }}>
          찜한 코스가 아직 없어요. 😢
        </div>
      )}
    </div>
  );
};

export default LikeCourse;
