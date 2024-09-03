import React from "react";
import { Link } from "react-router-dom";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Fast Gaming Society</h1>
        <h3>The Ulimate Gaming Experience</h3>
        <nav className={styles.nav}>
          <Link to="/teams" className={styles.navLink}>
            Teams
          </Link>
          <Link to="/registrations" className={styles.navLink}>
            Registrations
          </Link>
          <Link to="/members" className={styles.navLink}>
            Current Members
          </Link>
        </nav>
      </header>
      <div className={styles.main}>
        <img
          src="src/images/dashboard-background-3.jpg"
          alt="Background"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}></div>
        <div className={styles.buttonContainer}>
          <Link to="/add-events" className={styles.roundButton}>
            <span className={styles.plusSign}>+</span>
            Add Events
          </Link>
          <Link to="/add-onestop-request" className={styles.roundButton}>
            <span className={styles.plusSign}>+</span>
            Add OneStop Request
          </Link>
          <Link to="/add-announcement" className={styles.roundButton}>
            <span className={styles.plusSign}>+</span>
            Add Announcement
          </Link>
        </div>
      </div>
    </div>
  );
}
