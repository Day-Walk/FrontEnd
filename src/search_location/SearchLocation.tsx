// src/components/SearchLocation.jsx
import React, { useState } from "react";
import styles from "./SearchLocation.module.css";

import { api } from "../utils/api";

const SearchLocation = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState<any[]>([]);

  const searchPlace = async () => {
    if (!value.trim()) {
      console.log("검색어를 입력해주세요.");
      setData([]);
      return;
    }
    try {
      const res = await api.get("/place/search", {
        params: { searchStr: value },
      });

      setData(res.data.placeList);

      console.log("검색 결과:", res.data);
    } catch (error) {
      console.error("장소 검색 실패:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    searchPlace();
  };

  const handleClickPlace = async (placeId: string) => {
    try {
      const res = await api.post("/click-log", {
        userId: localStorage.getItem("userId"),
        placeId: placeId,
      });
      console.log(res.data);
      alert("장소 클릭이 기록되었습니다.");
    } catch (error) {
      console.error("장소 클릭 처리 실패:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="장소입력"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={styles.searchBar}
        />

        <button type="submit">검색</button>
        <button
          style={{ marginLeft: "20px" }}
          onClick={() => setValue("")}
          type="button"
        >
          삭제
        </button>
      </form>

      {data.length > 0 ? (
        data.map((item: any) => (
          <div
            key={item.placeId}
            onClick={() => {
              handleClickPlace(item.placeId);
            }}
            style={{
              padding: "20px",
            }}
          >
            {item.placeName}
          </div>
        ))
      ) : (
        <div>검색 결과가 없음</div>
      )}
    </div>
  );
};

export default SearchLocation;
