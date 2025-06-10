import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../utils/api";
import { useSetRecoilState } from "recoil";
import { userId } from "../../recoil/userInfo";

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setUserId = useSetRecoilState(userId);

  const postLogin = async (kakaoId: number, name: string) => {
    try {
      const res = await api.post("/user/login", {
        name,
        kakaoId: kakaoId,
      });

      const userId = res.data.userInfo.userId;
      setUserId(userId);
      localStorage.setItem("userId", userId);

      let nextPage = res.data.userInfo.nextPage;

      const authHeader = res.headers["authorization"];

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      localStorage.setItem("accessToken", token);

      if (nextPage === "home") {
        // navigate("/");
        // test
        navigate("/signup", {
          state: {
            id: userId,
            name,
          },
        });
      } else if (nextPage === "init") {
        navigate("/signup", {
          state: {
            id: userId,
            name,
          },
        });
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

    try {
      const tokenRes = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
          redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
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

  return <div>카카오 로그인 처리 중입니다...</div>;
};

export default KakaoCallback;
