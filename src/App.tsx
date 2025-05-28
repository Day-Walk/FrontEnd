import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./global.css";
import HeaderLayout from "./layouts/HeaderLayout";

const App = () => (
  <Routes>
    <Route element={<HeaderLayout />}>
      <Route path="/" element={<Home />} />
    </Route>
  </Routes>
);

export default App;
