import React, { useEffect } from "react";
import styles from "../Login.module.css";
import Logo from "../../assets/DayWalkLogo.png";

const Login = () => {
  const handleClickLogin = () => {
    const REST_API_KEY = "e3325f522736f4e123141deaf49845ae";
    const REDIRECT_URI = isProduction
      ? "https://final-front-end-fawn.vercel.app/auth/kakao-callback"
      : "http://localhost:5173/auth/kakao-callback";

    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = url;
  };

  const [isProduction, setIsProduction] = React.useState<boolean>(false);
  useEffect(() => {
    if (import.meta.env.MODE === "production") {
      setIsProduction(true);
    }
  }, []);
  import.meta.env.MODE;
  return (
    <div className={styles.background}>
      <img src={Logo} className={styles.logo} />
      <div className={styles.login_wrapper}>
        <div className={styles.title}>
          서울 여행자를 위한
          <br />
          AI 투어 가이드 서비스
        </div>
        <div className={styles.discription}>추가설명...</div>
        <div onClick={handleClickLogin} className={styles.kakao_login}></div>
      </div>
    </div>
  );
};

export default Login;
