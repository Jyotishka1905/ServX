import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import ProfessionalsSection from "../components/ProfessionalsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controls whether we show the public "landing" page or the user's "portal"
  const [viewMode, setViewMode] = useState("landing");

  // Load user profile and tokens safely
  const loadUserData = () => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.account_type === "customer") {
          fetchCustomerBookings(token);
        } else if (parsedUser.account_type === "professional") {
          fetchProfessionalRequests(token);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    // Listen for storage changes (like profile updates or logouts across tabs/components)
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, []);

  const fetchCustomerBookings = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/bookings/customer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionalRequests = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/bookings/professional/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching professional requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreCategory = (categoryName) => {
    navigate(`/services?profession=${encodeURIComponent(categoryName)}`);
  };

  // Handles logging out safely with a confirmation dialog
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      setUser(null);
      setViewMode("landing");
      navigate('/');
    }
  };

  return (
    <>
      <Navbar />

      {/* Global Logged-In Action Bar: Always shows Edit Profile & Logout when signed in */}
      {user && (
        <div style={{ backgroundColor: '#f8fafc', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* View Mode Toggles */}
          <div style={{ display: 'flex', gap: '10px', margin: '0 auto' }}>
            <button 
              onClick={() => setViewMode("landing")}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: viewMode === "landing" ? '#2563eb' : '#ffffff', 
                color: viewMode === "landing" ? '#fff' : '#475569', 
                border: viewMode === "landing" ? 'none' : '1px solid #cbd5e1', 
                borderRadius: '8px', 
                fontWeight: '600', 
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              🏠 View Home Page
            </button>
            <button 
              onClick={() => setViewMode("portal")}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: viewMode === "portal" ? '#2563eb' : '#ffffff', 
                color: viewMode === "portal" ? '#fff' : '#475569', 
                border: viewMode === "portal" ? 'none' : '1px solid #cbd5e1', 
                borderRadius: '8px', 
                fontWeight: '600', 
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              👤 My Portal Dashboard
            </button>
          </div>

          {/* Persistent Profile & Logout Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => navigate('/edit-profile')}
              style={{ padding: '8px 14px', backgroundColor: '#e0e7ff', color: '#3730a3', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
            >
              ✏️ Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              style={{ padding: '8px 14px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
            >
              🚪 Log Out
            </button>
          </div>

        </div>
      )}

      <main>
        {user && viewMode === "portal" ? (
          <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '35px 30px', borderRadius: '16px', marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 10px 25px -5px rgba(37,99,235,0.3)' }}>
              <div>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                  {user.account_type} Portal
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '8px 0 6px 0' }}>
                  Welcome back, {user.name}! 👋
                </h2>
                <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>
                  Here is a quick overview of your active service marketplace status.
                </p>
              </div>

              {user.account_type === 'customer' ? (
                <button 
                  onClick={() => navigate('/services')} 
                  style={{ backgroundColor: '#ffffff', color: '#2563eb', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                  Browse Services
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/professional-dashboard')} 
                  style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                >
                  Open Management Panel
                </button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {user.account_type === 'customer' ? 'Your Recent Bookings' : 'Incoming Requests Preview'}
              </h3>
              <button 
                onClick={() => navigate(user.account_type === 'customer' ? '/dashboard' : '/professional-dashboard')} 
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                View Full Dashboard &rarr;
              </button>
            </div>

            {loading ? (
              <p style={{ color: '#6b7280', padding: '30px 0' }}>Loading your dashboard data...</p>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', background: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb', marginBottom: '50px' }}>
                <p style={{ color: '#4b5563', margin: '0 0 12px 0', fontWeight: '500' }}>No active activity found right now.</p>
                {user.account_type === 'customer' && (
                  <button onClick={() => navigate('/services')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    Find Professionals Now
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                {bookings.slice(0, 3).map((b) => (
                  <div key={b.id} style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '16px', color: '#111827' }}>{b.profession || 'Service Request'}</strong>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '20px', backgroundColor: b.status === 'Accepted' ? '#d1fae5' : '#fef3c7', color: b.status === 'Accepted' ? '#065f46' : '#92400e', textTransform: 'uppercase' }}>
                        {b.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#4b5563', margin: '4px 0' }}>Date: <strong>{b.service_date}</strong></p>
                    <p style={{ fontSize: '14px', color: '#4b5563', margin: '4px 0' }}>{user.account_type === 'customer' ? `Expert: ${b.professional_name}` : `Client: ${b.customer_name}`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <Hero />
            <ServicesSection onExplore={handleExploreCategory} />
            <HowItWorks />
            <ProfessionalsSection />
            <CTASection />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Home;