import { useEffect, useState } from "react";
import style from "./Courses.module.css";
import Course from "./components/Course";
import * as Interfaces from "./interfaces/Interfaces";
import SearchBox from "./components/SearchBox";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Loading1 } from "../loading/Loading";
import Footer from "../global_components/Footer/Footer";
import AlertModal from "../global_components/AlertModal/AlertModal";
import MainBanner from "./components/MainBanner";
import { useUserStore } from "../zustand/useUserStore";
import { useDebouncedSearch } from "../utils/useDebouncedSearch";

const Courses = () => {
  const [coursePagesData, setCoursePagesData] =
    useState<Interfaces.CourseListResponse>();
  const navigate = useNavigate();
  const userIdState = useUserStore((state) => state.userId);

  useEffect(() => {
    if (!userIdState || userIdState.length === 0) {
      navigate("/login");
    }
  }, [userIdState, navigate]);

  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("like"); // like or latest
  const [coursePage, setCoursePage] = useState<Interfaces.CoursePage>();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    if (coursePagesData?.courseList) {
      setCoursePage(coursePagesData.courseList[value - 1]);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get<Interfaces.CourseListResponse>(
        `/course/all?sort=${sort}&userId=${userIdState}`,
      );
      const clonedData = JSON.parse(JSON.stringify(response.data));
      setCoursePagesData(clonedData);
      setNowPage(1);
      setCoursePage(clonedData.courseList[0]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (data: Interfaces.CourseListResponse) => {
    setCoursePagesData(data);
    setNowPage(1);
    setCoursePage(data.courseList[0]);
  };

  const fetchSearchResults = async (searchQuery: string, sortOrder: string) => {
    try {
      setLoading(true);
      const url =
        searchQuery.length <= 0
          ? `/course/all?sort=${sortOrder}&userId=${userIdState}`
          : `/course/search?searchStr=${encodeURIComponent(searchQuery)}&sort=${sortOrder}&userId=${userIdState}`;

      const response = await api.get<Interfaces.CourseListResponse>(url);
      handleSearchResults(response.data);
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const [query, setQuery] = useState<string>("");

  const debouncedSearch = useDebouncedSearch(
    (searchText: string, sort: string) => {
      fetchSearchResults(searchText, sort);
    },
    300,
    [userIdState],
  );

  useEffect(() => {
    if (query.length === 0) {
      fetchCourses();
    } else {
      debouncedSearch(query, sort);
    }
  }, [query]);

  useEffect(() => {
    if (query.length === 0) {
      fetchCourses();
    } else {
      fetchSearchResults(query, sort);
    }
  }, [sort]);

  useEffect(() => {
    if (coursePagesData?.courseList) {
      setCoursePage(coursePagesData.courseList[nowPage - 1]);
    }
  }, [nowPage, coursePagesData]);

  return (
    <div className={style.contentArea}>
      <div className={style.courseWrapper}>
        <MainBanner />
        <div>
          <SearchBox
            query={query}
            setQuery={setQuery}
            onSearch={() => fetchSearchResults(query, sort)}
          />
        </div>

        {!loading && coursePage ? (
          <>
            <div className={style.sortWrapper}>
              <button
                className={sort === "like" ? style.click : undefined}
                onClick={() => setSort("like")}
              >
                인기순
              </button>
              <p>&nbsp;|&nbsp;</p>
              <button
                className={sort === "latest" ? style.click : undefined}
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
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Course
                      {...c}
                      showModal={(msg: string) => {
                        setModalMessage(msg);
                        setShowModal(true);
                      }}
                    />
                  </div>
                ))}
            </div>

            <div className={style.paginationWrapper}>
              <Stack spacing={2}>
                <Pagination
                  count={coursePagesData?.courseList.length || 0}
                  page={nowPage}
                  onChange={handleChangePage}
                />
              </Stack>
            </div>
          </>
        ) : loading ? (
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: 0,
              width: "100%",
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <Loading1 />
          </div>
        ) : (
          <div className={style.noCourse}>
            "{query}" 검색어에 해당하는 코스가 없어요. 😢
          </div>
        )}
      </div>

      {showModal && (
        <AlertModal
          message={modalMessage}
          onClose={() => {
            setShowModal(false);
            window.location.reload();
          }}
        />
      )}

      {isHovering && !(mousePos.x === 0 && mousePos.y === 0) && (
        <div
          style={{
            position: "fixed",
            top: mousePos.y + 10,
            left: mousePos.x + 10,
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className={style.hoverCourse}
        >
          코스 클릭해서 자세히 보기 →
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Courses;
