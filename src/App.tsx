import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Courses from "./courses/Courses";
import "./global.css";
import HeaderLayout from "./layouts/HeaderLayout";
import SignupLayout from "./layouts/SignupLayout";
import Signup from "./signup/pages/Signup";
import UserLike from "./signup/pages/UserLike";

const App = () => (
  <Routes>
    <Route element={<HeaderLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
    </Route>
    <Route element={<SignupLayout />}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/user-like" element={<UserLike />} />
    </Route>
  </Routes>
);

export default App;
