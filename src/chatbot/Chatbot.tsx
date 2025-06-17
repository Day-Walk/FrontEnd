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
import { useRecoilValue } from "recoil";
import { userId } from "../recoil/userInfo";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { api } from "../utils/api";

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
  const userIdState = useRecoilValue(userId);
  const token = localStorage.getItem("accessToken");

  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const [event, setEvent] = useState<EventSourcePolyfill | null>(null);
  const [loading, setLoading] = useState(false);

  const hanldePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      setTimeout(() => {
        handleClickSendBtn();
        inputRef.current?.blur();
      }, 0);
    }
  };

  const handleClickSendBtn = async () => {
    if (value.trim() === "") {
      setShowModal(true);
      setMessage("메시지를 입력해주세요.");
      return;
    }

    setLoading(true);
    if (event) {
      event.close();
      setEvent(null);
    }

    try {
      await connectSSE();
      await sendChat();
    } catch (error) {
      console.error("SSE 연결 또는 채팅 전송 중 오류 발생:", error);
      setShowModal(true);
      setMessage("채팅 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  };
  const connectSSE = (): Promise<EventSourcePolyfill> => {
    return new Promise((resolve, reject) => {
      const EventSource = EventSourcePolyfill || NativeEventSource;
      const SERVER_URL = import.meta.env.VITE_SERVER_URL;

      const newEventSource = new EventSource(
        `${SERVER_URL}/api/chat/connect?userId=${userIdState}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      newEventSource.onopen = () => {
        console.log("SSE 연결 완료");
        setEvent(newEventSource);
        resolve(newEventSource);
      };

      newEventSource.onmessage = (e: any) => {
        console.log("메시지 : ", e.data);
      };

      newEventSource.addEventListener("chatbot", (e: any) => {
        try {
          const parsed = JSON.parse(e.data);
          console.log("chatbot 이벤트 수신:", parsed, e);

          setChatLog((prev) => [...prev, { isUser: false, message: parsed }]);
          newEventSource.close();
          setEvent(null);
        } catch (error) {
          console.error("chatbot 이벤트 파싱 실패", error);
        } finally {
          setLoading(false);
        }
      });

      newEventSource.onerror = (err: any) => {
        console.error("SSE 연결 에러:", err);
        newEventSource.close();
        setEvent(null);
        reject(err);
        setLoading(false);
      };
    });
  };

  const sendChat = async () => {
    try {
      const res = await api.get("/chat", {
        params: {
          userId: userIdState,
          question: value,
        },
      });

      console.log(res.data);

      setChatLog((prev) => [...prev, { isUser: true, message: value }]);
      setValue("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <AddCourseModal
          courseInfo={chatLog[1]?.message?.placeList}
          handleClose={handleClose}
        />
      </Modal>

      <div className={styles.chatbot_container}>
        {loading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 20,
            }}
          ></div>
        )}
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
              onKeyDown={hanldePressEnter}
            />
            <MainButton onClick={handleClickSendBtn} paddingY={10}>
              전송
            </MainButton>
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
