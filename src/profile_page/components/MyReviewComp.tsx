import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { MapPin } from "lucide-react";
import { Star } from "lucide-react";
import { Trash2 } from "lucide-react";

const MyReviewComp = (nowReview: Interfaces.Review) => {
  const [review, setReview] = useState<Interfaces.Review | null>(nowReview);

  return (
    <div>
      <div className={style.reviewBlock}>
        <div className={style.reviewTop}>
          <div className={style.reviewImg}>
            <img src={review?.imgUrl} alt="img" className={style.reviewImg} />
          </div>
          <div className={style.reviewInfo}>
            <div className={style.rPlace}>{review?.placeName}</div>
            <div className={style.rDate}>작성일 : {review?.createAt}</div>
            <div className={style.rAddress}>
              <MapPin size={14} />
              {review?.address.split(" ").slice(0, 2).join(" ")}
            </div>
            <div>{review?.content}</div>
          </div>
          <div className={style.rStar}>
            <Star size={20} fill="#FFEA00" color="#FFEA00" />
            <div>&nbsp;{review?.stars.toFixed(1)}</div>
          </div>
        </div>
        <div className={style.reviewBottom}>
          <div className={style.reviewTagList}>
            {review?.tagList.map((tag, index) => (
              <span key={index} className={style.tag}>
                {tag}
              </span>
            ))}
          </div>
          <button className={style.deleteBtn}>
            <Trash2 size={22} color="#E96563" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default MyReviewComp;
