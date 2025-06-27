export function CustomMarker(
  map: any,
  place: any,
  index: number,
  selectedPlaceId: string,
  markerClass: string,
  selectedMarkerClass: string,
) {
  const position = new window.kakao.maps.LatLng(
    place.location.lat,
    place.location.lng,
  );

  const div = document.createElement("div");
  div.className = `${markerClass} ${
    place.placeId === selectedPlaceId ? selectedMarkerClass : ""
  }`;
  div.innerText = `${index + 1}`;

  const overlay = new window.kakao.maps.CustomOverlay({
    position,
    content: div,
    yAnchor: 1,
    zIndex: place.placeId === selectedPlaceId ? 4 : 2,
  });
  console.log("********", div); // 확인용

  overlay.setMap(map);

  return overlay;
}
