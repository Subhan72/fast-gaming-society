import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import styles from './viewtask.module.css';
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer.jsx";

export default function TaskList({ team }) {
  const taskCollection = collection(db, "Task");
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    const getTaskList = async () => {
      try {
        const data = await getDocs(taskCollection);
        const tasks = data.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((task) => task.team === team);
        setTaskList(tasks);
        console.log("Tasks fetched:", tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    getTaskList();
  }, [team]);

  const updateStatus = async (id, status) => {
    try {
      const taskDoc = doc(db, "Task", id);
      await updateDoc(taskDoc, { status });
      const data = await getDocs(taskCollection);
      const tasks = data.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .filter((task) => task.team === team);
      setTaskList(tasks);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <HeaderLogin />
      <div className={styles.taskList}>
        <img
          src="src/images/view-task.jpg"
          alt="Background"
          className={styles.backgroundImage}
        />
        {taskList.length === 0 ? (
          <div className={styles.noTaskMessage}>
            No tasks assigned to this team.
          </div>
        ) : (
          taskList.map((task) => (
            <div key={task.id} className={styles.task}>
              <div className={styles.taskDetails}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p><strong>Required Date: </strong>{task.date}</p>
                <p>{task.status}</p>
              </div>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={task.status === "completed"}
                onChange={(e) => updateStatus(task.id, e.target.checked ? "completed" : "pending")}
              />
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}
