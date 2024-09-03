import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";
import Footer from "./Footer";
import ViewAnnounments from "./ViewAnnounments";
import Header from "./Header";
import HeaderLogin from "./HeaderLogin";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardMentor({ auth }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleActionClick = (event) => {
    if (!user) {
      event.preventDefault();
      setError("You need to sign in to access these features.");
    }
  };

  return (
    <div className={styles.dashboard}>
      {user ? <HeaderLogin auth={auth} /> : <Header />}
      <div className={styles.main}>
        <img
          src="src/images/dashboard-background-3.jpg"
          alt="Background"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          {error && (
            <div className={styles.errorContainer}>
              <h2 className={styles.errorMessage}>{error}</h2>
            </div>
          )}
          <div className={styles.buttonContainer}>
            <Link
              to="/approve-event"
              className={styles.roundButton}
              onClick={handleActionClick}
            >
              Create/Approve Events
            </Link>
            <Link
              to="/appoint-president"
              className={styles.roundButton}
              onClick={handleActionClick}
            >
              Appoint President
            </Link>
            <Link
              to="/executive"
              className={styles.roundButton}
              onClick={handleActionClick}
            >
              Executive Body
            </Link>
          </div>
          <h1>Upcoming Events</h1>
          <ViewAnnounments />
        </div>
      </div>
      <Footer />
    </div>
  );
}
