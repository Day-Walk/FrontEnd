import React, { useState } from "react";
import styles from "./Signup.module.css";

const Gender = {
  남: 0,
  여: 1,
} as const;

type GenderKey = keyof typeof Gender;
type GenderValue = (typeof Gender)[GenderKey];

const AgeGroup = {
  "10대": 10,
  "20대": 20,
  "30대": 30,
  "40대": 40,
  "50대": 50,
  "60대 이상": 60,
} as const;

type AgeGroupKey = keyof typeof AgeGroup;
type AgeGroupValue = (typeof AgeGroup)[AgeGroupKey];

interface UserInfoType {
  userName: string;
  age: AgeGroupValue | null;
  gender: GenderValue | null;
}

const Signup = () => {
  const [userInfo, setUserInfo] = useState<UserInfoType>({
    // todo : 받아오는 userName으로 넣을 예정
    userName: "이희연",
    age: null,
    gender: null,
  });

  return (
    <div className={styles.signup_wrapper}>
      <div className={styles.signup_title}>하루걸음에 오신 것을 환영해요:)</div>
      <label className={styles.element_label} htmlFor="name">
        사용하실 닉네임을 입력해주세요.
      </label>
      <input
        id="name"
        type="text"
        placeholder="ex - 하루걸음"
        value={userInfo.userName}
        onChange={(e) =>
          setUserInfo((prev) => ({
            ...prev,
            userName: e.target.value,
          }))
        }
        className={`${styles.element} ${styles.input}`}
      />
      <div className={styles.element_label}>성별</div>
      <div className={styles.buttons}>
        {Object.keys(Gender).map((key) => (
          <div
            key={key}
            className={`${styles.element} ${styles.button} ${userInfo.gender === Gender[key as GenderKey] ? styles.selected_btn : ""}`}
            onClick={() =>
              setUserInfo((prev) => ({
                ...prev,
                gender: Gender[key as GenderKey],
              }))
            }
          >
            {key}
          </div>
        ))}
      </div>
      <div className={styles.element_label}>연령대</div>
      <div className={styles.buttons}>
        {Object.keys(AgeGroup).map((key) => (
          <div
            key={key}
            className={`${styles.element} ${styles.button} ${userInfo.age === AgeGroup[key as AgeGroupKey] ? styles.selected_btn : ""}`}
            onClick={() =>
              setUserInfo((prev) => ({
                ...prev,
                age: AgeGroup[key as AgeGroupKey],
              }))
            }
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Signup;
