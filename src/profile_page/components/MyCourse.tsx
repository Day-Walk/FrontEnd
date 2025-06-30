import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import Course from "./MyCourseComp";
import * as Interfaces from "../interfaces/Interfaces";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { api } from "../../utils/api";
import { Loading1 } from "../../loading/Loading";
import { useUserStore } from "../../zustand/useUserStore";

const MyCourse = () => {
  const [coursePagesData, setCoursePagesData] =
    useState<Interfaces.CourseListResponse>();

  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [coursePage, setCoursePage] = useState<Interfaces.CoursePage>();
  // coursePagesData.courseList[nowPage - 1],

  const userIdState = useUserStore((state) => state.userId);

  const [deleted, setDeleted] = useState<string>("");

  const handleDelete = (deletedId: string) => {
    setDeleted(deletedId);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("userIdState", userIdState);
      try {
        const response = await api.get<Interfaces.CourseListResponse>(
          `/course/all/user?userId=${userIdState}`,
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
  }, [deleted]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    setCoursePage(coursePagesData?.courseList[value - 1]);
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
      {coursePage ? (
        <>
          <div>
            {coursePage &&
              coursePage.page.map((c, i) => (
                <div
                  className={i === 0 ? undefined : style.courseList}
                  key={c.courseId}
                >
                  <Course nowCourse={c} onDelete={handleDelete} />
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
          내가 만든 코스가 아직 없어요. 😢
        </div>
      )}
    </div>
  );
};

export default MyCourse;
