import React from "react";
import styles from "../Congestion.module.css";
import { Users } from "lucide-react";

interface MarkerProps {
  color: string;
  size: string;
  shadow?: boolean;
}

const Marker: React.FC<MarkerProps> = ({ color, size, shadow = false }) => {
  const style: React.CSSProperties = {
    backgroundColor: color,
    width: size,
    height: size,
    filter: shadow ? `drop-shadow(0px 4px 4px ${color + "40"})` : undefined,
  };

  return (
    <div className={styles.marker} style={style}>
      <Users color="#fff" size={24} />
    </div>
  );
};

export default Marker;
