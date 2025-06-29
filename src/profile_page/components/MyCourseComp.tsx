import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { MapPin, Pencil } from "lucide-react";
import { SquareCheck, Square } from "lucide-react";
import NoImage from "../../assets/NoImage.webp";
import { api } from "../../utils/api";
import EditCourseModal from "./Modals/EditCourseModal";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../global_components/AlertModal/AlertModal";
import ConfirmModal from "../../global_components/ConfirmModal/ConfirmModal";
import { Trash2 } from "lucide-react";

interface Props {
  nowCourse: Interfaces.Course;
  onDelete: (reviewId: string) => void; // 부모에게 삭제 사실 알림
}

const MyCourseList = ({ nowCourse, onDelete }: Props) => {
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (course?.visible) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [course?.visible]);

  const handleClickDelete = () => {
    setConfirmModalOpen(true);
  };

  const handleToggleVisibility = async () => {
    if (!course) return;

    try {
      await api.put("/course/visible", { courseId: course.courseId });
      setIsOpen(!isOpen);
      setShowModal(true);
      setMessage("코스 공개설정 변경 완료!");
    } catch (error) {
      console.error("공개설정 변경 실패:", error);
      setShowModal(true);
      setMessage("코스 공개설정 변경 중 오류가 발생했습니다.");
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
  useEffect(() => {
    console.log(course);
  }, [course]);

  const handleDeleteCourse = async () => {
    try {
      await api.delete("/course", {
        data: { courseId: course?.courseId },
      });
      setShowModal(true);
      setMessage("내 코스 삭제 완료!");
      setTimeout(() => {
        if (course?.courseId) onDelete(course?.courseId);
      }, 1000);
    } catch (error) {
      console.error("내 코스 삭제 실패:", error);
      setShowModal(true);
      setMessage("코스 삭제 중 오류가 발생했습니다.");
    }
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
              <SquareCheck color="var(--color-main)" size={20} />
            ) : (
              <Square color="var(--color-main)" size={20} />
            )}
            <label>&nbsp;공개</label>
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            onClick={() => setModalOpen(true)}
            className={style.btnCenter}
          >
            <Pencil size={20} color="#4BB3DD" />
            <label>&nbsp;수정</label>
          </button>
          &nbsp;&nbsp;&nbsp;
          <button className={style.btnCenter} onClick={handleClickDelete}>
            <Trash2 size={20} color="#E96563" />
            <label>&nbsp;삭제</label>
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
      {confirmModalOpen && (
        <ConfirmModal
          message="정말로 이 코스를 삭제하시겠습니까?"
          onConfirm={() => {
            handleDeleteCourse();
            setConfirmModalOpen(false);
          }}
          onCancel={() => {
            setConfirmModalOpen(false); // 취소 시 그냥 모달 닫기
          }}
        />
      )}
      {showModal && (
        <AlertModal message={message} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default MyCourseList;
