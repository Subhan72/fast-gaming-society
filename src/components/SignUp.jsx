import { useEffect } from "react";
import { getDocs } from "firebase/firestore";

// Your existing imports
import styles from "./signup.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase"; 
import logo from "../images/logo.png";
import Footer from "./Footer";

export default function SignUp({ auth }) {
  const navigate = useNavigate();
  const registrationCollection = collection(db, "Registrations");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [teamOptions, setTeamOptions] = useState([]); // For storing team names
  const [errors, setErrors] = useState({});

  // Fetch team names from "Teams" collection
  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, "Teams");
      const teamSnapshot = await getDocs(teamsCollection);
      const teams = teamSnapshot.docs.map(doc => doc.data().name);
      setTeamOptions(teams);
    };

    fetchTeams();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid.";
    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!role) newErrors.role = "Role is required.";
    if ((role === "Team Leader" || role === "Team Member") && !team.trim())
      newErrors.team = "Team is required for Team Leader and Team Member.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await addDoc(registrationCollection, {
        uid: user.uid, 
        name: name,
        email: email,
        role: role,
        status: false,
        team: role === "Team Leader" || role === "Team Member" ? team : "",
      });

      navigate("/login");
    } catch (err) {
      if (err.code) {
        switch (err.code) {
          case "auth/email-already-in-use":
            alert("The email address is already in use by another account.");
            break;
          case "auth/invalid-email":
            alert("The email address is not valid.");
            break;
          case "auth/operation-not-allowed":
            alert("Operation not allowed. Please contact support.");
            break;
          case "auth/weak-password":
            alert("The password is too weak.");
            break;
          default:
            alert(
              "Error creating account. Please check your input and try again."
            );
            break;
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Error creating account:", err);
    }
  };

  const isTeamRequired = role === "Team Leader" || role === "Team Member";

  return (
    <div className={styles.signupContainer}>
      <header className={styles.header}>
        <img
          src={logo}
          alt="Fast Gaming Society Logo"
          className={styles.logo}
        />
        <nav className={styles.nav}>
          <h1>Fast Gaming Society</h1>
        </nav>
      </header>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <img
            src={logo}
            alt="Fast Gaming Society Logo"
            className={styles.logoLarge}
          />
          <h1>Fast Gaming Society</h1>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Enter your Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? styles.errorInput : ""}
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name}</p>
            )}

            <input
              type="email"
              placeholder="Enter your Email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? styles.errorInput : ""}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email}</p>
            )}

            <input
              type="password"
              placeholder="Enter your Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? styles.errorInput : ""}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password}</p>
            )}

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={errors.role ? styles.errorInput : ""}
            >
              <option value="" disabled>
                Select your Role
              </option>
              <option value="Mentor">Mentor</option>
              <option value="President">President</option>
              <option value="Team Leader">Team Leader</option>
              <option value="Team Member">Team Member</option>
            </select>
            {errors.role && (
              <p className={styles.errorMessage}>{errors.role}</p>
            )}

            {isTeamRequired && (
              <>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className={errors.team ? styles.errorInput : ""}
                >
                  <option value="" disabled>
                    Select your Team
                  </option>
                  {teamOptions.map((teamName, index) => (
                    <option key={index} value={teamName}>
                      {teamName}
                    </option>
                  ))}
                </select>
                {errors.team && (
                  <p className={styles.errorMessage}>{errors.team}</p>
                )}
              </>
            )}

            <button type="submit">Sign Up</button>
          </form>
          <div className={styles.loginSection}>
            <h2>If you already have an account</h2>
            <Link to="/login" className={styles.loginLink}>
              Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
