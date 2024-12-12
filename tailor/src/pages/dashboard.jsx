import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  

 

  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-black">Welcome to the Dashboard</h1>

        {/* Card with Total, Components, Pant */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-300">
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
