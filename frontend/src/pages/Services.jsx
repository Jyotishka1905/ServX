import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProfessionalCard from '../components/ProfessionalCard';

// Keep the backend address consistent throughout ServX
const API_BASE_URL = 'http://127.0.0.1:8001';

function Services() {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- BOOKING MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [bookingTarget, setBookingTarget] = useState(null);
  const [serviceDate, setServiceDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const locationUrl = useLocation();

  // ============================================================
  // READ PROFESSION FROM URL
  // ============================================================
  useEffect(() => {
    const params = new URLSearchParams(locationUrl.search);
    const profParam = params.get('profession');

    if (profParam) {
      setSelectedProfession(profParam);
    } else {
      setSelectedProfession('');
    }
  }, [locationUrl.search]);

  // ============================================================
  // NORMALIZE API RESPONSE
  // ============================================================
  const extractProfessionals = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.recommended_professionals)) {
      return data.recommended_professionals;
    }

    if (Array.isArray(data?.professionals)) {
      return data.professionals;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  };

  // ============================================================
  // FETCH PROFESSIONALS
  // ============================================================
  const fetchProfessionals = async () => {
    setLoading(true);
    setErrorMessage('');

    const params = {
      limit: 12,
      offset: 0,
    };

    if (selectedProfession.trim()) {
      params.profession = selectedProfession.trim();
    }

    if (locationQuery.trim()) {
      params.location = locationQuery.trim();
    }

    console.log('ServX search parameters:', params);

    try {
      // --------------------------------------------------------
      // FIRST: Recommendation endpoint
      // --------------------------------------------------------
      const response = await axios.get(
        `${API_BASE_URL}/professionals/recommendations`,
        {
          params,
          timeout: 10000,
        }
      );

      let dataArray = extractProfessionals(response.data);

      console.log(
        'Recommendation API returned:',
        dataArray.length,
        'professionals'
      );

      // --------------------------------------------------------
      // FALLBACK: Normal search endpoint
      // --------------------------------------------------------
      if (dataArray.length === 0) {
        console.log('Recommendations returned no results. Trying search...');

        const searchResponse = await axios.get(
          `${API_BASE_URL}/professionals/search`,
          {
            params,
            timeout: 10000,
          }
        );

        dataArray = extractProfessionals(searchResponse.data);

        console.log(
          'Search API returned:',
          dataArray.length,
          'professionals'
        );
      }

      // Only replace existing results after a successful request
      setProfessionals(dataArray);
    } catch (error) {
      console.error('ServX API Error:', error);

      // Do NOT pretend an API error means zero professionals
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', error.response.data);

        setErrorMessage(
          `Server error (${error.response.status}). Please check that the ServX backend is running.`
        );
      } else if (error.request) {
        setErrorMessage(
          'Cannot connect to the ServX backend. Please start FastAPI on http://127.0.0.1:8001.'
        );
      } else {
        setErrorMessage(
          'Something went wrong while searching for professionals.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD RESULTS WHEN CATEGORY OR LOCATION CHANGES
  // ============================================================
  useEffect(() => {
    fetchProfessionals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfession]);

  // ============================================================
  // BOOKING MODAL
  // ============================================================
  const handleBookClick = (professional) => {
    setBookingTarget(professional);
    setShowModal(true);
    setServiceDate('');
    setNotes('');
  };

  const closeModal = () => {
    if (bookingLoading) return;

    setShowModal(false);
    setBookingTarget(null);
    setServiceDate('');
    setNotes('');
  };

  // ============================================================
  // SUBMIT BOOKING
  // ============================================================
  const submitBooking = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in as a customer first to book a service!');
      return;
    }

    if (!bookingTarget?.id) {
      alert('Invalid professional selected.');
      return;
    }

    if (!serviceDate) {
      alert('Please select a date for the service.');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/`,
        {
          professional_id: bookingTarget.id,
          service_date: serviceDate,
          notes: notes.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      alert(response.data?.message || 'Booking request created successfully!');

      closeModal();
    } catch (error) {
      console.error('Booking error:', error);

      if (error.response) {
        alert(
          error.response.data?.detail ||
            'The server rejected the booking request.'
        );
      } else if (error.request) {
        alert(
          'Cannot connect to the ServX backend. Please make sure FastAPI is running.'
        );
      } else {
        alert('Error creating booking request.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#1f2937',
      }}
    >
      {/* HERO HEADER */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <h2
          style={{
            fontSize: '34px',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '10px',
            letterSpacing: '-0.5px',
          }}
        >
          Explore Verified Experts
        </h2>

        <p
          style={{
            color: '#4b5563',
            fontSize: '16px',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Discover trusted local professionals customized to your service
          category and location preferences.
        </p>
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          boxShadow:
            '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          border: '1px solid #f3f4f6',
        }}
      >
        {/* CATEGORY */}
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
            fontWeight: '500',
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

        {/* LOCATION */}
        <input
          type="text"
          placeholder="Filter by location (e.g., Kolkata, Asansol)"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchProfessionals();
            }
          }}
          style={{
            padding: '14px 16px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            outline: 'none',
            flex: '1',
            minWidth: '240px',
            backgroundColor: '#f9fafb',
            color: '#374151',
          }}
        />

        {/* SEARCH */}
        <button
          onClick={fetchProfessionals}
          disabled={loading}
          style={{
            padding: '14px 28px',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
          }}
        >
          {loading ? 'Searching...' : 'Search Experts'}
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {errorMessage && !loading && (
        <div
          style={{
            marginBottom: '24px',
            padding: '18px 20px',
            borderRadius: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            textAlign: 'center',
          }}
        >
          <strong>Unable to load professionals</strong>

          <p
            style={{
              margin: '8px 0 14px',
              fontSize: '14px',
            }}
          >
            {errorMessage}
          </p>

          <button
            onClick={fetchProfessionals}
            style={{
              padding: '9px 18px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#dc2626',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* RESULTS */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#6b7280',
            fontSize: '18px',
            fontWeight: '500',
          }}
        >
          Finding the best options for you...
        </div>
      ) : !errorMessage ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {professionals.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px',
                background: '#f9fafb',
                borderRadius: '16px',
                border: '2px dashed #e5e7eb',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: '#4b5563',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                No professionals found matching your criteria.
              </p>
            </div>
          ) : (
            professionals.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                id={pro.id}
                name={pro.name || 'Verified Professional'}
                profession={pro.profession || 'Service Professional'}
                rating={pro.rating ?? 0}
                experience={pro.experience ?? 0}
                price={pro.price ?? 0}
                location={pro.location || 'Location unavailable'}
                verified={true}
                matchScore={pro.match_score}
                onBookClick={handleBookClick}
              />
            ))
          )}
        </div>
      ) : null}

      {/* ====================================================== */}
      {/* BOOKING MODAL                                          */}
      {/* ====================================================== */}
      {showModal && bookingTarget && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '16px',
              width: '380px',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div>
              <h3
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#111827',
                }}
              >
                Book {bookingTarget.name}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500',
                }}
              >
                {bookingTarget.profession} •{' '}
                <span
                  style={{
                    color: '#059669',
                    fontWeight: '600',
                  }}
                >
                  ₹{bookingTarget.price} / visit
                </span>
              </p>
            </div>

            {/* DATE */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Service Date:
              </label>

              <input
                type="date"
                value={serviceDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setServiceDate(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                }}
              />
            </div>

            {/* NOTES */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Notes / Requirements:
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., I need my system fixed after 5 PM."
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  minHeight: '90px',
                  outline: 'none',
                  resize: 'vertical',
                  backgroundColor: '#f9fafb',
                }}
              />
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '10px',
              }}
            >
              <button
                onClick={submitBooking}
                disabled={bookingLoading}
                style={{
                  flex: 1,
                  backgroundColor: bookingLoading ? '#6ee7b7' : '#10b981',
                  color: 'white',
                  padding: '13px',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: bookingLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>

              <button
                onClick={closeModal}
                disabled={bookingLoading}
                style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  padding: '13px',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: bookingLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
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