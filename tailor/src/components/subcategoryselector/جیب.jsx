import React, { useState, useEffect, useMemo, useCallback } from "react";
import { HiChevronDown } from "react-icons/hi";

function جیب({
  subCategoryImages,
  selectedSubCategory,
  handleImageClick,
  formState = {},
  updateData,
  handleButtonClick,
}) {
  // Memoize static data to prevent unnecessary recalculations
  const pocketImages = useMemo(() => subCategoryImages["جیب"] || [
    "/assets/choras jaib.svg",
    "/assets/cut jaib.svg",
    "/assets/flip jaib choras.svg",
    "/assets/flip jaib simple.svg",
    "/assets/flip jaib.svg",
    "/assets/gol jaib.svg",
    "/assets/no jaib.svg",
    "/assets/nok jaib.svg",
  ], [subCategoryImages]);

  const sidePocketImages = useMemo(() => ["/assets/side jaib 1.svg", "/assets/side jaib 2.svg"], []);
  const numberOfPocketsOptions = useMemo(() => ["1 جیب", "2 جیب"], []);
  const pocketSizeOptions = useMemo(() => [
    "3* 3 1/2",
    "3 1/4 * 3 3/4",
    "3 1/2 * 4",
    "3 3/4 * 4 1/4",
    "4* 4 1/2",
    "4 1/4 * 4 3/4",
    "4 1/2 * 5",
    "5* 5 1/2",
    "6* 6 1/2",
  ], []);

  const kandeSeJaibOptions = useMemo(() => [
    "6", "6 1/4", "6 1/2", "6 3/4", "7", "7 1/4", "7 1/2", "7 3/4", "8",
    "8 1/4", "8 1/2", "8 3/4", "9", "9 1/4", "9 1/2", "9 3/4", "10",
  ], []);

  const styleLabels = useMemo(() => ["کندھے پر شولڈر", "جیب ک نیچے جیب", "جیب پر بٹن"], []);

  // Initialize state with both image selections
  const initialState = useMemo(() => ({
    noOfPockets: formState.noOfPockets || "",
    pocketSize: formState.pocketSize || "",
    kandeSeJaib: formState.kandeSeJaib || "",
    selectedTopImage: formState.pocketImages?.find(img => img.buttonName === "جیب")?.imgSrc || "",
    selectedRadio: formState.pocketImages?.find(img => img.buttonName === "ہوم سائیڈ جیب")?.imgSrc || "",
    multiSelectButtons: formState.styleSelections
      ? styleLabels.map((label) => formState.styleSelections.includes(label))
      : [false, false, false]
  }), [formState, styleLabels]);

  const [noOfPockets, setNoOfPockets] = useState(initialState.noOfPockets);
  const [pocketSize, setPocketSize] = useState(initialState.pocketSize);
  const [kandeSeJaib, setKandeSeJaib] = useState(initialState.kandeSeJaib);
  const [selectedTopImage, setSelectedTopImage] = useState(initialState.selectedTopImage);
  const [selectedRadio, setSelectedRadio] = useState(initialState.selectedRadio);
  const [multiSelectButtons, setMultiSelectButtons] = useState(initialState.multiSelectButtons);

   // Update state when formState changes
  useEffect(() => {
    setNoOfPockets(formState.noOfPockets || "");
    setPocketSize(formState.pocketSize || "");
    setKandeSeJaib(formState.kandeSeJaib || "");
    setSelectedTopImage(formState.pocketImages?.find(img => img.buttonName === "جیب")?.imgSrc || "");
    setSelectedRadio(formState.pocketImages?.find(img => img.buttonName === "ہوم سائیڈ جیب")?.imgSrc || "");
    setMultiSelectButtons(
      formState.styleSelections
        ? styleLabels.map((label) => formState.styleSelections.includes(label))
        : [false, false, false]
    );
  }, [formState, styleLabels]);

   // Handle data updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const pocketImagesData = [];
      
      // Front pocket image
      if (selectedTopImage) {
        pocketImagesData.push({ 
          imgSrc: selectedTopImage, 
          buttonName: "جیب",
          pocketSize,
          kandeSeJaib,
          noOfPockets
        });
      }
      
      // Side pocket image
      if (selectedRadio) {
        pocketImagesData.push({ 
          imgSrc: selectedRadio, 
          buttonName: "ہوم سائیڈ جیب",
          pocketSize,
          kandeSeJaib,
          noOfPockets
        });
      }

      const data = {
        pocketImages: pocketImagesData,
        noOfPockets,
        pocketSize,
        kandeSeJaib,
        styleSelections: styleLabels.filter((_, index) => multiSelectButtons[index]),
        selectedButton: multiSelectButtons[2] ? "جیب پر بٹن" : "",
      };

      updateData("pocket", data);
      
      // Update individual image selections
      if (selectedTopImage) handleImageClick(selectedTopImage, "جیب");
      if (selectedRadio) handleImageClick(selectedRadio, "ہوم سائیڈ جیب");
      if (multiSelectButtons[2]) handleButtonClick("جیب پر بٹن", "pocket");
    }, 100);

    return () => clearTimeout(timer);
  }, [
    selectedTopImage, 
    selectedRadio, 
    noOfPockets, 
    pocketSize, 
    kandeSeJaib, 
    multiSelectButtons, 
    updateData, 
    handleImageClick, 
    handleButtonClick,
    styleLabels
  ]);

  const toggleStyleButton = useCallback((index) => {
    setMultiSelectButtons((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  }, []);

  const handleTopImageClick = useCallback((imgSrc) => {
    setSelectedTopImage(prev => imgSrc === prev ? "" : imgSrc);
  }, []);

  const handleRadioClick = useCallback((imgSrc) => {
    setSelectedRadio(prev => imgSrc === prev ? "" : imgSrc);
  }, []);

  return (
    <div className="mt-8">
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-4">
            {pocketImages.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`جیب ${index + 1}`}
                className={`w-36 h-24 p-3 cursor-pointer border rounded-3xl object-contain transition-all duration-300 bg-white ${
                  selectedTopImage === imgSrc ? "border-2 border-green-600" : "border border-gray-300"
                }`}
                onClick={() => handleTopImageClick(imgSrc)}
              />
            ))}
          </div>
        </div>
        <div className="col-span-1 flex flex-col space-y-4 ml-1">
          <div className="relative inline-block w-[8rem]">
            <select
              value={noOfPockets}
              onChange={(e) => setNoOfPockets(e.target.value)}
              className="block w-[125px] h-[3rem] appearance-none bg-white text-black text-md font-medium rounded-xl px-2 py-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">فرنٹ جیب</option>
              {numberOfPocketsOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <HiChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
          </div>
          <div className="relative inline-block w-[8rem]">
            <select
              value={pocketSize}
              onChange={(e) => setPocketSize(e.target.value)}
              className="block w-[125px] h-[3rem] appearance-none bg-white text-black text-md font-medium rounded-xl px-2 py-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">جیب سائز</option>
              {pocketSizeOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <HiChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
          </div>
          <div className="relative inline-block w-[8rem]">
            <select
              value={kandeSeJaib}
              onChange={(e) => setKandeSeJaib(e.target.value)}
              className="block w-[125px] h-[3rem] appearance-none bg-white text-black text-md font-medium rounded-xl px-2 py-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">کندھے سے جیب</option>
              {kandeSeJaibOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <HiChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
          </div>
          <div className="flex justify-center my-2">
            <h1 className="text-heading text-lg">Select Style</h1>
          </div>
          <div className="flex flex-col space-y-2">
            {styleLabels.map((label, index) => (
              <button
                key={index}
                onClick={() => toggleStyleButton(index)}
                className={`w-[126px] h-10 border rounded-lg text-md font-medium transition-all duration-200 ${
                  multiSelectButtons[index]
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold mb-2 text-center text-heading">
          Select One
        </h4>
        <div className="flex justify-center space-x-2">
          {sidePocketImages.map((imgSrc, index) => (
            <img
              key={index}
              src={imgSrc}
              alt={`Side Jaib ${index + 1}`}
              className={`w-24 h-24 p-2 bg-white cursor-pointer border rounded-lg object-contain transition-all duration-300 ${
                selectedRadio === imgSrc ? "border-2 border-green-600" : "border border-gray-300"
              }`}
              onClick={() => handleRadioClick(imgSrc)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default جیب;
