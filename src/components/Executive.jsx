import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import teamStyles from "./executive.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";

const Executive = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const teamCollection = collection(db, "Teams");
      const teamSnapshot = await getDocs(teamCollection);
      const teamData = teamSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(teamData);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams(); 
  }, []);

  const handleAddTeam = async () => {
    if (newTeam.trim()) {
      try {
        await addDoc(collection(db, "Teams"), {
          name: newTeam,
          leader: { name: "", email: "" },
          members: []
        });
        setShowPopup(false);
        setNewTeam("");
        alert("New team added successfully!");
        fetchTeams();
        navigate("/dashboard-mentor"); 
      } catch (error) {
        console.error("Error adding team:", error);
      }
    } else {
      alert("Please enter a valid team name.");
    }
  };

  return (
    <div className={teamStyles.teamContainer}>
      <HeaderLogin />
      <div className={teamStyles.mainContent}>
        <div className={teamStyles.leftPanel}>
          <h2>Team Management</h2>
          <div className={teamStyles.teamList}>
            {teams.length > 0 ? (
              teams.map((team, index) => (
                <div key={index} className={teamStyles.team}>
                  <h3>{team.name}</h3>
                  <p>
                    <strong>Leader: </strong>
                    {team.leader.name ? `${team.leader.name} (${team.leader.email})` : "No leader assigned"}
                  </p>
                  <p>
                    <strong>Members: </strong>
                    {team.members.length > 0
                      ? team.members.map((member, index) => (
                          <span key={index}>{member.name} ({member.email}){index < team.members.length - 1 ? ', ' : ''}</span>
                        ))
                      : "No members"}
                  </p>
                </div>
              ))
            ) : (
              <p>No teams to display</p>
            )}
          </div>
          <button
            className={teamStyles.addButton}
            onClick={() => setShowPopup(true)}
          >
            Add New Team
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={teamStyles.popup}>
          <div className={teamStyles.popupContent}>
            <h3>Add New Team</h3>
            <input
              type="text"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="Enter team name"
              className={teamStyles.inputField}
            />
            <div className={teamStyles.popupActions}>
              <button className={teamStyles.saveButton} onClick={handleAddTeam}>
                Save
              </button>
              <button
                className={teamStyles.cancelButton}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New buttons for navigation */}
      <div className={teamStyles.buttonContainer}>
        <button className={teamStyles.navButton} onClick={() => navigate("/appoint-leader")}>
          Appoint Leader
        </button>
        <button className={teamStyles.navButton} onClick={() => navigate("/appoint-president")}>
          Appoint President
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Executive;
