import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Courses from "./courses/Courses";
import "./global.css";
import HeaderLayout from "./layouts/HeaderLayout";

const App = () => (
  <Routes>
    <Route element={<HeaderLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
    </Route>
  </Routes>
);

export default App;
