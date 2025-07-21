import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

const API_BASE_URL = "http://localhost:8000"; // Adjust to your backend port

const Karigar = () => {
  const navigate = useNavigate();
  const [karigars, setKarigars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKarigars, setFilteredKarigars] = useState([]);
  const [selectedKarigars, setSelectedKarigars] = useState([]);
  const [editKarigar, setEditKarigar] = useState(null);
  const [deleteKarigar, setDeleteKarigar] = useState(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deleteSelectedConfirm, setDeleteSelectedConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [addKarigar, setAddKarigar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const karigarTypeOptions = ["Shalwaar Kameez", "Coat", "Waist Coat", "Pant", "Shirt", "Kurta"];

  useEffect(() => {
    fetchKarigars();
  }, []);

  const fetchKarigars = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/karigars`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Karigar API endpoint not found. Please check server configuration.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      const data = await response.json();
      const sortedKarigars = data.sort((a, b) =>
        a.name && b.name ? a.name.localeCompare(b.name) : 0
      );
      setKarigars(sortedKarigars);
      setFilteredKarigars(sortedKarigars);
    } catch (error) {
      console.error("Error fetching karigars:", error);
      setErrorMessage(error.message || "Failed to load karigars. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setErrorMessage("");
    setCurrentPage(1);
    if (value.trim() === "") {
      setFilteredKarigars(karigars);
    } else {
      const filtered = karigars.filter((karigar) =>
        karigar.name &&
        typeof karigar.name === "string" &&
        karigar.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredKarigars(filtered);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKarigars(paginatedKarigars.map((k) => k.karigarId));
    } else {
      setSelectedKarigars([]);
    }
  };

  const handleSelectKarigar = (id) => {
    if (selectedKarigars.includes(id)) {
      setSelectedKarigars(selectedKarigars.filter((k) => k !== id));
    } else {
      setSelectedKarigars([...selectedKarigars, id]);
    }
  };

  const handleEditClick = (karigar) => {
    setEditKarigar({ ...karigar, dateCreated: new Date(karigar.dateCreated).toISOString().split('T')[0] });
    setDeleteKarigar(null);
    setDeleteAllConfirm(false);
    setDeleteSelectedConfirm(false);
    setAddKarigar(null);
    setErrorMessage("");
  };

  const handleViewClick = (karigar) => {
    navigate(`/karigar/${karigar.karigarId}`, { state: { karigar } });
  };

  const handleDeleteClick = (karigar) => {
    setDeleteKarigar(karigar);
    setEditKarigar(null);
    setDeleteAllConfirm(false);
    setDeleteSelectedConfirm(false);
    setAddKarigar(null);
    setErrorMessage("");
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/karigars/${deleteKarigar.karigarId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Delete API endpoint not found. Please check server configuration.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setKarigars(karigars.filter((k) => k.karigarId !== deleteKarigar.karigarId));
      setFilteredKarigars(filteredKarigars.filter((k) => k.karigarId !== deleteKarigar.karigarId));
      setSelectedKarigars(selectedKarigars.filter((id) => id !== deleteKarigar.karigarId));
      setDeleteKarigar(null);
    } catch (error) {
      console.error("Error deleting karigar:", error);
      setErrorMessage(error.message || "Failed to delete karigar. Please try again.");
    }
  };

  const handleDeleteAllClick = () => {
    setDeleteAllConfirm(true);
    setEditKarigar(null);
    setDeleteKarigar(null);
    setDeleteSelectedConfirm(false);
    setAddKarigar(null);
    setErrorMessage("");
  };

  const confirmDeleteAll = async () => {
    try {
      for (const id of selectedKarigars) {
        const response = await fetch(`${API_BASE_URL}/api/karigars/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Delete API endpoint not found. Please check server configuration.");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      setKarigars(karigars.filter((k) => !selectedKarigars.includes(k.karigarId)));
      setFilteredKarigars(filteredKarigars.filter((k) => !selectedKarigars.includes(k.karigarId)));
      setSelectedKarigars([]);
      setDeleteAllConfirm(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting all karigars:", error);
      setErrorMessage(error.message || "Failed to delete selected karigars. Please try again.");
    }
  };

  const handleDeleteSelectedClick = () => {
    setDeleteSelectedConfirm(true);
    setEditKarigar(null);
    setDeleteKarigar(null);
    setDeleteAllConfirm(false);
    setAddKarigar(null);
    setErrorMessage("");
  };

  const confirmDeleteSelected = async () => {
    try {
      for (const id of selectedKarigars) {
        const response = await fetch(`${API_BASE_URL}/api/karigars/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Delete API endpoint not found. Please check server configuration.");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      setKarigars(karigars.filter((k) => !selectedKarigars.includes(k.karigarId)));
      setFilteredKarigars(filteredKarigars.filter((k) => !selectedKarigars.includes(k.karigarId)));
      setSelectedKarigars([]);
      setDeleteSelectedConfirm(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting selected karigars:", error);
      setErrorMessage(error.message || "Failed to delete selected karigars. Please try again.");
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (!editKarigar.name || !editKarigar.name.trim()) {
        setErrorMessage("Name is required");
        return;
      }
      if (!editKarigar.phone || !editKarigar.phone.trim()) {
        setErrorMessage("Phone number is required");
        return;
      }
      if (!Array.isArray(editKarigar.karigarType) || editKarigar.karigarType.length === 0) {
        setErrorMessage("At least one karigar type must be selected");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/karigars/${editKarigar.karigarId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editKarigar.name.trim(),
          phone: editKarigar.phone.trim(),
          karigarType: editKarigar.karigarType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error("Karigar not found or API endpoint unavailable.");
        }
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        }
        if (response.status === 400) {
          throw new Error(errorData.message || "Invalid input data.");
        }
        throw new Error(errorData.message || "Server error updating karigar.");
      }

      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const updatedKarigar = await response.json();
      setKarigars(karigars.map((k) => (k.karigarId === editKarigar.karigarId ? updatedKarigar.karigar : k)));
      setFilteredKarigars(filteredKarigars.map((k) => (k.karigarId === editKarigar.karigarId ? updatedKarigar.karigar : k)));
      setEditKarigar(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating karigar:", error);
      setErrorMessage(error.message || "Failed to update karigar. Please try again.");
    }
  };

  const handleAddKarigarClick = () => {
    setAddKarigar({ name: "", phone: "", karigarType: [], karigarId: "", dateCreated: new Date().toISOString().split('T')[0] });
    setEditKarigar(null);
    setDeleteKarigar(null);
    setDeleteAllConfirm(false);
    setDeleteSelectedConfirm(false);
    setErrorMessage("");
  };

  const handleSaveAdd = async () => {
    if (!addKarigar.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }
    if (!addKarigar.phone.trim()) {
      setErrorMessage("Phone number is required");
      return;
    }
    if (addKarigar.karigarType.length === 0) {
      setErrorMessage("At least one karigar type must be selected");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/karigars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: addKarigar.name.trim(),
          phone: addKarigar.phone.trim(),
          karigarType: addKarigar.karigarType,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Karigar API endpoint not found. Please check server configuration.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const newKarigar = await response.json();
      const sortedKarigars = [...karigars, newKarigar.karigar].sort((a, b) =>
        a.name && b.name ? a.name.localeCompare(b.name) : 0
      );
      setKarigars(sortedKarigars);
      setFilteredKarigars(sortedKarigars);
      setAddKarigar(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding karigar:", error);
      setErrorMessage(error.message || "Failed to add karigar. Please try again.");
    }
  };

  const handleKarigarTypeChange = (type, isAddModal) => {
    if (isAddModal) {
      setAddKarigar({
        ...addKarigar,
        karigarType: addKarigar.karigarType.includes(type)
          ? addKarigar.karigarType.filter((t) => t !== type)
          : [...addKarigar.karigarType, type],
      });
    } else {
      setEditKarigar({
        ...editKarigar,
        karigarType: editKarigar.karigarType.includes(type)
          ? editKarigar.karigarType.filter((t) => t !== type)
          : [...editKarigar.karigarType, type],
      });
    }
  };

  const totalPages = Math.ceil(filteredKarigars.length / itemsPerPage);
  const paginatedKarigars = filteredKarigars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex justify-center pt-4 sm:pt-5 font-font">
      <div className="mb-3 sm:mb-4 p-4 sm:p-5 md:p-6 rounded-xl space-y-2 w-[95%] sm:w-[90%] md:w-[60rem] bg-cardBg border shadow-lg border-gradient">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm md:text-base">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-left text-heading">
            Karigar List
          </h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleAddKarigarClick}
              className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-sm text-white bg-btnBg rounded-xl flex items-center space-x-1"
            >
              <FaPlus />
              <span>Add New Karigar</span>
            </button>
            <div className="flex space-x-2">
              <button className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-sm text-white bg-btnBg rounded-xl">
                Export
              </button>
              <button className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-sm text-white bg-btnBg rounded-xl">
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex justify-center mb-3 sm:mb-4">
          <svg
            className="absolute left-2 sm:left-56  top-1/2 transform -translate-y-1/2 w-4 sm:w-4 h-4 sm:h-4 text-gray-500"
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
            placeholder="Search by Karigar Name"
            className="w-full sm:w-[20rem] md:w-[31rem] px-8 sm:px-10 py-1 sm:py-2 border-customBorder bg-inputBg rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
          />
        </div>

        {/* Pagination and Total Karigars Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 md:mb-6 bg-gray-100 p-2 sm:p-3 rounded-xl">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center mb-2 sm:mb-0">
            <FaPeopleGroup className="text-lg sm:text-xl md:text-2xl text-btnBg" />
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-1 sm:p-2 rounded-xl text-xs sm:text-sm md:text-sm bg-gray-200 w-[80px] sm:w-auto"
            >
              {[25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="w-[8rem] sm:w-[9rem] h-[28px] sm:h-[34px] bg-gradient-to-r from-blue-400 to-teal-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-xl shadow-md flex items-center space-x-1 sm:space-x-2">
              <span className="font-semibold text-xs sm:text-sm md:text-sm">
                Total Karigars: {filteredKarigars.length}
              </span>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-2 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              <svg
                className="w-4 sm:w-5 md:w-[22px] h-4 sm:h-5 md:h-[22px] text-gray-600"
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
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm md:text-base ${
                  currentPage === page ? "bg-btnBg text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              <svg
                className="w-4 sm:w-5 md:w-[22px] h-4 sm:h-5 md:h-[22px] text-gray-600"
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
              className="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm md:text-base bg-gray-200 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>

        {/* Select All, Delete All, Delete Selected */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div>
              <input
                type="checkbox"
                checked={selectedKarigars.length === paginatedKarigars.length && paginatedKarigars.length > 0}
                onChange={handleSelectAll}
              />
              <label className="ml-2 text-heading text-xs sm:text-sm md:text-base">
                Select All
              </label>
            </div>
            {selectedKarigars.length > 0 && selectedKarigars.length < paginatedKarigars.length && (
              <button
                onClick={handleDeleteSelectedClick}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-xl"
              >
                Delete Selected
              </button>
            )}
            {selectedKarigars.length === paginatedKarigars.length && paginatedKarigars.length > 0 && (
              <button
                onClick={handleDeleteAllClick}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-xl"
              >
                Delete All
              </button>
            )}
          </div>
        </div>

        {/* Table with Scrollable Container */}
        <div className="overflow-x-auto max-h-[300px] sm:max-h-[400px] border rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm md:text-base">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="p-1 sm:p-2 border">
                  <input
                    type="checkbox"
                    checked={selectedKarigars.length === paginatedKarigars.length && paginatedKarigars.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-1 sm:p-2 border w-[100px] sm:w-[120px] md:w-[150px]">
                  Karigar ID
                </th>
                <th className="p-1 sm:p-2 border">Name</th>
                <th className="p-1 sm:p-2 border">Phone Number</th>
                <th className="p-1 sm:p-2 border w-[120px] sm:w-[150px] md:w-[170px]">
                  Karigar Type
                </th>
                <th className="p-1 sm:p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedKarigars.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-1 sm:p-2 border text-center">
                    No karigars available
                  </td>
                </tr>
              ) : (
                paginatedKarigars.map((karigar) => (
                  <tr key={karigar.karigarId} className="border-b">
                    <td className="p-1 sm:p-2 border">
                      <input
                        type="checkbox"
                        checked={selectedKarigars.includes(karigar.karigarId)}
                        onChange={() => handleSelectKarigar(karigar.karigarId)}
                      />
                    </td>
                    <td className="p-1 sm:p-2 border">{karigar.karigarId}</td>
                    <td className="p-1 sm:p-2 border">{karigar.name}</td>
                    <td className="p-1 sm:p-2 border">{karigar.phone}</td>
                    <td className="p-1 sm:p-2 border text-center">
                      {karigar.karigarType.join(", ")}
                    </td>
                    <td className="p-1 sm:p-2 border flex space-x-1 sm:space-x-2 justify-center">
                      <button onClick={() => handleEditClick(karigar)}>
                        <FaEdit className="text-blue-500 text-sm sm:text-base" />
                      </button>
                      <button onClick={() => handleViewClick(karigar)}>
                        <FaEye className="text-green-500 text-sm sm:text-base" />
                      </button>
                      <button onClick={() => handleDeleteClick(karigar)}>
                        <FaTrash className="text-red-500 text-sm sm:text-base" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Karigar Modal */}
        {addKarigar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50">
            <div className="bg-gray-100 p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-[95%] sm:w-[90%] md:w-[40rem] max-h-[80vh] overflow-y-auto">
              <h2 className="text-base sm:text-lg md:text-lg font-bold text-center text-heading sticky top-0 bg-gray-100 z-10">
                Add New Karigar
              </h2>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-3 sm:space-y-4 mt-4">
                <div className="relative">
                  <input
                    id="Name"
                    type="text"
                    value={addKarigar.name}
                    onChange={(e) =>
                      setAddKarigar({ ...addKarigar, name: e.target.value })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                    placeholder=" "
                  />
                  <label
                    htmlFor="Name"
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      addKarigar.name
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="Phone"
                    type="text"
                    value={addKarigar.phone}
                    onChange={(e) =>
                      setAddKarigar({ ...addKarigar, phone: e.target.value })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                    placeholder=" "
                  />
                  <label
                    htmlFor="Phone"
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      addKarigar.phone
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    Phone
                  </label>
                </div>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {karigarTypeOptions.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`add-${type}`}
                          checked={addKarigar.karigarType.includes(type)}
                          onChange={() => handleKarigarTypeChange(type, true)}
                          className="mr-2"
                        />
                        <label htmlFor={`add-${type}`} className="text-xs sm:text-sm md:text-base">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  <label
                    className="  absolute left-3 sm:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 top-[-16px] text-xs sm:text-xs md:text-xs"
                  >
                    Karigar Type
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="DateCreated"
                    type="date"
                    value={addKarigar.dateCreated}
                    disabled
                    className="input-custom peer w-full px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="DateCreated"
                    className={`absolute left-3 sm:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      addKarigar.dateCreated
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Date Created
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6 sticky bottom-0 bg-gray-100 z-10">
                <button
                  onClick={handleSaveAdd}
                  className="w-full sm:w-[14rem] h-[36px] sm:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-btnBg rounded-3xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setAddKarigar(null)}
                  className="w-full sm:w-[14rem] h-[36px] sm:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Karigar Modal */}
        {editKarigar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50">
            <div className="bg-gray-100 p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-[95%] sm:w-[90%] md:w-[40rem] max-h-[80vh] overflow-y-auto">
              <h2 className="text-base sm:text-lg md:text-lg font-bold text-center text-heading sticky top-0 bg-gray-100 z-10">
                Edit Karigar
              </h2>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-3 sm:space-y-4 mt-4">
                <div className="relative">
                  <input
                    id="ID"
                    type="text"
                    value={editKarigar.karigarId}
                    disabled
                    className="input-custom peer w-full px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="ID"
                    className={`absolute left-3 sm:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editKarigar.karigarId
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Karigar ID
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="Name"
                    type="text"
                    value={editKarigar.name}
                    onChange={(e) =>
                      setEditKarigar({ ...editKarigar, name: e.target.value })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                    placeholder=" "
                  />
                  <label
                    htmlFor="Name"
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editKarigar.name
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="Phone"
                    type="text"
                    value={editKarigar.phone}
                    onChange={(e) =>
                      setEditKarigar({ ...editKarigar, phone: e.target.value })
                    }
                    className="input-custom peer w-full px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                    placeholder=" "
                  />
                  <label
                    htmlFor="Phone"
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editKarigar.phone
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500"
                    }`}
                  >
                    Phone
                  </label>
                </div>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {karigarTypeOptions.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-${type}`}
                          checked={editKarigar.karigarType.includes(type)}
                          onChange={() => handleKarigarTypeChange(type, false)}
                          className="mr-2"
                        />
                        <label htmlFor={`edit-${type}`} className="text-xs sm:text-sm md:text-base">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  <label
                    className="absolute left-3 sm:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 top-[-8px] text-xs sm:text-xs md:text-xs"
                  >
                    Karigar Type
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="DateCreated"
                    type="date"
                    value={editKarigar.dateCreated}
                    disabled
                    className="input-custom peer w-full px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-black border border-borderColor text-xs sm:text-sm md:text-base"
                  />
                  <label
                    htmlFor="DateCreated"
                    className={`absolute left-3 sm:left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm ${
                      editKarigar.dateCreated
                        ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Date Created
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6 sticky bottom-0 bg-gray-100 z-10">
                <button
                  onClick={handleSaveEdit}
                  className="w-full sm:w-[14rem] h-[36px] sm:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-btnBg rounded-3xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditKarigar(null)}
                  className="w-full sm:w-[14rem] h-[36px] sm:h-[41px] px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteKarigar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg w-[90%] sm:w-[400px]">
              <h2 className="text-base sm:text-lg md:text-lg font-bold mb-3 sm:mb-4 text-center">
                Are you sure you want to delete {deleteKarigar.name}?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-red-500 rounded-3xl w-full sm:w-auto"
                >
                  Yes
                </button>
                <button
                  onClick={() => setDeleteKarigar(null)}
                  className="px-4 py-2 text-xs sm:text-sm md:text-sm text-white bg-gray-500 rounded-3xl w-full sm:w-auto"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete All Confirmation Modal */}
        {deleteAllConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg w-[90%] sm:w-[400px]">
              <h2 className="text-base sm:text-lg md:text-lg font-bold mb-3 sm:mb-4 text-center">
                Are you sure you want to delete all selected karigars?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
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

        {/* Delete Selected Confirmation Modal */}
        {deleteSelectedConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg w-[90%] sm:w-[400px]">
              <h2 className="text-base sm:text-lg md:text-lg font-bold mb-3 sm:mb-4 text-center">
                Are you sure you want to delete the selected karigars?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
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
      </div>
    </div>
  );
};

export default Karigar;