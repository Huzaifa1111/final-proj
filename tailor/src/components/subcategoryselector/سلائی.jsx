import React, { useState, useEffect } from "react";

const silaiButtons = [
  "سادہ سلائی",
  "ڈبل سادہ سلائی",
  "سنگل چمک سلائی",
  "ڈبل چمک سلائی",
  "چمک ٹک پا ٹک سلائی",
  "ٹریپل سلائی",
  "عام ٹریپل سلائی",
  "زنجیر سلائی",
  "ڈبل زنجیر سلائی",
  "چمک پن سلائی",
  "چوکا سلائی",
  "موبائل میں Dیزائن",
];

const Silai = ({ selectedSubCategory, handleButtonClick, formState = {}, updateData }) => {
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
      updateData("silai", data);
      handleButtonClick(selectedButton, "سلائی");
    }
  }, [selectedButton, updateData, handleButtonClick, formState.selectedButton]);

  const rows = [
    silaiButtons.slice(0, 3),
    silaiButtons.slice(3, 6),
    silaiButtons.slice(6, 9),
    silaiButtons.slice(9, 12),
  ];

  const handleSelection = (btnName) => {
    const newSelection = selectedButton === btnName ? "" : btnName;
    setSelectedButton(newSelection);
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col items-center font-nastaliq">
      <h3 className="text-xl sm:text-2xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-4">سلائی Options</h3>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2 md:gap-2 mt-2 sm:mt-3 md:mt-4">
          {row.map((btnName, btnIndex) => (
            <button
              key={btnIndex}
              onClick={() => handleSelection(btnName)}
              className={`w-full sm:w-36 md:w-40 h-12 sm:h-13 md:h-13 p-2 sm:p-3 md:p-3 cursor-pointer text-xs sm:text-sm md:text-md border rounded-xl transition-all duration-300 hover:shadow-xl ${
                selectedButton === btnName
                  ? "bg-green-500 text-white"
                  : "border border-gray-300 bg-white"
              }`}
            >
              {btnName}
            </button>
          ))}
        </div>
      ))}
      {selectedButton && (
        <div className="mt-3 sm:mt-4 md:mt-4 text-green-600 font-semibold text-sm sm:text-base md:text-base">
          Selected: {selectedButton}
        </div>
      )}
    </div>
  );
};

Silai.defaultProps = {
  formState: {},
};

export default Silai;