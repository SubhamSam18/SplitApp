import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Authentication.css';

function Authentication() {
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const chkRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log("Login triggered");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true },
      );
      setStatus("Success");
      setMessage("Login successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setStatus("Failed");
      setMessage("Login Failed! Try Again!");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const handleSignup = async () => {
    // console.log("Name: ", signupName);
    // console.log("Email: ", signupEmail);
    // console.log("Password: ", signupPassword);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name: signupName, email: signupEmail, password: signupPassword },
      );
      //   console.log(response.data);
      // alert("SignUp successful! Please Login");
      if (chkRef.current) {
        chkRef.current.checked = true;
      }
    } catch (err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <input type="checkbox" id="chk" ref={chkRef} aria-hidden="true" />

        <div className="signup">
          <label htmlFor="chk">Sign Up</label>

          <input
            className="AuthName"
            type="text"
            placeholder="Name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
          />

          <input
            className="AuthEmail"
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />

          <input
            className="AuthPassword"
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />

          <button className="AuthButton" onClick={handleSignup}>
            Sign Up
          </button>
        </div>

        <form className="login" onSubmit={handleLogin}>
          <label htmlFor="chk">Login</label>
          <input
            className="AuthEmail"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="AuthPassword"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="AuthButton" type="submit">
            Login
          </button>
          {message && (
            <p className={`auth-message ${status}`}>
              {message}
              {(status === "Success") && (
                <span className="loading-dots"></span>
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
export default Authentication;
