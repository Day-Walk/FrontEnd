import React from "react";
import { Loading1 } from "../loading/Loading";
import ReactDOM from "react-dom";

interface LoadingProps {
  loading?: boolean;
}

const Loading = ({ loading = true }: LoadingProps) => {
  const loadingStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      {loading &&
        ReactDOM.createPortal(
          <div style={loadingStyle}>
            <Loading1 />
          </div>,
          document.body,
        )}
    </>
  );
};

export default Loading;
