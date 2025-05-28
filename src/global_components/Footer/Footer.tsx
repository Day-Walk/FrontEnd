import React from "react";
import styles from "./Footer.module.css";
const Footer = () => {
  return (
    <div className={styles.footer_wrapper}>
      <div className={styles.footer_title}>하루걸음</div>
      <div className={styles.line} />
      <div>
        Hankyung & TOSS <span className={styles.boldText}>Final Project</span>
      </div>
      <LastLine />
    </div>
  );
};

const LastLine = () => {
  return (
    <div className={styles.lastLine_wrapper}>
      <div className={styles.softText}>
        @ Seoul Outing Course Recommendation Service
      </div>
      <div className={styles.names}>
        <p>김경민 정수현 이유진 이희연</p>
        <p>배범서 남은채 손기승 손소민</p>
      </div>
    </div>
  );
};
export default Footer;
