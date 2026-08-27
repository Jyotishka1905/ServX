import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setName(user.name || '');
        setLocation(user.location || '');
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Fixed: Now correctly reading "access_token" to match Login.jsx
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Session expired or missing. Please sign in again.");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put('http://localhost:8000/auth/profile/update', {
        name: name.trim(),
        location: location.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage user data and broadcast storage change event
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("storage"));

      setMessage("Profile updated successfully!");
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error("Detailed profile update error:", error.response || error);
      alert(error.response?.data?.detail || "Failed to update profile.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Inter, sans-serif' }}>
      <h2>Edit Profile</h2>
      {message && <p style={{ color: 'green', fontSize: '14px', marginBottom: '10px' }}>{message}</p>}
      
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Full Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
            required
          />
        </div>

        <div>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Location / City:</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
            required
          />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '5px' }}>
          Save Changes
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '10px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditProfile;