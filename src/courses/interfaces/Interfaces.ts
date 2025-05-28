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
