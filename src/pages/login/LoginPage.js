import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import Header from "../../components/ui/Header";
import axios from "axios";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [userPassWord, setUserPassWord] = useState("");
  const baseUrl = "http://localhost:8080";
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(baseUrl + "/member/login", {
        userId,
        userPassWord,
      });
      localStorage.setItem("Authorization", "Bearer " + response.data);
      alert("로그인 하였습니다.");
      console.log(localStorage.getItem("Authorization"));
      // 로그인 성공 시 처리할 로직 추가
      navigate("/");
    } catch (error) {
      alert("ID 와 비밀번호를 다시한번 체크해주세요.");
      console.error("로그인 실패:", error);
      // 로그인 실패 시 처리할 로직 추가
    }
  };

  const singUp = () => {
    navigate("/signUp");
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} className={styles.input} />
          <input type="password" placeholder="PassWord" value={userPassWord} onChange={(e) => setUserPassWord(e.target.value)} className={styles.input} />
          <button type="submit" className={styles.button}>
            Login
          </button>
          <button onClick={singUp} className={styles.button}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
