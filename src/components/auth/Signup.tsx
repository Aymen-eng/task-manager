import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Check for email syntax validity
      if (!validateEmail(email)) {
        setErrorMessage('Invalid email syntax.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccessMessage('Account created successfully.');
      setUsername('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 500);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        setErrorMessage('Email already exists.');
        setTimeout(() => {
          setErrorMessage('');
        }, 500);
      } else {
        setErrorMessage('An error occurred during signup. Please try again later.');
      }
      console.log('Signup error:', errorMessage);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container">
      <form id="contactForm" onSubmit={handleSignup}>
        <h2>Sign up</h2>
        {successMessage && <p className="alert success">{successMessage}</p>}
        {errorMessage && <p className="alert error">{errorMessage}</p>}
        <div className="inputBox">
          <input
            type="text"
            id="name"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="inputBox">
          <input
            type="email"
            id="emailid"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="inputBox">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="agree">
          <label>
            <input type="checkbox" />
            I agree to the terms & conditions
          </label>
        </div>
        <div>
          <button type="submit">Sign up</button>
        </div>
        <div className="login-link">
          <p>
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
