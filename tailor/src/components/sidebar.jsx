import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaUser, // Icon for Karigar
  FaCog,  // Icon for Settings
  FaSignOutAlt, // Icon for Logout
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="text-white pt-9 w-[71px] group hover:w-64 h-full transition-all duration-300 flex flex-col gap-6 p-[6px] bg-gradient-to-b from-[#0EC4CB] to-[#11D1D7] rounded-tr-3xl rounded-br-3xl font-montserrat text-[13px]">
      <div className="flex space-x-2 text-[15px] items-center px-3">
        <img src="/assets/img29.png" alt="logo" className="w-8 h-auto" />
        <h1 className="mt-[6px] hidden group-hover:inline-block">PhiHorizon</h1>
      </div>
      <ul className="text-4xl group-hover:text-xl">
        {/* Dashboard Icon */}
        <li className="mb-4">
          <button
            className="w-full text-left py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 flex items-center"
            onClick={() => navigate("/dashboard")}
          >
            <FaTachometerAlt className="mr-2" />
            <span className="text-[15px] hidden group-hover:inline-block">Dashboard</span>
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
  );
};

export default Sidebar;
