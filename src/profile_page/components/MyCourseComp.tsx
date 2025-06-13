import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { MapPin, Pencil } from "lucide-react";
import { SquareCheck, Square } from "lucide-react";
import NoImage from "../../assets/NoImage.png";
import { api } from "../../utils/api";
import EditCourseModal from "./Modals/EditCourseModal";
import { useNavigate } from "react-router-dom";

const MyCourseList = (nowCourse: Interfaces.Course) => {
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const token = localStorage.getItem("accessToken");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(course?.visible);
  }, []);

  const handleToggleVisibility = async () => {
    if (!course) return;

    try {
      await api.put(
        "/course/visible",
        { courseId: course.courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setIsOpen(!isOpen);
    } catch (error) {
      console.error("공개 설정 변경 실패:", error);
      alert("공개 설정 변경 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateTitle = (newTitle: string) => {
    if (course) {
      setCourse({ ...course, title: newTitle });
    }
  };
  const navigate = useNavigate();
  const handleCourseClick = () => {
    navigate(`/course/${course?.courseId}`);
  };

  return (
    <div className={style.courseBlock}>
      <div className={style.header}>
        <div onClick={handleCourseClick} className={style.title}>
          <span style={{ color: "var(--color-main)" }}>{course?.title}</span>{" "}
          코스
        </div>
        <div className={style.sideButtons}>
          <button onClick={handleToggleVisibility} className={style.btnCenter}>
            {isOpen ? (
              <SquareCheck color="var(--color-main)" size={24} />
            ) : (
              <Square size={24} />
            )}
            <label>&nbsp;공개</label>
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            onClick={() => setModalOpen(true)}
            className={style.btnCenter}
          >
            <Pencil size={18} />
            <label>&nbsp;수정</label>
          </button>
          {modalOpen && course && (
            <EditCourseModal
              onClose={() => setModalOpen(false)}
              courseId={course.courseId}
              courseTitle={course.title}
              onUpdateTitle={handleUpdateTitle}
            />
          )}
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

export default MyCourseList;
