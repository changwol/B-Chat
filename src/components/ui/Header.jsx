import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('Authorization');

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.logo_section}>
          <Link to="/">
            <Button variant="outline-light" className={styles.main_logo}>
              Main
            </Button>
          </Link>
        </div>
        {token != null ? (
          <Link to="/mypage">
            <Button variant="outline-light" className={styles.myPage_btn}>
              My Page
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="outline-light" className={styles.login_btn}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
