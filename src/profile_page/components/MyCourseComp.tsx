import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { MapPin, Pencil } from "lucide-react";
import { SquareCheck, Square } from "lucide-react";

const MyCourseList = (nowCourse: Interfaces.Course) => {
  const [course, setCourse] = useState<Interfaces.Course | null>(nowCourse);
  const [isOpen, setIsOpen] = useState<boolean>(course?.isOpen || false);

  return (
    <div className={style.courseBlock}>
      <div className={style.header}>
        <div className={style.title}>
          <span style={{ color: "var(--color-main)" }}>{course?.title}</span>{" "}
          코스
        </div>
        <div className={style.sideButtons}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={style.btnCenter}
          >
            {isOpen ? (
              <SquareCheck color="var(--color-main)" size={20} />
            ) : (
              <Square size={20} />
            )}
            <label>&nbsp;공개</label>
          </button>
          <button className={style.btnCenter}>
            <Pencil size={18} />
            <label>&nbsp;수정</label>
          </button>
        </div>
      </div>
      <div className={style.coursePlaceList}>
        {course?.placeList.map((place, idx) => (
          <div key={place.placeId} className={style.placeBlock}>
            <img
              src={place.imgUrl}
              alt={place.placeName}
              className={style.placeImg}
            />
            <div className={style.placeInfo}>
              <div className={style.idx}>{idx + 1}</div>
              <div className={style.placeName}>{place.placeName}</div>
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
