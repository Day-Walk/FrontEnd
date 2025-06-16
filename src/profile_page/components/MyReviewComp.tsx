import { useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import { MapPin } from "lucide-react";
import { Star } from "lucide-react";
import { Trash2 } from "lucide-react";
import NoImage from "../../assets/NoImage.png";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

interface Props {
  nowReview: Interfaces.Review;
  onDelete: (reviewId: string) => void; // 부모에게 삭제 사실 알림
}

const MyReviewComp = ({ nowReview, onDelete }: Props) => {
  const [review, setReview] = useState<Interfaces.Review | null>(nowReview);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const handleSelectPlace = () => {
    navigate(`/place/${review?.placeId}`);
  };

  const handleDeleteReview = async () => {
    try {
      await api.delete("/review", {
        data: { reviewId: review?.reviewId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("리뷰 삭제 완료!");
      if (review?.reviewId) onDelete(review.reviewId);
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <div onClick={handleSelectPlace} className={style.reviewBlock}>
        <div className={style.reviewTop}>
          <div className={style.reviewImg}>
            {review?.imgUrl ? (
              <img src={review?.imgUrl} alt="img" className={style.reviewImg} />
            ) : (
              <img src={NoImage} className={style.reviewImg} />
            )}
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
          <button className={style.deleteBtn} onClick={handleDeleteReview}>
            <Trash2 size={22} color="#E96563" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default MyReviewComp;
