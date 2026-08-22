import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="cta-section">

      <div className="cta-content">

        <p className="section-label">
          GET STARTED TODAY
        </p>

        <h2>
          Need a Professional?
          <br />
          We've Got You Covered.
        </h2>

        <p>
          Find trusted professionals for your everyday service needs.
        </p>

        <Link to="/services" className="primary-button">
          Browse Services →
        </Link>

      </div>

    </section>
  );
}

export default CTASection;