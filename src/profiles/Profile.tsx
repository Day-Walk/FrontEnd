import { useState } from "react";
import style from "./Profile.module.css";

const Profile = () => {
  const [menuIndex, setMenuIndex] = useState<number>(0);

  return (
    <div className={style.profileWrapper}>
      <div className={style.nameWrapper}>
        <div>name</div>
        <button>프로필 수정</button>
      </div>
      <div className={style.rightWrapper}>
        <ul className={style.menuList}>
          <li
            onClick={() => setMenuIndex(0)}
            className={menuIndex == 0 ? style.click : undefined}
          >
            나의 코스
          </li>
          <li
            onClick={() => setMenuIndex(1)}
            className={menuIndex == 1 ? style.click : undefined}
          >
            내가 쓴 리뷰
          </li>
          <li
            onClick={() => setMenuIndex(2)}
            className={menuIndex == 2 ? style.click : undefined}
          >
            찜한 코스
          </li>
          <li
            onClick={() => setMenuIndex(3)}
            className={menuIndex == 3 ? style.click : undefined}
          >
            찜한 장소
          </li>
        </ul>
        <div>
          {menuIndex === 0 && (
            <div>
              <div>나의 코스</div>
            </div>
          )}
          {menuIndex === 1 && (
            <div>
              <div>내가 쓴 리뷰</div>
            </div>
          )}
          {menuIndex === 2 && (
            <div>
              <div>찜한 코스</div>
            </div>
          )}
          {menuIndex === 3 && (
            <div>
              <div>찜한 장소</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
