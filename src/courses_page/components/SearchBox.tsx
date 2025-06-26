import style from "../Courses.module.css";
import { Search } from "lucide-react";
import { useState } from "react";
import { api } from "../../utils/api";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";

interface SearchBoxProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
}

const SearchBox = ({ query, setQuery, onSearch }: SearchBoxProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
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
