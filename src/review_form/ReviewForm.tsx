import React, { useEffect, useState } from "react";
import style from "./ReviewForm.module.css";
import { ImageUp, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import Rating from "react-rating";
import * as Interfaces from "./interfaces/Interface";

const ReviewForm = () => {
  const { placeId } = useParams();
  // if (!placeId) {
  //   throw new Error("placeId is required");
  // }
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [uploadImgUrl, setUploadImgUrl] = useState(""); // 서버에 전송할 url
  const [content, setContent] = useState("");
  const [placeTags, setPlaceTags] = useState<Interfaces.PlaceTagInfo>(
    Interfaces.dummyPlaceTagResponse.placeInfo,
  );
  const MAX_TAGS = 5;

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
    const { files } = e.target;
    if (!files || files.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }
    const file = files[0];
    if (file.type === "image/png" || file.type === "image/jpeg") {
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUploadImgUrl(reader.result);
        }
      };
    } else {
      alert("JPG / JPEG / PNG 형식의 파일 업로드만 가능합니다.");
    }
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.reviewWrapper}>
        <div className={style.reviewHeader}>리뷰 작성하기</div>
        <div className={style.card}>
          <h3>{placeTags.placeName}</h3>
          <span className={style.sub}>
            {placeTags?.categoryName}({placeTags?.subCategoryName})
          </span>
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
            태그는 최소 1개 - 최대 5개 선택({selectedTags.length}/{MAX_TAGS})
          </p>
          <div className={style.tagBox}>
            {placeTags.tagList.map((tag) => (
              <button
                key={tag.tagId}
                className={`${style.tag} ${selectedTags.includes(tag.tagId) ? style.selected : ""}`}
                onClick={() => toggleTag(tag.tagId)}
              >
                {tag.fullName}
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
              accept="image/png, image/jpeg, image/jpg"
              hidden
              onChange={handleImageChange}
            />
            <div className={style.imagePlaceholder}>
              {image ? (
                <span style={{ margin: "10px 0" }}>{image.name}</span>
              ) : (
                <>
                  <ImageUp size={32} color="#b0b0b0" />
                  JPG / JPEG / PNG 형식의 파일 업로드
                </>
              )}

              {/* 이미지 미리보기 */}
              {uploadImgUrl && (
                <div className={style.previewWrapper}>
                  <img
                    src={uploadImgUrl}
                    alt="미리보기"
                    className={style.previewImage}
                  />
                </div>
              )}
            </div>
          </label>
        </div>

        <div className={style.card}>
          <h3>리뷰 글 작성</h3>
          <p className={style.sub}>최대 500자 이내({content.length}/500)</p>
          <textarea
            className={style.textarea}
            maxLength={500}
            placeholder="이곳에서의 경험을 자세히 알려주세요 😊"
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
