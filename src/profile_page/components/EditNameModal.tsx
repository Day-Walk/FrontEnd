import { useRecoilState } from "recoil";
import { userName } from "../../recoil/userInfo";
import style from "../Profile.module.css";
import { useState } from "react";
import { CircleAlert } from "lucide-react";

interface Props {
  onClose: () => void;
}

const EditNameModal = ({ onClose }: Props) => {
  const [userNameState, setUserNameState] = useRecoilState(userName);
  const [newName, setNewName] = useState(userNameState); // 로컬 상태로 복사

  const handleSubmit = () => {
    if (newName.trim()) {
      setUserNameState(newName.trim());
      onClose();
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
    </div>
  );
};

export default EditNameModal;
