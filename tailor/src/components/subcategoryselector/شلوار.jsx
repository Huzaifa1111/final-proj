import React, { useState, useEffect, useMemo, useCallback } from "react";
import { HiChevronDown } from "react-icons/hi";

function شلوار({ subCategoryImages, selectedSubCategory, handleImageClick, formState = {}, updateData }) {
  const images = useMemo(() => 
    subCategoryImages["شلوار"] || [
      "/assets/pent shalwar.svg",
      "/assets/zip shalwar.svg",
      "/assets/pocket shalwar.svg",
      "/assets/shalwaer.svg",
    ], 
  [subCategoryImages]);

  const styleLabels = useMemo(() => [
    "بغیر بکرم پانچا",
    "پانچا پٹی چمک سلائی",
    "پانچا پٹی ایک سلائی اوپر تین نیچے",
  ], []);

  // Memoize the initial state based on formState
  const initialState = useMemo(() => ({
    selectedImage: formState.selectedImage || "",
    panchaChorai: formState.panchaChorai || "",
    multiSelect: formState.styleSelections
      ? styleLabels.map((label) => formState.styleSelections.includes(label))
      : [false, false, false]
  }), [formState, styleLabels]);

  const [selectedImage, setSelectedImage] = useState(initialState.selectedImage);
  const [panchaChorai, setPanchaChorai] = useState(initialState.panchaChorai);
  const [isPanchaDropdownOpen, setIsPanchaDropdownOpen] = useState(false);
  const [multiSelect, setMultiSelect] = useState(initialState.multiSelect);

  // Generate panchaChoraiOptions only once
  const panchaChoraiOptions = useMemo(() => {
    const options = [];
    for (let val = 0.5; val <= 2; val += 0.25) {
      let label;
      if (val === 0.5) label = "1/2";
      else if (val === 0.75) label = "3/4";
      else label = val.toString();
      options.push(label);
    }
    return options;
  }, []);

  // Only update state when formState actually changes
  useEffect(() => {
    setSelectedImage(formState.selectedImage || "");
    setPanchaChorai(formState.panchaChorai || "");
    setMultiSelect(
      formState.styleSelections
        ? styleLabels.map((label) => formState.styleSelections.includes(label))
        : [false, false, false]
    );
  }, [formState.selectedImage, formState.panchaChorai, formState.styleSelections, styleLabels]);

  // Debounce the updateData call to prevent rapid successive updates
  useEffect(() => {
    const selectedStyles = styleLabels.filter((_, index) => multiSelect[index]);
    
    // Only update if there's an actual change
    if (
      selectedImage !== (formState.selectedImage || "") ||
      panchaChorai !== (formState.panchaChorai || "") ||
      JSON.stringify(selectedStyles) !== JSON.stringify(formState.styleSelections || [])
    ) {
      const timer = setTimeout(() => {
        const data = {
          selectedImage,
          panchaChorai,
          styleSelections: selectedStyles,
          measurement: panchaChorai,
        };
        updateData("shalwar", data);
        
        if (selectedImage) {
          handleImageClick(selectedImage, "شلوار");
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedImage, panchaChorai, multiSelect, updateData, handleImageClick, formState, styleLabels]);

  const handleSelectImage = useCallback((imgSrc) => {
    setSelectedImage(prev => imgSrc === prev ? "" : imgSrc);
  }, []);

  const toggleButton = useCallback((index) => {
    setMultiSelect(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsPanchaDropdownOpen(prev => !prev);
  }, []);

  const selectPanchaOption = useCallback((option) => {
    setPanchaChorai(option);
    setIsPanchaDropdownOpen(false);
  }, []);

  return (
    <div className="mt-4 sm:mt-6 md:mt-8">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-2 sm:gap-3 md:gap-2">
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {images.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`شلوار ${index + 1}`}
                className={`w-28 sm:w-32 md:w-36 h-20 sm:h-22 md:h-24 p-2 sm:p-2.5 md:p-3 cursor-pointer border rounded-3xl object-contain transition-all duration-300 bg-white ${
                  selectedImage === imgSrc ? "border-2 border-green-600" : "border border-gray-300"
                }`}
                onClick={() => handleSelectImage(imgSrc)}
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-1 flex flex-col space-y-2 sm:space-y-3 md:space-y-4 mt-3 md:mt-0">
          <div className="relative inline-block w-full md:w-[135px]">
            <button
              onClick={toggleDropdown}
              className="inline-flex justify-between items-center w-full h-9 sm:h-10 md:h-10 px-3 sm:px-3.5 md:px-4 py-1 bg-white text-black text-sm sm:text-md md:text-md rounded-xl border border-gray-300 hover:shadow-xl"
            >
              <span>{panchaChorai || "پانچا چوڑائی"}</span>
              <HiChevronDown className="h-4 sm:h-5 md:h-5 w-4 sm:w-4 md:w-4" />
            </button>
            {isPanchaDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-full rounded-xl text-sm sm:text-md md:text-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="py-1">
                  <div className="block w-full text-left px-3 py-2 text-sm sm:text-md md:text-md font-semibold text-gray-900 border-b border-gray-200">
                    پانچا چوڑائی
                  </div>
                  {panchaChoraiOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectPanchaOption(option)}
                      className="block w-full text-left px-3 py-2 text-sm sm:text-md md:text-md text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-2">
            {styleLabels.map((label, index) => (
              <button
                key={index}
                onClick={() => toggleButton(index)}
                className={`p-1 w-full md:w-[135px] h-14 sm:h-15 md:h-16 cursor-pointer text-sm sm:text-md md:text-md border rounded-xl transition-all duration-300 bg-white hover:shadow-xl ${
                  multiSelect[index]
                    ? "border-2 border-green-600 bg-green-100 text-black"
                    : "border border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default شلوار;