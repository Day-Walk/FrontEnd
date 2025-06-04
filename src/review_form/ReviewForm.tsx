import React, { useState } from "react";
import style from "./ReviewForm.module.css";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";
import Rating from "react-rating";

const MAX_TAGS = 5;

const TAGS = [
  "음식이 맛있어요",
  "양이 많아요",
  "직원이 친절해요",
  "청결해요",
  "재방문의사 있어요",
];

const ReviewForm = () => {
  const { placeId } = useParams();
  // if (!placeId) {
  //   throw new Error("placeId is required");
  // }
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < MAX_TAGS
          ? [...prev, tag]
          : prev,
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.reviewWrapper}>
        <div className={style.card}>
          <h3>볼리블러 배불러 음식점</h3>
          <span className={style.sub}>음식점(양식)</span>
          <div className={style.contentBox}>
            <p className={style.sub}>평점을 표시해 주세요</p>
            <div className={style.starBox}>
              <Rating
                initialRating={rating}
                fractions={2}
                onChange={(value) => setRating(value)}
                emptySymbol={<Star size={32} color="#e0e0e0" fill="none" />}
                fullSymbol={<Star size={32} color="#ffc700" fill="#ffc700" />}
              />
            </div>
            <div className={style.ratingValue}>{rating.toFixed(1)}</div>
          </div>
        </div>

        <div className={style.card}>
          <h3>태그 선택</h3>
          <p className={style.sub}>
            태그는 최소 1개 ~ 최대 5개 선택({selectedTags.length}/{MAX_TAGS})
          </p>
          <div className={style.tagBox}>
            {TAGS.map((tag) => (
              <button
                key={tag}
                className={`${style.tag} ${selectedTags.includes(tag) ? style.selected : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className={style.card}>
          <h3>
            사진 첨부<span className={style.sub}> (선택)</span>
          </h3>
          <p className={style.sub}>사진은 1장만 가능해요</p>
          <label className={style.imageUpload}>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <div className={style.imagePlaceholder}>
              {image ? image.name : "사진은 1장만 가능해요"}
            </div>
          </label>
        </div>

        <div className={style.card}>
          <h3>리뷰 글 작성</h3>
          <p className={style.sub}>최대 500자 이내({content.length}/500)</p>
          <textarea
            className={style.textarea}
            maxLength={500}
            placeholder="이곳에서의 경험을 자세히 알려주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={style.buttonRow}>
          <button className={style.cancel}>취소</button>
          <button className={style.submit}>리뷰 등록하기</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
