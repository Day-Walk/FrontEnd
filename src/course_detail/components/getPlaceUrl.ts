import axios from "axios";

export async function getPlaceUrl(keyword: string): Promise<string | null> {
  try {
    if (keyword) {
      return `https://map.naver.com/p/search/${keyword}`;
    } else {
      console.warn("검색 결과가 없습니다.");
      return null;
    }
  } catch (error) {
    console.error("장소 검색 실패:", error);
    return null;
  }
}
