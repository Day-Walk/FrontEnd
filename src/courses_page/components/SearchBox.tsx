import style from "../Courses.module.css";
import { Search } from "lucide-react";
import { useState } from "react";
import { api } from "../../utils/api";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";

interface SearchBoxProps {
  onSearchResults: (data: any) => void;
}

const SearchBox = ({ onSearchResults }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const userIdState = useRecoilValue(userId);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSearchResults();
    }
  };

  const fetchSearchResults = async () => {
    try {
      const url =
        query.length <= 0
          ? `/course/all?sort=like&userId=${userIdState}`
          : `/course/search?searchStr=${encodeURIComponent(query)}&sort=like&userId=${userIdState}`;

      const response = await api.get(url);

      const data = await response.data;
      onSearchResults(data);
      console.log("검색 결과:", data);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  return (
    <div className={style.searchWrapper}>
      <input
        type="text"
        placeholder="코스 검색하기"
        className={style.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Search className={style.searchIcon} />
    </div>
  );
};

export default SearchBox;
