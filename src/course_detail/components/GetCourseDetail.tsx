import axios from "axios";
import { useEffect, useState } from "react";
import { CourseDetailResponse } from "../interfaces/Interface";

const GetCourseDetail = (courseId: string) => {
  const [data, setData] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get<CourseDetailResponse>(
          `/api/course?courseId=${courseId}`,
        );
        setData(response.data);
      } catch (err) {
        setError("코스 정보를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  return { data, loading, error };
};

export default GetCourseDetail;
