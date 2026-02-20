import "../designs/auth.css";

function AuthenticationDesign({
  chkRef,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  signupName,
  setSignupName,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  handleSignup,
}) {
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

        <div className="login">
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

          <button className="AuthButton" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationDesign;
