import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================================
            HOME PAGE
        ======================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ========================================
            AUTHENTICATION
        ======================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ========================================
            SERVICES
        ======================================== */}

        <Route
          path="/services"
          element={<Services />}
        />


        {/* ========================================
            PROFESSIONAL DASHBOARD
        ======================================== */}

        <Route
          path="/professional-dashboard"
          element={<ProfessionalDashboard />}
        />


        {/* ========================================
            CUSTOMER DASHBOARD
        ======================================== */}

        {/* We will create Dashboard.jsx later */}

      </Routes>

    </BrowserRouter>
  );
}


export default App;