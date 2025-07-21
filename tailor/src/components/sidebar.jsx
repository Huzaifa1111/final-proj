
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { PiPantsThin } from "react-icons/pi";
import {
  GiLabCoat,
  GiPirateCoat,
  GiSleevelessJacket,
  GiClothes,
  GiPoloShirt,
} from "react-icons/gi";

const Sidebar = ({ handleVarietyClick, selectedVariety }) => {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log("Initiating logout");
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    }
    setIsMobileSidebarOpen(false);
  };

  const varietyIcons = {
    Pant: <PiPantsThin className="w-8 h-8 mb-2" />,
    Pantcoat: <GiPirateCoat className="w-8 h-8 mb-2" />,
    Waistcoat: <GiLabCoat className="w-8 h-8 mb-2" />,
    Coat: <GiSleevelessJacket className="w-8 h-8 mb-2" />,
    Shalwaarkameez: <GiClothes className="w-8 h-8 mb-2" />,
    Shirt: <GiPoloShirt className="w-8 h-8 mb-2" />,
  };

  const menuItems = [
    {
      icon: <FaTachometerAlt className="w-6 h-6" />,
      label: "Dashboard",
      onClick: () => {
        console.log("Navigating to /dashboard");
        navigate("/dashboard");
      },
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      label: "Customers",
      onClick: () => {
        console.log("Navigating to /customers");
        navigate("/customers");
      },
    },
    {
      icon: <FaBox className="w-6 h-6" />,
      label: "Orders",
      onClick: () => {
        console.log("Navigating to /orders");
        navigate("/orders");
      },
    },
    {
      icon: <FaUser className="w-6 h-6" />,
      label: "Karigar",
      onClick: () => {
        console.log("Navigating to /karigar");
        navigate("/karigar");
      },
    },
    {
      icon: <FaCog className="w-6 h-6" />,
      label: "Settings",
      onClick: () => {
        console.log("Navigating to /settings");
        navigate("/settings");
      },
    },
    {
      icon: <FaSignOutAlt className="w-6 h-6" />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const toggleMobileSidebar = () => {
    console.log("Toggling mobile sidebar:", !isMobileSidebarOpen);
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <>
      <div className="font-font">
        {/* Mobile Toggle Button */}
        <button
          className="fixed top-6 left-6 z-50 p-2 bg-heading text-white rounded-lg md:hidden"
          onClick={toggleMobileSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* Sidebar Container */}
        <div
          className={`absolute md:absolute h-[76rem] text-white pt-10 w-[71px] group hover:w-52 transition-all duration-300 flex flex-col gap-6 p-[6px] bg-heading rounded-tr-3xl rounded-br-3xl font-montserrat text-[13px] z-40 items-center group-hover:items-start ${
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Logo and Title */}
          <div className="flex items-center justify-center group-hover:justify-start w-full px-4">
            <img src="/assets/img29.png" alt="logo" className="w-8 h-8 hover:w-8" />
            <span className="ml-2 hidden group-hover:inline-block text-[15px]">
              PhiHorizon
            </span>
          </div>

          {/* Navigation */}
          <nav className="w-full">
            <ul className="w-full">
              {menuItems.map((item, index) => (
                <li key={index} className="mb-4">
                  <button
                    className="w-full flex items-center justify-center group-hover:justify-start py-4 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20"
                    onClick={() => {
                      item.onClick();
                      setIsMobileSidebarOpen(false);
                    }}
                    aria-label={item.label}
                  >
                    {item.icon}
                    <span className="ml-2 hidden group-hover:inline-block text-[15px]">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
              {Object.keys(varietyIcons).map((variety) => (
                <li key={variety} className="mb-4">
                  <button
                    className={`w-full flex items-center justify-center group-hover:justify-start py-2 px-4 rounded-2xl hover:bg-cyan-50 hover:bg-opacity-20 ${
                      selectedVariety === variety ? "bg-black bg-opacity-50" : ""
                    }`}
                    onClick={() => {
                      console.log(`Variety click: ${variety}`);
                      if (typeof handleVarietyClick === "function") {
                        handleVarietyClick(variety);
                      }
                      setIsMobileSidebarOpen(false);
                    }}
                    aria-label={variety}
                  >
                    {varietyIcons[variety]}
                    <span className="ml-2 hidden group-hover:inline-block text-[15px]">
                      {variety}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;