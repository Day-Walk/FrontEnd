import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import MyReviewComp from "./MyReviewComp";
import { useRecoilValue } from "recoil";
import { userId } from "../../recoil/userInfo";
import { api } from "../../utils/api";

const MyReview = () => {
  const [ReviewListResponse, setReviewListResponse] =
    useState<Interfaces.ReviewListResponse>();

  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [reviewPage, setReviewPage] = useState<Interfaces.ReviewPage>();
  // ReviewListResponse.reviewList[nowPage - 1],

  const userIdState = useRecoilValue(userId);
  const token = localStorage.getItem("accessToken");

  const [deleted, setDeleted] = useState<string>("");

  const handleDelete = (deletedId: string) => {
    setDeleted(deletedId);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("userIdState", userIdState);
      try {
        const response = await api.get<Interfaces.ReviewListResponse>(
          `/review/all/user?userId=${userIdState}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setReviewListResponse(response.data);
        setReviewPage(response.data.reviewList[nowPage - 1]);
        setLoading(false);
        console.log("Fetched courses:", response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [deleted]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    setReviewPage(ReviewListResponse?.reviewList[value - 1]);
  };

  useEffect(() => {
    console.log(nowPage, "coursePage", reviewPage);
  }, [nowPage, reviewPage]);

  return (
    <div className={style.courseWrapper}>
      <div className={style.subTitle}>내가 쓴 리뷰</div>
      {reviewPage ? (
        <>
          <div>
            {reviewPage &&
              reviewPage.page.map((r, i) => (
                <div key={r.placeName}>
                  <MyReviewComp
                    key={r.reviewId}
                    nowReview={r}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
          </div>
          <div className={style.paginationWrapper}>
            <Stack spacing={2}>
              <Pagination
                count={ReviewListResponse?.reviewList.length}
                page={nowPage}
                onChange={handleChangePage}
              />
            </Stack>
          </div>
        </>
      ) : (
        <div style={{ margin: "30px 10px", color: "#aaa" }}>
          내가 쓴 장소 리뷰가 아직 없어요. 😢
        </div>
      )}
    </div>
  );
};
export default MyReview;
