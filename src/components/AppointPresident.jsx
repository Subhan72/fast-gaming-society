import React, { useState, useEffect } from "react";
import { query, where, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import presidentStyles from "./appointpresident.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const AppointPresident = () => {
  const [presidentExists, setPresidentExists] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const checkForPresident = async () => {
      try {
        const q = query(collection(db, "Registrations"), where("role", "==", "President"));
        const querySnapshot = await getDocs(q);
        const existingPresident = querySnapshot.docs.find(doc => doc.data().status === true);

        if (existingPresident) {
          setPresidentExists(true);
        } else {
          const applicantList = querySnapshot.docs
            .filter(doc => doc.data().status === false)
            .map(doc => ({ ...doc.data(), id: doc.id }));
          setApplicants(applicantList);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    checkForPresident();
  }, []);

  const handleAppoint = async (id) => {
    try {
      await updateDoc(doc(db, "Registrations", id), { status: true });
      setApplicants(applicants.filter(applicant => applicant.id !== id));
      setPresidentExists(true);
      alert("President appointed successfully!");
      navigate("/dashboard-mentor");
    } catch (error) {
      console.error("Error appointing president:", error);
    }
  };

  return (
    <div className={presidentStyles.presidentContainer}>
      <HeaderLogin />
      <div className={presidentStyles.mainContent}>
        <div className={presidentStyles.leftPanel}>
          <h2>President Appointment</h2>
          {presidentExists ? (
            <p className={presidentStyles.notice}>The president is already appointed</p>
          ) : (
            <div className={presidentStyles.applicantList}>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <div key={applicant.id} className={presidentStyles.applicant}>
                    <div className={presidentStyles.applicantDetails}>
                      <h3>{applicant.name}</h3>
                      <p><strong>Email: </strong>{applicant.email}</p>
                      <p><strong>Role: </strong>{applicant.role}</p>
                    </div>
                    <div className={presidentStyles.applicantActions}>
                      <button
                        className={presidentStyles.appointButton}
                        onClick={() => handleAppoint(applicant.id)}
                      >
                        Appoint President
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No applicants to display</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointPresident;
