import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";

const MyReviewComp = (nowReview: Interfaces.Review) => {
  const [review, setReview] = useState<Interfaces.Review | null>(nowReview);

  return (
    <div>
      <div className={style.reviewBlock}>
        <div className={style.reviewTop}>
          <div className={style.reviewImg}>
            <img src={review?.imgUrl} alt="img" className={style.reviewImg} />
          </div>
          <div>
            <div>{review?.placeName}</div>
            <div>{review?.createAt}</div>
            <div>{review?.address.split(" ").slice(0, 2).join(" ")}</div>
            <div>{review?.content}</div>
          </div>
          <div>{review?.stars}</div>
        </div>
        <div className={style.reviewTagList}>
          {review?.tagList.map((tag, index) => (
            <span key={index} className={style.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MyReviewComp;
