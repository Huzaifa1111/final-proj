import React, { useState, useEffect } from "react";

const buttonNames = [
  "سٹیل بٹن",
  "کپڑا بٹن",
  "رینگ بٹن",
  "واسکٹ بٹن",
  "فینسی بٹن",
  "فینسی رینگ بٹن",
  "اپنے بٹن",
];

function بٹن({ selectedSubCategory, handleButtonClick, formState = {}, updateData }) {
  const [selectedButton, setSelectedButton] = useState(formState.selectedButton || "");

  // Initialize from formState
  useEffect(() => {
    if (formState.selectedButton && formState.selectedButton !== selectedButton) {
      setSelectedButton(formState.selectedButton);
    }
  }, [formState.selectedButton]);

  useEffect(() => {
    if (selectedButton && selectedButton !== formState.selectedButton) {
      const data = { selectedButton };
      updateData("button", data);
      handleButtonClick(selectedButton, "بٹن");
    }
  }, [selectedButton, updateData, handleButtonClick, formState.selectedButton]);

  const handleSelection = (name) => {
    const newSelection = selectedButton === name ? "" : name;
    setSelectedButton(newSelection);
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-2xl font-bold text-center">بٹن Options</h3>
      <div className="flex justify-center space-x-4">
        {buttonNames.slice(0, 3).map((name) => (
          <button
            key={name}
            onClick={() => handleSelection(name)}
            className={`w-36 h-13 p-3 text-md cursor-pointer border rounded-xl transition-all duration-300 bg-white ${
              selectedButton === name
                ? "border-2 border-green-600 shadow-lg"
                : "border border-gray-300 hover:shadow-xl"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        {buttonNames.slice(3, 6).map((name) => (
          <button
            key={name}
            onClick={() => handleSelection(name)}
            className={`w-36 h-13 p-3 text-md cursor-pointer border rounded-xl transition-all duration-300 bg-white ${
              selectedButton === name
                ? "border-2 border-green-600 shadow-lg"
                : "border border-gray-300 hover:shadow-xl"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        {buttonNames.slice(6, 7).map((name) => (
          <button
            key={name}
            onClick={() => handleSelection(name)}
            className={`w-36 h-13 p-3 text-md cursor-pointer border rounded-xl transition-all duration-300 bg-white ${
              selectedButton === name
                ? "border-2 border-green-600 shadow-lg"
                : "border border-gray-300 hover:shadow-xl"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      {selectedButton && (
        <div className="text-center text-green-600 font-semibold">
          Selected: {selectedButton}
        </div>
      )}
    </div>
  );
}

export default بٹن;