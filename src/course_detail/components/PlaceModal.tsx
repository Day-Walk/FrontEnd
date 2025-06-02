import React, { useEffect, useState } from "react";
import style from "../CourseDetail.module.css";
import * as Interfaces from "../interfaces/Interface";
import * as rInterfaces from "../interfaces/ReviewInterface";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

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

  const handlePrev = () => {
    setCurrentImgIndex((prev) =>
      prev === 0 ? selectedPlace!.imgUrlList.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImgIndex((prev) =>
      prev === selectedPlace!.imgUrlList.length - 1 ? 0 : prev + 1,
    );
  };

  if (selectedPlace === null) {
    return <div>장소 정보를 불러오는 중...</div>;
  }
  return (
    <div className={style.placeModalWrapper}>
      <div className={style.placeModal}>
        <button
          className={style.slideInButton}
          onClick={() => setSelectedPlace(null)}
        >
          ◀
        </button>

        <div style={{ marginBottom: "20px" }}>
          <div className={style.modalTitle}>{selectedPlace?.name}</div>
          <span className={style.category}>{selectedPlace?.category}</span>
        </div>

        {selectedPlace?.imgUrlList.length > 0 && (
          <div className={style.sliderWrapper}>
            <button className={style.arrowLeft} onClick={handlePrev}>
              <ChevronLeft />
            </button>

            <img
              src={selectedPlace.imgUrlList[currentImgIndex]}
              alt={`Place Image ${currentImgIndex + 1}`}
              className={style.modalImg}
            />

            <button className={style.arrowRight} onClick={handleNext}>
              <ChevronRight />
            </button>
          </div>
        )}

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
          <div>
            <div className={style.modalSubTitle}>가게 설명</div>
            <p>{selectedPlace.content}</p>
          </div>
          {/* <p>⭐ {selectedPlace?.stars.toFixed(1)}</p> */}

          <div>
            <div className={style.modalReviewTitle}>
              <div>리뷰({reviewTotal.reviewNum})</div>
              <div>
                <Star size={20} color="#FABD55" fill="#FABD55" />
                {reviewTotal.stars}
              </div>
            </div>
            <div className={style.reviewTags}>
              {reviewTotal.tagList.map((tag, index) => (
                <span key={index} className={style.reviewTotalTag}>
                  {tag}
                </span>
              ))}
            </div>

            {reviewList.page.map((review, index) => (
              <div key={index} className={style.reviewBlock}>
                <div className={style.reviewHeader}>
                  <span className={style.reviewUserName}>
                    {review.userName}
                  </span>
                  <div className={style.reviewStars}>
                    ⭐ {review.stars.toFixed(1)}
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
                    <p className={style.reviewContent}>{review.content}</p>
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
    </div>
  );
};
export default PlaceModal;
