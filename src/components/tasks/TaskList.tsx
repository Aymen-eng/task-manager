// TaskList.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { onValue, ref, remove, set } from 'firebase/database';
import { database, auth } from '../../firebase';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskList.css';

interface Task {
  id: string;
  name: string;
  dueDate: string;
  description: string;
}

export const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const taskRef = ref(database, `users/${userId}/tasks`);
      const unsubscribe = onValue(taskRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const taskList: Task[] = [];
          for (let id in data) {
            taskList.push({ id, ...data[id] });
          }
          setTasks(taskList);
        } else {
          setTasks([]);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleSearchByDate = () => {
    if (searchDate) {
      const filtered = tasks.filter((task) => {
        try {
          const taskDueDate = parseISO(task.dueDate);
          if (isValid(taskDueDate)) {
            const formattedTaskDueDate = format(taskDueDate, 'yyyy-MM-dd');
            const formattedSearchDate = format(searchDate, 'yyyy-MM-dd');
            return formattedTaskDueDate === formattedSearchDate;
          }
          return false;
        } catch (error) {
          console.error('Error processing task:', task, error);
          return false;
        }
      });
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      navigate('/addtask', { state: { taskId, taskToEdit } });
    } else {
      console.error('Task not found');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const taskRef = ref(database, `users/${userId}/tasks/${taskId}`);

        remove(taskRef)
          .then(() => {
            console.log('Task deleted successfully');
            setTasks(tasks.filter((task) => task.id !== taskId));
            setFilteredTasks(filteredTasks.filter((task) => task.id !== taskId));
          })
          .catch((error) => {
            console.error('Error deleting task:', error);
          });
      }
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
        <h2>Task List</h2>
        <div className="search-section">
          <DatePicker
            selected={searchDate}
            onChange={(date: Date | null) => setSearchDate(date)}
            placeholderText="Select a date"
            dateFormat="MM/dd/yyyy"
            className="date-picker"
          />
          <button onClick={handleSearchByDate}>
            <FaSearch />
          </button>
        </div>
        <ul>
          {(searchDate ? filteredTasks : tasks).map((task: Task) => (
            <li key={task.id}>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <p>
                Due Date:{' '}
                {isValid(parseISO(task.dueDate))
                  ? format(parseISO(task.dueDate), 'MM/dd/yyyy')
                  : 'Invalid date'}
              </p>
              <div className="task-actions">
                <button onClick={() => handleEditTask(task.id)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
