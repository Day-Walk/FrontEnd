import { useEffect, useState } from "react";
import * as Interfaces from "../interfaces/Interfaces";
import style from "../Profile.module.css";
import { MapPin, Star } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";
import { api } from "../../utils/api";
import NoImage from "../../assets/NoImage.png";

const LikePlace = () => {
  const [likePlaceResponse, setLikePlaceResponse] =
    useState<Interfaces.FavoritePlaceListResponse>();
  const [likedList, setLikedList] = useState<boolean[]>();

  const toggleLike = (index: number) => {
    setLikedList((prev) =>
      prev.map((liked, i) => (i === index ? !liked : liked)),
    );
  };
  const [loading, setLoading] = useState<boolean>(true);

  const userIdState = useRecoilValue(userId);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("userIdState", userIdState);
      try {
        const response = await api.get<Interfaces.FavoritePlaceListResponse>(
          `/place-like/user?userId=${userIdState}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setLikePlaceResponse(response.data);
        setLikedList(likePlaceResponse?.placeList.map(() => true));
        setLoading(false);
        console.log("like place:", response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className={style.courseWrapper}>
      <div className={style.subTitle}>찜한 장소</div>
      {likePlaceResponse && likePlaceResponse?.placeList.length > 0 ? (
        <>
          <div className={style.likePlaceGrid}>
            {likePlaceResponse.placeList.map((p, index) => (
              <div key={index}>
                <div className={style.pBlock}>
                  {p.imgUrl ? (
                    <img
                      src={p.imgUrl}
                      alt="img"
                      className={style.likePlaceImg}
                    />
                  ) : (
                    <img src={NoImage} className={style.likePlaceImg} />
                  )}
                  <div className={style.pInfo}>
                    <div className={style.pHeader}>
                      <div className={style.pName}>{p.name}</div>
                      <div
                        onClick={() => toggleLike(index)}
                        style={{ cursor: "pointer" }}
                      >
                        {likedList && likedList[index] ? (
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
        </>
      ) : (
        <div style={{ margin: "30px 10px", color: "#aaa" }}>
          찜한 장소가 아직 없어요. 😢
        </div>
      )}
    </div>
  );
};
export default LikePlace;
