import React, { useEffect, useState } from "react";
import style from "./ReviewForm.module.css";
import { ImageUp, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "react-rating";
import * as Interfaces from "./interfaces/Interface";
import axios from "axios";
import { api } from "../utils/api";
import { useRecoilValue } from "recoil";
import { userId } from "../recoil/userInfo";

const ReviewForm = () => {
  const { placeId } = useParams();
  // const placeId = "15741ea9-bea3-48e5-a1e0-f678774c4b91";
  if (!placeId) {
    alert("잘못된 접근입니다. 장소 ID가 없습니다.");
  }
  const userIdState = useRecoilValue(userId);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [uploadImgUrl, setUploadImgUrl] = useState(""); // 서버에 전송할 url
  const [content, setContent] = useState("");
  const [placeInfo, setPlaceInfo] = useState<Interfaces.PlaceTagInfo>(
    Interfaces.dummyPlaceTagResponse.placeInfo,
  );
  const MAX_TAGS = 5;
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaceInfo = async () => {
      try {
        console.log("accessToken", token);
        console.log("userIdState", userIdState);
        const placeResponse = await api.get<Interfaces.PlaceTagResponse>(
          `/tag/all/place?placeId=${placeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (placeResponse.status === 200) {
          setPlaceInfo(placeResponse.data.placeInfo);
          console.log("장소 정보:", placeResponse.data.placeInfo);
        } else {
          console.error("장소 정보를 불러오는 데 실패했습니다.");
          console.log("placeId", placeId);
        }
      } catch (error) {
        console.error("장소 정보를 불러오는 중 오류 발생:", error);
        console.log("placeId", placeId);
      }
    };
    fetchPlaceInfo();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < MAX_TAGS
          ? [...prev, tag]
          : prev,
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }

    const file = files[0];
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      alert("JPG / JPEG / PNG 형식의 파일 업로드만 가능합니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("***", response.data);
      const imageUrl = response.data.imageUrl;
      setImage(file);
      setUploadImgUrl(imageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || selectedTags.length === 0 || !content) {
      alert("별점, 태그, 리뷰 내용을 모두 입력해주세요.");
      return;
    }

    try {
      console.log("accessToken", token);
      console.log("userIdState", userIdState);
      const response = await api.post(
        "/review",
        {
          userId: userIdState,
          placeId: placeId,
          tagList: selectedTags,
          stars: rating,
          imgUrl: uploadImgUrl || null,
          content: content, // 리뷰 텍스트
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("리뷰 등록 성공:", response.data);
      alert("리뷰가 등록되었습니다!");
      navigate(-1);
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.reviewWrapper}>
        <div className={style.reviewHeader}>리뷰 작성하기</div>
        <div className={style.card}>
          <h3>{placeInfo.placeName}</h3>
          <span className={style.sub}>
            {placeInfo?.categoryName}({placeInfo?.subCategoryName})
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
            {placeInfo.tagList.map((tag) => (
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
          <button onClick={handleSubmitReview} className={style.submit}>
            리뷰 등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
