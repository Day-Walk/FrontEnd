import React, { useState } from "react";
import styles from "../Signup.module.css";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userName } from "../../recoil/userInfo";
import { api } from "../../utils/api";

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

interface ButtonGroupProps<T> {
  label: string;
  options: Record<string, T>;
  selected: T | null;
  onSelect: (value: T) => void;
}

export const ButtonGroup = <T,>({
  label,
  options,
  selected,
  onSelect,
}: ButtonGroupProps<T>) => {
  return (
    <>
      <div className={styles.element_label}>{label}</div>
      <div className={styles.buttons}>
        {Object.entries(options).map(([key, value]) => (
          <button
            key={key}
            className={`${styles.element} ${styles.button} ${
              selected === value ? styles.selected_btn : ""
            }`}
            onClick={() => onSelect(value)}
          >
            {key}
          </button>
        ))}
      </div>
    </>
  );
};

const Signup = () => {
  const location = useLocation();
  const { id, name } = location.state;

  const [userInfo, setUserInfo] = useState<UserInfoType>({
    userName: name || "",
    age: null,
    gender: null,
  });

  const handleChange = (key: keyof UserInfoType, value: any) => {
    setUserInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isFinished =
    userInfo.userName && userInfo.age !== null && userInfo.gender !== null;

  const setUserName = useSetRecoilState(userName);
  const navigate = useNavigate();
  const handleClickNextBtn = async () => {
    if (!isFinished) {
      return;
    }

    try {
      const res = await api.post("/user", {
        id,
        name: userInfo.userName,
        gender: userInfo.gender,
        age: userInfo.age,
      });
      setUserName(userInfo.userName);
      localStorage.setItem("userName", userInfo.userName);
      navigate("/signup/user-like");
    } catch (error) {
      console.error("user 초기 정보 저장 오류 : ", error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.signup_wrapper}>
        <div className={styles.signup_title}>
          하루걸음에 오신 것을 환영해요:)
        </div>

        <label className={styles.element_label} htmlFor="name">
          사용하실 닉네임을 입력해주세요.
        </label>
        <input
          id="name"
          type="text"
          placeholder="사용하실 닉네임을 입력해주세요."
          value={userInfo.userName}
          onChange={(e) => handleChange("userName", e.target.value)}
          className={`${styles.element} ${styles.input}`}
        />

        <ButtonGroup
          label="성별"
          options={Gender}
          selected={userInfo.gender}
          onSelect={(value) => handleChange("gender", value)}
        />

        <ButtonGroup
          label="연령대"
          options={AgeGroup}
          selected={userInfo.age}
          onSelect={(value) => handleChange("age", value)}
        />
      </div>

      <div className={styles.btn_wrapper}>
        <button
          onClick={handleClickNextBtn}
          className={`${styles.next_btn} ${isFinished ? styles.active : ""}`}
        >
          다음
          <ArrowRight size={20} color="#FFF" />
        </button>
      </div>
    </div>
  );
};

export default Signup;
