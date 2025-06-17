import React, { useEffect, useRef, useState } from "react";
import styles from "./Chatbot.module.css";
import ChatMessage from "./components/ChatMessage";
import UserMessage from "./components/UserMessage";
import ChatbotMap from "./components/ChatbotMap";
import { MainButton } from "./components/Buttons";
import { Modal } from "@mui/material";
import AddCourseModal from "./components/AddCourseModal";
import ChatBot from "../assets/ChatBot.png";
import AlertModal from "../global_components/AlertModal/AlertModal";

const Chatbot = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const placeholderText =
    "ex - 가족이 서울에 놀러오는데, \n날씨 좋을 때 투어 코스 알려줘.";

  const [chatLog, setChatLog] = useState<any[]>([]);

  const mapInfo =
    chatLog.length > 1 && chatLog[1].message?.placeList
      ? chatLog[1].message.placeList.map((place: any) => place.location)
      : [];
  const [value, setValue] = useState<string>("");
  const handleClickSendBtn = () => {
    if (value.trim() === "") {
      setShowModal(true);
      setMessage("메시지를 입력해주세요.");
      return;
    }
    // todo : api 호출
    console.log(value);
    setChatLog((prev) => [...prev, { isUser: true, message: value }]);
    setValue("");
  };
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <AddCourseModal
          courseInfo={chatLog[1]?.message?.placeList}
          handleClose={handleClose}
        />
      </Modal>
      <div className={styles.chatbot_container}>
        <div className={styles.chat_wrapper}>
          {chatLog.length === 0 ? (
            <div className={styles.empty_chat}>
              <img src={ChatBot} style={{ width: "120px" }} />
              <div className={styles.ask_to}>챗봇에게 물어보세요!</div>
            </div>
          ) : (
            <div className={styles.content}>
              {chatLog.map((chat, index) =>
                chat.isUser ? (
                  <UserMessage message={chat.message} key={index} />
                ) : (
                  <ChatMessage
                    message={chat.message}
                    key={index}
                    selectedMarker={selectedMarker}
                    setSelectedMarker={setSelectedMarker}
                    handleModalOpen={handleOpen}
                    inputRef={inputRef}
                  />
                ),
              )}
            </div>
          )}

          <div
            className={`${styles.input_wrapper} ${isFocused ? styles.focused : ""}`}
          >
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={styles.chat_input}
              placeholder={placeholderText}
              ref={inputRef}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <MainButton paddingY={10}>전송</MainButton>
          </div>
        </div>
        <ChatbotMap
          mapInfo={mapInfo}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
        />
      </div>
      {showModal && (
        <AlertModal message={message} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Chatbot;
