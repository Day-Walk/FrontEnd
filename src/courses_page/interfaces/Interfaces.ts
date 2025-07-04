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
  createAt: string;
}

export interface Place {
  placeId: string;
  placeName: string;
  imgUrl: string;
  address: string;
}

export interface Top4Place {
  address: string;
  category: string;
  clickNum: number;
  imgUrl: string;
  name: string;
  placeId: string;
  subCategory: string;
}
