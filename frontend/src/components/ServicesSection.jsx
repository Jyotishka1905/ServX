import React from 'react';
import ServiceCard from "./ServiceCard";

function ServicesSection({ onExplore }) {
  const services = [
    {
      icon: "🔧",
      title: "Electrician",
      description: "Electrical repair, wiring and installation services."
    },
    {
      icon: "👨‍🏫",
      title: "Teacher",
      description: "Experienced teachers and tutors for different subjects."
    },
    {
      icon: "🚗",
      title: "Driver",
      description: "Professional drivers for personal and commercial needs."
    },
    {
      icon: "🔧",
      title: "Plumber",
      description: "Reliable plumbing repair and installation services."
    },
    {
      icon: "🩺",
      title: "Doctor",
      description: "Find qualified healthcare professionals."
    },
    {
      icon: "🧹",
      title: "Maid",
      description: "Trusted household cleaning and assistance services."
    },
    {
      icon: "🔨",
      title: "Carpenter",
      description: "Furniture, woodwork and carpentry services."
    },
    {
      icon: "💻",
      title: "IT Expert",
      description: "Computer, software and technical support services."
    },
    {
      icon: "🏠",
      title: "Painter",
      description: "Professional home and commercial painting services."
    },
    {
      icon: "❄️",
      title: "AC Repair",
      description: "AC installation, maintenance and repair services."
    },
    {
      icon: "📱",
      title: "Technician",
      description: "Mobile, electronics and appliance repair services."
    },
    {
      icon: "📚",
      title: "Tutor",
      description: "Personalized academic tutoring and learning support."
    }
  ];

  return (
    <section className="services-section">
      <div className="section-header">
        <p className="section-label">
          FIND THE RIGHT PROFESSIONAL
        </p>
        <h2>
          Find the Right Professional
        </h2>
        <p>
          Choose from trusted professionals across different services.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            onExplore={onExplore}
          />
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;