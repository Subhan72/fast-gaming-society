import React from "react";
import styles from "./footer.module.css";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className={styles.footer}>
      <Link to="/about" className={styles.footerLink}>
          About
      </Link>
    </footer>
  );
}
