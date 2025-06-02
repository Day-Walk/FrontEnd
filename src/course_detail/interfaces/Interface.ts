export interface CourseDetailPlace {
  placeId: string;
  placeName: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  stars: number;
  category: string;
  subCategory: string;
  imgUrl: string;
}

export interface CourseDetail {
  userName: string;
  title: string;
  placeList: CourseDetailPlace[];
  like: boolean;
}

export interface CourseDetailResponse {
  success: boolean;
  message: string;
  courseInfo: CourseDetail;
}

export interface PlaceDetailLocation {
  lat: number;
  lng: number;
}

export interface PlaceDetail {
  placeId: string;
  imgUrlList: string[];
  name: string;
  address: string;
  category: string;
  subCategory: string;
  location: PlaceDetailLocation;
  openTime: string;
  closeDate: string;
  detail: string;
  content: string;
  phoneNum: string[];
  like: boolean;
}

export interface PlaceDetailResponse {
  success: boolean;
  message: string;
  placeInfo: PlaceDetail;
}

export const dummyPlaceDetail: PlaceDetailResponse = {
  success: true,
  message: "장소 상세 조회 성공!",
  placeInfo: {
    placeId: "12345678-1234-5678-1234-123456789123",
    imgUrlList: [
      "https://picsum.photos/seed/place1/400",
      "https://picsum.photos/seed/place2/400",
    ],
    name: "공화춘",
    address: "서울시 중구 충정로 123",
    category: "음식점",
    subCategory: "중식",
    location: {
      lat: 37.564213,
      lng: 126.977829,
    },
    openTime: "11:00 ~ 23:00",
    closeDate: "매주 월요일 휴무",
    detail: "화장실 있음, 주차장 있음",
    content: "100년 전통의 중식당. 자장면의 본고장.",
    phoneNum: ["010-1234-1234", "02-1234-5678"],
    like: true,
  },
};

export const dummyCourseDetail: CourseDetailResponse = {
  success: true,
  message: "코스 상세 조회 성공!",
  courseInfo: {
    userName: "마리오",
    title: "날씨 좋은 날 데이트",
    like: true,
    placeList: [
      {
        placeId: "11111111-1111-1111-1111-111111111111",
        placeName: "성수동 브런치 카페",
        address: "서울시 성동구 성수이로 123",
        location: {
          lat: 37.544,
          lng: 127.056,
        },
        stars: 4.8,
        category: "음식점",
        subCategory: "카페",
        imgUrl: "https://picsum.photos/seed/place1/200",
      },
      {
        placeId: "22222222-2222-2222-2222-222222222222",
        placeName: "한강 공원 산책로",
        address: "서울시 영등포구 여의도동",
        location: {
          lat: 37.527,
          lng: 126.924,
        },
        stars: 4.7,
        category: "자연",
        subCategory: "산책",
        imgUrl: "https://picsum.photos/seed/place2/200",
      },
      {
        placeId: "33333333-3333-3333-3333-333333333333",
        placeName: "서울시립미술관",
        address: "서울시 중구 덕수궁길 61",
        location: {
          lat: 37.566,
          lng: 126.974,
        },
        stars: 4.6,
        category: "관광",
        subCategory: "미술관",
        imgUrl: "https://picsum.photos/seed/place3/200",
      },
      {
        placeId: "44444444-4444-4444-4444-444444444444",
        placeName: "남산타워 전망대",
        address: "서울시 용산구 남산공원길 105",
        location: {
          lat: 37.551,
          lng: 126.988,
        },
        stars: 4.9,
        category: "관광",
        subCategory: "전망대",
        imgUrl: "https://picsum.photos/seed/place4/200",
      },
    ],
  },
};
