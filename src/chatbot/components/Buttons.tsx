import React from "react";
import styles from "./AddCourseModal.module.css";

type ButtonProps = {
  fontSize?: number;
  fontColor?: string;
  fontWeight?: number;
  paddingX?: number;
  paddingY?: number;
  bgColor?: string;
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export const MainButton: React.FC<ButtonProps> = ({
  fontSize = 16,
  fontColor = "#FFF",
  fontWeight = 700,
  paddingX = 16,
  paddingY = 8,
  bgColor = "#00B493",
  children,
  onClick,
  style = {},
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.mainBtn}
      style={{
        fontSize: `${fontSize}px`,
        color: fontColor,
        fontWeight: fontWeight,
        backgroundColor: bgColor,
        padding: `${paddingY}px ${paddingX}px`,
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export const BorderButton: React.FC<ButtonProps> = ({
  fontSize = 16,
  fontColor = "#00B493",
  fontWeight = 700,
  paddingX = 16,
  paddingY = 8,
  bgColor = "#FFF",
  children,
  onClick,
  style,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: `${fontSize}px`,
        color: fontColor,
        fontWeight: fontWeight,
        backgroundColor: bgColor,
        padding: `${paddingY}px ${paddingX}px`,
        border: `2px solid ${fontColor}`,
        borderRadius: "10px",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
};
