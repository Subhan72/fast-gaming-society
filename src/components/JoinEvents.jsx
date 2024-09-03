import React, { useRef, useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import styles from './joinevent.module.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const JoinEvents = () => {
  const form = useRef();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("Your registration for the tournament has been confirmed. We will message you shortly!!");
  const [application, setApplication] = useState({
    name: '',
    email: '',
    paymentMethod: 'cash',
    eventId: '',
    eventName: '',
    eventDescription: '',
    eventVenue: '',
    eventDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const eventCollection = collection(db, 'Event');
      const eventSnapshot = await getDocs(eventCollection);
      const eventList = eventSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  const handleJoinEvent = (event) => {
    setApplication({
      ...application,
      eventId: event.id,
      eventName: event.title,
      eventDescription: event.description,
      eventVenue: event.venue,
      eventDate: event.date,
    });
  };

  const validateForm = () => {
    if (!application.name) {
      setError('Applicant name is required.');
      return false;
    }
    if (!application.email) {
      setError('Email is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(application.email)) {
      setError('Email address is invalid.');
      return false;
    }
    if (!application.eventId) {
      setError('Please select an event to join.');
      return false;
    }
    setError('');
    return true;
  };

  const sendEmail = () => {

    emailjs
      .sendForm("service_knnhxz9", "template_djbavuw", form.current, "eY-nf6zG8F1_3rJ6_")
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const applicationCollection = collection(db, 'EventApplications');
      await addDoc(applicationCollection, application);
      sendEmail()
      setApplication({
        name: '',
        email: '',
        paymentMethod: 'cash',
        eventId: '',
        eventName: '',
        eventDescription: '',
        eventVenue: '',
        eventDate: '',
      });
      alert(`Thank you ${application.name} for registering for the tournament! You have successfully applied for the event "${application.eventName}" on ${application.eventDate}. We will contact you shortly with more details.`);
      navigate("/dashboard-member");
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Error submitting application. Please try again.');
    }
  };

  return (
    <div className={styles.approvalContainer}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <h2>Available Events</h2>
          <div className={styles.approvalList}>
            {events.map(event => (
              <div key={event.id} className={styles.approval}>
                <div className={styles.approvalDetails}>
                  <h3>{event.title}</h3>
                  <p><strong>Description: </strong>{event.description}</p>
                  <p><strong>Date: </strong>{event.date}</p>
                  <p><strong>Venue: </strong>{event.venue}</p>
                  <p><strong>Ticket Price: </strong>{event.price}</p>
                </div>
                <input
                  type="checkbox"
                  onChange={() => handleJoinEvent(event)}
                  checked={application.eventId === event.id}
                  className={styles.checkbox}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <form ref={form} className={styles.form} onSubmit={handleSubmitApplication}>
            <h2>Event Application</h2>
            {error && <p className={styles.error}>{error}</p>}
            <input
              type="text"
              placeholder="Applicant Name"
              name="user_name"
              value={application.name}
              onChange={(e) => setApplication({ ...application, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="recipient_email"
              value={application.email}
              onChange={(e) => setApplication({ ...application, email: e.target.value })}
              required
            />
            <select
              value={application.paymentMethod}
              name="message"
              onChange={(e) => {
                setApplication({ ...application, paymentMethod: e.target.value });
                setMessage("Your registration for the tournament has been confirmed. We will message you shortly!!");
              }}
              required
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
            <button type="submit">Submit Application</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinEvents;
