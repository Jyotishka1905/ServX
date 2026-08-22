import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
      general: ""
    }));
  };


  // ========================================
  // VALIDATE FORM
  // ========================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };


  // ========================================
  // LOGIN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password
        }
      );

      console.log("Login response:", response.data);


      // ========================================
      // GET LOGIN DATA
      // ========================================

      const {
        access_token,
        token_type,
        user
      } = response.data;


      // ========================================
      // STORE AUTHENTICATION DATA
      // ========================================

      localStorage.setItem(
        "access_token",
        access_token
      );

      localStorage.setItem(
        "token_type",
        token_type
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      // ========================================
      // REDIRECT BASED ON ACCOUNT TYPE
      // ========================================

      if (user.account_type === "professional") {

        navigate("/professional-dashboard");

      } else {

        navigate("/dashboard");

      }


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      // ========================================
      // FASTAPI ERROR
      // ========================================

      if (error.response) {

        const message =
          error.response.data?.detail ||
          "Invalid email or password";

        setErrors({
          general: message
        });

      }


      // ========================================
      // SERVER NOT RUNNING
      // ========================================

      else if (error.request) {

        setErrors({
          general:
            "Unable to connect to ServX server. Make sure FastAPI is running."
        });

      }


      // ========================================
      // OTHER ERROR
      // ========================================

      else {

        setErrors({
          general:
            "Something went wrong. Please try again."
        });

      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* ========================================
            LOGO
        ======================================== */}

        <div className="auth-logo">
          Serv<span>X</span>
        </div>


        {/* ========================================
            HEADING
        ======================================== */}

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Sign in to continue to ServX
        </p>


        {/* ========================================
            GENERAL ERROR
        ======================================== */}

        {errors.general && (
          <div className="form-error-box">
            {errors.general}
          </div>
        )}


        {/* ========================================
            LOGIN FORM
        ======================================== */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />

            {errors.email && (
              <p className="form-error">
                {errors.email}
              </p>
            )}

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            {errors.password && (
              <p className="form-error">
                {errors.password}
              </p>
            )}

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Signing In..."
              : "Sign In"
            }

          </button>

        </form>


        {/* ========================================
            REGISTER LINK
        ======================================== */}

        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;