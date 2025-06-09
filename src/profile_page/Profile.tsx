import { useState } from "react";
import style from "./Profile.module.css";
import MyCourse from "./components/MyCourse";
import MyReview from "./components/MyReview";
import LikeCourse from "./components/LikeCourse";
import LikePlace from "./components/LikePlace";
import { Settings } from "lucide-react";
import * as Interfaces from "./interfaces/Interfaces";

const Profile = () => {
  const [menuIndex, setMenuIndex] = useState<number>(0);
  const userName = localStorage.getItem("userName") || "";

  return (
    <div className={style.profileWrapper}>
      <div className={style.nameWrapper}>
        <div className={style.profileName}>{userName}</div>
        <button className={style.settingBtn}>
          <Settings size={20} />
          <div>&nbsp;프로필 수정</div>
        </button>
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
              <MyCourse />
            </div>
          )}
          {menuIndex === 1 && (
            <div>
              <MyReview />
            </div>
          )}
          {menuIndex === 2 && (
            <div>
              <LikeCourse />
            </div>
          )}
          {menuIndex === 3 && (
            <div>
              <LikePlace />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
