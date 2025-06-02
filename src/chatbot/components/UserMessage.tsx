import React from "react";
import styles from "../Chatbot.module.css";

interface UserMessageProps {
  message: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div
      className={`${styles.message} ${styles.user_message}`}
      // style={index === 0 ? { marginTop: "20px" } : {}}
    >
      {message}
    </div>
  );
};

export default UserMessage;
