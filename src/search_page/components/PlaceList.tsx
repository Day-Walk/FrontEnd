// src/components/RecommendedPlaceList.tsx
import React from "react";
import style from "../Search.module.css";
import { MapPin, Star, ThumbsUp } from "lucide-react";
import * as Interfaces from "../interfaces/Interface";
import NoImage from "../../assets/NoImage.png";
interface Props {
  places: Interfaces.SearchPlace[];
  selectedPlaceId: string;
  onPlaceClick: (place: Interfaces.SearchPlace) => void;
}

const RecommendedList: React.FC<Props> = ({
  places,
  selectedPlaceId,
  onPlaceClick,
}) => {
  return (
    <div>
      {places.map((p) => (
        <div
          key={p.placeId}
          onClick={() => onPlaceClick(p)}
          className={
            selectedPlaceId === p.placeId
              ? style.placeBlockClick
              : style.placeBlock
          }
        >
          {p.imgUrl ? (
            <img src={p.imgUrl} alt={p.placeName} className={style.placeImg} />
          ) : (
            <img src={NoImage} className={style.placeImg} />
          )}
          <div className={style.placeInfo}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className={style.placeName}>&nbsp;{p.placeName}</div>
            </div>
            <div className={style.address}>
              <MapPin size={14} />
              {p.address}
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
      ))}
    </div>
  );
};

export default RecommendedList;
