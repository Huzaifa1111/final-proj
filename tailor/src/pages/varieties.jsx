import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Varieties() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingNo, customerDetails } = location.state || {};

  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});
  const [savedMeasurements, setSavedMeasurements] = useState({});

  const measurementFields = {
    Pant: ["Waist", "Length", "Thigh", "Bottom"],
    Pantshirt: ["Chest", "Shoulder", "Sleeve", "Length"],
    Waistcoat: ["Chest", "Shoulder", "Waist", "Length"],
    Shalwaarkameez: ["Chest", "Shoulder", "Sleeve", "Length", "Shalwaar Length"],
    Coat: ["Chest", "Shoulder", "Sleeve", "Length", "Waist"],
  };

  const handleButtonClick = (type) => {
    setSelectedForm(type);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveMeasurements = (e) => {
    e.preventDefault();
    if (selectedForm) {
      setSavedMeasurements((prev) => ({
        ...prev,
        [selectedForm]: [
          ...(prev[selectedForm] || []),
          { ...formData, bookingNo },
        ],
      }));
      setFormData({});
      setSelectedForm("");
    }
  };

  const handleCreateOrder = (type, measurement) => {
    navigate("/createorder", {
      state: {
        customerDetails,
        bookingNo,
        type,
        measurement,
      },
    });
  };

  useEffect(() => {
    if (!location.state) {
      // Handle if no state is passed
    }
  }, [location]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
     {/* Top Heading */}
<h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-wide">
  {customerDetails?.name}'s Measurements 
  <span className="block text-lg text-gray-600 font-medium">
    (Booking #{bookingNo})
  </span>
</h1>

{/* Customer Details */}
<div className="bg-blue-50 p-6 rounded-lg shadow-lg mb-10 flex flex-col sm:flex-row justify-evenly gap-6 ">
  {/* Name */}
  <div className="text-center">
    <p className="text-lg font-medium text-blue-600">Name</p>
    <p className="text-xl font-bold text-gray-700">{customerDetails?.name}</p>
  </div>
  {/* Phone */}
  <div className="text-center">
    <p className="text-lg font-medium text-blue-600">Phone</p>
    <p className="text-xl font-bold text-gray-700">{customerDetails?.phone}</p>
  </div>
  {/* Booking No */}
  <div className="text-center">
    <p className="text-lg font-medium text-blue-600">Booking No</p>
    <p className="text-xl font-bold text-gray-700">{bookingNo}</p>
  </div>
</div>


{/* Buttons */}
<div className="mb-10 flex flex-wrap justify-center gap-4">
  {Object.keys(measurementFields).map((type) => (
    <button
      key={type}
      className="btn-gradient"
      onClick={() => handleButtonClick(type)}
    >
      {type}
    </button>
  ))}
</div>


      {selectedForm && (
        <div className="p-6 border border-gray-300 rounded-3xl bg-white w-full max-w-md mx-auto shadow-lg">
          <form onSubmit={handleSaveMeasurements}>
            {measurementFields[selectedForm].map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  {field}
                </label>
                <input
                  type="text"
                  name={field.toLowerCase()}
                  value={formData[field.toLowerCase()] || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-3xl"
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-3xl w-full hover:bg-black hover:text-white transition-all "
            >
              Save Measurements
            </button>
          </form>
        </div>
      )}
      {Object.keys(savedMeasurements).map((type) => (
        <div key={type} className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">{type} Measurements</h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr>
                {measurementFields[type].map((field, index) => (
                  <th key={index} className="border px-4 py-2">
                    {field}
                  </th>
                ))}
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedMeasurements[type].map((measurement, index) => (
                <tr key={index}>
                  {measurementFields[type].map((field, fieldIndex) => (
                    <td key={fieldIndex} className="border px-4 py-2">
                      {measurement[field.toLowerCase()] || "-"}
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleCreateOrder(type, measurement)}
                    >
                      Create Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Varieties;
