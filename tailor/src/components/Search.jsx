import React, { useState, useEffect, useRef } from "react";

const Search = ({ searchCustomers, onAddCustomer, onCreateOrder, customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    cnic: "",
    bookNo: "",
  });
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setErrors({});
      if (searchTerm.trim() === "") {
        console.log("Search term is empty, clearing results");
        setSearchResults([]);
        setIsDropdownOpen(false);
        setShowNewCustomerForm(false);
        return;
      }
      try {
        console.log(`Searching for customers with query: "${searchTerm}"`);
        const results = await searchCustomers(searchTerm);
        console.log("Search results:", results);
        setSearchResults(Array.isArray(results) ? results : []);
        setIsDropdownOpen(results.length > 0);
        setShowNewCustomerForm(results.length === 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setIsDropdownOpen(false);
        setShowNewCustomerForm(true);
        setErrors({ general: error.message || "Failed to fetch customers" });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchCustomers]);

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddCustomerClick = async () => {
    const newErrors = {};

    if (!newCustomer.name) {
      newErrors.name = "Name is required";
    } else {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(newCustomer.name)) {
        newErrors.name = "Name must contain only letters and spaces";
      }
    }

    if (!newCustomer.phone) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^\d{10,12}$/;
      if (!phoneRegex.test(newCustomer.phone)) {
        newErrors.phone = "Phone number must be 10-12 digits";
      }
    }

    if (!newCustomer.cnic) {
      newErrors.cnic = "CNIC is required";
    } else {
      const cnicRegex = /^\d{13}$/;
      if (!cnicRegex.test(newCustomer.cnic)) {
        newErrors.cnic = "CNIC must be 13 digits";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const customerData = {
      name: newCustomer.name,
      phone: newCustomer.phone,
      cnic: newCustomer.cnic,
      bookNo: newCustomer.bookNo || "",
    };

    try {
      console.log("Adding new customer:", customerData);
      const createdCustomer = await onAddCustomer(customerData);
      console.log("Created customer:", createdCustomer);
      if (createdCustomer) {
        setNewCustomer({ name: "", phone: "", cnic: "", bookNo: "" });
        setSearchTerm("");
        setShowNewCustomerForm(false);
        setErrors({});
        setCustomers((prev) => {
          if (!prev.some((c) => c._id === createdCustomer._id)) {
            return [...prev, createdCustomer];
          }
          return prev;
        });
        onCreateOrder(createdCustomer);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setErrors({ general: error.message || "Failed to add customer" });
    }
  };

  const handleCustomerSelect = (customer) => {
    console.log("Selected customer:", customer);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setShowNewCustomerForm(false);
    onCreateOrder(customer);
  };

  return (
    <div className="flex flex-col items-center mb-4 p-6 bg-gray-100 font-font">
      <h2 className="text-2xl font-bold mb-4 text-heading">Create Order</h2>
      <div className="relative w-full max-w-md">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
          />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full pl-10 pr-4 py-2 border-customBorder bg-inputBg rounded-xl text-black border border-borderColor input-custom"
        />
        {isDropdownOpen && searchResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute w-full max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-xl shadow-lg mt-1 z-50"
          >
            {searchResults.map((customer) => (
              <div
                key={customer._id}
                className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                onClick={() => handleCustomerSelect(customer)}
              >
                <span>{customer.name} ({customer.customerId})- ({customer.phone || "No phone"} )</span>
              </div>
            ))}
          </div>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-1 text-center">{errors.general}</p>
        )}
      </div>
      {showNewCustomerForm && (
        <div className="mt-4 w-full max-w-md bg-cardBg p-6 border rounded-3xl shadow-lg space-y-4 text-white">
          <h2 className="text-lg font-bold text-center text-heading font-font">
            No Customer Found
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={newCustomer.name}
                onChange={handleNewCustomerChange}
                placeholder=" "
                className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="name"
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                  newCustomer.name
                    ? "top-[-8px] text-xs text-blue-500"
                    : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500"
                }`}
              >
                Name
              </label>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                value={newCustomer.phone}
                onChange={handleNewCustomerChange}
                placeholder=" "
                className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="phone"
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                  newCustomer.phone
                    ? "top-[-8px] text-xs text-blue-500"
                    : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500"
                }`}
              >
                Phone
              </label>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="relative">
              <input
                id="cnic"
                name="cnic"
                type="text"
                value={newCustomer.cnic}
                onChange={handleNewCustomerChange}
                placeholder=" "
                className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="cnic"
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                  newCustomer.cnic
                    ? "top-[-8px] text-xs text-blue-500"
                    : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500"
                }`}
              >
                CNIC
              </label>
              {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
            </div>
            <div className="relative">
              <input
                id="bookNo"
                name="bookNo"
                type="text"
                value={newCustomer.bookNo}
                onChange={handleNewCustomerChange}
                placeholder=" "
                className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="bookNo"
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                  newCustomer.bookNo
                    ? "top-[-8px] text-xs text-blue-500"
                    : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500"
                }`}
              >
                Book No (Optional)
              </label>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleAddCustomerClick}
                className="w-[14rem] h-[41px] px-4 py-2 text-sm text-white transition-all bg-btnBg rounded-3xl font-font hover:bg-blue-600"
              >
                Add New Customer
              </button>
            </div>
            {errors.general && <p className="text-red-500 text-sm mt-1 text-center">{errors.general}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;