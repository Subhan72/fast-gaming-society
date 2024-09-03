import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import styles from "./approval.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Approval = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({
    id: "",
    title: "",
    description: "",
    venue: "",
    date: "",
    budget: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    const fetchRequests = async () => {
      const requestCollection = collection(db, "EventRequest");
      const requestSnapshot = await getDocs(requestCollection);
      const requestList = requestSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((event) => !event.approve);
      setRequests(requestList);
    };

    fetchRequests();
  }, []);

  const handleApproval = async (event) => {
    setSelectedEvent(event);
    try {
      await updateDoc(doc(db, "EventRequest", event.id), { approve: true });
      const requestCollection = collection(db, "EventRequest");
      const requestSnapshot = await getDocs(requestCollection);
      const requestList = requestSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((event) => !event.approve);
      setRequests(requestList);
    } catch (err) {
      console.error("Error updating approval status:", err);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      const eventCollection = collection(db, "Event");
      await addDoc(eventCollection, selectedEvent);

      setSelectedEvent({
        id: "",
        title: "",
        description: "",
        venue: "",
        date: "",
        budget: "",
        price: "",
        image: "",
      });

      const requestCollection = collection(db, "EventRequest");
      const requestSnapshot = await getDocs(requestCollection);
      const requestList = requestSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((event) => !event.approve);
      setRequests(requestList);

      navigate("/dashboard-president");
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "EventRequest", id));
      setRequests((prevRequests) => prevRequests.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  return (
    <div className={styles.approvalContainer}>
      <HeaderLogin />
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <h2>Pending Event Requests</h2>
          <div className={styles.approvalList}>
            {requests.map((event) => (
              <div key={event.id} className={styles.approval}>
                <div className={styles.approvalDetails}>
                  <h3>{event.title}</h3>
                  <p>
                    <strong>Description: </strong>
                    {event.description}
                  </p>
                  <p>
                    <strong>Date: </strong>
                    {event.date}
                  </p>
                  <p>
                    <strong>Venue: </strong>
                    {event.venue}
                  </p>
                  <p>
                    <strong>Budget: </strong>
                    {event.budget}
                  </p>
                  <p>
                    <strong>Added By: </strong>
                    {event.name}
                  </p>
                  <p>
                    <strong>Role: </strong>
                    {event.role}
                  </p>
                </div>
                <div className={styles.approvalActions}>
                  <h4>Approval:</h4>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    onChange={() => handleApproval(event)}
                    checked={selectedEvent.id === event.id}
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <h2>Approved Event</h2>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSaveEvent}>
              <input
                type="text"
                placeholder="Title"
                value={selectedEvent.title}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={selectedEvent.description}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="Venue"
                value={selectedEvent.venue}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, venue: e.target.value })
                }
                required
              />
              <input
                type="date"
                placeholder="Date"
                value={selectedEvent.date}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, date: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Budget"
                value={selectedEvent.budget}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, budget: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Price"
                value={selectedEvent.price}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, price: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Image"
                value={selectedEvent.image}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, image: e.target.value })
                }
                required
              />
              <button type="submit">Save Event</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Approval;
