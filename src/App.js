import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/home/MainPage";
import LoginPage from "./pages/login/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import BoardPage from "./pages/board/BoardPage";
import ChatPage from "./chat/ChatPage";
import BoardPostPage from "./pages/board/BoardPostPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/board" element={<BoardPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/boardPost" element={<BoardPostPage />} />
    </Routes>
  );
}

export default App;
