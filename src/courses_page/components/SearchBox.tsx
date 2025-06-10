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
  const token = localStorage.getItem("accessToken");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      fetchSearchResults();
    }
  };

  const fetchSearchResults = async () => {
    try {
      const response = await api.get(
        `/course/search?searchStr=${encodeURIComponent(query)}&sort=like&userId=${userIdState}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
