import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import eventStyles from "./eventregistrations.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";

const EventRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventMap, setEventMap] = useState(new Map());

  const fetchEventApplications = async () => {
    try {
      const eventCollection = collection(db, "EventApplications");
      const eventSnapshot = await getDocs(eventCollection);
      const eventData = eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Aggregate events by name and count registrations
      const eventAggregator = new Map();
      eventData.forEach((doc) => {
        const { eventName, name, email } = doc;
        if (!eventAggregator.has(eventName)) {
          eventAggregator.set(eventName, { count: 0, participants: [] });
        }
        const eventEntry = eventAggregator.get(eventName);
        eventEntry.count += 1;
        eventEntry.participants.push({ name, email });
      });

      // Convert map to array
      const aggregatedEvents = Array.from(eventAggregator, ([eventName, { count, participants }]) => ({
        eventName,
        registrations: count,
        participants,
      }));

      setEvents(aggregatedEvents);
      setEventMap(eventAggregator);
    } catch (error) {
      console.error("Error fetching event applications:", error);
    }
  };

  useEffect(() => {
    fetchEventApplications();
  }, []);

  const handleEventClick = (eventName) => {
    setSelectedEvent(eventMap.get(eventName));
  };

  return (
    <div className={eventStyles.eventContainer}>
      <HeaderLogin />
      <div className={eventStyles.mainContent}>
        <div className={eventStyles.eventList}>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={index}
                className={`${eventStyles.eventItem} ${selectedEvent?.eventName === event.eventName ? eventStyles.active : ""}`}
                onClick={() => handleEventClick(event.eventName)}
              >
                <h3>{event.eventName}</h3>
                <p>
                  <strong>Registrations: </strong>
                  {event.registrations}
                </p>
              </div>
            ))
          ) : (
            <p>No events to display</p>
          )}
        </div>

        {selectedEvent && (
          <div className={eventStyles.eventDetails}>
            <h3>{selectedEvent.eventName} - Registered Participants</h3>
            {selectedEvent.participants.length > 0 ? (
              selectedEvent.participants.map((participant, index) => (
                <p key={index}>
                  <strong>{participant.name}</strong> ({participant.email})
                </p>
              ))
            ) : (
              <p>No participants registered</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventRegistrations;
