import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SingleCustomer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customer = state?.customer;

  if (!customer) {
    return (
      <div className="flex justify-center pt-[25px] font-font">
        <div className="p-6 rounded-xl w-[90%] md:w-[60rem] bg-cardBg border shadow-lg border-gradient">
          <h2 className="text-2xl font-bold mb-4 text-heading">Customer Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-[25px] font-font">
      <div className="p-6 rounded-xl w-[90%] md:w-[60rem] bg-cardBg border shadow-lg border-gradient">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-heading">Customer Details</h2>
          <button
            onClick={() => navigate("/customers")}
            className="px-4 py-2 text-sm text-white bg-btnBg rounded-2xl"
          >
            Back to Customers
          </button>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl">
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-heading">Customer ID:</span> {customer.customerId}
            </div>
            <div>
              <span className="font-semibold text-heading">Name:</span> {customer.name}
            </div>
            <div>
              <span className="font-semibold text-heading">Phone:</span> {customer.phone}
            </div>
            <div>
              <span className="font-semibold text-heading">CNIC:</span> {customer.cnic}
            </div>
            <div>
              <span className="font-semibold text-heading">Book No:</span> {customer.bookNo || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCustomer;