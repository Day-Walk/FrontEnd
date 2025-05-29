import { useState } from "react";
import * as Interfaces from "../interfaces/Interfaces";
import style from "../Profile.module.css";
import { MapPin, Star } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikePlace = () => {
  const [likePlaceResponse, setLikePlaceResponse] =
    useState<Interfaces.FavoritePlaceListResponse>(
      Interfaces.dummyFavoritePlaces,
    );
  const [likedList, setLikedList] = useState<boolean[]>(
    likePlaceResponse.placeList.map(() => true), // 전부 찜 상태로 초기화
  );
  const toggleLike = (index: number) => {
    setLikedList((prev) =>
      prev.map((liked, i) => (i === index ? !liked : liked)),
    );
  };

  return (
    <div className={style.courseWrapper}>
      <div className={style.subTitle}>찜한 장소</div>
      <div className={style.likePlaceGrid}>
        {likePlaceResponse.placeList.map((p, index) => (
          <div key={index}>
            <div className={style.pBlock}>
              <img src={p.imgUrl} alt="img" className={style.likePlaceImg} />
              <div className={style.pInfo}>
                <div className={style.pHeader}>
                  <div className={style.pName}>{p.name}</div>
                  <div
                    onClick={() => toggleLike(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {likedList[index] ? (
                      <AiFillHeart color="#E96563" size={24} />
                    ) : (
                      <AiOutlineHeart color="#E96563" size={24} />
                    )}
                  </div>
                </div>
                <div className={style.pAddress}>
                  <MapPin size={14} />
                  {p?.address.split(" ").slice(0, 2).join(" ")}
                </div>
                <div className={style.pStar}>
                  <Star size={20} fill="#FFEA00" color="#FFEA00" />
                  <span>&nbsp;{p.star.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LikePlace;
