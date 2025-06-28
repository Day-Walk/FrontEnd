import { useEffect, useState } from "react";
import style from "./Profile.module.css";
import MyCourse from "./components/MyCourse";
import MyReview from "./components/MyReview";
import LikeCourse from "./components/LikeCourse";
import LikePlace from "./components/LikePlace";
import { LogOutIcon, Settings } from "lucide-react";
import { userName } from "../recoil/userInfo";
import { useRecoilValue } from "recoil";
import EditNameModal from "./components/Modals/EditNameModal";
import Footer from "../global_components/Footer/Footer";
import { api } from "../utils/api";
import { useLocation } from "react-router-dom";
import ChatbotFace from "../assets/ChatBot.webp";

const Profile = () => {
  const [menuIndex, setMenuIndex] = useState<number>(0);
  const userNameState = useRecoilValue(userName);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (location.state && location.state.menuIndex) {
      setMenuIndex(location.state.menuIndex);
    }
  }, []);

  return (
    <div className={style.contentArea}>
      <div className={style.profileWrapper}>
        <div>
          <div className={style.nameWrapper}>
            <img src={ChatbotFace} alt="Chatbot Face" width={70} />
            <div style={{ lineHeight: "1.5" }}>
              <span className={style.profileName}>{userNameState}</span> 님!
              <br />
              좋은 하루 되세요💛
            </div>
          </div>
          <div>&nbsp;</div>
          <button
            onClick={() => setModalOpen(true)}
            className={style.settingBtn}
            style={{ width: "200px" }}
          >
            <Settings size={20} />
            <div>&nbsp;프로필 수정</div>
          </button>
          {modalOpen && <EditNameModal onClose={() => setModalOpen(false)} />}
          <div className={style.hrLine}></div>
          <div
            onClick={handleLogout}
            className={style.settingBtn}
            style={{ width: "200px", color: "#bbb" }}
          >
            <LogOutIcon size={20} />
            <div>&nbsp;로그아웃</div>
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
