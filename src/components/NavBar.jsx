import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "../styles/Navbar.css";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate();

  const auth = getAuth();

  // Listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [auth]);

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
        setShowLogin(false); // Close modal on successful login
        navigate("/dashboard");
      })
      .catch(() => setError("Invalid email or password"));
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        navigate("/"); // Redirect to home page after logout
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <nav className="navbar-container">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      {isLoggedIn ? (
        <button className="navbar-login-btn" onClick={handleLogout}>
          Log Out
        </button>
      ) : (
        <button className="navbar-login-btn" onClick={handleLoginClick}>
          Log In
        </button>
      )}

      {showLogin && (
        <div className="login-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseLogin}>
              &times;
            </span>
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
    </nav>
  );
};

export default Navbar;
