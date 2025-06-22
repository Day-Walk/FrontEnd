import React from "react";
import styles from "../Chatbot.module.css";
import { MapPin } from "lucide-react";
import { MainButton } from "./Buttons";
import ChatBot from "../../assets/ChatBot.png";

interface ChatMessageProps {
  message: MessageType;
  selectedMarker: { lat: number; lng: number } | null;
  setSelectedMarker: (value: { lat: number; lng: number }) => void;
  handleModalOpen: (placeList: any) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleClick: () => void;
}

type MessageType = {
  placeList?: any[];
  detail?: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  selectedMarker,
  setSelectedMarker,
  handleModalOpen,
  inputRef,
  handleClick,
}) => {
  const handleClickUpdateBtn = () => {
    inputRef.current?.focus();
  };
  const formatDetailText = (text: string) => {
    return text.split(/(<br>|<n>)/g).map((chunk, idx) => {
      if (chunk === "<br>")
        return <div key={idx} style={{ marginBottom: "1em" }} />;
      if (chunk === "<n>") return <br key={idx} />;
      return chunk; // 태그 없이 텍스트만 반환
    });
  };

  return (
    <div className={`${styles.message} ${styles.chat_message}`}>
      <img src={ChatBot} alt="Chatbot" className={styles.chatbot_image} />
      {message.placeList && message.placeList.length > 0 && (
        <div onClick={handleClick} className={styles.place_wrapper}>
          {message?.placeList?.map((place: any, idx: number) => (
            <div
              onClick={() => setSelectedMarker(place.location)}
              key={idx}
              className={`${styles.place_box} ${selectedMarker === place.location ? styles.selected_img : ""}`}
            >
              <img
                src={place.imgUrl}
                alt={place.name}
                className={styles.place_img}
              />
              <div className={styles.place_info}>
                <div className={styles.place_idx}>{idx + 1}</div>
                <div className={styles.place_name}>{place.name}</div>
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
      {message.detail && <div>{formatDetailText(message.detail)}</div>}
      {message.placeList && message.placeList.length > 0 && (
        <div className={styles.button_wrapper}>
          <MainButton
            fontSize={14}
            bgColor="#E96563"
            style={{ flexShrink: 0 }}
            onClick={() => {
              handleModalOpen(message.placeList);
            }}
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
          <MainButton
            onClick={() => {
              handleClick();
              if (message.placeList && message.placeList.length > 0) {
                setSelectedMarker({
                  lat: message.placeList[0].location.lat,
                  lng: message.placeList[0].location.lng,
                });
              }
            }}
            fontSize={14}
            bgColor="#333"
            style={{ flexShrink: 0 }}
          >
            지도에 표시하기
          </MainButton>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
