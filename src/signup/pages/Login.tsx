import styles from "../Login.module.css";
import Logo from "../../assets/DayWalkLogo.webp";

const Login = () => {
  const handleClickLogin = () => {
    const REST_API_KEY = "e3325f522736f4e123141deaf49845ae";
    const REDIRECT_URI = "https://day-walk.vercel.app/auth/kakao-callback";

    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = url;
  };

  return (
    <div className={styles.background}>
      <img src={Logo} className={styles.logo} />
      <div>
        <div
          style={{
            color: "#fff",
            fontSize: "12px",
            display: "flex",
            justifyContent: "right",
            marginRight: "80px",
            marginBottom: "12px",
          }}
        >
          <p>
            ※ '하루걸음'은 한국관광공사에서 제공되는 TourAPI 기반의
            서비스입니다.
          </p>
        </div>
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
    </div>
  );
};

export default Login;
