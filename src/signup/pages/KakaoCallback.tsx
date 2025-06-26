import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../utils/api";
import { useSetRecoilState } from "recoil";
import { userId, userName } from "../../recoil/userInfo";
import Loading from "../../global_components/Loading";

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setUserId = useSetRecoilState(userId);
  const setUserName = useSetRecoilState(userName);

  const postLogin = async (kakaoId: number, kakaoName: string) => {
    try {
      const res = await api.post("/user/login", {
        kakaoName,
        kakaoId: kakaoId,
      });
      let nextPage = res.data.userInfo.nextPage;

      const { userId, name } = res.data.userInfo;

      setUserId(userId);
      setUserName(name);

      localStorage.setItem("userId", userId);

      // 신규유저
      if (nextPage === "init") {
        navigate("/signup", {
          state: {
            id: userId,
            name,
          },
        });
      }
      // 기존유저
      if (nextPage === "home") {
        localStorage.setItem("userName", name);
        navigate("/");
      }
    } catch (error) {
      console.error("Login api error : ", error);
    }
  };

  const fetchKakaoUser = async () => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (!code) {
      console.error("Kakao login failed");
      return;
    }
    const hostname = window.location.hostname;

    const REDIRECT_URI =
      hostname.includes("localhost") || hostname.includes("127.0.0.1")
        ? "http://localhost:5173/auth/kakao-callback"
        : hostname.includes("final")
          ? "https://final-front-end-fawn.vercel.app/auth/kakao-callback"
          : "https://day-walk.vercel.app/auth/kakao-callback";

    try {
      const tokenRes = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        },
      );

      const accessToken = tokenRes.data.access_token;

      const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      const kakaoId = userRes.data.id;
      const nickname = userRes.data.kakao_account.profile.nickname;

      await postLogin(kakaoId, nickname);
    } catch (error) {
      console.error("Kakao Login error : ", error);
    }
  };

  useEffect(() => {
    fetchKakaoUser();
  }, [location.search]);

  return <Loading />;
};

export default KakaoCallback;
