import { useEffect, useState } from "react";
import * as Interfaces from "../interfaces/Interfaces";
import style from "../Profile.module.css";
import { MapPin, Star } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";
import { api } from "../../utils/api";
import NoImage from "../../assets/NoImage.png";
import { Stack, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Loading1 } from "../../loading/Loading";

const LikePlace = () => {
  const [likePlaces, setLikePlaces] = useState<Interfaces.FavoritePlacePage[]>(
    [],
  );
  const [likedList, setLikedList] = useState<boolean[]>();
  const [nowPage, setNowPage] = useState<number>(1);
  const toggleLike = (index: number) => {
    setLikedList((prev = []) =>
      prev.map((liked, i) => (i === index ? !liked : liked)),
    );
  };
  const [loading, setLoading] = useState<boolean>(true);

  const userIdState = useRecoilValue(userId);

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("userIdState", userIdState);
      try {
        const response = await api.get<Interfaces.FavoritePlaceListResponse>(
          `/place-like/user?userId=${userIdState}`,
        );
        const pageList = response.data.placeList;
        setLikePlaces(pageList);
        setLikedList(pageList[0]?.page.map(() => true) ?? []);
        setLoading(false);
        console.log("like place:", response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    const nextPage = likePlaces?.[value - 1];
    setLikedList(nextPage?.page ? nextPage.page.map(() => true) : []);
  };

  const currentPagePlaces = likePlaces[nowPage - 1]?.page ?? [];
  const navigate = useNavigate();
  const handleSelectPlace = (placeId: string) => {
    navigate(`/place/${placeId}`);
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
    <div className={style.courseWrapper}>
      {currentPagePlaces.length > 0 ? (
        <>
          <div className={style.likePlaceGrid}>
            {currentPagePlaces.map((p, index) => (
              <div key={index} onClick={() => handleSelectPlace(p.placeId)}>
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
                      {p.address?.split(" ").slice(0, 2).join(" ")}
                    </div>
                    <div className={style.pStar}>
                      <Star size={20} fill="#FFEA00" color="#FFEA00" />
                      <span>&nbsp;{p.stars.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={style.paginationWrapper}>
            <Stack spacing={2}>
              <Pagination
                count={likePlaces.length}
                page={nowPage}
                onChange={handleChangePage}
              />
            </Stack>
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
