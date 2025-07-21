import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deleteSelectedConfirm, setDeleteSelectedConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    cnic: "",
    bookNo: "",
  });
  const [errors, setErrors] = useState({});

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${baseURL}/customers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customers");
      }
      const sortedCustomers = data.sort((a, b) =>
        a.name && b.name ? a.name.localeCompare(b.name) : 0
      );
      setCustomers(sortedCustomers);
      setFilteredCustomers(sortedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setErrorMessage("Failed to load customers. Please try again.");
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    setCurrentPage(1);
    if (query.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        customer.name &&
        typeof customer.name === 'string' &&
        customer.name.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const onAddCustomer = async (newCustomer) => {
    try {
      const response = await fetch(`${baseURL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add customer");
      }
      const customer = data.customer;
      setCustomers((prev) => {
        const updatedCustomers = [...prev, customer].sort((a, b) =>
          a.name && b.name ? a.name.localeCompare(b.name) : 0
        );
        setFilteredCustomers(updatedCustomers);
        return updatedCustomers;
      });
      setErrorMessage("");
      return customer;
    } catch (error) {
      console.error("Error adding customer:", error);
      setErrorMessage(
        error.message ||
          "Failed to add customer. Please check your connection or try again."
      );
      return null;
    }
  };

  const updateCustomer = async (updatedCustomer) => {
    try {
      const response = await fetch(
        `${baseURL}/customers/${updatedCustomer._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCustomer),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update customer");
      }
      const customer = data.customer;
      setCustomers((prev) =>
        prev
          .map((c) => (c._id === customer._id ? customer : c))
          .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0))
      );
      setFilteredCustomers((prev) =>
        prev
          .map((c) => (c._id === customer._id ? customer : c))
          .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0))
      );
      setErrorMessage("");
      return customer;
    } catch (error) {
      console.error("Error updating customer:", error);
      setErrorMessage("Failed to update customer.");
      return null;
    }
  };

  const deleteCustomerFromDB = async (customerId) => {
    try {
      const response = await fetch(`${baseURL}/customers/${customerId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete customer");
      }
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      setErrorMessage("Failed to delete customer.");
      return false;
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(paginatedCustomers.map((c) => c._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((c) => c !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleEditClick = (customer) => {
    setEditCustomer({ ...customer });
    setDeleteCustomer(null);
    setDeleteAllConfirm(false);
    setDeleteSelectedConfirm(false);
  };

  const handleViewClick = (customer) => {
    navigate(`/customer/${customer._id}`, { state: { customer } });
  };

  const handleDeleteClick = (customer) => {
    setDeleteCustomer(customer);
    setEditCustomer(null);
    setDeleteAllConfirm(false);
    setDeleteSelectedConfirm(false);
  };

  const confirmDelete = async () => {
    const success = await deleteCustomerFromDB(deleteCustomer._id);
    if (success) {
      setCustomers(customers.filter((c) => c._id !== deleteCustomer._id));
      setFilteredCustomers(filteredCustomers.filter((c) => c._id !== deleteCustomer._id));
      setSelectedCustomers(
        selectedCustomers.filter((id) => id !== deleteCustomer._id)
      );
      setDeleteCustomer(null);
    }
  };

  const handleDeleteAllClick = () => {
    setDeleteAllConfirm(true);
    setEditCustomer(null);
    setDeleteCustomer(null);
    setDeleteSelectedConfirm(false);
  };

  const confirmDeleteAll = async () => {
    for (const id of selectedCustomers) {
      await deleteCustomerFromDB(id);
    }
    setCustomers(customers.filter((c) => !selectedCustomers.includes(c._id)));
    setFilteredCustomers(filteredCustomers.filter((c) => !selectedCustomers.includes(c._id)));
    setSelectedCustomers([]);
    setDeleteAllConfirm(false);
    setCurrentPage(1);
  };

  const handleDeleteSelectedClick = () => {
    setDeleteSelectedConfirm(true);
    setEditCustomer(null);
    setDeleteCustomer(null);
    setDeleteAllConfirm(false);
  };

  const confirmDeleteSelected = async () => {
    for (const id of selectedCustomers) {
      await deleteCustomerFromDB(id);
    }
    setCustomers(customers.filter((c) => !selectedCustomers.includes(c._id)));
    setFilteredCustomers(filteredCustomers.filter((c) => !selectedCustomers.includes(c._id)));
    setSelectedCustomers([]);
    setDeleteSelectedConfirm(false);
    setCurrentPage(1);
  };

  const handleSaveEdit = async () => {
    const updatedCustomer = await updateCustomer(editCustomer);
    if (updatedCustomer) {
      setEditCustomer(null);
    }
  };

  const handleNewCustomerChange = (e) => {
    const { id, value } = e.target;
    const field = id.toLowerCase().replace(" ", "");
    setNewCustomer((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
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

    const createdCustomer = await onAddCustomer(newCustomer);
    if (createdCustomer) {
      setNewCustomer({ name: "", phone: "", cnic: "", bookNo: "" });
      setShowNewCustomerForm(false);
      setErrors({});
    }
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex justify-center pt-[11px] sm:pt-[20px] md:pt-[11px] font-font">
      <div className="mb-3 sm:mb-1 md:mb-2 p-4 sm:p-6 md:p-6 rounded-xl space-y-1 w-[95%] sm:w-[90%] md:w-[80%] bg-cardBg border shadow-lg border-gradient">
        <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-left text-heading">
          Customer List
        </h1>
        <div className="flex flex-col space-y-2 sm:items-end">
          <div>
            <button
              onClick={() => setShowNewCustomerForm(true)}
              className="px-2 py-2 sm:py-2 md:py-2 text-xs sm:text-xs md:text-sm text-white bg-btnBg rounded-xl flex items-center space-x-1 w-full sm:w-auto"
            >
              <FaPlus />
              <span>Add New Customer</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-2 py-2 text-xs sm:text-xs md:text-sm text-white bg-btnBg rounded-xl w-full sm:w-auto">
              Export
            </button>
            <button className="px-2 py-1 text-xs sm:text-xs md:text-sm text-white bg-btnBg rounded-xl w-full sm:w-auto">
              Import
            </button>
          </div>
        </div>

        <div className="relative flex justify-center mb-4">
          <svg
            className="relative md:left-12 left-12 top-[6px] transform translate-y-1/2 w-4 h-4 text-gray-500"
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
            onChange={handleSearchChange}
            placeholder="Search by Customer Name"
            className="text-center w-[20rem] md:w-[31rem] px-10 py-2 border-customBorder bg-inputBg rounded-xl text-black input-custom border-borderColor text-xs sm:text-sm md:text-base"
          />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4 text-xs sm:text-sm md:text-base">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 md:mb-6 bg-gray-100 p-2 sm:p-3 md:p-3 rounded-xl">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center mb-2 sm:mb-0">
            <FaPeopleGroup className="text-xl sm:text-xl md:text-2xl text-btnBg" />
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-1 sm:p-2 md:p-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-sm bg-gray-200 w-[80px] sm:w-auto"
            >
              {[25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="w-[8rem] sm:w-[9rem] md:w-[9rem] h-[30px] sm:h-[34px] md:h-[34px] bg-gradient-to-r from-blue-400 to-teal-600 text-white px-2 sm:px-3 md:px-3 py-1 sm:py-2 md:py-2 rounded-xl sm:rounded-2xl md:rounded-2xl shadow-md flex items-center space-x-1 sm:space-x-2 md:space-x-2">
              <span className="font-semibold text-xs sm:text-sm md:text-sm">
                Total Customers: {filteredCustomers.length}
              </span>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-2 md:space-x-2 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              <svg
                className="w-[18px] sm:w-[20px] md:w-[22px] h-[18px] sm:h-[20px] md:h-[22px] text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 sm:px-3 md:px-3 py-1 rounded-lg text-xs sm:text-sm md:text-base ${
                  currentPage === page ? "bg-btnBg text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              <svg
                className="w-[18px] sm:w-[20px] md:w-[22px] h-[18px] sm:h-[20px] md:h-[22px] text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 md:px-3 py-1 rounded-lg text-xs sm:text-sm md:text-base bg-gray-200 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div>
              <input
                type="checkbox"
                checked={
                  selectedCustomers.length === paginatedCustomers.length &&
                  paginatedCustomers.length > 0
                }
                onChange={handleSelectAll}
              />
              <label className="ml-2 text-heading text-xs sm:text-sm md:text-base">
                Select All
              </label>
            </div>
            {selectedCustomers.length > 0 &&
              selectedCustomers.length < paginatedCustomers.length && (
                <button
                  onClick={handleDeleteSelectedClick}
                  className="px-2 py-1 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-xl"
                >
                  Delete Selected
                </button>
              )}
            {selectedCustomers.length === paginatedCustomers.length &&
              paginatedCustomers.length > 0 && (
                <button
                  onClick={handleDeleteAllClick}
                  className="px-2 py-1 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-xl"
                >
                  Delete All
                </button>
              )}
          </div>
        </div>
        <div className="overflow-x-auto max-h-[300px] sm:max-h-[400px] md:max-h-[400px] overflow-y-auto border rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm md:text-base">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="p-1 sm:p-2 md:p-2 border">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomers.length === paginatedCustomers.length &&
                      paginatedCustomers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-1 sm:p-2 md:p-2 border w-[100px] sm:w-[120px] md:w-[150px]">
                  Customer ID
                </th>
                <th className="p-1 sm:p-2 md:p-2 border">Name</th>
                <th className="p-1 sm:p-2 md:p-2 border">Phone</th>
                <th className="p-1 sm:p-2 md:p-2 border">CNIC</th>
                <th className="p-1 sm:p-2 md:p-2 border w-[120px] sm:w-[150px] md:w-[170px]">
                  Book No
                </th>
                <th className="p-1 sm:p-2 md:p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-1 sm:p-2 md:p-2 border text-center"
                  >
                    No customers available
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b">
                    <td className="p-1 sm:p-2 md:p-2 border">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={() => handleSelectCustomer(customer._id)}
                      />
                    </td>
                    <td className="p-1 sm:p-2 md:p-2 border">
                      {customer.customerId}
                    </td>
                    <td className="p-1 sm:p-2 md:p-2 border">
                      {customer.name}
                    </td>
                    <td className="p-1 sm:p-2 md:p-2 border">
                      {customer.phone}
                    </td>
                    <td className="p-1 sm:p-2 md:p-2 border">
                      {customer.cnic}
                    </td>
                    <td className="p-1 sm:p-2 md:p-2 border text-center">
                      {customer.bookNo || "N/A"}
                    </td>
                    <td className="p-1 sm:p-2 md:p-2 border flex space-x-1 sm:space-x-2 md:space-x-2 justify-center">
                      <button onClick={() => handleEditClick(customer)}>
                        <FaEdit className="text-blue-500 text-sm sm:text-sm md:text-base" />
                      </button>
                      <button onClick={() => handleViewClick(customer)}>
                        <FaEye className="text-green-500 text-sm sm:text-sm md:text-base" />
                      </button>
                      <button onClick={() => handleDeleteClick(customer)}>
                        <FaTrash className="text-red-500 text-sm sm:text-sm md:text-base" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {editCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50">
            <div className="bg-gray-100 p-4 sm:p-6 md:p-6 rounded-xl shadow-lg w-[95%] sm:w-[90%] md:w-[40rem] max-h-[80vh] overflow-y-auto">
              <h2 className="text-base sm:text-lg md:text-lg font-bold text-center text-heading sticky top-0 bg-gray-100 z-10">
                Edit Customer
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-4 mt-4">
                <div className="relative">
                  <input
                    id="customerId"
                    type="text"
                    value={editCustomer.customerId}
                    disabled
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="customerId"
                    className={`absolute left-3 sm:left-4 md:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editCustomer.customerId
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Customer ID
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={editCustomer.name}
                    onChange={(e) =>
                      setEditCustomer({ ...editCustomer, name: e.target.value })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-3 sm:left-4 md:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editCustomer.name
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="phone"
                    type="text"
                    value={editCustomer.phone}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        phone: e.target.value,
                      })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="phone"
                    className={`absolute left-3 sm:left-4 md:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editCustomer.phone
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Phone
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="cnic"
                    type="text"
                    value={editCustomer.cnic}
                    onChange={(e) =>
                      setEditCustomer({ ...editCustomer, cnic: e.target.value })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="cnic"
                    className={`absolute left-3 sm:left-4 md:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editCustomer.cnic
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    CNIC
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="bookNo"
                    type="text"
                    value={editCustomer.bookNo}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        bookNo: e.target.value,
                      })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="bookNo"
                    className={`absolute left-3 sm:left-4 md:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editCustomer.bookNo
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Book No (Optional)
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-4 mt-4 sm:mt-6 md:mt-6 sticky bottom-0 bg-gray-100 z-10">
                <button
                  onClick={handleSaveEdit}
                  className="w-full sm:w-[14rem] md:w-[14rem] h-[36px] sm:h-[41px] md:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-btnBg rounded-3xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCustomer(null)}
                  className="w-full sm:w-[14rem] md:w-[14rem] h-[36px] sm:h-[41px] md:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-6 md:p-6 rounded-xl shadow-lg w-[90%] sm:w-[400px] md:w-[400px]">
              <h2 className="text-base sm:text-lg md:text-lg font-bold mb-4">
                Are you sure you want to delete {deleteCustomer.name}?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-4">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-3xl w-full sm:w-auto"
                >
                  Yes
                </button>
                <button
                  onClick={() => setDeleteCustomer(null)}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl w-full sm:w-auto"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteAllConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-6 md:p-6 rounded-xl shadow-lg w-[90%] sm:w-[400px] md:w-[400px]">
              <h2 className="text-base sm:text-lg md:text-lg font-bold mb-4">
                Are you sure you want to delete all selected customers?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-4">
                <button
                  onClick={confirmDeleteAll}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-3xl w-full sm:w-auto"
                >
                  Yes
                </button>
                <button
                  onClick={() => setDeleteAllConfirm(false)}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl w-full sm:w-auto"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteSelectedConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-6 md:p-6 rounded-xl shadow-lg w-[90%] sm:w-[400px] md:w-[400px]">
              <h2 className="text-base sm:text-lg md:text-lg font-bold mb-4">
                Are you sure you want to delete the selected customers?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-4">
                <button
                  onClick={confirmDeleteSelected}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-3xl w-full sm:w-auto"
                >
                  Yes
                </button>
                <button
                  onClick={() => setDeleteSelectedConfirm(false)}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl w-full sm:w-auto"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {showNewCustomerForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50">
            <div className="bg-cardBg p-4 sm:p-6 md:p-6 rounded-3xl shadow-lg w-[95%] sm:w-[90%] md:w-[40rem] max-h-[80vh] overflow-y-auto">
              <h2 className="text-base sm:text-lg md:text-lg font-bold text-center text-heading font-font">
                Add New Customer
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-4 mt-4">
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={newCustomer.name}
                    onChange={handleNewCustomerChange}
                    placeholder=" "
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-3 sm:left-4 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 text-xs sm:text-sm md:text-sm ${
                      newCustomer.name
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    Name
                  </label>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="phone"
                    type="text"
                    value={newCustomer.phone}
                    onChange={handleNewCustomerChange}
                    placeholder=" "
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="phone"
                    className={`absolute left-3 sm:left-4 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 text-xs sm:text-sm md:text-sm ${
                      newCustomer.phone
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    Phone
                  </label>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="cnic"
                    type="text"
                    value={newCustomer.cnic}
                    onChange={handleNewCustomerChange}
                    placeholder=" "
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="cnic"
                    className={`absolute left-3 sm:left-4 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 text-xs sm:text-sm md:text-sm ${
                      newCustomer.cnic
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    CNIC
                  </label>
                  {errors.cnic && (
                    <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="bookNo"
                    type="text"
                    value={newCustomer.bookNo}
                    onChange={handleNewCustomerChange}
                    placeholder=" "
                    className="input-custom peer w-full px-3 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="bookNo"
                    className={`absolute left-3 sm:left-4 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 text-xs sm:text-sm md:text-sm ${
                      newCustomer.bookNo
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    Book No (Optional)
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 md:space-x-6 mt-4 sm:mt-6 md:mt-6">
                  <button
                    onClick={handleAddCustomerClick}
                    className="w-full sm:w-[14rem] md:w-[14rem] h-[36px] sm:h-[41px] md:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white transition-all bg-btnBg rounded-3xl btn font-font"
                  >
                    Add New Customer
                  </button>
                  <button
                    onClick={() => setShowNewCustomerForm(false)}
                    className="w-full sm:w-[14rem] md:w-[14rem] h-[36px] sm:h-[41px] md:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;