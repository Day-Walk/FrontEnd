import React from "react";
import styles from "../Chatbot.module.css";
import { MapPin } from "lucide-react";
import { MainButton } from "./Buttons";
import ChatBot from "../../assets/ChatBot.webp";
import NoImage from "../../assets/NoImage.webp";
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
  setInputValue,

  messageId,
}) => {
  const placeListWithMessageId =
    message?.placeList?.map((place) => ({
      ...place,
      messageId,
    })) || [];

  const handleClickReRecommed = () => {
    const firstLine = message.detail?.split("<br>")[0] ?? "";

    setInputValue(firstLine + " 추천했던 장소 제외하고 다시 추천해줘.");
    inputRef.current?.focus();
  };

  const formatDetailText = (text: string) => {
    const paragraphs = text.split("<br>").filter(Boolean);

    return (
      <div>
        {paragraphs.map((paragraph, idx) => {
          const lines = paragraph.split("<n>").filter(Boolean);
          const firstLine = lines[0].trim();
          const isPlaceLine = /^\d+\.\s.*\s-\s.*$/.test(firstLine);

          return (
            <div key={idx}>
              {isPlaceLine ? (
                <>
                  <div style={{ fontWeight: "bold", paddingBottom: "4px" }}>
                    {firstLine}
                  </div>
                  {lines.slice(1).map((desc, i) => (
                    <div key={i} style={{ color: "#aaa", fontSize: "14px" }}>
                      {desc.trim()}
                    </div>
                  ))}
                </>
              ) : (
                lines.map((line, i) => (
                  <div
                    key={i}
                    style={
                      i === 0 ? undefined : { color: "#aaa", fontSize: "14px" }
                    }
                  >
                    {line.trim()}
                  </div>
                ))
              )}
              {idx !== paragraphs.length - 1 && <br />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`${styles.message} ${styles.chat_message}`}>
      <img src={ChatBot} alt="Chatbot" className={styles.chatbot_image} />
      {loading && <LoadingSpinner />}
      {message.placeList && message.placeList.length > 0 && (
        <div onClick={handleClick} className={styles.place_wrapper}>
          {placeListWithMessageId.map(
            (place: Interfaces.PlaceType, idx: number) => (
              <div
                onClick={() => {
                  setSelectedMarker({
                    location: {
                      lat: place.location.lat,
                      lng: place.location.lng,
                    },
                    placeId: place.placeId,
                    messageId: place.messageId,
                  });
                }}
                key={idx}
                className={`${styles.place_box} ${
                  selectedMarker?.placeId === place.placeId &&
                  selectedMarker?.messageId === place.messageId
                    ? styles.selected_img
                    : ""
                }`}
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
                      style={{ filter: " drop-shadow(0 0 4px #333)" }}
                    />
                    {place.address.split(" ").slice(0, 2).join(" ")}
                  </div>
                </div>
              </div>
            ),
          )}
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
              handleModalOpen(placeListWithMessageId);
            }}
          >
            내 코스에 추가하기
          </MainButton>
          <MainButton
            fontSize={14}
            bgColor="#F7A19B"
            style={{ flexShrink: 0 }}
            onClick={handleClickReRecommed}
          >
            다시 추천받기
          </MainButton>
          <MainButton
            onClick={() => {
              handleClick();
              if (placeListWithMessageId?.length > 0) {
                setSelectedMarker({
                  location: {
                    lat: placeListWithMessageId[0].location.lat,
                    lng: placeListWithMessageId[0].location.lng,
                  },
                  placeId: placeListWithMessageId[0].placeId,
                  messageId: placeListWithMessageId[0].messageId,
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
