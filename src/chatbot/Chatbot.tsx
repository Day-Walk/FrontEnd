import React, { useState } from "react";
import styles from "./Chatbot.module.css";
import {
  BotMessageSquare,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MapPin,
} from "lucide-react";

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
          },
          {
            placeId: "22345678-1234-5678-1234-123456789124",
            imgUrl: "https://picsum.photos/200",
            name: "이태원 브루어리",
            address: "서울시 용산구 이태원로 88",
            category: "술집",
            subCategory: "맥주집",
            stars: 4.5,
          },
          {
            placeId: "32345678-1234-5678-1234-123456789125",
            imgUrl: "https://picsum.photos/200",
            name: "스윗카페",
            address: "서울시 강남구 역삼로 22",
            category: "카페",
            subCategory: "디저트카페",
            stars: 4.2,
          },
          {
            placeId: "42345678-1234-5678-1234-123456789126",
            imgUrl: "https://picsum.photos/200",
            name: "피자굽는남자",
            address: "서울시 마포구 합정동 123",
            category: "음식점",
            subCategory: "양식",
            stars: 4.6,
          },
          {
            placeId: "52345678-1234-5678-1234-123456789127",
            imgUrl: "https://picsum.photos/200",
            name: "해피마사지",
            address: "서울시 송파구 가락동 456",
            category: "서비스",
            subCategory: "마사지",
            stars: 4.9,
          },
        ],
      },
    },
  ]);

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

  const [toggleDetail, setToggleDetail] = useState<boolean>(false);

  const handleToggleDetail = () => {
    setToggleDetail((prev) => !prev);
  };
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
                <div
                  key={index}
                  className={`${styles.message} ${styles.user_message}`}
                  style={index === 0 ? { marginTop: "20px" } : {}}
                >
                  {chat.message}
                </div>
              ) : (
                <div
                  key={index}
                  style={index === 0 ? { marginTop: "20px" } : {}}
                >
                  <BotMessageSquare size={40} color="#00B493" strokeWidth={2} />

                  <div className={`${styles.message} ${styles.chat_message}`}>
                    <div>{chat.message.header}</div>
                    <div className={styles.place_wrapper}>
                      {chat.message?.placeList.map(
                        (place: any, idx: number) => (
                          <div key={place.placeId} className={styles.place_box}>
                            <img
                              src={place.imgUrl}
                              alt={place.name}
                              className={styles.place_img}
                            />
                            <div className={styles.place_info}>
                              <div className={styles.place_idx}>{idx + 1}</div>
                              <div>{place.name}</div>
                              <div className={styles.place_address}>
                                <MapPin size={14} />
                                {place.address.split(" ").slice(0, 2).join(" ")}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                    {chat.message.footer && toggleDetail ? (
                      <>
                        <div
                          className={styles.toggle}
                          onClick={handleToggleDetail}
                        >
                          <ChevronUp size={20} />
                          코스 설명 접기
                        </div>
                        <div>{chat.message.footer}</div>
                      </>
                    ) : (
                      <div
                        className={styles.toggle}
                        onClick={handleToggleDetail}
                      >
                        <ChevronDown size={20} />
                        코스 설명 더보기
                      </div>
                    )}
                  </div>
                </div>
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
          <button className={styles.sendBtn} onClick={handleClickSendBtn}>
            전송
          </button>
        </div>
      </div>
      <div className={styles.mapSection}>지도</div>
    </div>
  );
};

export default Chatbot;
