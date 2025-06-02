import style from "../Search.module.css";
import { Search } from "lucide-react";

const SearchBox = () => {
  return (
    <div className={style.searchWrapper}>
      <input
        type="text"
        placeholder="지역과 장소를 검색해주세요 (ex - 홍대 맛집)"
        className={style.searchInput}
      />
      <Search className={style.searchIcon} />
    </div>
  );
};

export default SearchBox;
