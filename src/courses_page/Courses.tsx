import { useEffect, useState } from "react";
import style from "./Courses.module.css";
import Course from "./components/Course";
import * as Interfaces from "./interfaces/Interfaces";
import SearchBox from "./components/SearchBox";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { useRecoilValue } from "recoil";
import { userId } from "../recoil/userInfo";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Loading1 } from "../loading/Loading";

const Courses = () => {
  const [coursePagesData, setCoursePagesData] =
    useState<Interfaces.CourseListResponse>();
  const navigate = useNavigate();
  const userIdState = useRecoilValue(userId);
  if (!userIdState || userIdState.length == 0) {
    navigate("/login");
  }
  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("like"); // like or latest
  const [coursePage, setCoursePage] = useState<Interfaces.CoursePage>();
  // coursePagesData.courseList[nowPage - 1],

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    setCoursePage(coursePagesData?.courseList[value - 1]);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<Interfaces.CourseListResponse>(
          `/course/all?sort=${sort}&userId=${userIdState}`,
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
  }, [sort, nowPage]);

  // 검색결과 저장
  const handleSearchResults = (data: Interfaces.CourseListResponse) => {
    setCoursePagesData(data);
    setNowPage(1);
    setCoursePage(data.courseList[0]);
  };

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
    <div className={style.courseWrapper}>
      {/* <div>코스 보기</div> */}
      <div>
        <SearchBox onSearchResults={handleSearchResults} />
      </div>
      {coursePage ? (
        <>
          <div className={style.sortWrapper}>
            <button
              className={sort == "like" ? style.click : undefined}
              onClick={() => setSort("like")}
            >
              인기순
            </button>
            <p>&nbsp;|&nbsp;</p>
            <button
              className={sort == "latest" ? style.click : undefined}
              onClick={() => setSort("latest")}
            >
              최신순
            </button>
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
                count={coursePagesData?.courseList.length}
                page={nowPage}
                onChange={handleChangePage}
              />
            </Stack>
          </div>
        </>
      ) : (
        <div style={{ margin: "60px 10px", color: "#aaa" }}>
          해당하는 코스가 없어요. 😢
        </div>
      )}
    </div>
  );
};

export default Courses;
