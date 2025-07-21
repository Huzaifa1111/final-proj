import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBox } from "react-icons/fa";
import { PiPantsThin } from "react-icons/pi";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  GiLabCoat,
  GiSleevelessJacket,
  GiPirateCoat,
  GiClothes,
  GiPoloShirt,
} from "react-icons/gi";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [prices, setPrices] = useState({
    Pant: "1500 Rs",
    Pantcoat: "15000 Rs",
    Waistcoat: "2500 Rs",
    Coat: "5500 Rs",
    ShalwarKameez: "5000 Rs",
    Shirt: "5000 Rs",
  });

  const [totalCustomers, setTotalCustomers] = useState(0); // State for total customers
  const [totalOrders, setTotalOrders] = useState(0); // State for total orders
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error

  const fetchPrices = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/settings", {
        credentials: 'include',
      });
      const data = await response.json();
      if (data) {
        setPrices({
          Pant: data.pantPrice ? `${data.pantPrice} Rs` : "1500 Rs",
          Pantcoat: data.pantCoatPrice ? `${data.pantCoatPrice} Rs` : "15000 Rs",
          Waistcoat: data.waistCoatPrice ? `${data.waistCoatPrice} Rs` : "2500 Rs",
          Coat: data.coatPrice ? `${data.coatPrice} Rs` : "5500 Rs",
          Shalwarkameez: data.shalwarKameezPrice ? `${data.shalwarKameezPrice} Rs` : "5000 Rs",
          Shirt: data.shirtPrice ? `${data.shirtPrice} Rs` : "5000 Rs",
        });
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      setError("Failed to load prices.");
    }
  };

  // Fetch total customers
  const fetchTotalCustomers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/customers", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customers");
      }
      setTotalCustomers(data.length);
    } catch (error) {
      console.error("Error fetching total customers:", error);
      setError("Failed to load customers.");
    }
  };

  // Fetch total orders
  const fetchTotalOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }
      // Count total orders including sub-orders
      const total = data.reduce((acc, order) => {
        return acc + 1 + (order.subOrders ? order.subOrders.length : 0);
      }, 0);
      setTotalOrders(total);
    } catch (error) {
      console.error("Error fetching total orders:", error);
      setError("Failed to load orders.");
    }
  };

  let inactivityTimer;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:8000/api/logout", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          navigate("/");
        }
      } catch (error) {
        console.error("Auto-logout failed:", error);
        navigate("/");
      }
    }, 900000); // 15 minutes
  };

 useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchPrices(), fetchTotalCustomers(), fetchTotalOrders()])
      .finally(() => setIsLoading(false));

    fetch('http://localhost:8000/api/check-session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => console.log(data));

    resetInactivityTimer();

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, [location.state?.refreshPrices]);

  const handleCreateOrderClick = () => {
    navigate("/createorder");
  };

  const handleTimePeriodChange = (event) => {
    console.log(`Selected time period: ${event.target.value}`);
  };

  const salesReportData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Earnings",
        data: [800, 600, 700, 500, 900],
        backgroundColor: "#4A90E2",
        borderWidth: 0,
        barThickness: 20,
      },
      {
        label: "Payments",
        data: [900, 1000, 900, 600, 1000],
        backgroundColor: "#FF6F91",
        borderWidth: 0,
        barThickness: 20,
      },
    ],
  };

  const salesReportOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12,
            family: "'Arial', sans-serif",
          },
          color: "#333",
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Sales Report",
        align: "start",
        font: {
          size: 18,
          weight: "bold",
          family: "'poppins', poppins",
        },
        color: "#008080",
        padding: {
          bottom: 18,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#333",
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
            family: "'Arial', sans-serif",
          },
        },
      },
      y: {
        min: 0,
        max: 1000,
        ticks: {
          stepSize: 200,
          color: "#666",
          font: {
            size: 12,
            family: "'poppins', poppins",
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const customerAnalyticsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Current Clients",
        data: [15, 10, 8, 12, 18, 20, 22, 15, 10, 14, 16, 20],
        backgroundColor: "#008080",
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: "Subscribers",
        data: [5, 7, 6, 4, 8, 6, 5, 7, 6, 5, 4, 6],
        backgroundColor: "#4A90E2",
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: "New Customers",
        data: [5, 3, 4, 2, 4, 3, 3, 4, 2, 3, 2, 4],
        backgroundColor: "#A0AEC0",
        borderWidth: 0,
        barPercentage: 0.8,
      },
    ],
  };

  const customerAnalyticsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12,
            family: "'poppins', poppins",
          },
          color: "#333",
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Customer Analytics",
        align: "start",
        font: {
          size: 18,
          weight: "bold",
          family: "'poppins', poppins",
        },
        color: "#008080",
        padding: {
          bottom: 18,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#333",
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
            family: "'poppins', poppins",
          },
        },
      },
      y: {
        stacked: true,
        min: 0,
        max: 30,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`,
          color: "#666",
          font: {
            size: 12,
            family: "'poppins', poppins",
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const activityStatsData = {
    datasets: [
      {
        data: [88, 12],
        backgroundColor: ["#38A169", "#CBD5E0"],
        borderWidth: 0,
      },
    ],
  };

  const activityStatsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const currentDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  });

  const cardData = [
    {
  title: "",
  items: [],
  customContent: (
    <div className="font-font">
          <div className="sm:bg-gray-100 sm:text-btnBg sm:h-[18rem] flex flex-col items-center justify-center relative">
            <div className="sm:top-2 sm:left-4 sm:w-8 sm:h-8 sm:absolute w-6 h-6 mt-2">
              <img src="/assets/img28.PNG" alt="" />
            </div>
            <select
              className="sm:absolute sm:top-2 sm:right-4 bg-gradient-to-br bg-gray-100 text-btnBg p-1 sm:p-2 rounded-lg border shadow-lg hover:scale-105 transition-all duration-300 ease-in-out text-sm sm:text-base mt-2 sm:mt-0 w-[120px] sm:w-auto"
              onChange={handleTimePeriodChange}
              defaultValue="this week"
            >
              <option value="this week">This week</option>
              <option value="this month">This month</option>
              <option value="this year">This year</option>
            </select>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-btnBg mx-auto"></div>
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
                  <div className="w-[9rem] sm:w-[11rem] h-[7rem] sm:h-[8rem] pt-2 flex flex-col items-center border shadow-lg rounded-2xl sm:rounded-3xl hover:scale-105 transition-all duration-300 ease-in-out bg-white sm:bg-transparent">
                    <FaPeopleGroup className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-btnBg" />
                    <p className="text-base sm:text-lg text-btnBg">Total customers</p>
                    <p className="text-xl sm:text-2xl font-bold text-btnBg">{totalCustomers}</p>
                  </div>
                  <div className="w-[9rem] sm:w-[11rem] h-[7rem] sm:h-[8rem] pt-2 flex flex-col items-center border shadow-lg rounded-2xl sm:rounded-3xl hover:scale-105 transition-all duration-300 ease-in-out bg-white sm:bg-transparent">
                    <FaBox className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-btnBg" />
                    <p className="text-base sm:text-lg text-btnBg">Total orders</p>
                    <p className="text-xl sm:text-2xl font-bold text-btnBg">{totalOrders}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
  ),
},
  {
  title: "",
  items: [],
  customContent: (
    <div className="bg-gray-100 text-white font-font">
      <div className="">
        <h3 className="text-lg font-semibold text-btnBg">Prices</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full sm:w-[499px] h-[14rem]">
        {[
          {
            name: "Pant",
            icon: <PiPantsThin className="text-2xl sm:text-4xl mb-1 sm:mb-2" />,
            price: prices.Pant,
          },
          {
            name: "Pant coat",
            icon: <GiLabCoat className="text-2xl sm:text-4xl mb-1 sm:mb-2" />,
            price: prices["Pantcoat"],
          },
          {
            name: "Waist coat",
            icon: <GiSleevelessJacket className="text-2xl sm:text-4xl mb-1 sm:mb-2" />,
            price: prices["Waistcoat"],
          },
          {
            name: "Coat",
            icon: <GiPirateCoat className="text-2xl sm:text-4xl mb-1 sm:mb-2" />,
            price: prices.Coat,
          },
          {
            name: "Shalwar Kameez",
            icon: <GiClothes className="text-xl sm:text-3xl mb-1 sm:mb-2" />,
            price: prices["Shalwarkameez"],
          },
          {
            name: "Shirt",
            icon: <GiPoloShirt className="text-2xl sm:text-4xl mb-1 sm:mb-2" />,
            price: prices.Shirt,
          },
        ].map((category, index) => (
          <button
            key={index}
            onClick={() => console.log(`Category clicked: ${category.name}`)}
            className="flex flex-col items-center p-1 sm:p-2 bg-btnBg rounded-2xl sm:rounded-3xl gap-1 sm:gap-3 hover:scale-105 transition-all duration-300 ease-in-out"
            aria-label={`Select ${category.name} category`}
          >
            {category.icon}
            <p className="text-[10px] sm:text-sm font-medium text-white">{category.name}</p>
            <p className="text-sm sm:text-lg font-bold text-white">{category.price}</p>
          </button>
        ))}
      </div>
    </div>
  ),
},
    {
      title: "",
      items: [],
      customContent: (
        <div className="h-[19rem] w-full">
          <Bar
            data={salesReportData}
            options={{
              ...salesReportOptions,
              responsive: true,
              maintainAspectRatio: false,
            }}
            height={null}
          />
        </div>
      ),
    },
    {
      title: "",
      items: [],
      customContent: (
        <div className="bg-gradient-to-br text-btnBg rounded-xl font-font h-[19rem]">
          <h3 className="text-xl font-semibold">Total Active Orders</h3>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-5xl font-bold text-btnBg">25</p>
            <div className="flex items-center mt-2">
              <svg
                className="w-5 h-5 text-btnBg mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 11.586V7z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-btnBg">+5.2% (Last 7 days)</p>
            </div>
            <p className="text-xs text-btnBg mt-4">Updated: {currentDate}</p>
            <button
              className="mt-6 bg-btnBg px-4 py-2 rounded-lg text-white hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={() => console.log("View Details clicked")}
            >
              View Details
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "",
      items: [],
      customContent: (
        <div className="h-[19rem] w-full">
          <Bar
            data={customerAnalyticsData}
            options={{
              ...customerAnalyticsOptions,
              responsive: true,
              maintainAspectRatio: false,
            }}
            height={null}
          />
        </div>
      ),
    },
    {
      title: "",
      items: [],
      customContent: (
        <div className="h-[22rem] font-font">
          <h3 className="text-lg font-bold mb-12 ml-4 text-btnBg">Activity Stats</h3>
          <div className="flex items-center justify-center h-auto">
            <div className="relative w-40 h-40">
              <Doughnut data={activityStatsData} options={activityStatsOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-4xl font-bold text-gray-800">88%</p>
              </div>
            </div>
            <div className="ml-6 flex flex-col justify-center h-full">
              <p className="text-lg text-gray-600 mb-2">
                Your activity rate is on 88%.
              </p>
              <p className="text-lg text-gray-600">
                It depends on your response time.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 bg-gray-100">
      <div className="flex justify-end md:pr-28 pr-[1rem]">
        <button
          className="border bg-btnBg md:w-[8rem] h-[3rem] w-[311px]  rounded-2xl text-white hover:scale-105 transition-all duration-300 ease-in-out"
          onClick={handleCreateOrderClick}
        >
          Create order
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-gray-100 rounded-2xl md:p-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cardData.map((card, index) => (
            <div key={index} className="h-[22rem] border md:p-6 p-3 rounded-3xl bg-gray-100 shadow-lg">
              {card.customContent ? (
                card.customContent
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-3">{card.title}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {card.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;