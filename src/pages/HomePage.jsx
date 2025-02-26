import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import ScheduleForm from "../components/ScheduleForm";
import "../styles/HomePage.css";

const auth = getAuth();

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    setError("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/dashboard");
      })
      .catch(() => setError("Invalid email or password"));
  };

  return (
    <div className="home-container">
      <ScheduleForm />

      {showLogin && (
        <div className="login-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseLogin}>&times;</span>
            <h3>Manager Login</h3>
            <form onSubmit={handleLoginSubmit}>
              {error && <p className="error">{error}</p>}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
