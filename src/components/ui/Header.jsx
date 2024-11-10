import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
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
        <Link to="/login">
          <Button variant="outline-light" className={styles.login_btn}>
            Login
          </Button>{' '}
        </Link>
      </div>
    </div>
  );
};

export default Header;
