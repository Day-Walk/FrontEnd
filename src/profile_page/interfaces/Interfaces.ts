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
  visible: boolean;
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
  reviewId: string;
  placeId: string;
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
  imgUrl: string | null;
  stars: number;
}

export interface FavoritePlacePage {
  page: FavoritePlace[];
}

export interface FavoritePlaceListResponse {
  success: boolean;
  message: string;
  placeList: FavoritePlacePage[];
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
  placeList: [
    {
      page: [
        {
          placeId: "dde66f78-57ad-4026-86b8-8c76ac2b1d2a",
          name: "북파크라운지",
          address: "서울특별시 용산구 이태원로 294 (한남동)",
          imgUrl:
            "http://tong.visitkorea.or.kr/cms/resource/36/3339336_image2_1.jpg",
          stars: 3.5,
        },
        {
          placeId: "1cf3969b-59a1-488c-8483-f2bdcf4640e3",
          name: "고카페 용산아이파크몰점",
          address: "서울특별시 용산구 한강대로23길 55 (한강로3가)",
          imgUrl: null,
          stars: 3.8,
        },
        {
          placeId: "138616f9-00fc-405a-a6d6-4e28af67332e",
          name: "구찌가옥",
          address: "서울특별시 용산구 이태원로 223 (한남동)",
          imgUrl:
            "http://tong.visitkorea.or.kr/cms/resource/12/3080712_image2_1.JPG",
          stars: 2.5,
        },
        {
          placeId: "e00d35ea-eee2-45b4-898f-de00890e91d2",
          name: "난지한강공원",
          address: "서울특별시 마포구 한강난지로 162",
          imgUrl:
            "http://tong.visitkorea.or.kr/cms/resource/07/1805807_image2_1.jpg",
          stars: 0,
        },
      ],
    },
  ],
  message: "유저별 찜한 장소 조회 성공!",
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
