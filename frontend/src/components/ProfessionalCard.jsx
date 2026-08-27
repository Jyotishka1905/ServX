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
  onBookClick // <-- Prop to handle booking action
}) {
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

          {/* Connected the click action to trigger booking */}
          <button onClick={() => onBookClick && onBookClick({ id, name, profession, price })}>
            Book Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProfessionalCard;