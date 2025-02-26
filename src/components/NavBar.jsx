import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";  
import "../styles/Navbar.css";

const Navbar = () => {
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

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setShowLogin(false);  // Close modal on successful login
        navigate("/dashboard");
      })
      .catch(() => setError("Invalid email or password"));
  };

  return (
    <nav className="navbar-container">
      <div className="logo-container">
        <img src="../../public/logo.png" alt="Logo" className="logo" />
      </div>
      <button className="login-btn" onClick={handleLoginClick}>Log in</button>

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
    </nav>
  );
};

export default Navbar;
