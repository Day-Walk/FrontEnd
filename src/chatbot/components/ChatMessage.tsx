import React, { useState } from "react";
import styles from "../Chatbot.module.css";
import { BotMessageSquare, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { MainButton } from "./Buttons";
import ChatBot from "../../assets/ChatBot.png";

interface ChatMessageProps {
  message: MessageType;
  selectedMarker: { lat: number; lng: number } | null;
  setSelectedMarker: (value: { lat: number; lng: number }) => void;
  handleModalOpen: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

type MessageType = {
  title: string;
  placeList?: any[];
  detail?: string;
  error?: boolean;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  selectedMarker,
  setSelectedMarker,
  handleModalOpen,
  inputRef,
}) => {
  const [toggleDetail, setToggleDetail] = useState<boolean>(false);

  const handleToggleDetail = () => {
    setToggleDetail((prev) => !prev);
  };

  const handleClickUpdateBtn = () => {
    inputRef.current?.focus();
  };
  return (
    <div className={`${styles.message} ${styles.chat_message}`}>
      <img src={ChatBot} alt="Chatbot" className={styles.chatbot_image} />
      <div>{message.title}</div>
      {message.placeList && (
        <div className={styles.place_wrapper}>
          {message?.placeList?.map((place: any, idx: number) => (
            <div
              onClick={() => setSelectedMarker(place.location)}
              key={place.placeId}
              className={`${styles.place_box} ${selectedMarker === place.location ? styles.selected_img : ""}`}
            >
              <img
                src={place.imgUrl}
                alt={place.name}
                className={styles.place_img}
              />
              <div className={styles.place_info}>
                <div className={styles.place_idx}>{idx + 1}</div>
                <div>{place.name}</div>
                <div className={styles.place_address}>
                  <MapPin
                    size={14}
                    style={{
                      filter: " drop-shadow(0 0 4px #333)",
                    }}
                  />
                  {place.address.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {message.detail &&
        (toggleDetail ? (
          <>
            <div className={styles.toggle} onClick={handleToggleDetail}>
              <ChevronUp size={20} />
              코스 설명 접기
            </div>
            <div>{message.detail}</div>
          </>
        ) : (
          <div className={styles.toggle} onClick={handleToggleDetail}>
            <ChevronDown size={20} />
            코스 설명 더보기
          </div>
        ))}

      {message.error && (
        <div className={styles.button_wrapper}>
          <MainButton
            fontSize={14}
            bgColor="#E96563"
            style={{ flexShrink: 0 }}
            onClick={handleModalOpen}
          >
            내 코스에 추가하기
          </MainButton>
          <MainButton
            fontSize={14}
            bgColor="#F7A19B"
            style={{ flexShrink: 0 }}
            onClick={handleClickUpdateBtn}
          >
            수정하기
          </MainButton>
          <MainButton fontSize={14} bgColor="#333" style={{ flexShrink: 0 }}>
            지도에 표시하기
          </MainButton>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
