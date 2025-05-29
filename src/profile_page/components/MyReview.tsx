import { useEffect, useState } from "react";
import style from "../Profile.module.css";
import * as Interfaces from "../interfaces/Interfaces";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import MyReviewComp from "./MyReviewComp";

const MyReview = () => {
  const [ReviewListResponse, setReviewListResponse] =
    useState<Interfaces.ReviewListResponse>(Interfaces.dummyReviewList);

  const [loading, setLoading] = useState<boolean>(true);
  const [nowPage, setNowPage] = useState<number>(1);
  const [reviewPage, setReviewPage] = useState<Interfaces.ReviewPage>(
    ReviewListResponse.reviewList[nowPage - 1],
  );

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setNowPage(value);
    setReviewPage(ReviewListResponse.reviewList[value - 1]);
  };

  useEffect(() => {
    console.log(nowPage, "coursePage", reviewPage);
  }, [nowPage, reviewPage]);

  return (
    <div className={style.courseWrapper}>
      <div className={style.subTitle}>내가 쓴 리뷰</div>
      <div>
        {reviewPage &&
          reviewPage.page.map((r, i) => (
            <div key={r.placeName}>
              <MyReviewComp {...r} />
            </div>
          ))}
      </div>
      <div className={style.paginationWrapper}>
        <Stack spacing={2}>
          <Pagination
            count={ReviewListResponse.reviewList.length}
            page={nowPage}
            onChange={handleChangePage}
          />
        </Stack>
      </div>
    </div>
  );
};
export default MyReview;
