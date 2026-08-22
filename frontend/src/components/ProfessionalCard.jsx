function ProfessionalCard({
  name,
  profession,
  rating,
  experience,
  price,
  location,
  verified
}) {
  return (
    <div className="professional-card">

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

          <button>
            View Profile
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProfessionalCard;