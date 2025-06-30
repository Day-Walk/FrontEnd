import style from "../../Profile.module.css";
import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { api } from "../../../utils/api";
import AlertModal from "../../../global_components/AlertModal/AlertModal";

interface Props {
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  onUpdateTitle: (newTitle: string) => void;
}

const EditCourseModal = ({
  onClose,
  courseId,
  courseTitle,
  onUpdateTitle,
}: Props) => {
  const [newTitle, setNewTitle] = useState<string>(courseTitle); // 로컬 상태로 복사

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (newTitle.trim()) {
      const titleTrim = newTitle.trim();

      try {
        await api.put("/course/title", {
          courseId: courseId,
          title: titleTrim,
        });
        onUpdateTitle(titleTrim);
        onClose();
        setShowModal(true);
        setMessage("코스 이름 변경 완료!");
      } catch (error) {
        setShowModal(true);
        setMessage("코스 이름 변경 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modal}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircleAlert color="var(--color-main)" size={26} />
          <div className={style.title}>&nbsp;코스 이름 수정</div>
        </div>
        <div>
          <p className={style.nameTitle}>코스 이름</p>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={style.inputName}
          />
        </div>
        <div className={style.buttonGroup}>
          <button className={style.btn2} onClick={onClose}>
            취소
          </button>
          <button className={style.btn1} onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
      {showModal && (
        <AlertModal message={message} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default EditCourseModal;
