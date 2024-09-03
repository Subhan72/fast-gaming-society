import styles from "./issues.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {  db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import logo from "../images/logo.png";
import Footer from "./Footer";
import HeaderLogin from "./HeaderLogin";

export default function Issues() {
  const issueCollection = collection(db, "Issues");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");

  const onSubmitIssue = async (e) => {
    e.preventDefault();
    try {
      await addDoc(issueCollection, {
        title: title,
        description: issue,
        status: false
      });
      navigate("/dashboard-member");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={styles.issueContainer}>
      <HeaderLogin/>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <img src={logo} alt="Fast Gaming Society Logo" className={styles.logoLarge} />
          <h1>Fast Gaming Society</h1>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={onSubmitIssue}>
            <h1>Enter Issue/Suggestion</h1>
            <input
              type="text"
              placeholder="Enter your Title..."
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter your Issue/Suggestion..."
              onChange={(e) => setIssue(e.target.value)}
              required
              className={styles.description}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
