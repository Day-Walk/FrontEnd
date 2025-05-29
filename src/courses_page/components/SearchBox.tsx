import style from "../Courses.module.css";
import { Search } from "lucide-react";

const SearchBox = () => {
  return (
    <div className={style.searchWrapper}>
      <input
        type="text"
        placeholder="코스 검색하기"
        className={style.searchInput}
      />
      <Search className={style.searchIcon} />
    </div>
  );
};

export default SearchBox;
