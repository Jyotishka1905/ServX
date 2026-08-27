function ServiceCard({ icon, title, description, onExplore }) {
  return (
    <div className="service-card">

      <div className="service-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      {/* Added onClick event handler to trigger navigation */}
      <button 
        className="service-link"
        onClick={() => onExplore && onExplore(title)}
      >
        Explore →
      </button>

    </div>
  );
}

export default ServiceCard;