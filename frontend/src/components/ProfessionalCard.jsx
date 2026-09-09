function ProfessionalCard({
  id,
  name,
  profession,
  rating,
  experience,
  price,
  location,
  verified,
  matchScore,
  onBookClick // Prop to handle booking action
}) {
  
  const handleBookingClick = () => {
    // Check if user is logged in as a customer
    const userRole = localStorage.getItem("accountType") || localStorage.getItem("account_type");
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      alert("Please sign in first to book a service!");
      return;
    }

    if (userRole && userRole.toLowerCase() !== "customer") {
      alert("Please log in as a customer first to book a service!");
      return;
    }

    // If check passes, trigger the booking modal / action
    if (onBookClick) {
      onBookClick({ id, name, profession, price });
    }
  };

  return (
    <div className="professional-card">

      {/* AI Match Score Badge */}
      {matchScore && (
        <div className="match-badge" style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'inline-block' }}>
          🔥 {matchScore}% Match
        </div>
      )}

      <div className="professional-image">
        👤
      </div>

      <div className="professional-info">

        <div className="professional-name-row">

          <h3>{name}</h3>

          {verified && (
            <span className="verified">
              ✓ Verified
            </span>
          )}

        </div>

        <p className="profession">
          {profession}
        </p>

        <div className="rating">
          ⭐ {rating}
        </div>

        <div className="professional-details">

          <span>
            {experience} years experience
          </span>

          <span>
            {location}
          </span>

        </div>

        <div className="professional-bottom">

          <strong>
            ₹{price}
          </strong>

          {/* Connected to safety check handler */}
          <button onClick={handleBookingClick}>
            Book Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProfessionalCard;