import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./global.css";
import HeaderLayout from "./layouts/HeaderLayout";
import SignupLayout from "./layouts/SignupLayout";
import Signup from "./signup/Signup";

const App = () => (
  <Routes>
    <Route element={<HeaderLayout />}>
      <Route path="/" element={<Home />} />
    </Route>
    <Route element={<SignupLayout />}>
      <Route path="/signup" element={<Signup />} />
    </Route>
  </Routes>
);

export default App;
