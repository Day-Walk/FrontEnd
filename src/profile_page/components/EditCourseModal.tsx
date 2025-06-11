import { useRecoilState, useRecoilValue } from "recoil";
import { userId, userName } from "../../recoil/userInfo";
import style from "../Profile.module.css";
import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { api } from "../../utils/api";

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
  const token = localStorage.getItem("accessToken");

  const handleSubmit = async () => {
    if (newTitle.trim()) {
      const titleTrim = newTitle.trim();

      try {
        await api.put(
          "/course/title",
          {
            courseId: courseId,
            title: titleTrim,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        onUpdateTitle(titleTrim);
        onClose();
      } catch (error) {
        alert("title error");
        console.log(error);
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
    </div>
  );
};

export default EditCourseModal;
