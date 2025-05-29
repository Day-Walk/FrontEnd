export interface CourseListResponse {
  courseList: CoursePage[];
}

export interface CoursePage {
  page: Course[];
}

export interface Course {
  courseId: string;
  title: string;
  userName: string;
  courseLike: number;
  placeList: Place[];
  like: boolean;
}

export interface Place {
  placeId: string;
  placeName: string;
  imgUrl: string;
  address: string;
}

export interface Review {
  placeName: string;
  categoryName: string;
  subCategoryName: string;
  content: string;
  address: string;
  stars: number;
  imgUrl: string | null;
  tagList: string[];
  createAt: string;
}

export interface ReviewPage {
  page: Review[];
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  reviewList: ReviewPage[];
}

export interface FavoritePlace {
  placeId: string;
  name: string;
  address: string;
  imgUrl: string;
  star: number;
}

export interface FavoritePlaceListResponse {
  success: boolean;
  message: string;
  placeList: FavoritePlace[];
}

export interface UserInfo {
  userId: string;
  name: string;
}

export interface UserInfoResponse {
  success: boolean;
  message: string;
  userInfo: UserInfo;
}

export const dummyUserInfo: UserInfoResponse = {
  success: true,
  message: "유저 조회 성공!",
  userInfo: {
    userId: "12345678-1234-5678-1234-123456789123",
    name: "홍길동",
  },
};

export const dummyFavoritePlaces: FavoritePlaceListResponse = {
  success: true,
  message: "유저별 찜한 장소 조회 성공!",
  placeList: [
    {
      placeId: "1",
      name: "서울숲 카페",
      address: "서울특별시 성동구 서울숲길 50",
      imgUrl: "https://picsum.photos/seed/place1/200",
      star: 4.5,
    },
    {
      placeId: "2",
      name: "한강공원",
      address: "서울특별시 영등포구 여의도동",
      imgUrl: "https://picsum.photos/seed/place2/200",
      star: 4.0,
    },
    {
      placeId: "3",
      name: "DDP",
      address: "서울특별시 중구 을지로 281",
      imgUrl: "https://picsum.photos/seed/place3/200",
      star: 3.5,
    },
    {
      placeId: "4",
      name: "카페 노티드",
      address: "서울특별시 강남구 도산대로 17길 40",
      imgUrl: "https://picsum.photos/seed/place4/200",
      star: 4.8,
    },
    {
      placeId: "5",
      name: "광장시장",
      address: "서울특별시 종로구 창경궁로 88",
      imgUrl: "https://picsum.photos/seed/place5/200",
      star: 4.2,
    },
    {
      placeId: "6",
      name: "경복궁",
      address: "서울특별시 종로구 사직로 161",
      imgUrl: "https://picsum.photos/seed/place6/200",
      star: 5.0,
    },
    {
      placeId: "7",
      name: "남산타워",
      address: "서울특별시 용산구 남산공원길 105",
      imgUrl: "https://picsum.photos/seed/place7/200",
      star: 4.6,
    },
    {
      placeId: "8",
      name: "망원시장",
      address: "서울특별시 마포구 망원로 6길 14",
      imgUrl: "https://picsum.photos/seed/place8/200",
      star: 4.1,
    },
    {
      placeId: "9",
      name: "북촌한옥마을",
      address: "서울특별시 종로구 계동길 37",
      imgUrl: "https://picsum.photos/seed/place9/200",
      star: 4.7,
    },
    {
      placeId: "10",
      name: "성수동 수제화거리",
      address: "서울특별시 성동구 아차산로 11길",
      imgUrl: "https://picsum.photos/seed/place10/200",
      star: 3.9,
    },
  ],
};

export const dummyReviewList: ReviewListResponse = {
  success: true,
  message: "유저별 리뷰 조회 성공!",
  reviewList: [
    {
      page: [
        {
          placeName: "서울숲 카페",
          categoryName: "카페",
          subCategoryName: "디저트",
          content: "정말 조용하고 깔끔한 공간이에요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.5,
          imgUrl: "https://picsum.photos/seed/review1/200",
          tagList: ["조용해요", "깨끗해요", "친절해요"],
          createAt: "2025-05-23",
        },
        {
          placeName: "한강공원",
          categoryName: "공원",
          subCategoryName: "자연",
          content: "산책하기 딱 좋아요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.0,
          imgUrl: "https://picsum.photos/seed/review2/200",
          tagList: ["산책하기좋아요", "넓어요"],
          createAt: "2025-05-22",
        },
        {
          placeName: "롯데월드타워",
          categoryName: "전망대",
          subCategoryName: "관광지",
          content: "야경이 너무 예뻐요!",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 5.0,
          imgUrl: "https://picsum.photos/seed/review3/200",
          tagList: ["야경맛집", "인생샷"],
          createAt: "2025-05-21",
        },
        {
          placeName: "망원시장",
          categoryName: "시장",
          subCategoryName: "전통시장",
          content: "먹거리가 다양해서 좋아요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.2,
          imgUrl: "https://picsum.photos/seed/review4/200",
          tagList: ["푸짐해요", "저렴해요"],
          createAt: "2025-05-20",
        },
        {
          placeName: "DDP",
          categoryName: "전시",
          subCategoryName: "문화",
          content: "전시도 보고 산책도 하기 좋아요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.8,
          imgUrl: "https://picsum.photos/seed/review5/200",
          tagList: ["디자인좋아요", "전시좋아요"],
          createAt: "2025-05-19",
        },
      ],
    },
    {
      page: [
        {
          placeName: "카페 노티드",
          categoryName: "카페",
          subCategoryName: "디저트",
          content: "도넛이 진짜 맛있어요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 5.0,
          imgUrl: "https://picsum.photos/seed/review6/200",
          tagList: ["달콤해요", "인기많아요"],
          createAt: "2025-05-18",
        },
        {
          placeName: "남산공원",
          categoryName: "공원",
          subCategoryName: "자연",
          content: "조용하고 공기 좋아요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.3,
          imgUrl: "https://picsum.photos/seed/review7/200",
          tagList: ["한적해요", "공기좋아요"],
          createAt: "2025-05-17",
        },
        {
          placeName: "세종문화회관",
          categoryName: "공연",
          subCategoryName: "연극",
          content: "공연이 아주 인상적이었어요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.7,
          imgUrl: null,
          tagList: ["공연좋아요", "감동적이에요"],
          createAt: "2025-05-16",
        },
        {
          placeName: "익선동 한옥거리",
          categoryName: "골목",
          subCategoryName: "한옥",
          content: "사진 찍기 좋아요.",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.6,
          imgUrl: "https://picsum.photos/seed/review9/200",
          tagList: ["전통느낌", "한옥", "인생샷"],
          createAt: "2025-05-15",
        },
        {
          placeName: "광장시장",
          categoryName: "시장",
          subCategoryName: "전통시장",
          content: "빈대떡이 최고예요!",
          address: "서울특별시 성동구 서울숲길 273",
          stars: 4.9,
          imgUrl: "https://picsum.photos/seed/review10/200",
          tagList: ["맛있어요", "전통시장"],
          createAt: "2025-05-14",
        },
      ],
    },
  ],
};

export const dummyCourseList: CourseListResponse = {
  courseList: [
    {
      page: [
        {
          courseId: "1",
          title: "서울 데이트",
          userName: "홍길동",
          courseLike: 12,
          like: true,
          placeList: [
            {
              placeId: "2",
              placeName: "남산타워",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 남산공원길 105",
            },
            {
              placeId: "33333333-3333-3333-3333-333333333333",
              placeName: "이태원 맛집",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 이태원로 123",
            },
            {
              placeId: "2222-2222-222222222222",
              placeName: "남산타워",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 남산공원길 105",
            },
            {
              placeId: "22222",
              placeName: "남산타워",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 남산공원길 105",
            },
          ],
        },
        {
          courseId: "44444444-4444-444",
          title: "강릉 하루 ",
          userName: "이순신",
          courseLike: 8,
          like: false,
          placeList: [
            {
              placeId: "555555555555",
              placeName: "경포대",
              imgUrl: "https://picsum.photos/200",
              address: "강원도 강릉시 강문동 경포해변길",
            },
            {
              placeId: "66666666-666666666666",
              placeName: "안목 커피거리",
              imgUrl: "https://picsum.photos/200",
              address: "강원도 강릉시 창해로14번길",
            },
            {
              placeId: "555",
              placeName: "경포대 해변",
              imgUrl: "https://picsum.photos/200",
              address: "강원도 강릉시 강문동 경포해변길",
            },
          ],
        },
      ],
    },
    {
      page: [
        {
          courseId: "11111111-1111-1111--111111111111",
          title: "서울 데이트",
          userName: "홍길동",
          courseLike: 12,
          like: true,
          placeList: [
            {
              placeId: "22222222---2222-",
              placeName: "남산타워",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 남산공원길 105",
            },
            {
              placeId: "33333333-3333-3333-3333-",
              placeName: "이태원 맛집",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 이태원로 123",
            },
            {
              placeId: "--22-",
              placeName: "남산타워",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 남산공원길 105",
            },
            {
              placeId: "33333333-33-3333-333333333333",
              placeName: "이태원 맛집",
              imgUrl: "https://picsum.photos/200",
              address: "서울특별시 용산구 이태원로 123",
            },
          ],
        },
        {
          courseId: "44444444-4444---",
          title: "하루 여행",
          userName: "이순신",
          courseLike: 8,
          like: false,
          placeList: [
            {
              placeId: "-5555-5555--555555555555",
              placeName: " 해변",
              imgUrl: "https://picsum.photos/200",
              address: "강원도 강릉시 강문동 경포해변길",
            },
            {
              placeId: "--6666--666666666666",
              placeName: " 커피거리",
              imgUrl: "https://picsum.photos/200",
              address: "강원도 강릉시 창해로14번길",
            },
          ],
        },
      ],
    },
  ],
};
