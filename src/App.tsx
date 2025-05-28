import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Courses from "./courses/Courses";
import "./global.css";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/courses" element={<Courses />} />
  </Routes>
);

export default App;
