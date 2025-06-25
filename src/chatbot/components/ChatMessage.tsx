import React from "react";
import styles from "../Chatbot.module.css";
import { MapPin } from "lucide-react";
import { MainButton } from "./Buttons";
import ChatBot from "../../assets/ChatBot.png";
import NoImage from "../../assets/NoImage.png";
import * as Interfaces from "../interfaces/Interface";

const LoadingSpinner = () => {
  return (
    <div className={styles.dot_spinner}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
};

const ChatMessage: React.FC<Interfaces.ChatMessageProps> = ({
  message,
  selectedMarker,
  setSelectedMarker,
  handleModalOpen,
  inputRef,
  handleClick,
  loading,
}) => {
  const handleClickUpdateBtn = () => {
    inputRef.current?.focus();
  };
  const formatDetailText = (text: string) => {
    return text.split(/(<br>|<n>)/g).map((chunk, idx) => {
      if (chunk === "<br>")
        return <div key={idx} style={{ marginBottom: "1em" }} />;
      if (chunk === "<n>") return <br key={idx} />;
      return chunk;
    });
  };

  return (
    <div className={`${styles.message} ${styles.chat_message}`}>
      <img src={ChatBot} alt="Chatbot" className={styles.chatbot_image} />
      {loading && <LoadingSpinner />}
      {message.placeList && message.placeList.length > 0 && (
        <div onClick={handleClick} className={styles.place_wrapper}>
          {message?.placeList?.map((place: any, idx: number) => (
            <div
              onClick={() =>
                setSelectedMarker({
                  location: {
                    lat: place.location.lat,
                    lng: place.location.lng,
                  },
                  placeId: place.placeId,
                })
              }
              key={idx}
              className={`${styles.place_box} ${selectedMarker === place.location ? styles.selected_img : ""}`}
            >
              {place.imgUrl ? (
                <img
                  src={place.imgUrl}
                  alt={place.name}
                  className={styles.place_img}
                />
              ) : (
                <img src={NoImage} className={styles.place_img} />
              )}

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
                  location: {
                    lat: message.placeList[0].location.lat,
                    lng: message.placeList[0].location.lng,
                  },
                  placeId: "",
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
