// app.tsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { Login } from './components/auth/Login';
import  Signup  from './components/auth/Signup';
import { TaskList } from './components/tasks/TaskList';
import { AddTask } from "./components/tasks/addtask";
import ProtectedRoute from './components/HOC/hoc';
import { auth } from './firebase';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/'); // Redirect to login page after logout
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addtask" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
        <Route path="/tasklist" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
