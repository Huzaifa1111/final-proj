import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const KarigarSearch = ({ onKarigarSelect, selectedKarigar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [karigars, setKarigars] = useState([]);
  const [filteredKarigars, setFilteredKarigars] = useState([]);
  const [selectedKarigarState, setSelectedKarigarState] = useState(null);
  const [showKarigarDropdown, setShowKarigarDropdown] = useState(false);
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize with selectedKarigar prop
  useEffect(() => {
    if (selectedKarigar) {
      setSelectedKarigarState(selectedKarigar);
      setSearchTerm(selectedKarigar.name || "");
      setShowDetailsDropdown(true);
    } else {
      setSelectedKarigarState(null);
      setSearchTerm("");
      setShowDetailsDropdown(false);
    }
  }, [selectedKarigar]);

  useEffect(() => {
    const fetchKarigars = async () => {
      try {
        const response = await fetch("/api/karigars", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (!response.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        const data = await response.json();
        setKarigars(data);
        if (searchTerm.trim() !== "") {
          const lowerTerm = searchTerm.toLowerCase();
          setFilteredKarigars(data.filter((karigar) => karigar.name.toLowerCase().startsWith(lowerTerm)));
          setShowKarigarDropdown(true);
        } else {
          setFilteredKarigars([]);
          setShowKarigarDropdown(false);
        }
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching karigars:", error);
        setErrorMessage(error.message || "Error fetching karigars. Please try again.");
        setKarigars([]);
        setFilteredKarigars([]);
        setShowKarigarDropdown(false);
      }
    };

    fetchKarigars();
  }, [searchTerm]);

  const handleKarigarSelect = (karigar) => {
    setSelectedKarigarState(karigar);
    setSearchTerm(karigar.name);
    setShowKarigarDropdown(false);
    setShowDetailsDropdown(true);
    if (onKarigarSelect) {
      onKarigarSelect({
        _id: karigar._id,
        name: karigar.name,
        karigarId: karigar.karigarId,
      });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setSelectedKarigarState(null);
      setShowDetailsDropdown(false);
      if (onKarigarSelect) {
        onKarigarSelect(null);
      }
    }
  };

  return (
    <div className="p-[25px] m-1 md:m-0 rounded-xl bg-cardBg md:w-[319px] w-[17rem] shadow-lg border font-font text-black relative">
      <h3 className="text-lg font-bold text-heading mb-4">Search Karigar</h3>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4">
          {errorMessage}
        </div>
      )}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder=" "
          className="peer w-full px-4 pt-6 pb-2 border rounded-xl bg-inputBg text-black text-sm focus:outline-none focus:ring-blue-500"
        />
        <label
          className={`absolute left-4 bg-cardBg px-1 text-sm transition-all duration-200 
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
                     peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs 
                     peer-valid:top-0 peer-valid:left-2 peer-valid:text-xs`}
          style={{ whiteSpace: "nowrap" }}
        >
          Search by Karigar Name
        </label>
        {searchTerm.trim() !== "" && filteredKarigars.length > 0 && (
          <div className="w-full mt-1 bg-white border rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
            {filteredKarigars.map((karigar) => (
              <div
                key={karigar.karigarId}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleKarigarSelect(karigar)}
              >
                {karigar.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={selectedKarigarState ? selectedKarigarState.name : ""}
            readOnly
            placeholder=" "
            className="peer w-full px-4 pt-6 pb-2 border rounded-xl bg-inputBg text-black text-sm focus:outline-none focus:ring-blue-500 pr-10"
          />
          <label
            className={`absolute left-4 bg-cardBg px-1 text-sm transition-all duration-200 
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
                       peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs 
                       peer-valid:top-0 peer-valid:left-2 peer-valid:text-xs`}
            style={{ whiteSpace: "nowrap" }}
          >
            Select Karigar
          </label>
          <button
            onClick={() => setShowDetailsDropdown(!showDetailsDropdown)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <ChevronDown
              className={`transform transition-transform ${
                showDetailsDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        {showDetailsDropdown && (
          <div className="absolute w-full mt-1 bg-white border rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
            {selectedKarigarState ? (
              <div className="p-4">
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedKarigarState.name}</p>
                  <p><strong>Services:</strong> {selectedKarigarState.karigarType?.join(", ") || "N/A"}</p>
                  <p><strong>Assigned Orders:</strong> {selectedKarigarState.assignedOrders?.length || 0}</p>
                </div>
              </div>
            ) : (
              karigars.map((karigar) => (
                <div
                  key={karigar.karigarId}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleKarigarSelect(karigar)}
                >
                  {karigar.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KarigarSearch;