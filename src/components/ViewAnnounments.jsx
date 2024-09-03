import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from './viewannounment.module.css';
import { useNavigate } from "react-router-dom";

export default function ViewAnnounments() {
  const announmentCollection = collection(db, "Event");
  const [announmentList, setAnnounmentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAnnounmentList = async () => {
      try {
        const data = await getDocs(announmentCollection);
        const announments = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          showDetails: false,
        }));
        setAnnounmentList(announments);
        console.log("announments fetched:", announments);
      } catch (err) {
        console.error("Error fetching announments:", err);
      }
    };

    getAnnounmentList();
  }, []);

  const toggleDetails = (id) => {
    setAnnounmentList((prevList) =>
      prevList.map((announment) =>
        announment.id === id
          ? { ...announment, showDetails: !announment.showDetails }
          : announment
      )
    );
  };

  const onRegister = () => {
    navigate("/join-event");
  };

  return (
    <div className={styles.announmentList}>
      {announmentList.map((announment) => (
        <div
          key={announment.id}
          className={`${styles.announment} ${announment.showDetails ? styles.expanded : ''}`}
          onClick={() => toggleDetails(announment.id)}
        >
          {announment.image && (
            <img
              src={announment.image}
              alt={`${announment.title} image`}
              className={styles.announmentImage}
            />
          )}
          <div className={styles.announmentTitle}>
            <h2>{announment.title}</h2>
          </div>
          <div className={`${styles.announmentDetails} ${announment.showDetails ? styles.show : ''}`}>
            <h3>Description:</h3>
            <p>{announment.description}</p>
            <h3>Event Date:</h3>
            <p>{announment.date}</p>
            <h3>Venue:</h3>
            <p>{announment.venue}</p>
            <h3>Added By:</h3>
            <p>{announment.role} - {announment.name}</p>
            <button className={styles.b1} onClick={onRegister}>Register</button>
          </div>
        </div>
      ))}
    </div>
  );
}
