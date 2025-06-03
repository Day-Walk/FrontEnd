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
  [category: number]: SearchPlace[]; // 예: '추천픽', '장소' 등
}

export interface SearchPlaceResponse {
  success: boolean;
  message: string;
  placeList: GroupedPlaceList;
}

export const dummySearchPlaceResponse: SearchPlaceResponse = {
  success: true,
  message: "장소 검색 성공!",
  placeList: {
    추천픽: [
      {
        placeId: "11111111-1111-1111-1111-111111111111",
        placeName: "홍대 맛집",
        address: "서울시 마포구",
        category: "음식점",
        subCategory: "양식",
        stars: 4.0,
        imgUrl: "https://picsum.photos/seed/place1/100",
        location: {
          lat: 37.5563,
          lng: 126.922,
        },
      },
      {
        placeId: "22222222-2222-2222-2222-222222222222",
        placeName: "강남 카페",
        address: "서울시 강남구",
        category: "카페",
        subCategory: "디저트",
        stars: 4.5,
        imgUrl: "https://picsum.photos/seed/place1/100",
        location: {
          lat: 37.4979,
          lng: 127.0276,
        },
      },
    ],
    장소: [
      {
        placeId: "33333333-3333-3333-3333-333333333333",
        placeName: "종로 서점",
        address: "서울시 종로구",
        category: "서점",
        subCategory: "독립서점",
        stars: 4.2,
        imgUrl: "https://picsum.photos/seed/place1/100",
        location: {
          lat: 37.572,
          lng: 126.9794,
        },
      },
      {
        placeId: "44444444-4444-4444-4444-444444444444",
        placeName: "이태원 바",
        address: "서울시 용산구",
        category: "주점",
        subCategory: "칵테일",
        stars: 3.8,
        imgUrl: "https://picsum.photos/seed/place1/100",
        location: {
          lat: 37.5349,
          lng: 126.9945,
        },
      },
      {
        placeId: "55555555-5555-5555-5555-555555555555",
        placeName: "잠실 놀이공원",
        address: "서울시 송파구",
        category: "관광",
        subCategory: "테마파크",
        stars: 4.7,
        imgUrl: "https://picsum.photos/seed/place1/100",
        location: {
          lat: 37.511,
          lng: 127.098,
        },
      },
      {
        placeId: "66666666-6666-6666-6666-666666666666",
        placeName: "북촌 한옥마을",
        address: "서울시 종로구",
        category: "관광",
        subCategory: "전통",
        stars: 4.6,
        imgUrl: "https://picsum.photos/seed/place1/100",
        location: {
          lat: 37.5828,
          lng: 126.9835,
        },
      },
    ],
  },
};
