export interface Review {
  userName: string;
  content: string;
  imgUrl: string;
  stars: number;
  tagList: string[];
  createAt: string;
}

export interface ReviewPage {
  page: Review[];
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  reviewList: ReviewPage[];
}

export interface ReviewTotalResponse {
  success: boolean;
  message: string;
  reviewTotal: ReviewTotal;
}

export interface ReviewTotal {
  stars: number;
  reviewNum: number;
  tagList: string[]; // 최대 5개까지만
}

export const dummyReviewTotal: ReviewTotalResponse = {
  success: true,
  message: "장소별 리뷰 통계 조회 성공!",
  reviewTotal: {
    stars: 4.5,
    reviewNum: 12,
    tagList: ["깨끗해요", "재밌어요", "조용해요", "친절해요", "분위기 좋아요"],
  },
};

export const dummyReviewList: ReviewListResponse = {
  success: true,
  message: "장소별 리뷰 조회 성공!",
  reviewList: [
    {
      page: [
        {
          userName: "홍길동",
          content: "분위기 좋고 조용해서 대화하기 좋아요.",
          imgUrl: "https://picsum.photos/seed/review1/200",
          stars: 4.5,
          tagList: ["조용해요", "깨끗해요"],
          createAt: "2025-05-23",
        },
        {
          userName: "김민지",
          content: "친절한 직원 덕분에 기분 좋게 먹고 왔어요.",
          imgUrl: "https://picsum.photos/seed/review2/200",
          stars: 4.8,
          tagList: ["친절해요", "맛있어요"],
          createAt: "2025-05-22",
        },
        {
          userName: "이수현",
          content: "가성비 최고! 양도 많고 맛도 좋아요.",
          imgUrl: "https://picsum.photos/seed/review3/200",
          stars: 4.7,
          tagList: ["양이 많아요", "가성비 좋아요"],
          createAt: "2025-05-21",
        },
        {
          userName: "박찬호",
          content: "인테리어가 예쁘고 사진 찍기 좋아요.",
          imgUrl: "https://picsum.photos/seed/review4/200",
          stars: 4.2,
          tagList: ["예뻐요", "사진맛집"],
          createAt: "2025-05-20",
        },
        {
          userName: "정예린",
          content: "주차 공간이 넓어서 편하게 다녀왔어요.",
          imgUrl: "https://picsum.photos/seed/review5/200",
          stars: 4.0,
          tagList: ["주차편해요", "편리해요"],
          createAt: "2025-05-19",
        },
      ],
    },
    {
      page: [
        {
          userName: "최지훈",
          content: "음식 나오는 속도가 빨라서 좋아요.",
          imgUrl: "https://picsum.photos/seed/review6/200",
          stars: 4.3,
          tagList: ["빠르게 나와요", "효율적이에요"],
          createAt: "2025-05-18",
        },
        {
          userName: "윤다현",
          content: "가족끼리 오기 좋은 곳이에요.",
          imgUrl: "https://picsum.photos/seed/review7/200",
          stars: 4.6,
          tagList: ["가족끼리 좋아요", "넓어요"],
          createAt: "2025-05-17",
        },
        {
          userName: "조윤호",
          content: "혼밥하기에도 부담 없는 분위기예요.",
          imgUrl: "https://picsum.photos/seed/review8/200",
          stars: 4.1,
          tagList: ["혼밥가능", "조용해요"],
          createAt: "2025-05-16",
        },
        {
          userName: "배수진",
          content: "음식이 정갈하고 깔끔해요.",
          imgUrl: "https://picsum.photos/seed/review9/200",
          stars: 4.4,
          tagList: ["깔끔해요", "정갈해요"],
          createAt: "2025-05-15",
        },
        {
          userName: "임재훈",
          content: "가격대는 조금 있지만 만족도는 높아요.",
          imgUrl: "https://picsum.photos/seed/review10/200",
          stars: 4.7,
          tagList: ["고급스러워요", "만족도 높아요"],
          createAt: "2025-05-14",
        },
      ],
    },
  ],
};
