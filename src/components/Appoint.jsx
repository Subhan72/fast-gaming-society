import React, { useState, useEffect } from "react";
import { query, where, collection, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore"; // Import arrayUnion
import { db } from "../config/firebase";
import appointStyles from "./appoint.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";

const Appoint = ({ team }) => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantCollection = collection(db, "Registrations");
        const applicantSnapshot = await getDocs(applicantCollection);
        const applicantList = applicantSnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((applicant) => {
            return (
              applicant.team === team &&
              !applicant.status &&
              applicant.role === "Team Member"
            ); 
          });
        setApplicants(applicantList);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [team]);

  const handleAppoint = async (id, team, name, email) => {
    try {
      const q = query(collection(db, "Teams"), where("name", "==", team));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const teamDocRef = querySnapshot.docs[0].ref;
  
        await updateDoc(doc(db, "Registrations", id), { status: true });
  
        await updateDoc(teamDocRef, {
          members: arrayUnion({ name, email }), 
        });
  
        setApplicants((prevApplicants) =>
          prevApplicants.filter((applicant) => applicant.id !== id)
        );
        navigate("/dashboard-leader");
      } else {
        console.error(`Team ${team} does not exist in the Teams collection.`);
        alert(`Team ${team} does not exist. Member not appointed.`);
      }
    } catch (err) {
      console.error("Error appointing applicant:", err);
    }
  };

  return (
    <div className={appointStyles.appointContainer}>
      <HeaderLogin />
      <div className={appointStyles.mainContent}>
        <div className={appointStyles.leftPanel}>
          <h2>Team Applicants</h2>
          <div className={appointStyles.applicantList}>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div key={applicant.id} className={appointStyles.applicant}>
                  <div className={appointStyles.applicantDetails}>
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
                  <div className={appointStyles.applicantActions}>
                    <button
                      className={appointStyles.appointButton}
                      onClick={() =>
                        handleAppoint(
                          applicant.id,
                          applicant.team,
                          applicant.name,
                          applicant.email
                        )
                      }
                    >
                      Appoint
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No applicants to display</p>
            )}
          </div>
          <div className={appointStyles.linkContainer}>
            <Link
              to="/send-invitation"
              className={appointStyles.sendInvitationLink}
            >
              Send Invitation
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Appoint;
