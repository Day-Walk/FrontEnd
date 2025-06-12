export function CustomMarker(
  map: any,
  place: any,
  index: number,
  selectedPlaceId: string,
  onClick: () => void,
  markerClass: string,
  selectedMarkerClass: string,
): kakao.maps.CustomOverlay {
  const position = new window.kakao.maps.LatLng(
    place.location.lat,
    place.location.lng,
  );

  const div = document.createElement("div");
  div.className = `${markerClass} ${place.placeId === selectedPlaceId ? selectedMarkerClass : ""}`;
  div.innerText = `${index + 1}`;
  div.onclick = onClick;

  const overlay = new window.kakao.maps.CustomOverlay({
    position,
    content: div,
    yAnchor: 1,
  });

  overlay.setMap(map);
  return overlay;
}
