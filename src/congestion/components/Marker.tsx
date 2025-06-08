import React from "react";
import styles from "../Congestion.module.css";
import { Users } from "lucide-react";

interface MarkerProps {
  color: string;
  size: number;
  shadow?: boolean;
  onClick?: () => void;
  isGradient?: boolean;
  style?: string;
}

const Marker: React.FC<MarkerProps> = ({
  color,
  size,
  shadow = false,
  onClick,
  isGradient,
  style = {},
}) => {
  const basicStyle: React.CSSProperties = {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    filter: shadow ? `drop-shadow(0px 4px 4px ${color + "40"})` : undefined,
    outline: isGradient ? `6px solid ${color + "80"}` : undefined,
  };

  return (
    <div
      className={`${styles.marker} ${style}`}
      style={basicStyle}
      onClick={onClick}
    >
      <Users color="#fff" size={Math.floor(size * 0.6)} />
    </div>
  );
};

export default Marker;
