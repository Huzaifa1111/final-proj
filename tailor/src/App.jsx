import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Layout from "./components/Layout"; // Import the Layout component
import Customers from "./pages/customers";
import Orders from "./pages/orders";
import Varieties from "./pages/varieties";
import CreateOrder from "./pages/createOrder";
import Karigar from "./pages/karigar";
import SingleKarigar from "./pages/singleKarigar";
import SingleCustomer from "./pages/singlecustomer";

import Settings from "./pages/settings";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Page (No Sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (with Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="customers" element={<Customers />} />
                <Route path="/customer/:id" element={<SingleCustomer />} />
                <Route path="orders" element={<Orders />} />
                <Route path="karigar" element={<Karigar />} />
                <Route path="karigar/:id" element={<SingleKarigar />} />
                <Route path="settings" element={<Settings />} />
                <Route path="varieties/:cnic" element={<Varieties />} />
                <Route path="createOrder" element={<CreateOrder />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;