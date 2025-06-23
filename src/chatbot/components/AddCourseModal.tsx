import React, { forwardRef, useState } from "react";
import styles from "./Modal.module.css";
import placeStyle from "../Chatbot.module.css";
import { Check, MapPin, X } from "lucide-react";
import { MainButton } from "./Buttons";
import AlertModal from "../../global_components/AlertModal/AlertModal";
import * as Interfaces from "../interfaces/Interface";
import { api } from "../../utils/api";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";

interface AddCourse {
  courseInfo: Interfaces.PlaceType[];
  handleCloseCourseSaveModal: () => void;
}

interface CourseInfo {
  title: string;
  visible: boolean;
  placeList: Interfaces.PlaceType[];
}

const AddCourseModal = forwardRef<HTMLDivElement, AddCourse>(
  ({ courseInfo, handleCloseCourseSaveModal }, ref) => {
    const [addCourseInfo, setAddCourseInfo] = useState<CourseInfo>({
      title: "",
      visible: false,
      placeList: courseInfo,
    });

    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const userIdState = useRecoilValue(userId);

    const handleClickCompleteBtn = async () => {
      console.log(addCourseInfo);
      if (!addCourseInfo.title.trim()) {
        setShowModal(true);
        setMessage("코스 이름을 입력해주세요.");
        return;
      }

      try {
        const res = await api.post("course", {
          userId: userIdState,
          title: addCourseInfo.title,
          visible: addCourseInfo.visible,
          placeList: courseInfo.map((place) => place.placeId),
        });
        console.log(res.data);
        setShowModal(true);
        setMessage("코스가 저장되었습니다.");
      } catch (error) {
        console.error("코스 저장 오류 : ", error);
        setShowModal(true);
        setMessage("코스 저장 중 오류가 발생했습니다.");
      }
    };

    return (
      <div className={styles.modal} ref={ref} tabIndex={-1}>
        <X
          color="#333"
          size={24}
          style={{ placeSelf: "end", cursor: "pointer" }}
          onClick={handleCloseCourseSaveModal}
        />
        <h2 className={styles.title}>내 코스에 추가하기</h2>
        <div className={styles.title_wrapper}>
          <div className={styles.course_title}>코스 이름 :</div>
          <input
            className={styles.input}
            value={addCourseInfo.title}
            onChange={(e) => {
              setAddCourseInfo((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
          />
        </div>
        <div className={styles.title_wrapper}>
          <input
            type="checkbox"
            id="isShare"
            className={styles.checkbox}
            onChange={() => {
              setAddCourseInfo((prev) => ({
                ...prev,
                visible: !prev.visible,
              }));
            }}
            checked={addCourseInfo.visible}
          />
          <label htmlFor="isShare" className={styles.share}>
            코스를 사람들과 공유하기
          </label>
          <Check
            color="#FFF"
            size={14}
            strokeWidth={3}
            style={{ position: "absolute", left: "3px", pointerEvents: "none" }}
          />
        </div>
        <div className={styles.img_wrapper}>
          {courseInfo.map((place: any, idx: number) => (
            <div key={place.placeId} className={placeStyle.place_box}>
              <img
                src={place.imgUrl}
                alt={place.name}
                className={placeStyle.place_img}
              />
              <div className={placeStyle.place_info}>
                <div
                  className={placeStyle.place_idx}
                  style={{ marginBottom: "4px" }}
                >
                  {idx + 1}
                </div>
                <div style={{ marginBottom: "2px" }}>{place.name}</div>
                <div className={placeStyle.place_address}>
                  <MapPin
                    size={14}
                    style={{
                      filter: " drop-shadow(0 0 4px #333)",
                    }}
                  />
                  {place.address.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.btn_wrapper}>
          <MainButton
            bgColor="#d9d9d9"
            fontColor="#333"
            onClick={handleCloseCourseSaveModal}
          >
            취소
          </MainButton>
          <MainButton onClick={handleClickCompleteBtn}>완료</MainButton>
        </div>
        {showModal && (
          <AlertModal
            message={message}
            onClose={() => {
              setShowModal(false);
              handleCloseCourseSaveModal();
            }}
          />
        )}
      </div>
    );
  },
);

export default AddCourseModal;
