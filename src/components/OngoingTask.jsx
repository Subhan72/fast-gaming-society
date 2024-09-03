import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import newStyles from "./ongoingtask.module.css";
import HeaderLogin from "./HeaderLogin";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const OngoingTask = ({ team }) => { // Accept team prop
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    status: "pending",
    team: team // Include team in selectedTask
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const taskCollection = collection(db, "Task");
      const taskSnapshot = await getDocs(taskCollection);
      const taskList = taskSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((task) => !task.completed);
      setTasks(taskList);
    };

    fetchTasks();
  }, []);

  const handleUpdate = (task) => {
    setSelectedTask(task);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask.id) {
        await updateDoc(doc(db, "Task", selectedTask.id), selectedTask);
      } else {
        const taskCollection = collection(db, "Task");
        await addDoc(taskCollection, selectedTask);
      }

      setSelectedTask({
        id: "",
        title: "",
        description: "",
        date: "",
        status: "pending",
        team: team // Reset team when adding new task
      });

      const taskCollection = collection(db, "Task");
      const taskSnapshot = await getDocs(taskCollection);
      const taskList = taskSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((task) => !task.completed);
      setTasks(taskList);

      navigate("/dashboard-leader");
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Task", id));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className={newStyles.ongoingTaskContainer}>
      <HeaderLogin />
      <div className={newStyles.mainContent}>
        <div className={newStyles.leftPanel}>
          <h2>Ongoing Tasks</h2>
          <div className={newStyles.taskList}>
            {tasks.map((task) => (
              <div key={task.id} className={newStyles.task}>
                <div className={newStyles.taskDetails}>
                  <h3>{task.title}</h3>
                  <p>
                    <strong>Description: </strong>
                    {task.description}
                  </p>
                  <p>
                    <strong>Date: </strong>
                    {task.date}
                  </p>
                  <p>
                    <strong>Status: </strong>
                    {task.status}
                  </p>
                </div>
                <div className={newStyles.taskActions}>
                  <button
                    className={newStyles.updateButton}
                    onClick={() => handleUpdate(task)}
                  >
                    Update
                  </button>
                  <button
                    className={newStyles.deleteButton}
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={newStyles.rightPanel}>
          <h2>{selectedTask.id ? "Update Task" : "Add Task"}</h2>
          <div className={newStyles.formContainer}>
            <form className={newStyles.form} onSubmit={handleSaveTask}>
              <input
                type="text"
                placeholder="Title"
                value={selectedTask.title}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    description: e.target.value,
                  })
                }
                required
              />
              <input
                type="date"
                placeholder="Date"
                value={selectedTask.date}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, date: e.target.value })
                }
                required
              />
              <button type="submit">{selectedTask.id ? "Update Task" : "Add Task"}</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OngoingTask;
