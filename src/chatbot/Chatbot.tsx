import React, { useEffect, useRef, useState } from "react";
import styles from "./Chatbot.module.css";
import { BotMessageSquare, CookingPot } from "lucide-react";
import ChatMessage from "./components/ChatMessage";
import UserMessage from "./components/UserMessage";

import ChatbotMap from "./components/ChatbotMap";
import { MainButton } from "./components/Buttons";

const Chatbot = () => {
  const placeholderText =
    "ex - 가족이 서울에 놀러오는데, \n날씨 좋을 때 투어 코스 알려줘.";

  const [chatLog, setChatLog] = useState<any[]>([
    {
      isUser: true,
      message:
        "비오는날인데 데이트해야돼 어디로 놀러갈 지 추천 해줘 강남 주변이면 좋겠어!",
    },
    {
      isUser: false,
      message: {
        header: "추천 장소 리스트",
        footer: "Powered by ChatGPT",
        placeList: [
          {
            placeId: "12345678-1234-5678-1234-123456789123",
            imgUrl: "https://picsum.photos/200",
            name: "공화춘",
            address: "서울시 중구 충정로 1가 123-45",
            category: "음식점",
            subCategory: "중식",
            stars: 4.8,
            location: { lat: 37.5714, lng: 126.9769 },
          },
          {
            placeId: "22345678-1234-5678-1234-123456789124",
            imgUrl: "https://picsum.photos/200",
            name: "이태원 브루어리",
            address: "서울시 용산구 이태원로 88",
            category: "술집",
            subCategory: "맥주집",
            stars: 4.5,
            location: { lat: 37.572, lng: 126.9802 },
          },
          {
            placeId: "32345678-1234-5678-1234-123456789125",
            imgUrl: "https://picsum.photos/200",
            name: "스윗카페",
            address: "서울시 강남구 역삼로 22",
            category: "카페",
            subCategory: "디저트카페",
            stars: 4.2,
            location: { lat: 37.5698, lng: 126.9827 },
          },
          {
            placeId: "42345678-1234-5678-1234-123456789126",
            imgUrl: "https://picsum.photos/200",
            name: "피자굽는남자",
            address: "서울시 마포구 합정동 123",
            category: "음식점",
            subCategory: "양식",
            stars: 4.6,
            location: { lat: 37.5733, lng: 126.9812 },
          },
          {
            placeId: "52345678-1234-5678-1234-123456789127",
            imgUrl: "https://picsum.photos/200",
            name: "해피마사지",
            address: "서울시 송파구 가락동 456",
            category: "서비스",
            subCategory: "마사지",
            stars: 4.9,
            location: { lat: 37.5718, lng: 126.9785 },
          },
        ],
      },
    },
  ]);

  const mapInfo = chatLog[1].message.placeList.map(
    (place: any) => place.location,
  );

  const [value, setValue] = useState<string>("");
  const handleClickSendBtn = () => {
    if (value.trim() === "") {
      alert("메시지를 입력해주세요.");
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

  return (
    <div className={styles.chatbot_container}>
      <div className={styles.chat_wrapper}>
        {chatLog.length === 0 ? (
          <div className={styles.empty_chat}>
            <BotMessageSquare size={80} color="#00B493" strokeWidth={1} />
            <div className={styles.message}>챗봇에게 물어보세요!</div>
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
                />
              ),
            )}
          </div>
        )}

        <div className={styles.input_wrapper}>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.chat_input}
            placeholder={placeholderText}
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
  );
};

export default Chatbot;
