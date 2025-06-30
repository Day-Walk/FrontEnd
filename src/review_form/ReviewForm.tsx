import React, { useEffect, useState } from "react";
import style from "./ReviewForm.module.css";
import { ImageUp, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
// // @ts-expect-error
// const Rating = require("react-rating");
import Rating from "react-rating";
import * as Interfaces from "./interfaces/Interface";
import { api } from "../utils/api";
import AlertModal from "../global_components/AlertModal/AlertModal";
import { Loading1 } from "../loading/Loading";
import ConfirmModal from "../global_components/ConfirmModal/ConfirmModal";
import { useUserStore } from "../zustand/useUserStore";

const ReviewForm = () => {
  const { placeId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  if (!placeId) {
    setShowModal(true);
    setMessage("잘못된 접근입니다. 장소 ID가 없습니다.");
  }

  const userIdState = useUserStore((state) => state.userId);
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [uploadImgUrl, setUploadImgUrl] = useState(""); // 서버에 전송할 url
  const [content, setContent] = useState("");
  const [placeInfo, setPlaceInfo] = useState<Interfaces.PlaceTagInfo>(
    Interfaces.dummyPlaceTagResponse.placeInfo,
  );
  const MAX_TAGS = 5;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlaceInfo = async () => {
      try {
        console.log("userIdState", userIdState);
        const placeResponse = await api.get<Interfaces.PlaceTagResponse>(
          `/tag/all/place?placeId=${placeId}`,
        );
        if (placeResponse.status === 200) {
          setPlaceInfo(placeResponse.data.placeInfo);
          console.log("장소 정보:", placeResponse.data.placeInfo);
        } else {
          console.error("장소 정보를 불러오는 데 실패했습니다.");
          console.log("placeId", placeId);
        }
        setLoading(false);
      } catch (error) {
        console.error("장소 정보를 불러오는 중 오류 발생:", error);
        console.log("placeId", placeId);
        setLoading(false);
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
      setShowModal(true);
      setMessage("파일을 선택해주세요.");
      return;
    }

    const file = files[0];
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setShowModal(true);
      setMessage("JPG / JPEG / PNG 형식의 파일 업로드만 가능합니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/image", formData);
      console.log("***", response.data);
      const imageUrl = response.data.imageUrl;
      setImage(file);
      setUploadImgUrl(imageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setShowModal(true);
      setMessage("이미지 업로드 중 오류가 발생했습니다.");
    }
  };
  const [onModalClose, setOnModalClose] = useState<() => void>(() => () => {});

  const handelCancel = () => {
    setConfirmModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!rating || selectedTags.length === 0 || !content) {
      setShowModal(true);
      setMessage("별점, 태그, 리뷰 내용을 모두 입력해주세요.");
      setOnModalClose(() => () => {}); // 아무 것도 하지 않음
      return;
    }

    try {
      const response = await api.post("/review", {
        userId: userIdState,
        placeId,
        tagList: selectedTags,
        stars: rating,
        imgUrl: uploadImgUrl || null,
        content,
      });

      console.log("리뷰 등록 성공:", response.data);
      setMessage("리뷰가 등록되었습니다!");
      setShowModal(true);
      setOnModalClose(
        () => () =>
          navigate("/profile", {
            state: {
              menuIndex: 1,
            },
          }),
      ); // 모달 닫힐 때 뒤로가기
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      setMessage("리뷰 등록 중 오류가 발생했습니다.");
      setShowModal(true);
      setOnModalClose(() => () => {}); // 아무 동작 없음
    }
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 20,
        }}
      >
        <Loading1 />
      </div>
    );
  }

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
                onChange={(value: number) => setRating(value)}
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
          <button onClick={handelCancel} className={style.cancel}>
            취소
          </button>
          <button onClick={handleSubmitReview} className={style.submit}>
            리뷰 등록하기
          </button>
        </div>
      </div>
      {confirmModalOpen && (
        <ConfirmModal
          message="리뷰 작성을 취소하시겠습니까?"
          onConfirm={() => {
            navigate(-1);
            setConfirmModalOpen(false);
          }}
          onCancel={() => {
            setConfirmModalOpen(false); // 취소 시 그냥 모달 닫기
          }}
        />
      )}
      {showModal && (
        <AlertModal
          message={message}
          onClose={() => {
            setShowModal(false);
            onModalClose(); // navigate(-1) 실행
          }}
        />
      )}
    </div>
  );
};

export default ReviewForm;
