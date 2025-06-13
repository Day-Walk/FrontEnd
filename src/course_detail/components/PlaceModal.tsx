import React, { useEffect, useState } from "react";
import style from "../CourseDetail.module.css";
import * as Interfaces from "../interfaces/Interface";
import * as rInterfaces from "../interfaces/ReviewInterface";
import { ChevronLeft, ChevronRight, Share2, Star } from "lucide-react";
import { CircleChevronRight, Pencil, CircleUserRound } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";
import { api } from "../../utils/api";
import { Stack, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PlaceModal = ({
  placeId,
  isPlaceOnly,
  onSelectLocation,
}: {
  placeId: string;
  isPlaceOnly: boolean | null;
  onSelectLocation?: (location: { lat: number; lng: number }) => void | null;
}) => {
  const [selectedPlace, setSelectedPlace] =
    useState<Interfaces.PlaceDetail | null>();
  const [reviews, setReviews] = useState<rInterfaces.ReviewListResponse>();
  const [reviewList, setReviewList] = useState<rInterfaces.ReviewPage>();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [reviewTotal, setReviewTotal] = useState<rInterfaces.ReviewTotal>();
  const [nowPage, setNowPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(true); // false = 모달을 왼쪽으로 숨김
  const [slideDirection, setSlideDirection] = useState("");
  const token = localStorage.getItem("accessToken");
  const currentUserId = useRecoilValue(userId);
  const [like, setLike] = useState<boolean>(false);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    setReviewList(reviews?.reviewList[value - 1]);
  };

  useEffect(() => {
    const getPlace = async () => {
      try {
        const data = await api.get(
          `/place?placeId=${placeId}&userId=${currentUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSelectedPlace(data.data.placeInfo);
        if (isPlaceOnly && data.data.placeInfo.location && onSelectLocation) {
          onSelectLocation(data.data.placeInfo.location);
        }
        console.log(data.data);
      } catch (e) {
        console.log(e);
        alert("장소 상세조회 실패");
      }
    };
    const getReview = async () => {
      try {
        const data = await api.get(`/review/all/place?placeId=${placeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews(data.data);
        setReviewList(data.data.reviewList[0]);
        // console.log(data.data);
      } catch (e) {
        console.log(e);
        alert("장소 리뷰 조회 실패");
      }
    };
    const getReviewTotal = async () => {
      try {
        const data = await api.get(`/review/all/total?placeId=${placeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviewTotal(data.data.reviewTotal);
        // console.log("***", data.data);
      } catch (e) {
        console.log(e);
        alert("리뷰 통계 조회 실패");
      }
    };
    getPlace();
    getReview();
    getReviewTotal();
  }, [placeId]);

  useEffect(() => {
    setLike(selectedPlace?.like || false);
  }, [selectedPlace]);

  const LikeIcon = () => {
    return like ? (
      <AiFillHeart color="#E96563" size={26} />
    ) : (
      <AiOutlineHeart size={26} />
    );
  };

  const handleLike = async () => {
    const body = {
      userId: currentUserId,
      placeId: placeId,
    };

    try {
      if (!like) {
        // 좋아요 등록
        await api.post("/place-like", body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // 좋아요 취소
        await api.delete("/place-like", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: body,
        });
      }
      alert("찜 리스트에 추가 완료!");
      setLike(!like);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleNext = () => {
    setSlideDirection("slide-left");
    setCurrentImgIndex((prev) =>
      prev === selectedPlace!.imgUrlList.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrev = () => {
    setSlideDirection("slide-right");
    setCurrentImgIndex((prev) =>
      prev === 0 ? selectedPlace!.imgUrlList.length - 1 : prev - 1,
    );
  };

  const navigate = useNavigate();
  const handleCreateReview = () => {
    navigate(`/review/${placeId}`);
  };

  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(""), 400);
      return () => clearTimeout(timer);
    }
  }, [slideDirection]);

  if (selectedPlace === null) {
    return <div>장소 정보를 불러오는 중...</div>;
  }
  return (
    <div
      className={
        isPlaceOnly ? style.placeModalWrapperOnly : style.placeModalWrapper
      }
    >
      <div
        className={style.slideGroup}
        style={{ left: isModalOpen ? "0px" : "-400px" }}
      >
        <div className={isPlaceOnly ? style.placeModalOnly : style.placeModal}>
          {selectedPlace && selectedPlace?.imgUrlList.length > 0 && (
            <div className={style.sliderWrapper}>
              {selectedPlace.imgUrlList.length > 1 && (
                <button className={style.arrowLeft} onClick={handlePrev}>
                  <ChevronLeft />
                </button>
              )}
              <div className={style.slideViewport}>
                <div
                  className={style.slideTrack}
                  style={{
                    transform: `translateX(-${currentImgIndex * 100}%)`,
                  }}
                >
                  {selectedPlace?.imgUrlList.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      className={style.modalImg}
                      alt={`Place Image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              {selectedPlace.imgUrlList.length > 1 && (
                <button className={style.arrowRight} onClick={handleNext}>
                  <ChevronRight />
                </button>
              )}
            </div>
          )}

          <div className={style.modalHeader}>
            <div className={style.modalTitle}>{selectedPlace?.name}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className={style.placeModalCategory}>
                {selectedPlace?.category}({selectedPlace?.subCategory})
              </span>
              <div>
                <button onClick={handleCreateReview}>
                  <Pencil size={26} />
                </button>
                &nbsp;
                <button onClick={handleLike}>
                  <LikeIcon />
                </button>
                &nbsp;
                <Share2 size={26} />
              </div>
            </div>
          </div>

          <div style={{ padding: "0 16px 0 26px" }}>
            <div className={style.modalReviewTitle}>
              <div className={style.stars}>
                <Star size={20} color="#FABD55" fill="#FABD55" />
                &nbsp;
                {reviewTotal?.reviewNum == 0 ? "리뷰 없음" : reviewTotal?.stars}
              </div>
            </div>
            <div className={style.reviewTags} style={{ marginBottom: "24px" }}>
              {reviewTotal?.tagList.map((tag, index) => (
                <span key={index} className={style.reviewTotalTag}>
                  {tag}
                </span>
              ))}
            </div>
            <div>
              <p style={{ lineHeight: "24px", fontSize: "14px" }}>
                {selectedPlace?.content &&
                  selectedPlace.content
                    .replaceAll("<br>", ".") // <br>을 마침표로 대체
                    .split(".")
                    .map((line, idx) => {
                      const trimmed = line.trim();
                      return trimmed ? <p key={idx}>{trimmed}.</p> : null;
                    })}
              </p>
            </div>
            <br />
            <br />
            <hr color="#E5E5E5" />
          </div>

          <div className={style.modalContent}>
            <div>
              <div className={style.modalSubTitle}>주소</div>
              {selectedPlace?.address?.split("<br>").map((line, idx) => (
                <p style={{ lineHeight: "20px" }} key={idx}>
                  {line}
                </p>
              ))}
            </div>
            <div>
              <div className={style.modalSubTitle}>운영 시간</div>
              {selectedPlace?.openTime?.split("<br>").map((line, idx) => (
                <p style={{ lineHeight: "20px" }} key={idx}>
                  {line}
                </p>
              ))}
            </div>
            <div>
              <div className={style.modalSubTitle}>전화번호</div>
              <p>
                {selectedPlace?.phoneNum.map((num) => (
                  <p
                    key={num}
                    className={style.phoneNum}
                    style={{ lineHeight: "20px" }}
                  >
                    {num}
                  </p>
                ))}
              </p>
            </div>

            <div className={style.viewDetailButton}>
              <button style={{ display: "flex", alignItems: "center" }}>
                <span>상세 정보 보기&nbsp;</span>
                <CircleChevronRight size={24} />
              </button>
            </div>
            <div>
              <div>리뷰&nbsp;({reviewTotal?.reviewNum})</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {reviewList &&
                  reviewList.page &&
                  reviewList.page.map((review, index) => (
                    <>
                      <div key={index} className={style.reviewBlock}>
                        <div className={style.reviewHeader}>
                          <span className={style.reviewUserName}>
                            <CircleUserRound size={24} />
                            &nbsp;{review.userName}
                          </span>
                          <div className={style.stars}>
                            <Star size={20} color="#FABD55" fill="#FABD55" />{" "}
                            &nbsp;
                            {review.stars.toFixed(1)}
                          </div>
                        </div>
                        <div className={style.reviewContentBlock}>
                          {review.imgUrl && (
                            <a
                              href={review.imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={review.imgUrl}
                                alt={`Review Image ${index + 1}`}
                                className={style.reviewImg}
                              />
                            </a>
                          )}
                          <div>
                            <span className={style.reviewDate}>
                              작성일 : {review.createAt.split("T")[0]}
                            </span>
                            <div className={style.reviewContent}>
                              {review.content}
                            </div>
                          </div>
                        </div>
                        <div className={style.reviewTags}>
                          {review.tagList.map((tag, tagIndex) => (
                            <span key={tagIndex} className={style.reviewTag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ))}

                <div className={style.paginationWrapper}>
                  <Stack spacing={2}>
                    <Pagination
                      count={reviews?.reviewList.length}
                      page={nowPage}
                      onChange={handleChangePage}
                    />
                  </Stack>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}></div>
            </div>
          </div>
        </div>

        {!isModalOpen && (
          <button
            className={style.slideOutButton}
            onClick={() => setIsModalOpen(true)}
          >
            <ChevronRight size={24} />
          </button>
        )}
        {isModalOpen && (
          <button
            className={style.slideInButton}
            onClick={() => setIsModalOpen(false)}
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
    </div>
  );
};
export default PlaceModal;
