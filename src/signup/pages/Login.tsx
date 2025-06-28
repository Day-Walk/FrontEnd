import styles from "../Login.module.css";
import Logo from "../../assets/DayWalkLogo.png";

const Login = () => {
  const handleClickLogin = () => {
    const REST_API_KEY = "e3325f522736f4e123141deaf49845ae";
    const hostname = window.location.hostname;
    const REDIRECT_URI =
      hostname.includes("localhost") || hostname.includes("127.0.0.1")
        ? "http://localhost:5173/auth/kakao-callback"
        : hostname.includes("final")
          ? "https://final-front-end-fawn.vercel.app/auth/kakao-callback"
          : "https://day-walk.vercel.app/auth/kakao-callback";

    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = url;
  };

  return (
    <div className={styles.background}>
      <img src={Logo} className={styles.logo} />
      <div className={styles.login_wrapper}>
        <div className={styles.title}>
          서울 여행자를 위한
          <br />
          AI 투어 가이드 서비스 🎒
        </div>
        <div className={styles.discription}>
          당신의 하루, 챗봇과 함께 그려보세요.
          <br />
          하루 걸음이 추천 장소부터, <br />
          맞춤형 코스까지 제안해드립니다!
        </div>
        <div onClick={handleClickLogin} className={styles.kakao_login}></div>
      </div>
    </div>
  );
};

export default Login;
