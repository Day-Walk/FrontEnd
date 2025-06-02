import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./Search.module.css";
import * as Interfaces from "./interfaces/Interface";
import { Star, Share2, ThumbsUp, MapPin } from "lucide-react";
import PlaceModal from "../course_detail/components/PlaceModal";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import SearchBox from "./components/SearchBox";

declare global {
  interface Window {
    kakao: any;
  }
}

const Search = () => {
  const [searchPlaceList, setSearchPlaceList] =
    useState<Interfaces.SearchPlaceResponse | null>(
      Interfaces.dummySearchPlaceResponse,
    );
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");

  const handlePlaceClick = (p: Interfaces.CourseDetailPlace) => {
    setSelectedPlaceId(p.placeId);
    setSelectedPlace(p);
  };

  useEffect(() => {
    console.log(selectedPlaceId);
  }, [selectedPlaceId]);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => {
        if (mapRef.current && !mapInstance.current) {
          const firstPlace = searchPlaceList?.placeList[0];
          const center = firstPlace
            ? new window.kakao.maps.LatLng(
                firstPlace.location.lat,
                firstPlace.location.lng,
              )
            : new window.kakao.maps.LatLng(37.5665, 126.978);

          const options = {
            center,
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;

          searchPlaceList?.placeList.forEach((place) => {
            const markerPosition = new window.kakao.maps.LatLng(
              place.location.lat,
              place.location.lng,
            );

            new window.kakao.maps.Marker({
              map,
              position: markerPosition,
              title: place.placeName,
            });
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className={style.courseDetailWrapper}>
      <div className={style.detailLeft}>
        {/* <h1>Course Detail : {id}</h1> */}
        <div>
          <div className={style.courseTitle}>
            <div>
              name님이 좋아하실만한{" "}
              <span style={{ color: "var(--color-main)" }}>Pick!</span>
            </div>
          </div>
        </div>
        <div>
          {searchPlaceList?.placeList.map((p, i) => (
            <div
              key={p.placeId}
              onClick={() => handlePlaceClick(p)}
              className={
                selectedPlaceId == p.placeId
                  ? style.placeBlockClick
                  : style.placeBlock
              }
            >
              <img
                src={p.imgUrl}
                alt={p.placeName}
                className={style.placeImg}
              />
              <div className={style.placeInfo}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className={style.placeRecommend}>
                    <span>추천&nbsp;</span>
                    <ThumbsUp size={14} color="var(--color-main)" />
                  </span>
                  <div className={style.placeName}>&nbsp;{p.placeName}</div>
                </div>
                <div className={style.address}>
                  <MapPin size={14} />
                  {p.address}
                </div>
                <div className={style.placeCategory}>
                  <div className={style.category}>
                    {p.category}({p.subCategory})
                  </div>
                  <div className={style.stars}>
                    <Star size={20} fill="#fabd55" color="#fabd55" />
                    <span>&nbsp;{p.stars.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={style.detailRight}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        <div className={style.searchBoxWrapper}>
          <SearchBox />
        </div>
        {selectedPlaceId && selectedPlaceId.length > 0 && (
          <PlaceModal placeId={selectedPlaceId ? selectedPlaceId : ""} />
        )}
      </div>
    </div>
  );
};
export default Search;
