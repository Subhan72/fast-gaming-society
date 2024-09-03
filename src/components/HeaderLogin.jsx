import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./headerlogin.module.css";
import logo from "../images/logo.png";
import userIcon from "../images/user-icon.png";
import { signOut } from "firebase/auth";

const HeaderLogin = ({ auth }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate('/dashboard-member'); 
    } catch (err) {
      console.log(err);
    }
  };

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
        <Link to="/upload-image" className={styles.navLink}>
          Gallery
        </Link>
        <div className={styles.userIconContainer} onClick={toggleDropdown}>
          <img src={userIcon} alt="User Icon" className={styles.userIcon} />
          {dropdownVisible && (
            <div className={styles.dropdownMenu}>
              <button onClick={logOut} className={styles.dropdownItem}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default HeaderLogin;
