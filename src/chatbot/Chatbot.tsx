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
import { Loading1 } from "../loading/Loading";

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

  const contentRef = useRef<HTMLDivElement>(null);
  // 중복 요청 차단용
  const clickRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const connectSSE = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const EventSource = EventSourcePolyfill || NativeEventSource;
      const SERVER_URL = import.meta.env.VITE_SERVER_URL;
      const newEventSource = new EventSource(
        `${SERVER_URL}/api/chat/connect?userId=${userIdState}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      newEventSource.onopen = () => {
        console.log("SSE 연결 완료");
      };

      newEventSource.addEventListener("chatbot", (e: any) => {
        if (e.data === "[DONE]") {
          newEventSource.close();
          resolve();
          return;
        }

        try {
          const parsed = JSON.parse(e.data);
          console.log("chatbot 이벤트 수신:", parsed);
          setChatLog((prev) => [...prev, { isUser: false, message: parsed }]);
        } catch (error) {
          setChatLog((prev) => [
            ...prev,
            {
              isUser: false,
              message: {
                title:
                  "오류가 발생했습니다. 잠시 후에 다시 이용해주세요. 서비스 이용에 불편을 드려 죄송합니다.",
              },
              error: true,
            },
          ]);
          console.error("chatbot 이벤트 파싱 실패", error);
          newEventSource.close();
          reject(error);
        }
      });

      newEventSource.onerror = (err: any) => {
        console.error("SSE 연결 에러:", err);
        newEventSource.close();
        reject(err);
      };
    });
  };

  const getChat = async () => {
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
      setShowModal(true);
      setMessage("메시지 전송 중 오류가 발생했습니다.");
    }
  };

  const sendChat = async () => {
    if (clickRef.current || loading) return;
    if (value.trim() === "") {
      setShowModal(true);
      setMessage("메시지를 입력해주세요.");
      return;
    }

    clickRef.current = true;
    setLoading(true);

    try {
      await connectSSE();
      await getChat();
    } catch (error) {
      setChatLog((prev) => [
        ...prev,
        {
          isUser: false,
          message: {
            title: "오류가 발생했습니다. 잠시 후에 다시 이용해주세요.",
          },
          error: true,
        },
      ]);

      console.error("sendChat 실패", error);
    } finally {
      clickRef.current = false;
      setLoading(false);
    }
  };

  const handlePressEnter = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendChat();
    }
  };

  const handleClickSendBtn = async () => {
    console.log("click");
    await sendChat();
  };

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatLog, loading]);

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
          >
            <Loading1 />
          </div>
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
              <div ref={contentRef} />
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
              onKeyDown={handlePressEnter}
            />
            <MainButton
              onClick={handleClickSendBtn}
              paddingY={10}
              disabled={loading}
            >
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
