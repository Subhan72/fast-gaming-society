import React, { useState, useEffect } from "react";
import { query, where,collection, getDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import leaderStyles from "./appointleader.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const AppointLeader = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantCollection = collection(db, "Registrations");
        const applicantSnapshot = await getDocs(applicantCollection);

        const applicantList = applicantSnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter(
            (applicant) => !applicant.status && applicant.role === "Team Leader"
          );

        const teamLeaders = applicantSnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter(
            (applicant) => applicant.status && applicant.role === "Team Leader"
          )
          .map((leader) => leader.team);

        const filteredApplicants = applicantList.filter(
          (applicant) => !teamLeaders.includes(applicant.team)
        );

        console.log(filteredApplicants);
        setApplicants(filteredApplicants);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  const handleAppoint = async (id, team, name, email) => {
    try {
      const q = query(collection(db, "Teams"), where("name", "==", team));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const teamDocRef = querySnapshot.docs[0].ref;
  
        await updateDoc(doc(db, "Registrations", id), { status: true });
  
        await updateDoc(teamDocRef, {
          leader: { name, email },
        });
  
        setApplicants((prevApplicants) =>
          prevApplicants.filter((applicant) => applicant.id !== id)
        );
        navigate("/dashboard-president");
      } else {
        console.error(`Team ${team} does not exist in the Teams collection.`);
        alert(`Team ${team} does not exist. Leader not appointed.`);
      }
    } catch (err) {
      console.error("Error appointing applicant:", err);
    }
  };

  return (
    <div className={leaderStyles.leaderContainer}>
      <HeaderLogin />
      <div className={leaderStyles.mainContent}>
        <div className={leaderStyles.leftPanel}>
          <h2>Team Leader Applicants</h2>
          <div className={leaderStyles.applicantList}>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div key={applicant.id} className={leaderStyles.applicant}>
                  <div className={leaderStyles.applicantDetails}>
                    <h3>{applicant.name}</h3>
                    <p>
                      <strong>Email: </strong>
                      {applicant.email}
                    </p>
                    <p>
                      <strong>Role: </strong>
                      {applicant.role}
                    </p>
                    <p>
                      <strong>Team: </strong>
                      {applicant.team}
                    </p>
                  </div>
                  <div className={leaderStyles.applicantActions}>
                    <button
                      className={leaderStyles.appointButton}
                      onClick={() =>
                        handleAppoint(
                          applicant.id,
                          applicant.team,
                          applicant.name,
                          applicant.email
                        )
                      }
                    >
                      Appoint Leader
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No applicants to display</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointLeader;
