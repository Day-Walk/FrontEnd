import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./global.css";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
);

export default App;
