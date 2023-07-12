import './addtask.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { push, ref, set, remove } from 'firebase/database';
import { database, auth } from '../../firebase';

interface Task {
  id: string;
  name: string;
  dueDate: string;
  description: string;
}

export const AddTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId, taskToEdit } = location.state || {};
  const [taskName, setTaskName] = useState(taskToEdit?.name || '');
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');

  useEffect(() => {
    if (taskId && !taskToEdit) {
      // Fetch task details using taskId from the database
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const taskRef = ref(database, `users/${userId}/tasks/${taskId}`);
        // Fetch the task details from the database using taskRef
        // Update the state with the fetched task details (name, dueDate, description)
      }
    }
  }, [taskId, taskToEdit]);

  const handleSaveTask = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const tasksRef = ref(database, `users/${userId}/tasks`);
      const newTaskRef = push(tasksRef);
      const newTask = {
        id: newTaskRef.key,
        name: taskName,
        dueDate: dueDate,
        description: description,
      };

      set(newTaskRef, newTask)
        .then(() => {
          console.log('New task saved successfully');
          if (taskId) {
            const taskRef = ref(database, `users/${userId}/tasks/${taskId}`);
            remove(taskRef)
              .then(() => {
                console.log('Old task removed successfully');
                navigate('/tasklist');
              })
              .catch((error) => {
                console.error('Error deleting task:', error);
              });
          } else {
            navigate('/tasklist');
          }
        })
        .catch((error) => {
          console.error('Error saving task:', error);
        });
    }
  };

  return (
    <div className="task-list-container">
      <div className="sidebar">
        <ul className="sidebar-menu">
          <li>
            <Link to="/tasklist">Task List</Link>
          </li>
          <li>
            <Link to="/addtask">Add Task</Link>
          </li>
          <li>
            <a href="/" onClick={() => auth.signOut()}>
              Log out
            </a>
          </li>
        </ul>
      </div>
      <div className="content">
        <div id="add-task-form" className="add-task-section">
          <form id="task-form" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label>Task Name</label>
              <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
            </div>
            <div>
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div>
              <button type="submit" onClick={handleSaveTask}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
