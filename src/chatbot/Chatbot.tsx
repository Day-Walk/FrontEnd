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

import { api } from "../utils/api";
import { Loading1 } from "../loading/Loading";
import checkboxStyles from "../signup/Signup.module.css";
import { Check } from "lucide-react";

export type PlaceType = {
  placeId: string;
  name: string;
  address: string;
  imgUrl: string;
  location: {
    lat: number;
    lng: number;
  };
};

type MessageType = {
  userId: string;
  question: string;
  answer: {
    placeList: PlaceType[];
    detail: string;
  };
  createAt: string;
};

const Chatbot = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const placeholderText =
    "ex - 홍대에서 연인과 데이트 할 건데,\n분위기 좋은 코스를 추천해줘.";

  // const [chatLog, setChatLog] = useState<MessageType[] | null>([
  //   {
  //     userId: "65ac77c5-05e1-4729-86e1-7794763d54b9",
  //     question: "홍대 맛집 찾아줘",
  //     answer: {
  //       placeList: [
  //         {
  //           placeId: "119c7a17-ac6a-4160-9996-3055a900bd02",
  //           name: "KT&G 상상마당(홍대)",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/29/1570629_image2_1.jpg",
  //           address: "서울특별시 마포구 어울마당로 65",
  //           location: {
  //             lat: 37.550936,
  //             lng: 126.921043,
  //           },
  //         },
  //         {
  //           placeId: "20af0fdd-5546-45f9-b5c8-0b41734370b2",
  //           name: "폴인팬케이크 홍대",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/80/2655080_image2_1.jpg",
  //           address: "서울특별시 마포구 와우산로29가길 86",
  //           location: {
  //             lat: 37.55383,
  //             lng: 126.924779,
  //           },
  //         },
  //         {
  //           placeId: "3f30d342-78db-4605-8c59-ea700dac9db5",
  //           name: "할랄가이즈 홍대",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/38/3109638_image2_1.JPG",
  //           address: "서울특별시 마포구 양화로 161",
  //           location: {
  //             lat: 37.55699,
  //             lng: 126.923337,
  //           },
  //         },
  //       ],
  //       detail: "홍대에서 인기 있는 맛집 3곳을 추천드립니다!",
  //     },
  //     createAt: "2025-06-16T09:27:15.2059238",
  //   },
  //   {
  //     userId: "45678912-1234-5678-1234-678901234567",
  //     question: "강남에서 분위기 좋은 식당 알려줘",
  //     answer: {
  //       placeList: [
  //         {
  //           placeId: "3a8d80fc-8641-495c-903c-9e6bd278f4c0",
  //           name: "마초쉐프 강남본점",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/10/2869910_image2_1.jpg",
  //           address: "서울특별시 강남구 강남대로106길 29 유니켐",
  //           location: {
  //             lat: 37.503551,
  //             lng: 127.02786,
  //           },
  //         },
  //         {
  //           placeId: "419ba925-4aff-4a51-9f11-46750ac630f8",
  //           name: "까르니두브라질 강남역",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/93/2684693_image2_1.jpg",
  //           address: "서울특별시 강남구 테헤란로4길 14",
  //           location: {
  //             lat: 37.497408,
  //             lng: 127.02971,
  //           },
  //         },
  //         {
  //           placeId: "7b0fe5cc-e094-4cdd-889c-01cca39f8be6",
  //           name: "할랄가이즈 강남",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/26/2669026_image2_1.jpg",
  //           address: "서울특별시 서초구 강남대로69길 8",
  //           location: {
  //             lat: 37.501907,
  //             lng: 127.024658,
  //           },
  //         },
  //         {
  //           placeId: "dd624f96-abe5-4e2a-b1b8-c1b0e9ffb4b8",
  //           name: "갓덴스시 강남",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/49/2684649_image2_1.jpg",
  //           address: "서울특별시 강남구 테헤란로 109",
  //           location: {
  //             lat: 37.498888,
  //             lng: 127.029021,
  //           },
  //         },
  //       ],
  //       detail: "강남에서 분위기 좋은 서양식 및 일식 레스토랑을 소개해요.",
  //     },
  //     createAt: "2025-06-17T11:45:12.1234567",
  //   },
  //   {
  //     userId: "78945612-4321-5678-4321-987654321098",
  //     question: "강남 데이트 코스 추천해줘",
  //     answer: {
  //       placeList: [
  //         {
  //           placeId: "f532afe1-c218-4c21-af78-e788ef03049d",
  //           name: "강남 마이스 관광특구",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/12/3464912_image2_1.jpg",
  //           address: "서울특별시 강남구 영동대로 513",
  //           location: {
  //             lat: 37.511809,
  //             lng: 127.059132,
  //           },
  //         },
  //         {
  //           placeId: "328499d0-1fd3-46dd-b4ed-dc2bc71757bd",
  //           name: "세븐럭카지노(강남코엑스점)",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/40/2996840_image2_1.jpg",
  //           address: "서울특별시 강남구 테헤란로87길 58",
  //           location: {
  //             lat: 37.512026,
  //             lng: 127.057532,
  //           },
  //         },
  //         {
  //           placeId: "8420b7a4-1bc0-4bd3-8304-fbd3b8619345",
  //           name: "봉밀가 강남구청점",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/19/2871719_image2_1.jpg",
  //           address: "서울특별시 강남구 선릉로 664 건설빌딩",
  //           location: {
  //             lat: 37.515953,
  //             lng: 127.042311,
  //           },
  //         },
  //         {
  //           placeId: "96031efe-6aa3-495f-93be-75fc08bc3143",
  //           name: "바바인디아 강남역점",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/15/1807915_image2_1.jpg",
  //           address: "서울특별시 서초구 강남대로 359",
  //           location: {
  //             lat: 37.494805,
  //             lng: 127.028591,
  //           },
  //         },
  //         {
  //           placeId: "c1665b54-6c89-4715-943a-f1d73fcf000b",
  //           name: "강남청소년수련관",
  //           imgUrl:
  //             "http://tong.visitkorea.or.kr/cms/resource/99/1868099_image2_1.jpg",
  //           address: "서울특별시 강남구 영동대로131길 26",
  //           location: {
  //             lat: 37.52045,
  //             lng: 127.054143,
  //           },
  //         },
  //       ],
  //       detail:
  //         "데이트에 딱 좋은 관광지부터 이색 레스토랑까지 강남 5코스 추천!",
  //     },
  //     createAt: "2025-06-17T13:02:33.7890123",
  //   },
  // ]);
  const [chatLog, setChatLog] = useState<MessageType[]>([]);

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
  const [selectedPlaceList, setSelectedPlaceList] = useState<
    PlaceType[] | null
  >(null);

  const handleOpen = (placeList: PlaceType[]) => {
    setSelectedPlaceList(placeList);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  // 중복 요청 차단용
  const clickRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const connectSSE = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const newEventSource = new EventSource(
        `https://hktoss.shop/api/chat/connect?userId=${userIdState}`,
      );

      newEventSource.addEventListener("connect", (e: any) => {
        console.log("연결 이벤트 수신:", e.data);
        resolve();
      });

      newEventSource.addEventListener("chatbot", (e: any) => {
        if (e.data === "[DONE]") {
          newEventSource.close();
          setLoading(false);
          return;
        }

        try {
          const parsed: MessageType["answer"] = JSON.parse(e.data);
          console.log("chatbot 이벤트 수신:", parsed);

          setChatLog((prev) => {
            if (!prev || prev.length === 0) return prev;

            const updated = [...prev];
            const lastIndex = updated.length - 1;

            updated[lastIndex] = {
              ...updated[lastIndex],
              answer: parsed,
            };

            return updated;
          });
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
        setLoading(false);
        setShowModal(true);
        setMessage("오류가 발생했습니다. 잠시 후에 다시 이용해주세요.");
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
      setChatLog((prev) => [
        ...prev,
        {
          userId: userIdState,
          question: value,
          answer: { placeList: [], detail: "" },
          createAt: new Date().toISOString(),
        },
      ]);
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
    } catch (error) {
      setShowModal(true);
      setMessage("오류가 발생했습니다. 잠시 후에 다시 이용해주세요.");
      console.error("sendChat 실패", error);
    } finally {
      setValue("");
      clickRef.current = false;
      // setLoading(false);
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
      {selectedPlaceList && (
        <Modal open={open} onClose={handleClose}>
          <AddCourseModal
            courseInfo={selectedPlaceList}
            handleClose={handleClose}
          />
        </Modal>
      )}
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
          {chatLog?.length === 0 ? (
            <div className={styles.empty_chat}>
              <img src={ChatBot} style={{ width: "120px" }} />
              <div className={styles.ask_to}>챗봇에게 물어보세요!</div>
            </div>
          ) : (
            <div className={styles.content}>
              {chatLog?.flatMap((chat, index) => [
                chat.question && (
                  <UserMessage message={chat.question} key={`${index}-q`} />
                ),
                chat.answer && (
                  <ChatMessage
                    key={`${index}-a`}
                    message={chat.answer}
                    selectedMarker={selectedMarker}
                    setSelectedMarker={setSelectedMarker}
                    handleModalOpen={handleOpen}
                    inputRef={inputRef}
                    handleClick={() => {
                      setSelectedPlaceList(chat.answer.placeList);
                    }}
                  />
                ),
              ])}

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
