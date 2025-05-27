// src/kakaoMapLoader.ts
export const loadKakaoMap = (appKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => resolve());
      } else {
        reject(new Error("Kakao map load failed"));
      }
    };
    script.onerror = () => reject(new Error("Kakao map script load error"));
    document.head.appendChild(script);
  });
};
