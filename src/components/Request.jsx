import styles from "./issues.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import logo from "../images/logo.png";
import Footer from "./Footer";
import HeaderLogin from "./HeaderLogin";

export default function Request() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const requestCollection = collection(db, "EventRequest");
  const navigate = useNavigate();

  const onSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      await addDoc(requestCollection, {
        title: title,
        description: description,
        date: date,
        venue: venue,
        budget: budget,
        image:image,
        name: name,
        role: role,
        approve: false
      });
      navigate("/dashboard-member");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.issueContainer}>
      <HeaderLogin />
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <img src={logo} alt="Fast Gaming Society Logo" className={styles.logoLarge} />
          <h1>Fast Gaming Society</h1>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={onSubmitRequest}>
            <h1>Request Event</h1>
            <input
              type="text"
              placeholder="Enter your Event Title..."
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter your event description..."
              onChange={(e) => setDescription(e.target.value)}
              required
              className={styles.description}
            />
            <input
              type="date"
              placeholder="Enter your preferred event date (yyyy-mm-dd)..."
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter your preferred event venue..."
              onChange={(e) => setVenue(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="What will be the budget for the event (in Rs)..."
              onChange={(e) => setBudget(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter image path..."
              onChange={(e) => setImage(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter your name..."
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter your role..."
              onChange={(e) => setRole(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
