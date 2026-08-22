import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          Serv<span>X</span>
        </Link>

        <nav className="nav-links">
          <Link to="/services">Services</Link>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="sign-in">
            Sign In
          </Link>

          <Link to="/register" className="get-started">
            Get Started
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;