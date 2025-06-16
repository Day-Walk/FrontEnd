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
