// MeasurementManager.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const MeasurementManager = ({ customer, selectedVariety, formState, onMeasurementSelect }) => {
  const [selectedSubId, setSelectedSubId] = useState("");
  const [showSubIdDropdown, setShowSubIdDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(null);

  // Fixed list of garment types (sub‑IDs)
  const subIdOptions = [
    shalwaarkameez,
    coat,
    pant,
    waistcoat,
    shirt,
    pantcoat,
  ];

  // When customer or selectedVariety changes, update the selectedSubId and load its versions.
  useEffect(() => {
    if (customer?.id && selectedVariety) {
      const baseSubId = `${customer.id}-${selectedVariety.toLowerCase().replace('_', '-')}`;
      setSelectedSubId(baseSubId);
      const historyEntry = formState.measurementHistory?.[baseSubId];
      if (historyEntry && historyEntry.versions) {
        setVersions(historyEntry.versions);
        setSelectedVersionIndex(historyEntry.activeVersionIndex);
      } else {
        setVersions([]);
        setSelectedVersionIndex(null);
      }
    }
  }, [customer, selectedVariety, formState.measurementHistory]);

  // When a sub id is selected from the first dropdown.
  const handleSubIdSelect = async (subId) => {
    try {
      setSelectedSubId(subId);
      setShowSubIdDropdown(false);
      const historyEntry = formState.measurementHistory?.[subId];
      if (historyEntry && historyEntry.versions) {
        setVersions(historyEntry.versions);
        setSelectedVersionIndex(historyEntry.activeVersionIndex);
        await onMeasurementSelect(
          historyEntry.versions[historyEntry.activeVersionIndex],
          subId,
          historyEntry.activeVersionIndex
        );
      } else {
        setVersions([]);
        setSelectedVersionIndex(null);
        await onMeasurementSelect(null, subId, null);
      }
    } catch (error) {
      console.error("Error in handleSubIdSelect:", error);
    }
  };

  // When a version is selected from the second dropdown.
  const handleVersionSelect = async (versionIndex) => {
    try {
      setSelectedVersionIndex(versionIndex);
      setShowVersionDropdown(false);
      const baseSubId = selectedSubId;
      const historyEntry = formState.measurementHistory?.[baseSubId];
      if (
        historyEntry &&
        historyEntry.versions &&
        historyEntry.versions[versionIndex]
      ) {
        await onMeasurementSelect(
          historyEntry.versions[versionIndex],
          baseSubId,
          versionIndex
        );
      }
    } catch (error) {
      console.error("Error in handleVersionSelect:", error);
    }
  };

  return (
    <div className="mb-4">
      {/* Dropdown for selecting version (now displaying the sub id) */}
      <div className="relative">
        <button
          onClick={() => setShowVersionDropdown(!showVersionDropdown)}
          className="w-full px-4 py-2 text-left bg-white border rounded-lg flex justify-between items-center"
        >
          <span>
            {selectedVersionIndex !== null && versions[selectedVersionIndex]
              ? `Sub ID: ${versions[selectedVersionIndex].id}`
              : "Select Measurement Sub ID"}
          </span>
          <ChevronDown
            className={`transform transition-transform ${
              showVersionDropdown ? "rotate-180" : ""
            }`}
          />
        </button>
        {showVersionDropdown && (
          <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
            {versions.length > 0 ? (
              versions.map((version, index) => (
                <div
                  key={version.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleVersionSelect(index)}
                >
                  {`Sub ID: ${version.id} - ${new Date(
                    version.timestamp
                  ).toLocaleString()}`}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No versions available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementManager;
