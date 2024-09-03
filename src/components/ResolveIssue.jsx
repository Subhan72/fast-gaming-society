import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import styles from "./resolveissue.module.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import HeaderLogin from "./HeaderLogin";

const ResolveIssue = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [handlingText, setHandlingText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      const issueCollection = collection(db, "Issues");
      const issueSnapshot = await getDocs(issueCollection);
      const issueList = issueSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const unresolvedIssues = issueList.filter((issue) => !issue.status);
      setIssues(unresolvedIssues);
    };

    fetchIssues();
  }, []);

  const handleSelectIssue = (issueId) => {
    setSelectedIssueId(issueId);
  };

  const handleSubmitHandling = async (e) => {
    e.preventDefault();
    if (!handlingText.trim()) {
      setError("Handling text is required.");
      return;
    }

    if (!selectedIssueId) {
      setError("No issue selected.");
      return;
    }

    const issue = issues.find((issue) => issue.id === selectedIssueId);
    if (issue && issue.status === true) {
      setError("This issue is already resolved.");
      return;
    }

    try {
      const issueDoc = doc(db, "Issues", selectedIssueId);
      await updateDoc(issueDoc, {
        resolve: handlingText,
        status: true,
      });

      setHandlingText("");
      setSelectedIssueId(null);
      alert("Issue handled successfully!");
      navigate("/dashboard-leader");
    } catch (err) {
      console.error("Error handling issue:", err);
      setError("Error handling issue. Please try again.");
    }
  };

  return (
    <div className={styles.approvalContainer}>
      <HeaderLogin />
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <h2>Issues</h2>
          <div className={styles.approvalList}>
            {issues.map((issue) => (
              <div key={issue.id} className={styles.approval}>
                <div className={styles.approvalDetails}>
                  <h3>{issue.title}</h3>
                  <p>
                    <strong>Description: </strong>
                    {issue.description}
                  </p>
                </div>
                <input
                  type="checkbox"
                  onChange={() => handleSelectIssue(issue.id)}
                  checked={selectedIssueId === issue.id}
                  className={styles.checkbox}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={handleSubmitHandling}>
            <h2>Handle Issue</h2>
            {error && <p className={styles.error}>{error}</p>}
            <textarea
              placeholder="Enter handling text..."
              value={handlingText}
              onChange={(e) => setHandlingText(e.target.value)}
              required
              rows="4"
              className={styles.textarea}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResolveIssue;
