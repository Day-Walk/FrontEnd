import React from "react";
import styles from "../Login.module.css";
import Logo from "../../assets/DayWalkLogo.png";

const Login = () => {
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
        <div className={styles.kakao_login}></div>
      </div>
    </div>
  );
};

export default Login;
