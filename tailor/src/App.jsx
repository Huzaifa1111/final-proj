import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Layout from "./components/layout"; // Import the Layout component
import Customers from "./pages/customers";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Page (No Sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Sidebar */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                {/* Dashboard Pages */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
