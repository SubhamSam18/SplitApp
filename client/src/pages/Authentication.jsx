import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthenticationDesign from "../designs/AuthenticationDesign";

function Authentication() {
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const chkRef = useRef(null);

  const handleLogin = async () => {
    // console.log("Email: ", email);
    // console.log("Password: ", password);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true },
      );
      //   console.log(response.data);
      alert("Login successful");
      navigate("/home");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  const handleSignup = async () => {
    console.log("Name: ", signupName);
    console.log("Email: ", signupEmail);
    console.log("Password: ", signupPassword);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name: signupName, email: signupEmail, password: signupPassword },
      );
      //   console.log(response.data);
      alert("SignUp successful! Please Login");
      if (chkRef.current) {
        chkRef.current.checked = true;
      }
    } catch (err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <AuthenticationDesign
      chkRef={chkRef}
      //Login
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      //Signup
      signupName={signupName}
      setSignupName={setSignupName}
      signupEmail={signupEmail}
      setSignupEmail={setSignupEmail}
      signupPassword={signupPassword}
      setSignupPassword={setSignupPassword}
      handleSignup={handleSignup}
    />
  );
}
export default Authentication;
