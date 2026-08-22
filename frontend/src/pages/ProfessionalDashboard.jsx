import React, { useEffect, useState } from "react";
import "./ProfessionalDashboard.css";

function ProfessionalDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfessionalProfile();
  }, []);

  const fetchProfessionalProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/professional/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load profile");
      }

      setProfile(data);
    } catch (err) {
      console.error("Profile error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="dashboard-message">
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  // ================================
  // ERROR
  // ================================

  if (error) {
    return (
      <div className="dashboard-message">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>

        <button onClick={fetchProfessionalProfile}>
          Try Again
        </button>
      </div>
    );
  }

  // ================================
  // PROFILE
  // ================================

  const user = profile.user;
  const professional = profile.professional;

  return (
    <div className="professional-dashboard">

      {/* ================================
          HEADER
      ================================= */}

      <header className="dashboard-header">

        <div>
          <h1>Professional Dashboard</h1>

          <p>
            Welcome back, {user.name}
          </p>
        </div>

        <div className="profile-badge">
          {user.name.charAt(0).toUpperCase()}
        </div>

      </header>


      {/* ================================
          PROFILE CARD
      ================================= */}

      <section className="profile-card">

        <div className="profile-info">

          <div className="large-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>

            <h2>{user.name}</h2>

            <p className="profession">
              {professional.profession}
            </p>

            <p>
              📍 {professional.location}
            </p>

          </div>

        </div>

        <div className="availability">

          <span className="availability-dot"></span>

          {professional.availability}

        </div>

      </section>


      {/* ================================
          STATISTICS
      ================================= */}

      <section className="stats-grid">

        <div className="stat-card">

          <span className="stat-icon">⭐</span>

          <div>

            <p>Rating</p>

            <h3>
              {professional.rating}
            </h3>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">💼</span>

          <div>

            <p>Completed Jobs</p>

            <h3>
              {professional.completed_jobs}
            </h3>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">⏳</span>

          <div>

            <p>Experience</p>

            <h3>
              {professional.experience} years
            </h3>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">₹</span>

          <div>

            <p>Starting Price</p>

            <h3>
              ₹{professional.price}
            </h3>

          </div>

        </div>

      </section>


      {/* ================================
          PROFESSIONAL DETAILS
      ================================= */}

      <section className="dashboard-content">

        <div className="dashboard-card">

          <h2>Professional Information</h2>

          <div className="detail-row">

            <span>Profession</span>

            <strong>
              {professional.profession}
            </strong>

          </div>


          <div className="detail-row">

            <span>Experience</span>

            <strong>
              {professional.experience} years
            </strong>

          </div>


          <div className="detail-row">

            <span>Location</span>

            <strong>
              {professional.location}
            </strong>

          </div>


          <div className="detail-row">

            <span>Service Price</span>

            <strong>
              ₹{professional.price}
            </strong>

          </div>


          <div className="detail-row">

            <span>Availability</span>

            <strong>
              {professional.availability}
            </strong>

          </div>

        </div>


        {/* ================================
            SKILLS
        ================================= */}

        <div className="dashboard-card">

          <h2>Skills & Expertise</h2>

          <div className="skills-container">

            {professional.skills
              ? professional.skills
                  .split(",")
                  .map((skill, index) => (

                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill.trim()}
                    </span>

                  ))
              : (
                <p>
                  No skills added yet.
                </p>
              )}

          </div>

        </div>

      </section>


      {/* ================================
          ACCOUNT INFORMATION
      ================================= */}

      <section className="dashboard-card account-card">

        <h2>Account Information</h2>

        <div className="detail-row">

          <span>Name</span>

          <strong>
            {user.name}
          </strong>

        </div>


        <div className="detail-row">

          <span>Email</span>

          <strong>
            {user.email}
          </strong>

        </div>


        <div className="detail-row">

          <span>Account Type</span>

          <strong>
            Professional
          </strong>

        </div>

      </section>

    </div>
  );
}

export default ProfessionalDashboard;