import { Routes, Route } from "react-router-dom";

import Courses from "./courses_page/Courses";
import "./global.css";
import HeaderLayout from "./layouts/HeaderLayout";
import Profile from "./profile_page/Profile";
import SignupLayout from "./layouts/SignupLayout";
import Signup from "./signup/pages/Signup";
import UserLike from "./signup/pages/UserLike";
import CourseDetail from "./course_detail/CourseDetail";
import Chatbot from "./chatbot/Chatbot";
import Search from "./search_page/Search";
import CongestionMap from "./congestion/CongestionMap";
import ReviewForm from "./review_form/ReviewForm";
import Login from "./signup/pages/Login";
import KakaoCallback from "./signup/pages/KakaoCallback";

const App = () => (
  <Routes>
    <Route element={<HeaderLayout />}>
      <Route path="/" element={<Courses />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/search" element={<Search />} />
      <Route path="/congestion" element={<CongestionMap />} />
      <Route path="/review/:placeId" element={<ReviewForm />} />
    </Route>
    <Route element={<SignupLayout />}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/user-like" element={<UserLike />} />
    </Route>
    <Route path="login" element={<Login />} />
    <Route path="/auth/kakao-callback" element={<KakaoCallback />} />
  </Routes>
);

export default App;
