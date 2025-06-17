import { useState } from "react";
import style from "../Search.module.css";
import { Search } from "lucide-react";

interface Props {
  onSearch: (keyword: string) => void;
}

const SearchBox = ({ onSearch }: Props) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(keyword.trim());
  };

  return (
    <div className={style.searchWrapper}>
      <input
        type="text"
        placeholder="지역과 장소를 검색해주세요 (ex - 홍대)"
        className={style.searchInput}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Search className={style.searchIcon} />
    </div>
  );
};

export default SearchBox;
