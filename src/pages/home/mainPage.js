import React from "react";
import Header from "../../components/ui/Header";
import styles from "./MainPage.module.css";
import boardImg from "../../../src/assets/boardIcon.png";
import chatImg from "../../../src/assets/chatIcon.png";
import Fade from "react-bootstrap/Fade";
import { Link } from "react-router-dom";
const fade = true;
const MainPage = () => {
  return (
    <div>
      <Header />

      <div className={styles.welcomeContainer}>
        <h1 className={styles.welcome}>welcome!</h1>
      </div>
      <Fade appear={fade} in={fade} timeout={3000000}>
        <div className={styles.iconContainer}>
          <Link to="/board" style={{ textDecoration: "none", color: "black" }}>
            <div className={styles.iconContainerWithWord}>
              <img src={boardImg} className={styles.img}></img>
              <p className={styles.word}>board</p>
            </div>
          </Link>
          <div className={styles.iconContainerWithWord}>
            <Link to="/chat" style={{ textDecoration: "none", color: "black" }}>
              <img src={chatImg} className={styles.img}></img>
              <p className={styles.word}>chat</p>
            </Link>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default MainPage;
