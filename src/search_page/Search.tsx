import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./Search.module.css";
import * as Interfaces from "./interfaces/Interface";
import { Star, Share2, ThumbsUp, MapPin } from "lucide-react";
import PlaceModal from "../course_detail/components/PlaceModal";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import SearchBox from "./components/SearchBox";
import RecommendedList from "./components/RecommendList";
import PlaceList from "./components/PlaceList";

declare global {
  interface Window {
    kakao: any;
  }
}

const Search = () => {
  const [recommendedPlaces, setRecommendedPlaces] = useState<
    Interfaces.GroupedPlaceList[0]
  >(Interfaces.dummySearchPlaceResponse.placeList["추천픽"]);
  const [regularPlaces, setRegularPlaces] = useState<
    Interfaces.GroupedPlaceList[1]
  >(Interfaces.dummySearchPlaceResponse.placeList["장소"]);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");

  const handlePlaceClick = (p: Interfaces.SearchPlace) => {
    setSelectedPlaceId(p.placeId);
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
          const firstPlace = recommendedPlaces[0];
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

          recommendedPlaces.forEach((place) => {
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
  }, [recommendedPlaces]);

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
          <RecommendedList
            places={recommendedPlaces}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={handlePlaceClick}
          />
          <hr color="#e5e5e5" style={{ margin: "20px" }} />
          <PlaceList
            places={regularPlaces}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={handlePlaceClick}
          />
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
