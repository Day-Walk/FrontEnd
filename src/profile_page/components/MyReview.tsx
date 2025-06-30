import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import MyReviewComp from "./MyReviewComp";
import { api } from "../../utils/api";
import { Loading1 } from "../../loading/Loading";
import { useUserStore } from "../../zustand/useUserStore";

const MyReview = () => {
  const [ReviewListResponse, setReviewListResponse] =
    useState<Interfaces.ReviewListResponse>();

  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [reviewPage, setReviewPage] = useState<Interfaces.ReviewPage>();
  // ReviewListResponse.reviewList[nowPage - 1],

  const userIdState = useUserStore((state) => state.userId);

  const [deleted, setDeleted] = useState<string>("");

  const handleDelete = (deletedId: string) => {
    setDeleted(deletedId);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<Interfaces.ReviewListResponse>(
          `/review/all/user?userId=${userIdState}`,
        );
        setReviewListResponse(response.data);
        setReviewPage(response.data.reviewList[nowPage - 1]);
        setLoading(false);
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

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 20,
        }}
      >
        <Loading1 />
      </div>
    );
  }

  return (
    <div className={style.courseWrapper}>
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
