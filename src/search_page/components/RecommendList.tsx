// src/components/RecommendedPlaceList.tsx
import React from "react";
import style from "../Search.module.css";
import { MapPin, Star, ThumbsUp } from "lucide-react";
import * as Interfaces from "../interfaces/Interface";
import NoImage from "../../assets/NoImage.webp";
interface Props {
  places: Interfaces.SearchPlace[];
  selectedPlaceId: string;
  onPlaceClick: (place: Interfaces.SearchPlace, index: number) => void;
  itemRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const RecommendedList: React.FC<Props> = ({
  places,
  selectedPlaceId,
  onPlaceClick,
  itemRefs,
}) => {
  return (
    <div>
      {places.map((p, i) => {
        return (
          <div
            key={p.placeId}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => onPlaceClick(p, i)}
            className={
              selectedPlaceId === p.placeId
                ? style.placeBlockClick
                : style.placeBlock
            }
          >
            {p.imgUrl ? (
              <img
                src={p.imgUrl}
                alt={p.placeName}
                className={style.placeImg}
              />
            ) : (
              <img src={NoImage} className={style.placeImg} />
            )}
            <div className={style.placeInfo}>
              <div style={{ display: "flex", alignItems: "start" }}>
                <span className={style.placeRecommend}>
                  <span>추천&nbsp;</span>
                  <ThumbsUp size={14} color="var(--color-main)" />
                </span>
                <div className={style.placeNameRecom}>&nbsp;{p.placeName}</div>
              </div>
              <div className={style.address}>
                <MapPin size={14} />
                {p.address?.split(" ").slice(0, 2).join(" ")}
              </div>
              <div className={style.placeCategory}>
                <div className={style.category}>{p.subCategory}</div>
                <div className={style.stars}>
                  <Star size={20} fill="#fabd55" color="#fabd55" />
                  <span>&nbsp;{p.stars}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendedList;
