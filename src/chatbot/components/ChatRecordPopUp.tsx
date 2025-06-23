import styles from "../Chatbot.module.css";
import checkboxStyles from "../../signup/Signup.module.css";
import { Check } from "lucide-react";
import * as Interfaces from "../interfaces/Interface";

const ChatRecordPopUp = ({
  isChecked,
  setIsChecked,
  handleClickClosePopup,
}: Interfaces.ChatRecordPopUpProps) => {
  return (
    <div className={styles.popup_container}>
      <div className={styles.popup}>
        채팅 기록은
        <span style={{ color: "#00b493", fontWeight: 600 }}>7일동안 </span>
        저장됩니다.
        <br />
        이후 기록은&nbsp;
        <span style={{ color: "#EF4444", fontWeight: 600 }}>삭제</span>
        됩니다.
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <input
            type="checkbox"
            id="popupCheckbox"
            className={checkboxStyles.checkbox}
            onChange={(e) => setIsChecked(e.target.checked)}
            checked={isChecked}
            style={{
              marginRight: "5px",
              width: "15px",
              height: "15px",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="popupCheckbox"
            style={{ fontSize: "12px", color: "#b0b0b0", cursor: "pointer" }}
          >
            오늘 하루 보지 않기
          </label>
          <Check
            color="#FFF"
            size={12}
            strokeWidth={3}
            style={{
              position: "absolute",
              left: "1px",
              top: "1px",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
      <button onClick={handleClickClosePopup} className={styles.close_btn}>
        닫기
      </button>
    </div>
  );
};

export default ChatRecordPopUp;
