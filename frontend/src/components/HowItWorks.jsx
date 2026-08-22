function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Search",
      description: "Search for the service you need."
    },
    {
      number: "02",
      title: "Compare",
      description: "Compare professionals, ratings and prices."
    },
    {
      number: "03",
      title: "Book",
      description: "Choose a professional and request a service."
    },
    {
      number: "04",
      title: "Review",
      description: "Complete the service and share your experience."
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">

      <div className="section-header">

        <p className="section-label">
          HOW IT WORKS
        </p>

        <h2>
          Get Your Service in Four Simple Steps
        </h2>

      </div>

      <div className="steps-grid">

        {steps.map((step) => (
          <div className="step-card" key={step.number}>

            <span className="step-number">
              {step.number}
            </span>

            <h3>{step.title}</h3>

            <p>{step.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;