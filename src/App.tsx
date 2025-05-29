import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Courses from "./courses_page/Courses";
import "./global.css";
import HeaderLayout from "./layouts/HeaderLayout";
import Profile from "./profile_page/Profile";

const App = () => (
  <Routes>
    <Route element={<HeaderLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Routes>
);

export default App;
