import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBox, 
  FaUser,  // Icon for Karigar
  FaCog,   // Icon for Settings
  FaSignOutAlt  // Icon for Logout
} from "react-icons/fa";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Sidebar */}
      <div className={`text-white pt-9 w-[71px] group hover:w-64 h-full transition-all duration-300 flex flex-col gap-6 p-[6px] bg-gradient-to-b from-[#0EC4CB] to-[#11D1D7] 
      rounded-tr-3xl rounded-br-3xl font-montserrat text-[13px] 
      ${isDarkMode ? "bg-gradient-to-b from-[#0EC4CB] to-[#11D1D7] dark:from-[#2c3e50] dark:to-[#34495e]" : "bg-gradient-to-b from-[#0EC4CB] to-[#11D1D7]"} 
      rounded-tr-3xl rounded-br-3xl font-montserrat text-[13px]`}>

        <div className="flex space-x-2 text-[15px] items-center px-4">
        <img src="/assets/img29.png" alt="logo" className="w-8 h-auto " />
        <h1 className="mt-[6px] hidden group-hover:inline-block ">PhiHorizon</h1>
        </div>
        <ul className="text-4xl group-hover:text-xl">
          {/* Dashboard Icon */}
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 flex items-center"
              onClick={() => navigate("/dashboard")}
            >
              <FaTachometerAlt className="mr-2" />
              <span className="text-[15px] hidden group-hover:inline-block ">Dashboard</span>
            </button>
          </li>

          {/* Customers Icon */}
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 flex items-center"
              onClick={() => navigate("/customers")}
            >
              <FaUsers className="mr-2" />
              <span className="text-[15px] hidden group-hover:inline-block">Customers</span>
            </button>
          </li>

          {/* Orders Icon */}
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 flex items-center"
              onClick={() => navigate("/orders")}
            >
              <FaBox className="mr-2" />
              <span className="text-[15px] hidden group-hover:inline-block">Orders</span>
            </button>
          </li>

          {/* Karigar Icon */}
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 flex items-center"
              onClick={() => navigate("/karigar")}
            >
              <FaUser className="mr-2" />
              <span className="text-[15px] hidden group-hover:inline-block">Karigar</span>
            </button>
          </li>

          {/* Settings Icon */}
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 flex items-center"
              onClick={() => navigate("/settings")}
            >
              <FaCog className="mr-2" />
              <span className="text-[15px] hidden group-hover:inline-block">Settings</span>
            </button>
          </li>

          {/* Logout Icon */}
          <li>
            <button
              className="w-full text-left py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 flex items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              <span className="text-[15px] hidden group-hover:inline-block">Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Sticky Theme Toggle Button */}
        <button
          onClick={handleToggleTheme}
          className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>Welcome to the Dashboard</h1>

        {/* Card with Total, Components, Pant */}
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold">Total</h3>
              <p className="text-2xl font-bold text-blue-600">$5000</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold">Components</h3>
              <p className="text-2xl font-bold text-green-600">150</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold">Pant</h3>
              <p className="text-2xl font-bold text-red-600">75</p>
            </div>
          </div>

          {/* Second Row with Logo */}
          <div className="mb-6">
  <img
    src="/assets/img28.PNG"
    alt="Brand Logo"
    className="mx-auto w-[99px] h-auto sm:w-[120px] md:w-[150px] lg:w-[200px]  rounded-lg"
  />
</div>


          {/* Third Row with Search Bar */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
