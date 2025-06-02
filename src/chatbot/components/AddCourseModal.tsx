import React, { forwardRef, useState } from "react";
import styles from "./Modal.module.css";
import placeStyle from "../Chatbot.module.css";
import { Check, MapPin, X } from "lucide-react";
import { MainButton } from "./Buttons";

interface AddCourse {
  courseInfo: [placeInfo: any];
  handleClose: () => void;
}

interface PlaceInfo {
  placeId: string;
  name: string;
  address: string;
  imgUrl: string;
}

interface CourseInfo {
  userId?: string;
  title: string;
  visible: boolean;
  placeList: PlaceInfo[];
}

const AddCourseModal = forwardRef<HTMLDivElement, AddCourse>(
  ({ courseInfo, handleClose }, ref) => {
    const [addCourseInfo, setAddCourseInfo] = useState<CourseInfo>({
      title: "",
      visible: false,
      placeList: courseInfo,
    });

    const handleClickCompleteBtn = () => {
      console.log(addCourseInfo);
      if (!addCourseInfo.title.trim()) {
        alert("코스 이름을 입력해주세요.");
        return;
      }
    };

    return (
      <div className={styles.modal} ref={ref} tabIndex={-1}>
        <X
          color="#333"
          size={24}
          style={{ placeSelf: "end" }}
          onClick={handleClose}
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
          <MainButton bgColor="#d9d9d9" fontColor="#333" onClick={handleClose}>
            취소
          </MainButton>
          <MainButton onClick={handleClickCompleteBtn}>완료</MainButton>
        </div>
      </div>
    );
  },
);

export default AddCourseModal;
