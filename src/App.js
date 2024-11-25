import { Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/home/MainPage';
import LoginPage from './pages/login/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import BoardPage from './pages/board/BoardPage';
import BoardPostPage from './pages/board/BoardPostPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import MyPage from './pages/mypage/MyPage';
import ChatPage from './chat/ChatPage';
import BoardUpdatePage from './pages/board/BoardUpdatePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/board" element={<BoardPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/boardPost" element={<BoardPostPage />} />
      <Route path="/boardDetail/:id" element={<BoardDetailPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/boardUpdate" element={<BoardUpdatePage />} />
    </Routes>
  );
}

export default App;
