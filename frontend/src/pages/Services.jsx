import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProfessionalCard from '../components/ProfessionalCard';

function Services() {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // --- BOOKING MODAL STATE VARIABLES ---
  const [showModal, setShowModal] = useState(false);
  const [bookingTarget, setBookingTarget] = useState(null);
  const [serviceDate, setServiceDate] = useState('');
  const [notes, setNotes] = useState('');

  const locationUrl = useLocation();

  // 1. Read category/profession from URL query params on load/change
  useEffect(() => {
    const params = new URLSearchParams(locationUrl.search);
    const profParam = params.get('profession');
    if (profParam) {
      setSelectedProfession(profParam);
    } else {
      setSelectedProfession(''); // Reset if parameter is removed
    }
  }, [locationUrl.search]);

  // Fetch recommended professionals based on filters
  const fetchProfessionals = async () => {
    setLoading(true);
    setProfessionals([]); // Clear previous results instantly

    try {
      const params = {};
      if (selectedProfession) params.profession = selectedProfession;
      if (locationQuery) params.location = locationQuery;

      const response = await axios.get('http://localhost:8000/professionals/recommendations', { params });
      setProfessionals(response.data.recommended_professionals);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch whenever the selected profession updates
  useEffect(() => {
    fetchProfessionals();
  }, [selectedProfession]);

  // Opens the modal and sets the target professional
  const handleBookClick = (professional) => {
    setBookingTarget(professional);
    setShowModal(true);
  };

  // Submits the booking request to the backend
  const submitBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in as a customer first to book a service!");
      return;
    }

    if (!serviceDate) {
      alert("Please select a date for the service.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/bookings/', {
        professional_id: bookingTarget.id,
        service_date: serviceDate,
        notes: notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(response.data.message); // Success!
      
      // Close and reset modal
      setShowModal(false);
      setServiceDate('');
      setNotes('');
    } catch (error) {
      console.error("Booking error:", error.response);
      alert(error.response?.data?.detail || "Error creating booking request.");
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif', color: '#1f2937' }}>
      
      {/* Hero Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#111827', marginBottom: '10px', letterSpacing: '-0.5px' }}>
          Explore Verified Experts
        </h2>
        <p style={{ color: '#4b5563', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Discover trusted local professionals customized to your service category and location preferences.
        </p>
      </div>

      {/* Modern Filter Controls Bar */}
      <div style={{ 
        background: '#ffffff', 
        padding: '24px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '16px', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '40px',
        border: '1px solid #f3f4f6'
      }}>
        <select 
          value={selectedProfession} 
          onChange={(e) => setSelectedProfession(e.target.value)}
          style={{ 
            padding: '14px 16px', 
            borderRadius: '10px', 
            border: '1px solid #d1d5db', 
            fontSize: '15px', 
            outline: 'none', 
            flex: '1', 
            minWidth: '220px',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
            color: '#374151',
            fontWeight: '500'
          }}
        >
          <option value="">All Categories</option>
          <option value="Electrician">Electrician</option>
          <option value="Teacher">Teacher</option>
          <option value="Driver">Driver</option>
          <option value="Plumber">Plumber</option>
          <option value="Doctor">Doctor</option>
          <option value="Maid">Maid</option>
          <option value="Carpenter">Carpenter</option>
          <option value="IT Expert">IT Expert</option>
          <option value="Painter">Painter</option>
          <option value="AC Repair">AC Repair</option>
          <option value="Technician">Technician</option>
          <option value="Tutor">Tutor</option>
        </select>

        <input 
          type="text" 
          placeholder="Filter by location (e.g., Kolkata, Asansol)" 
          value={locationQuery}
          onChange={(e) => getLocationQueryTarget(e.target.value)}
          onInput={(e) => setLocationQuery(e.target.value)}
          style={{ 
            padding: '14px 16px', 
            borderRadius: '10px', 
            border: '1px solid #d1d5db', 
            fontSize: '15px', 
            outline: 'none', 
            flex: '1', 
            minWidth: '240px',
            backgroundColor: '#f9fafb',
            color: '#374151'
          }}
        />

        <button 
          onClick={fetchProfessionals} 
          style={{ 
            padding: '14px 28px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px', 
            fontWeight: '600', 
            fontSize: '15px', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Search Experts
        </button>
      </div>

      {/* Results Grid / Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280', fontSize: '18px', fontWeight: '500' }}>
          Finding the best options for you...
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {professionals.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
              <p style={{ fontSize: '16px', color: '#4b5563', margin: 0, fontWeight: '500' }}>No professionals found matching your criteria.</p>
            </div>
          ) : (
            professionals.map((pro) => (
              <ProfessionalCard 
                key={pro.id}
                id={pro.id}
                name={pro.name}
                profession={pro.profession}
                rating={pro.rating}
                experience={pro.experience}
                price={pro.price}
                location={pro.location}
                verified={true}
                matchScore={pro.match_score}
                onBookClick={handleBookClick}
              />
            ))
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* CUSTOM POLISHED BOOKING MODAL              */}
      {/* ========================================== */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(5px)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '32px', borderRadius: '16px',
            width: '380px', display: 'flex', flexDirection: 'column', gap: '18px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700', color: '#111827' }}>
                Book {bookingTarget?.name}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                {bookingTarget?.profession} • <span style={{ color: '#059669', fontWeight: '600' }}>₹{bookingTarget?.price} / visit</span>
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Service Date:</label>
              <input 
                type="date" 
                value={serviceDate} 
                onChange={(e) => setServiceDate(e.target.value)} 
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', backgroundColor: '#f9fafb' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Notes / Requirements:</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="E.g., I need my system fixed after 5 PM."
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '14px', minHeight: '90px', outline: 'none', resize: 'vertical', backgroundColor: '#f9fafb' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={submitBooking} 
                style={{ flex: 1, backgroundColor: '#10b981', color: 'white', padding: '13px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                Confirm Booking
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#4b5563', padding: '13px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Services;