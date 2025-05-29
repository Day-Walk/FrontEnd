import React, { useState } from "react";
import styles from "./SearchLocation.module.css";
import { data } from "./data";

const SearchLocation = () => {
  const [value, setValue] = useState("");
  const handleClickSearchBtn = () => {
    console.log(value);
  };

  const handleClickPlace = (placeId: string) => {
    // todo : click log api
    console.log(placeId);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="장소입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles.searchBar}
      />
      <button onClick={handleClickSearchBtn}>검색</button>

      {data.placeList.map((item: any) => (
        <div
          key={item.placeId}
          onClick={() => {
            handleClickPlace(item.placeId);
          }}
          style={{
            cursor: "pointer",
            padding: "20px",
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default SearchLocation;
