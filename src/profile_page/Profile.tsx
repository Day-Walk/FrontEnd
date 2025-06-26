import { useState } from "react";
import style from "./Profile.module.css";
import MyCourse from "./components/MyCourse";
import MyReview from "./components/MyReview";
import LikeCourse from "./components/LikeCourse";
import LikePlace from "./components/LikePlace";
import { Settings } from "lucide-react";
import { userName } from "../recoil/userInfo";
import { useRecoilValue } from "recoil";
import EditNameModal from "./components/Modals/EditNameModal";
import Footer from "../global_components/Footer/Footer";

const Profile = () => {
  const [menuIndex, setMenuIndex] = useState<number>(0);
  const userNameState = useRecoilValue(userName);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    // 로그아웃 api 추가 필요
    window.location.href = "/login";
  };

  return (
    <div className={style.contentArea}>
      <div className={style.profileWrapper}>
        <div>
          <div className={style.nameWrapper}>
            <div className={style.profileName}>{userNameState}</div>
            <button
              onClick={() => setModalOpen(true)}
              className={style.settingBtn}
            >
              <Settings size={20} />
              <div>&nbsp;프로필 수정</div>
            </button>
            {modalOpen && <EditNameModal onClose={() => setModalOpen(false)} />}
          </div>
          <div>&nbsp;</div>
          <div
            onClick={handleLogout}
            className={style.settingBtn}
            style={{ width: "200px" }}
          >
            로그아웃
          </div>
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
      <Footer />
    </div>
  );
};

export default Profile;
