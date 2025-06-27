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
import AlertModal from "../../global_components/AlertModal/AlertModal";

const LikePlace = () => {
  const [likePlaces, setLikePlaces] = useState<Interfaces.FavoritePlacePage[]>(
    [],
  );
  const [likedList, setLikedList] = useState<boolean[]>();
  const [nowPage, setNowPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const userIdState = useRecoilValue(userId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<Interfaces.FavoritePlaceListResponse>(
          `/place-like/user?userId=${userIdState}`,
        );
        const pageList = response.data.placeList;
        setLikePlaces(pageList);
        setLikedList(pageList[0]?.page.map(() => true) ?? []);
        setLoading(false);
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

  const handleSelectPlace = (
    e: React.MouseEvent<HTMLDivElement>,
    placeId: string,
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const clickPercent = (clickX / width) * 100;
    if (clickPercent <= 90) navigate(`/place/${placeId}`);
  };

  const handleLike = async (index: number, placeId: string) => {
    const body = { userId: userIdState, placeId };
    try {
      if (likedList?.[index]) {
        await api.delete("/place-like", { data: body });
        setMessage("장소 찜 리스트에서 삭제 완료!");
      } else {
        await api.post("/place-like", body);
        setMessage("장소 찜 리스트에 추가 완료!");
      }
      setLikedList((prev = []) =>
        prev.map((liked, i) => (i === index ? !liked : liked)),
      );
    } catch (error) {
      setMessage("좋아요 처리 중 오류가 발생했습니다.");
      console.error("좋아요 처리 실패:", error);
    } finally {
      setShowModal(true);
    }
  };

  const currentPagePlaces = likePlaces[nowPage - 1]?.page ?? [];

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
        <div>
          <div className={style.likePlaceGrid}>
            {currentPagePlaces.map((p, index) => (
              <div key={index} onClick={(e) => handleSelectPlace(e, p.placeId)}>
                <div className={style.pBlock}>
                  {p.imgUrl ? (
                    <img
                      width={130}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(index, p.placeId);
                        }}
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
        </div>
      ) : (
        <div style={{ margin: "30px 10px", color: "#aaa" }}>
          찜한 장소가 아직 없어요. 😢
        </div>
      )}
      {showModal && (
        <AlertModal message={message} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default LikePlace;
