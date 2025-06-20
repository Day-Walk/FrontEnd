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
import { EventSource, NativeEventSource } from "event-source-polyfill";
import { api } from "../utils/api";
import { Loading1 } from "../loading/Loading";
import checkboxStyles from "../signup/Signup.module.css";
import { Check } from "lucide-react";

const Chatbot = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const placeholderText =
    "ex - 홍대에서 연인과 데이트 할 건데,\n분위기 좋은 코스를 추천해줘.";

  const [chatLog, setChatLog] = useState<any[]>([]);

  // const mapInfo =
  //   chatLog.length > 1 && chatLog[1].message?.placeList
  //     ? chatLog[1].message.placeList.map((place: any) => place.location)
  //     : [];
  const [value, setValue] = useState<string>("");
  const userIdState = useRecoilValue(userId);

  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  // 중복 요청 차단용
  const clickRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const connectSSE = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const EventSource = NativeEventSource;

      const newEventSource = new EventSource(
        `/api/chat/connect?userId=${userIdState}`,
      );

      // newEventSource.onopen = () => {
      //   console.log("SSE 연결 완료");
      // };

      newEventSource.addEventListener("connect", (e: any) => {
        console.log("연결 이벤트 수신:", e.data);
        resolve();
      });

      newEventSource.addEventListener("chatbot", (e: any) => {
        if (e.data === "[DONE]") {
          newEventSource.close();
          // resolve();
          return;
        }

        try {
          const parsed = JSON.parse(e.data);
          console.log("chatbot 이벤트 수신:", parsed);
          setChatLog((prev) => [...prev, { isUser: false, message: parsed }]);
        } catch (error) {
          setShowModal(true);
          setMessage("오류가 발생했습니다. 잠시 후에 다시 이용해주세요.");
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
      console.log("1. SSE 연결 완료 : ", new Date().toISOString());
      await getChat();
      console.log("2. getChat API 호출 완료 : ", new Date().toISOString());
      setChatLog((prev) => [...prev, { isUser: true, message: value }]);
    } catch (error) {
      setShowModal(true);
      setMessage("오류가 발생했습니다. 잠시 후에 다시 이용해주세요.");

      console.error("sendChat 실패", error);
    } finally {
      setValue("");
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
    await sendChat();
  };

  const [isChecked, setIsChecked] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const handleClickClosePopup = () => {
    setOpenPopup(false);
    if (isChecked) {
      localStorage.setItem(
        "popup",
        (new Date().getTime() + 24 * 60 * 60 * 1000).toString(),
      );
    }
  };

  const getChatLog = async () => {
    try {
      const res = await api.get("/chat/log", {
        params: {
          userId: userIdState,
        },
      });
      setChatLog(res.data.chatLog);
      console.log(res.data.chatLog);
    } catch (error) {
      console.error("채팅 로그 가져오기 실패", error);
    }
  };
  useEffect(() => {
    const popupTime = localStorage.getItem("popup");
    if (!popupTime) {
      setOpenPopup(true);
    } else {
      const popupTimeNum = parseInt(popupTime, 10);
      const currentTime = new Date().getTime();
      if (currentTime > popupTimeNum) {
        setOpenPopup(true);
      }
    }
  }, []);

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatLog, loading]);

  useEffect(() => {
    getChatLog();
  }, []);

  return (
    <>
      {/* <Modal open={open} onClose={handleClose}>
        <AddCourseModal
          courseInfo={chatLog[1]?.message?.placeList}
          handleClose={handleClose}
        />
      </Modal> */}

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
          {openPopup && (
            <div className={styles.popup_container}>
              <div className={styles.popup}>
                채팅은 기록은{" "}
                <span style={{ color: "#00b493", fontWeight: 600 }}>
                  7일동안{" "}
                </span>
                저장됩니다.
                <br />
                이후 기록은&nbsp;
                <span style={{ color: "#EF4444", fontWeight: 600 }}>삭제</span>
                됩니다.
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <input
                    type="checkbox"
                    id="popupCheckbox"
                    className={checkboxStyles.checkbox}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    checked={isChecked}
                    style={{
                      marginRight: "5px",
                      width: "15px",
                      height: "15px",
                    }}
                  />
                  <label
                    htmlFor="popupCheckbox"
                    style={{ fontSize: "12px", color: "#b0b0b0" }}
                  >
                    오늘 하루 보지 않기
                  </label>
                  <Check
                    color="#FFF"
                    size={12}
                    strokeWidth={3}
                    style={{
                      position: "absolute",
                      left: "1px",
                      top: "1px",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleClickClosePopup}
                className={styles.close_btn}
              >
                닫기
              </button>
            </div>
          )}
          {chatLog.length === 0 ? (
            <div className={styles.empty_chat}>
              <img src={ChatBot} style={{ width: "120px" }} />
              <div className={styles.ask_to}>챗봇에게 물어보세요!</div>
            </div>
          ) : (
            <div className={styles.content}>
              {chatLog.map((chat, index) =>
                chat.question ? (
                  <UserMessage message={chat.question} key={index} />
                ) : (
                  <ChatMessage
                    message={chat.answer}
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
