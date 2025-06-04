export interface PlaceTag {
  tagId: string;
  fullName: string;
}

export interface PlaceTagInfo {
  placeId: string;
  placeName: string;
  categoryName: string;
  subCategoryName: string;
  tagList: PlaceTag[];
}

export interface PlaceTagResponse {
  success: boolean;
  message: string;
  placeInfo: PlaceTagInfo;
}

export const dummyPlaceTagResponse: PlaceTagResponse = {
  success: true,
  message: "장소 태그 조회 성공!",
  placeInfo: {
    placeId: "11111111-1111-1111-1111-111111111111",
    placeName: "배불러 음식점",
    categoryName: "음식점",
    subCategoryName: "한식",
    tagList: [
      { tagId: "1", fullName: "깨끗하다" },
      { tagId: "2", fullName: "맛있다" },
      { tagId: "3", fullName: "조용하다" },
      { tagId: "4", fullName: "친절하다" },
      { tagId: "5", fullName: "양이 많다" },
      { tagId: "6", fullName: "가격이 적당하다" },
      { tagId: "7", fullName: "뷰가 좋다" },
      { tagId: "8", fullName: "인테리어가 예쁘다" },
      { tagId: "9", fullName: "주차가 편하다" },
      { tagId: "10", fullName: "웨이팅이 없다" },
      { tagId: "11", fullName: "혼밥하기 좋다" },
      { tagId: "12", fullName: "데이트하기 좋다" },
    ],
  },
};
