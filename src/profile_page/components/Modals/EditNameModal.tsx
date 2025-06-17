import { useRecoilState, useRecoilValue } from "recoil";
import { userId, userName } from "../../../recoil/userInfo";
import style from "../../Profile.module.css";
import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { api } from "../../../utils/api";
import AlertModal from "../../../global_components/AlertModal/AlertModal";

interface Props {
  onClose: () => void;
}

const EditNameModal = ({ onClose }: Props) => {
  const [userNameState, setUserNameState] = useRecoilState(userName);
  const [newName, setNewName] = useState(userNameState); // 로컬 상태로 복사
  const token = localStorage.getItem("accessToken");
  const userIdState = useRecoilValue(userId);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (newName.trim()) {
      const nameTrim = newName.trim();

      try {
        await api.put(
          "/user",
          {
            id: userIdState,
            name: nameTrim,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setShowModal(true);
        setMessage("닉네임 변경 완료!");
        setUserNameState(nameTrim);
        localStorage.setItem("userName", nameTrim);
        setTimeout(() => {
          setShowModal(false);
          onClose();
        }, 700);
      } catch (error) {
        setShowModal(true);
        setMessage("닉네임 변경 중 오류가 발생했습니다.");
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
          <div className={style.title}>&nbsp;프로필 수정</div>
        </div>
        <div>
          <p className={style.nameTitle}>닉네임</p>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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

export default EditNameModal;
