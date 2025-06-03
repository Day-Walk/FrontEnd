import React, { useEffect, useState } from "react";
import style from "../CourseDetail.module.css";
import * as Interfaces from "../interfaces/Interface";
import * as rInterfaces from "../interfaces/ReviewInterface";
import { ChevronLeft, ChevronRight, Pen, Share2, Star } from "lucide-react";
import { CircleChevronRight, Pencil, CircleUserRound } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const PlaceModal = ({ placeId }: { placeId: string }) => {
  const [selectedPlace, setSelectedPlace] =
    useState<Interfaces.PlaceDetail | null>(
      Interfaces.dummyPlaceDetail.placeInfo,
    );
  const [reviewList, setReviewList] = useState<rInterfaces.ReviewPage>(
    rInterfaces.dummyReviewList.reviewList[0],
  );
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [reviewTotal, setReviewTotal] = useState<rInterfaces.ReviewTotal>(
    rInterfaces.dummyReviewTotal.reviewTotal,
  );
  const [isModalOpen, setIsModalOpen] = useState(true); // false = 모달을 왼쪽으로 숨김

  const [slideDirection, setSlideDirection] = useState("");

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
    <div className={style.placeModalWrapper}>
      <div
        className={style.slideGroup}
        style={{ left: isModalOpen ? "0px" : "-400px" }}
      >
        <div className={style.placeModal}>
          {selectedPlace?.imgUrlList.length > 0 && (
            <div className={style.sliderWrapper}>
              <button className={style.arrowLeft} onClick={handlePrev}>
                <ChevronLeft />
              </button>

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

              <button className={style.arrowRight} onClick={handleNext}>
                <ChevronRight />
              </button>
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
                <Pencil size={26} />
                &nbsp;
                {selectedPlace?.like ? (
                  <AiFillHeart size={26} color="#E96563" />
                ) : (
                  <AiOutlineHeart size={26} color="#E96563" />
                )}
                &nbsp;
                <Share2 size={26} />
              </div>
            </div>
          </div>

          <div style={{ padding: "0 16px 0 26px" }}>
            <div className={style.modalReviewTitle}>
              <div className={style.stars}>
                <Star size={20} color="#FABD55" fill="#FABD55" />
                &nbsp;{reviewTotal.stars}
              </div>
            </div>
            <div className={style.reviewTags} style={{ marginBottom: "24px" }}>
              {reviewTotal.tagList.map((tag, index) => (
                <span key={index} className={style.reviewTotalTag}>
                  {tag}
                </span>
              ))}
            </div>
            <div>
              <p>{selectedPlace.content}</p>
            </div>
            <br />
            <br />
            <hr color="#E5E5E5" />
          </div>

          <div className={style.modalContent}>
            <div>
              <div className={style.modalSubTitle}>주소</div>
              <p>{selectedPlace?.address}</p>
            </div>
            <div>
              <div className={style.modalSubTitle}>운영 시간</div>
              <p>{selectedPlace.openTime}</p>
            </div>
            <div>
              <div className={style.modalSubTitle}>전화번호</div>
              <p>
                {selectedPlace.phoneNum.map((num) => (
                  <p key={num} className={style.phoneNum}>
                    {num}
                  </p>
                ))}
              </p>
            </div>
            <div>
              <div className={style.modalSubTitle}>매장 정보</div>
              <p>{selectedPlace.detail}</p>
            </div>

            <div className={style.viewDetailButton}>
              <button style={{ display: "flex", alignItems: "center" }}>
                <span>상세 정보 보기&nbsp;</span>
                <CircleChevronRight size={24} />
              </button>
            </div>
            <div>
              <div>리뷰&nbsp;({reviewTotal.reviewNum})</div>
              {reviewList.page.map((review, index) => (
                <div key={index} className={style.reviewBlock}>
                  <div className={style.reviewHeader}>
                    <span className={style.reviewUserName}>
                      <CircleUserRound size={24} />
                      &nbsp;{review.userName}
                    </span>
                    <div className={style.stars}>
                      <Star size={20} color="#FABD55" fill="#FABD55" /> &nbsp;
                      {review.stars.toFixed(1)}
                    </div>
                  </div>
                  <div className={style.reviewContentBlock}>
                    {review.imgUrl && (
                      <img
                        src={review.imgUrl}
                        alt={`Review Image ${index + 1}`}
                        className={style.reviewImg}
                      />
                    )}
                    <div>
                      <span className={style.reviewDate}>
                        작성일 : {review.createAt}
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
              ))}
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
