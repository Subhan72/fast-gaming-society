import { useState } from "react";
import styles from "./login.module.css";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { googleProvider } from "../config/firebase";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import logo from "../images/logo.png";
import Footer from "./Footer";

export default function Login({ setRole, setTeam }) {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [googleSignInError, setGoogleSignInError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link has been sent to your email");
      setForgotPasswordError("");
    } catch (err) {
      setForgotPasswordError("Error sending reset link. Please try again.");
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const q = query(collection(db, "Registrations"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();

        if (userDoc.status) {
          const role = userDoc.role;
          const team = userDoc.team;
          setRole(role);
          setTeam(team);

          switch (role) {
            case "President":
              navigate("/dashboard-president");
              break;
            case "Mentor":
              navigate("/dashboard-mentor");
              break;
            case "Team Leader":
              navigate("/dashboard-leader");
              break;
            case "Team Member":
              navigate("/dashboard-member");
              break;
            default:
              console.error("Unknown role:", role);
          }
        } else {
          setLoginError("Your account is not active. Please contact the administrator.");
        }
      } else {
        setLoginError("No matching document found. Please check your credentials.");
      }
    } catch (err) {
      setLoginError("Login failed. Please check your email and password.");
      console.error(err);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
      setGoogleSignInError("");
    } catch (err) {
      setGoogleSignInError("Google sign-in failed. Please try again.");
      console.log(err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <header className={styles.header}>
        <img src={logo} alt="Fast Gaming Society Logo" className={styles.logo} />
        <nav className={styles.nav}>
          <h1>Fast Gaming Society</h1>
        </nav>
      </header>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <img src={logo} alt="Fast Gaming Society Logo" className={styles.logoLarge} />
          <h1>Fast Gaming Society</h1>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <input
              type="email"
              placeholder="Enter your Email address..."
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your Password..."
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
            {loginError && <p className={styles.errorMessage}>{loginError}</p>}
          </form>
          <div className={styles.socialSection}>
            <button onClick={handleForgotPassword} className={styles.forgotPasswordButton}>
              Forgot Password
            </button>
            {forgotPasswordError && <p className={styles.errorMessage}>{forgotPasswordError}</p>}
            <h3>Or Sign In using</h3>
            <button onClick={handleSignInWithGoogle} className={styles.googleButton}>
              <img src="src/images/google-icon.png" alt="Google" className={styles.googleIcon} />
            </button>
            {googleSignInError && <p className={styles.errorMessage}>{googleSignInError}</p>}
          </div>
          <div className={styles.signUpSection}>
            <h3>Do not have an account yet?</h3>
            <Link to="/register" className={styles.signUpLink}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
