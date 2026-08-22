import ProfessionalCard from "./ProfessionalCard";

function ProfessionalsSection() {

  const professionals = [
    {
      name: "Rahul Kumar",
      profession: "Electrician",
      rating: "4.9",
      experience: 8,
      price: 500,
      location: "Delhi",
      verified: true
    },
    {
      name: "Anita Sharma",
      profession: "Teacher",
      rating: "4.8",
      experience: 6,
      price: 400,
      location: "Delhi",
      verified: true
    },
    {
      name: "Vijay Singh",
      profession: "Plumber",
      rating: "4.7",
      experience: 7,
      price: 450,
      location: "Delhi",
      verified: true
    }
  ];

  return (
    <section className="professionals-section">

      <div className="section-header">

        <p className="section-label">
          TRUSTED PROFESSIONALS
        </p>

        <h2>
          Meet Our Top Professionals
        </h2>

        <p>
          Experienced professionals ready to help you.
        </p>

      </div>

      <div className="professionals-grid">

        {professionals.map((professional) => (
          <ProfessionalCard
            key={professional.name}
            {...professional}
          />
        ))}

      </div>

    </section>
  );
}

export default ProfessionalsSection;