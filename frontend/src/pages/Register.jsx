import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ========================================
// API CONFIGURATION
// ========================================
const API = axios.create({
  baseURL: 'http://localhost:8000', // Points to your FastAPI backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/token', credentials);

function Register() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("customer");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    profession: "",
    skills: "",
    experience: "",
    price: "",
    availability: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    // Remove error for the field being edited
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ""
    }));

    setSuccessMessage("");
  };


  // ========================================
  // VALIDATE FORM
  // ========================================

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Location
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Professional validation
    if (accountType === "professional") {
      if (!formData.profession) {
        newErrors.profession = "Please select a profession";
      }

      if (!formData.skills.trim()) {
        newErrors.skills = "Please enter your skills";
      }

      if (formData.experience === "") {
        newErrors.experience = "Experience is required";
      } else if (Number(formData.experience) < 0) {
        newErrors.experience = "Experience cannot be negative";
      }

      if (formData.price === "") {
        newErrors.price = "Service charge is required";
      } else if (Number(formData.price) < 0) {
        newErrors.price = "Service charge cannot be negative";
      }

      if (!formData.availability) {
        newErrors.availability = "Please select availability";
      }
    }

    return newErrors;
  };


  // ========================================
  // HANDLE ACCOUNT TYPE
  // ========================================

  const handleAccountTypeChange = (e) => {
    const type = e.target.value;

    setAccountType(type);
    setErrors({});
    setSuccessMessage("");

    // Clear professional fields when switching to customer
    if (type === "customer") {
      setFormData((previousData) => ({
        ...previousData,
        profession: "",
        skills: "",
        experience: "",
        price: "",
        availability: ""
      }));
    }
  };


  // ========================================
  // SUBMIT REGISTRATION
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    // Validate form
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        accountType: accountType,
        account_type: accountType, // Included for both camelCase and snake_case backend schemas
        location: formData.location.trim(),
        profession: accountType === "professional" ? formData.profession : null,
        skills: accountType === "professional" ? formData.skills.trim() : null,
        experience: accountType === "professional" ? Number(formData.experience) : null,
        price: accountType === "professional" ? Number(formData.price) : null,
        availability: accountType === "professional" ? formData.availability : null
      };

      console.log("Sending registration data:", requestData);

      // ========================================
      // SEND DATA TO FASTAPI USING API HELPER
      // ========================================
      const response = await registerUser(requestData);

      console.log("Server response:", response.data);

      // ========================================
      // SUCCESS
      // ========================================
      setSuccessMessage("Account created successfully! Redirecting to login...");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        location: "",
        profession: "",
        skills: "",
        experience: "",
        price: "",
        availability: ""
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);

      // ========================================
      // SERVER ERROR
      // ========================================
      if (error.response) {
        const serverMessage = error.response.data?.detail;

        if (serverMessage) {
          setErrors({ general: serverMessage });
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      }
      // ========================================
      // SERVER NOT RUNNING / CORS
      // ========================================
      else if (error.request) {
        setErrors({
          general: "Unable to connect to ServX server. Make sure FastAPI is running and CORS is configured."
        });
      }
      // ========================================
      // OTHER ERROR
      // ========================================
      else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        
        {/* LOGO */}
        <div className="auth-logo">
          Serv<span>X</span>
        </div>

        <h1>Create Your Account</h1>
        <p className="auth-subtitle">
          Join ServX and connect with trusted professionals
        </p>

        {/* GENERAL ERROR */}
        {errors.general && (
          <div className="form-error-box">
            {errors.general}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="form-success-box">
            {successMessage}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* ACCOUNT TYPE */}
          <div className="form-group">
            <label>Account Type</label>
            <select value={accountType} onChange={handleAccountTypeChange}>
              <option value="customer">Customer</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* LOCATION */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your city"
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>

          {/* PROFESSIONAL SECTION */}
          {accountType === "professional" && (
            <div className="professional-form">
              <div className="professional-heading">
                <h3>Professional Information</h3>
                <p>Tell customers about your services</p>
              </div>

              {/* PROFESSION */}
              <div className="form-group">
                <label>Profession</label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                >
                  <option value="">Select your profession</option>
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
                {errors.profession && <p className="form-error">{errors.profession}</p>}
              </div>

              {/* SKILLS */}
              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Wiring, AC installation"
                />
                {errors.skills && <p className="form-error">{errors.skills}</p>}
              </div>

              {/* EXPERIENCE */}
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />
                {errors.experience && <p className="form-error">{errors.experience}</p>}
              </div>

              {/* SERVICE CHARGE */}
              <div className="form-group">
                <label>Service Charge (₹)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                />
                {errors.price && <p className="form-error">{errors.price}</p>}
              </div>

              {/* AVAILABILITY */}
              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="">Select availability</option>
                  <option value="Available Now">Available Now</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekends">Weekends</option>
                </select>
                {errors.availability && <p className="form-error">{errors.availability}</p>}
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;