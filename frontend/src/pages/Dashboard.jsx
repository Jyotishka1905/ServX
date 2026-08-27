import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/bookings/customer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching customer bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerBookings();
  }, [navigate]);

  // Helper function for dynamic status badge styling
  const getStatusBadgeStyle = (status) => {
    const base = { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };
    switch (status?.toLowerCase()) {
      case 'accepted':
        return { ...base, backgroundColor: '#d1fae5', color: '#065f46' };
      case 'rejected':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'completed':
        return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
      default:
        return { ...base, backgroundColor: '#fef3c7', color: '#92400e' }; // Pending
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif', color: '#1f2937' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            Customer Dashboard
          </h2>
          <p style={{ color: '#4b5563', fontSize: '15px', margin: 0 }}>
            Manage and track the real-time status of your booked services.
          </p>
        </div>

        <button 
          onClick={() => navigate('/services')} 
          style={{ 
            padding: '12px 20px', 
            backgroundColor: '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '10px', 
            fontWeight: '600', 
            fontSize: '14px', 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          + Browse More Services
        </button>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '30px' }} />

      {/* Main Content Area */}
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
        My Booking Requests
      </h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280', fontSize: '16px' }}>
          Loading your bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
          <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px', fontWeight: '500' }}>You haven't booked any services yet.</p>
          <button 
            onClick={() => navigate('/services')} 
            style={{ padding: '10px 18px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            Explore Experts Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '20px' }}>
          {bookings.map((b) => (
            <div key={b.id} style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e7eb', 
              padding: '24px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {b.profession}
                  </span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                    {b.professional_name}
                  </h4>
                </div>
                <span style={getStatusBadgeStyle(b.status)}>
                  {b.status}
                </span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '4px 0' }} />

              {/* Card Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', color: '#4b5563' }}>
                <div>
                  <strong>Location:</strong> <span style={{ color: '#111827' }}>{b.location}</span>
                </div>
                <div>
                  <strong>Fee:</strong> <span style={{ color: '#059669', fontWeight: '600' }}>₹{b.price}</span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Service Date:</strong> <span style={{ color: '#111827' }}>{b.service_date}</span>
                </div>
              </div>

              {/* Notes Container */}
              {b.notes && (
                <div style={{ backgroundColor: '#f9fafb', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#4b5563', borderLeft: '3px solid #2563eb' }}>
                  <strong>Notes:</strong> {b.notes}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;