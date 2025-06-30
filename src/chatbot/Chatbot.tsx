import React, { useEffect, useRef, useState } from "react";
import styles from "./Chatbot.module.css";
import ChatMessage from "./components/ChatMessage";
import UserMessage from "./components/UserMessage";
import ChatbotMap from "./components/ChatbotMap";
import { MainButton } from "./components/Buttons";
import { Modal } from "@mui/material";
import AddCourseModal from "./components/AddCourseModal";
import ChatBot from "../assets/ChatBot.webp";
import AlertModal from "../global_components/AlertModal/AlertModal";
import { api } from "../utils/api";
import * as Interfaces from "./interfaces/Interface";
import ChatRecordPopUp from "./components/ChatRecordPopUp";
import PlaceModal from "../course_detail/components/PlaceModal";
import { useUserStore } from "../zustand/useUserStore";
import { useChatStore } from "../zustand/chatStore";

const PLACE_HOLDER =
  "ex - 홍대에서 연인과 데이트 할 건데,\n분위기 좋은 코스를 추천해줘.";

const ChatInput = ({
  isFocused,
  setIsFocused,
  inputValue,
  setInputValue,
  inputRef,
  sendChat,
  loading,
}: Interfaces.ChatInputProps) => {
  const [isComposing, setIsComposing] = useState(false);

  const handlePressEnter = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      await sendChat();
    }
  };

  return (
    <div
      className={`${styles.input_wrapper} ${
        isFocused && !loading ? styles.focused : ""
      }`}
    >
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.chat_input}
        placeholder={PLACE_HOLDER}
        ref={inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handlePressEnter}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
      />
      <MainButton
        onClick={sendChat}
        paddingY={10}
        disabled={loading}
        bgColor={`${loading ? "#d9d9d9" : "#00B493"}`}
      >
        전송
      </MainButton>
    </div>
  );
};

const Chatbot = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const userIdState = useUserStore((state) => state.userId);
  const [open, setOpen] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isNewMessage, setIsNewMessage] = useState(false);

  const [selectedMarker, setSelectedMarker] =
    useState<Interfaces.MarkerInfo | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<
    Interfaces.PlaceType[] | null
  >(null);

  const {
    chatLog,
    loading,
    isLoaded,
    setChatLog,
    appendchatLog,
    setIsLoaded,
    setLoading,
    updateLastAnswer,
    updateLastAnswerWithError,
  } = useChatStore();

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const clickRef = useRef(false);

  const handleOpenCourseSaveModal = (placeList: Interfaces.PlaceType[]) => {
    setSelectedPlaceList(placeList);
    setOpen(true);
  };
  const handleCloseCourseSaveModal = () => setOpen(false);

  const connectSSE = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const newEventSource = new EventSource(
        `https://hktoss.shop/api/chat/connect?userId=${userIdState}`,
        { withCredentials: true },
      );

      newEventSource.addEventListener("connect", (e: any) => {
        console.log("연결 이벤트 수신:", e.data);
        resolve();
      });

      newEventSource.addEventListener("chatbot", (e: any) => {
        if (e.data === "[DONE]") {
          newEventSource.close();
          setLoading(false);
          setIsNewMessage(true);
          inputRef.current?.focus();
          return;
        }

        try {
          const parsed: Interfaces.MessageType["answer"] = JSON.parse(e.data);
          console.log("chatbot 이벤트 수신:", parsed);

          if (!chatLog || chatLog.length === 0) return;

          const updatedLog = [...chatLog];
          const lastIndex = updatedLog.length - 1;
          updatedLog[lastIndex] = {
            ...updatedLog[lastIndex],
            answer: parsed,
          };

          updateLastAnswer(parsed);

          if (parsed.placeList.length > 0) {
            setSelectedPlaceList(parsed.placeList);
            setSelectedMarker({
              location: parsed.placeList[0].location,
              placeId: parsed.placeList[0].placeId,
              messageId: updatedLog[lastIndex].createAt || "",
            });
            console.log(chatLog);
            console.log(updatedLog[lastIndex].createAt);
          }
        } catch (error) {
          updateLastAnswerWithError(
            "오류가 발생했습니다. 잠시 후에 다시 이용해주세요.",
          );
          console.error("chatbot 이벤트 파싱 실패", error);
          newEventSource.close();
          reject(error);
        }
      });

      newEventSource.onerror = (err: any) => {
        console.error("SSE 연결 에러:", err);
        setLoading(false);
        updateLastAnswerWithError(
          "오류가 발생했습니다. 잠시 후에 다시 이용해주세요.",
        );
        setIsNewMessage(true);
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
      updateLastAnswerWithError("메시지 전송 중 오류가 발생했습니다.");
    }
  };

  const sendChat = async () => {
    if (clickRef.current || loading) return;
    if (value.trim() === "") {
      setShowModal(true);
      setMessage("메시지를 입력해주세요.");
      return;
    }
    setValue("");

    setLoading(true);
    setIsNewMessage(true);
    try {
      appendchatLog({
        userId: userIdState,
        question: value,
        answer: { placeList: [], detail: "" },
        createAt: new Date().toISOString(),
      });
      await connectSSE();
      await getChat();
    } catch (error) {
      updateLastAnswerWithError(
        "오류가 발생했습니다. 잠시 후에 다시 이용해주세요.",
      );
      console.error("sendChat 실패", error);
    }
  };

  const handleClickClosePopup = () => {
    setOpenPopup(false);
    if (isChecked) {
      localStorage.setItem(
        "popup",
        (new Date().getTime() + 24 * 60 * 60 * 1000).toString(),
      );
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
    if (!contentRef.current) return;

    contentRef.current.scrollIntoView({
      behavior: isNewMessage ? "smooth" : "auto",
      block: "end",
    });
  }, [chatLog, loading]);

  useEffect(() => {
    if (!isLoaded && userIdState) {
      const getChatLog = async () => {
        try {
          const res = await api.get("/chat/log", {
            params: { userId: userIdState },
          });
          setChatLog(res.data.chatLog);
          setIsLoaded(true);
        } catch (error) {
          console.error("채팅 로그 가져오기 실패:", error);
        }
      };

      getChatLog();
    }
  }, [userIdState, isLoaded]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  return (
    <>
      {selectedPlaceList && (
        <Modal open={open} onClose={handleCloseCourseSaveModal}>
          <AddCourseModal
            courseInfo={selectedPlaceList}
            handleCloseCourseSaveModal={handleCloseCourseSaveModal}
          />
        </Modal>
      )}
      <div className={styles.chatbot_container}>
        <div className={styles.chat_wrapper}>
          {openPopup && (
            <ChatRecordPopUp
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              handleClickClosePopup={handleClickClosePopup}
            />
          )}
          {chatLog.length === 0 ? (
            <div className={styles.empty_chat}>
              <img src={ChatBot} style={{ width: "120px" }} />
              <div className={styles.ask_to}>챗봇에게 물어보세요!</div>
            </div>
          ) : (
            <div className={styles.content}>
              {chatLog.flatMap((chat, index) => [
                chat.question && (
                  <UserMessage message={chat.question} key={`${index}-q`} />
                ),
                chat.answer && (
                  <ChatMessage
                    key={`${index}-a`}
                    message={chat.answer}
                    selectedMarker={selectedMarker}
                    setSelectedMarker={setSelectedMarker}
                    handleModalOpen={handleOpenCourseSaveModal}
                    inputRef={inputRef}
                    handleClick={() => {
                      setSelectedPlaceList(chat.answer.placeList);
                    }}
                    loading={loading && index === chatLog.length - 1}
                    setInputValue={setValue}
                    messageId={chat.createAt}
                  />
                ),
              ])}

              <div ref={contentRef} />
            </div>
          )}
          <ChatInput
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            inputValue={value}
            setInputValue={setValue}
            inputRef={inputRef}
            sendChat={sendChat}
            loading={loading}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "420px",
            top: 0,
            width: "fit-content",
            height: "100%",
            zIndex: 10,
          }}
        >
          {selectedMarker && (
            <PlaceModal
              placeId={selectedMarker ? selectedMarker.placeId : ""}
              isPlaceOnly={true}
            />
          )}
        </div>
        <ChatbotMap
          mapInfo={selectedPlaceList}
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
