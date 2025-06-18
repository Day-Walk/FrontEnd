import React from "react";
import styles from "../Chatbot.module.css";

interface UserMessageProps {
  message: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className={`${styles.message} ${styles.user_message}`}>{message}</div>
  );
};

export default UserMessage;
