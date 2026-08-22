import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <p className="hero-label">
          YOUR ONE-STOP SERVICE PLATFORM
        </p>

        <h1>
          Find & Hire <span>Trusted</span>
          <br />
          Professionals Instantly
        </h1>

        <p className="hero-description">
          Teachers, doctors, electricians, drivers, maids and more —
          connect with verified professionals or register to offer your
          expertise.
        </p>

        <div className="hero-buttons">

          <Link to="/register" className="primary-button">
            Register Now →
          </Link>

          <Link to="/services" className="secondary-button">
            ◯ &nbsp; Browse Services
          </Link>

        </div>

        <div className="hero-stats">

          <div>
            <span>●</span>
            10,000+ Professionals
          </div>

          <div>
            <span>●</span>
            Free & Paid Options
          </div>

          <div>
            <span>●</span>
            Verified & Trusted
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;