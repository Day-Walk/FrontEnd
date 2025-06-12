import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadKakaoMap } from "../KakaoMapLoader";
import style from "./Search.module.css";
import * as Interfaces from "./interfaces/Interface";
import PlaceModal from "../course_detail/components/PlaceModal";
import SearchBox from "./components/SearchBox";
import RecommendList from "./components/RecommendList";
import PlaceList from "./components/PlaceList";
import { CustomMarker } from "./components/CustomMarker";
import { api } from "../utils/api";
import { useRecoilValue } from "recoil";
import { userId, userName } from "../recoil/userInfo";
import RobotImage from "../assets/goodVersion.png";

declare global {
  interface Window {
    kakao: any;
  }
}

const Search = () => {
  const [recommendedPlaces, setRecommendedPlaces] =
    useState<Interfaces.GroupedPlaceList[0]>();
  const [regularPlaces, setRegularPlaces] =
    useState<Interfaces.GroupedPlaceList[1]>();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
  const [selectedPlace, setSelectedPlace] =
    useState<Interfaces.SearchPlace | null>(null);
  const markerOverlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const userNameState = useRecoilValue(userName);

  const handlePlaceClick = (p: Interfaces.SearchPlace) => {
    setSelectedPlaceId(p.placeId);
    setSelectedPlace(p);
  };

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const onSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    console.log(keyword);
  };

  const userIdState = useRecoilValue(userId);
  useEffect(() => {
    if (searchKeyword.length == 0) return;
    const getResults = async () => {
      try {
        const res = await api.get(
          `/place/search?searchStr=${searchKeyword}&userId=${userIdState}`,
        );
        const data = res.data.searchData;
        setRecommendedPlaces(data["recommendList"]);
        setRegularPlaces(data["placeList"]);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    getResults();
  }, [searchKeyword]);

  useEffect(() => {
    console.log(selectedPlaceId);
  }, [selectedPlaceId]);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  // 마커 렌더링 함수
  const renderMarkers = () => {
    if (!window.kakao || !mapInstance.current) return;

    const map = mapInstance.current;

    // 기존 마커 제거
    markerOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markerOverlaysRef.current = [];

    const recomLength = recommendedPlaces?.length ?? 0;

    if (recommendedPlaces) {
      recommendedPlaces.forEach((place, index) => {
        const overlay = CustomMarker(
          map,
          place,
          index,
          selectedPlaceId,
          () => handlePlaceClick(place),
          style.mapMarker,
          style.selectedMarker,
        );
        markerOverlaysRef.current.push(overlay);
      });
    }

    if (regularPlaces) {
      regularPlaces.forEach((place, index) => {
        const overlay = CustomMarker(
          map,
          place,
          index + recomLength,
          selectedPlaceId,
          () => handlePlaceClick(place),
          style.mapMarker,
          style.selectedMarker,
        );
        markerOverlaysRef.current.push(overlay);
      });
    }
  };

  useEffect(() => {
    loadKakaoMap(import.meta.env.VITE_KAKAOMAP_KEY)
      .then(() => {
        if (mapRef.current && !mapInstance.current) {
          const firstPlace = recommendedPlaces?.[0] || null;
          const center = firstPlace
            ? new window.kakao.maps.LatLng(
                firstPlace.location.lat,
                firstPlace.location.lng,
              )
            : new window.kakao.maps.LatLng(37.5665, 126.978);

          const options = {
            center,
            level: 5,
          };

          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!window.kakao || !selectedPlace || !mapInstance.current) return;

    const newCenter = new window.kakao.maps.LatLng(
      selectedPlace.location.lat,
      selectedPlace.location.lng,
    );

    mapInstance.current.setCenter(newCenter);
  }, [selectedPlace]);

  useEffect(() => {
    renderMarkers();
  }, [recommendedPlaces, selectedPlaceId]);

  return (
    <div className={style.courseDetailWrapper}>
      <div className={style.detailLeft}>
        {/* <h1>Course Detail : {id}</h1> */}
        <div>
          {!recommendedPlaces && (
            <div className={style.courseTitleNone}>
              <img src={RobotImage} width={150} />
              <div>
                <span style={{ color: "var(--color-main)" }}>
                  {userNameState}
                </span>
                님!
                <br />
                관심있는 장소를
                <br />
                검색해보세요.
              </div>
            </div>
          )}
        </div>
        <div>
          {recommendedPlaces && recommendedPlaces.length > 0 && (
            <>
              <div>
                <div className={style.courseTitle}>
                  <div>
                    <span style={{ color: "var(--color-main)" }}>
                      {userNameState}
                    </span>
                    님이 좋아하실만한{" "}
                    <span style={{ color: "var(--color-main)" }}>Pick!</span>
                  </div>
                </div>
              </div>
              <RecommendList
                places={recommendedPlaces}
                selectedPlaceId={selectedPlaceId}
                onPlaceClick={handlePlaceClick}
              />
              <hr color="#e5e5e5" style={{ margin: "20px" }} />
            </>
          )}

          {regularPlaces && (
            <PlaceList
              places={regularPlaces}
              selectedPlaceId={selectedPlaceId}
              onPlaceClick={handlePlaceClick}
            />
          )}
        </div>
      </div>
      <div className={style.detailRight}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        <div className={style.searchBoxWrapper}>
          <SearchBox onSearch={onSearch} />
        </div>
        {selectedPlaceId && selectedPlaceId.length > 0 && (
          <PlaceModal placeId={selectedPlaceId ? selectedPlaceId : ""} />
        )}
      </div>
    </div>
  );
};
export default Search;
