import React, { useEffect, useState } from 'react';
import styles from './aboutpage.module.css';
import logo from "../images/logo.png";
import Footer from "./Footer";
import HeaderLogin from "./HeaderLogin";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../config/firebase";

const AboutPage = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, 'Teams');
      const teamsSnapshot = await getDocs(teamsCollection);
      const teamsList = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsList);
    };

    fetchTeams();
  }, []);

  return (
    <div className={styles.container}>
      <HeaderLogin />
      <main className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <img src={logo} alt="Society Logo" className={styles.logoLarge} />
        </div>
        <div className={styles.rightPanel}>
          <h1 className={styles.title}>About Us</h1>
          <p className={styles.description}>
            The Fast Gaming Society (F.G.S) at FAST-NUCES Islamabad promotes gaming as a skill through tournaments, technical workshops, and coaching sessions. It provides resources for students to develop and utilize their gaming skills in a competitive environment.
          </p>
          <h2 className={styles.subtitle}>Our Team</h2>
          {teams.map(team => (
            <div key={team.id} className={styles.teamSection}>
              <h3 className={styles.teamName}>{team.name}</h3>
              <div className={styles.teamLeader}>
                <p>Team Leader: {team.leaderName}</p>
              </div>
              {team.members.map(member => (
                <div key={member.email} className={styles.teamMember}>
                  <p>Member: {member.name}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
