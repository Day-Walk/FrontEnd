import React, { useEffect, useState } from "react";
import styles from "./loading.module.css";
import ChatBot from "../assets/ChatBot2D.png";

interface LoadingProps {
  width?: string;
  style?: React.CSSProperties;
}

const LoadingWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={styles.bg_wrapper}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {children}
        <div className={styles.loading}>Loading . . .</div>
      </div>
    </div>
  );
};

// 머리만 회전
const Loading1: React.FC<LoadingProps> = ({ width = "200px", style = {} }) => {
  return (
    <LoadingWrapper>
      <img
        src={ChatBot}
        style={{
          width: `${width}`,
          ...style,
        }}
        className={styles.spin_component}
      />
    </LoadingWrapper>
  );
};

// 캐릭터 좌우반전
const Loading2: React.FC<LoadingProps> = ({ width = "300px", style = {} }) => {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFlip((prev) => !prev);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <LoadingWrapper>
      <img
        src="../src/assets/goodVersion.png"
        style={{
          width: `${width}`,
          transform: flip ? "scaleX(-1)" : "scaleX(1)",
          ...style,
        }}
      />
    </LoadingWrapper>
  );
};

export { Loading1, Loading2 };
