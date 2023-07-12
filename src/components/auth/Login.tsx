// login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate('/tasklist'); // Redirect to TaskList page on successful login
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage('Invalid email or password.'); // Set error message
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to login page after logout
      })
      .catch((error) => {
        // Handle logout error
        console.log('Logout error:', error);
      });
  };

  return (
    <div className="box">
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <div className="input-box">
            <label>Email</label>
            <input
              type="email"
              id="emailid"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="remember-forget">
            <label>
              <input type="checkbox" />
              <span className="remember">Remember me</span>
            </label>
            <a className="white" href="#">
              Forget password?
            </a>
          </div>

          <div>
            <button className="but" type="submit">
              Log in
            </button>
          </div>
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
