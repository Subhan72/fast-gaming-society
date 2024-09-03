// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import logo from "../images/logo.png";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div>
          <h1 className={styles.title}>Fast Gaming Society</h1>
          <h3 className={styles.subtitle}>The Ultimate Gaming Experience</h3>
        </div>
      </div>
      <nav className={styles.nav}>
        <Link to="/register" className={styles.navLink}>
          Register
        </Link>
        <Link to="/login" className={styles.navLink}>
          Sign In
        </Link>
      </nav>
    </header>
  );
};

export default Header;
