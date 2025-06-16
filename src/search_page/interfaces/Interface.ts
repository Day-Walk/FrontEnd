export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface SearchPlace {
  placeId: string;
  placeName: string;
  address: string;
  category: string;
  subCategory: string;
  stars: number;
  imgUrl: string;
  location: PlaceLocation;
}

export interface GroupedPlaceList {
  [category: number]: SearchPlace[];
}

export interface SearchPlaceResponse {
  success: boolean;
  message: string;
  placeList: GroupedPlaceList;
}
