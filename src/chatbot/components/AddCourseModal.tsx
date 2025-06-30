import React, { forwardRef, useState } from "react";
import styles from "./AddCourseModal.module.css";
import placeStyle from "../Chatbot.module.css";
import { Check, MapPin, X } from "lucide-react";
import { MainButton } from "./Buttons";
import AlertModal from "../../global_components/AlertModal/AlertModal";
import * as Interfaces from "../interfaces/Interface";
import { api } from "../../utils/api";
import NoImage from "../../assets/NoImage.webp";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../zustand/useUserStore";

const AddCourseModal = forwardRef<HTMLDivElement, Interfaces.AddCourseProps>(
  ({ courseInfo, handleCloseCourseSaveModal }, ref) => {
    const [addCourseInfo, setAddCourseInfo] = useState<Interfaces.CourseInfo>({
      title: "",
      visible: true,
      placeList: courseInfo,
    });

    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [courseId, setCourseId] = useState<string>("");
    const userIdState = useUserStore((state) => state.userId);

    const navigate = useNavigate();

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
        const courseId = res.data.courseId;
        setCourseId(courseId);
        console.log(res.data);
        setShowModal(true);
        setMessage("코스가 저장되었습니다.");
      } catch (error) {
        console.error("코스 저장 오류 : ", error);
        setShowModal(true);
        setMessage("코스 저장 중 오류가 발생했습니다.");
      }
    };

    const moveToCourseDetail = () => {
      if (courseId === "") return;
      navigate(`/course/${courseId}`);
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
            style={{ cursor: "pointer" }}
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
        <div className={styles.title_wrapper}>
          <input
            placeholder="코스 이름을 입력하세요!"
            className={styles.input}
            value={addCourseInfo.title}
            onChange={(e) => {
              setAddCourseInfo((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
          />
          <div className={styles.text}>코스</div>
        </div>

        <div className={styles.img_wrapper}>
          {courseInfo.map((place: any, idx: number) => (
            <div key={place.placeId} className={placeStyle.place_box}>
              {place.imgUrl ? (
                <img
                  src={place.imgUrl}
                  alt={place.name}
                  className={placeStyle.place_img}
                />
              ) : (
                <img src={NoImage} className={styles.place_img} />
              )}

              <div className={placeStyle.place_info}>
                <div
                  className={placeStyle.place_idx}
                  style={{ padding: "2px" }}
                >
                  {idx + 1}
                </div>
                <div
                  className={placeStyle.place_name}
                  style={{ padding: "2px" }}
                >
                  {place.name}
                </div>
                <div
                  style={{ padding: "2px" }}
                  className={placeStyle.place_address}
                >
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
            fontColor="#fff"
            onClick={handleCloseCourseSaveModal}
            paddingY={10}
            paddingX={20}
          >
            취소
          </MainButton>
          <MainButton
            paddingY={10}
            paddingX={20}
            onClick={handleClickCompleteBtn}
          >
            완료
          </MainButton>
        </div>
        {showModal && (
          <AlertModal
            message={message}
            onClose={() => {
              setShowModal(false);
              handleCloseCourseSaveModal();
              moveToCourseDetail();
            }}
          />
        )}
      </div>
    );
  },
);

export default AddCourseModal;
