import React, { useEffect, useState, useMemo, useCallback } from "react";

function Cuff({
  subCategoryImages = {},
  selectedSubCategory,
  handleImageClick,
  updateData,
  formState = {},
}) {
  // Memoize static data to prevent unnecessary recalculations
  const cuffImages = useMemo(() => subCategoryImages["کف"] || [
    "/assets/choras kaf 2.svg",
    "/assets/choras kaf.svg",
    "/assets/d kaf.svg",
    "/assets/gol kaf.svg",
    "/assets/kat kaf.svg",
    "/assets/kani bazu.svg",
    "/assets/gol bazu 3 button.svg",
    "/assets/gol bazu.svg",
    "/assets/lopi gol bazu.svg",
  ], [subCategoryImages]);

  const groupOneLabels = useMemo(() => [
    "کف پر پلیٹ",
    "کف بغیر پلیٹ",
    "کف ڈبل بکرم",
    "سٹد کاج",
    "ڈبل کف",
    "کف اوپرنیچے",
  ], []);

  const groupTwoOptions = useMemo(() => [
    "1 چاک پٹی گول",
    "2 چاک پٹی گول",
    "1چاک پٹی چورس",
    "2چاک پٹی چورس",
    "1چاک پٹی نوک",
    "2چاک پٹی نوک",
  ], []);

  // Initialize state from formState with proper memoization
  const initialState = useMemo(() => ({
    selectedImage: formState.topImage || "",
    selectedGroupOne: formState.styleSelections
      ? groupOneLabels.map(label => formState.styleSelections.includes(label))
      : new Array(groupOneLabels.length).fill(false),
    selectedGroupTwo: formState.styleSelections?.find(opt => groupTwoOptions.includes(opt)) || "",
    lengthValue: formState.lengthValue || "",
    widthValue: formState.selectedDropdownCuff || ""
  }), [formState, groupOneLabels, groupTwoOptions]);

  const [selectedImage, setSelectedImage] = useState(initialState.selectedImage);
  const [selectedGroupOne, setSelectedGroupOne] = useState(initialState.selectedGroupOne);
  const [selectedGroupTwo, setSelectedGroupTwo] = useState(initialState.selectedGroupTwo);
  const [lengthValue, setLengthValue] = useState(initialState.lengthValue);
  const [widthValue, setWidthValue] = useState(initialState.widthValue);

  // Update state when formState changes
  useEffect(() => {
    setSelectedImage(formState.topImage || "");
    setSelectedGroupOne(
      formState.styleSelections
        ? groupOneLabels.map(label => formState.styleSelections.includes(label))
        : new Array(groupOneLabels.length).fill(false)
    );
    setSelectedGroupTwo(formState.styleSelections?.find(opt => groupTwoOptions.includes(opt)) || "");
    setLengthValue(formState.lengthValue || "");
    setWidthValue(formState.selectedDropdownCuff || "");
  }, [formState, groupOneLabels, groupTwoOptions]);

  // Debounce the updateData call to prevent rapid successive updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const newData = {
        cuffImages: selectedImage ? [{ imgSrc: selectedImage, buttonName: "کف" }] : [],
        selectedDropdownCuff: widthValue,
        styleSelections: [
          ...groupOneLabels.filter((_, i) => selectedGroupOne[i]),
          ...(selectedGroupTwo ? [selectedGroupTwo] : []),
        ],
        topImage: selectedImage,
        bottomImage: "",
        lengthValue,
      };

      if (
        selectedImage !== (formState.topImage || "") ||
        widthValue !== (formState.selectedDropdownCuff || "") ||
        lengthValue !== (formState.lengthValue || "") ||
        JSON.stringify(groupOneLabels.filter((_, i) => selectedGroupOne[i])) !==
        JSON.stringify(formState.styleSelections?.filter(label => groupOneLabels.includes(label)) || []) ||
        selectedGroupTwo !== (formState.styleSelections?.find(opt => groupTwoOptions.includes(opt)) || "")
      ) {
        updateData("cuff", newData);
        if (selectedImage) {
          handleImageClick(selectedImage, "کف");
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedImage, selectedGroupOne, selectedGroupTwo, lengthValue, widthValue, updateData, handleImageClick, formState, groupOneLabels, groupTwoOptions]);

  // Memoize callbacks to prevent unnecessary re-renders
  const toggleGroupOne = useCallback((index) => {
    setSelectedGroupOne(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  }, []);

  const handleImageClickWrapper = useCallback((imgSrc) => {
    const newImage = selectedImage === imgSrc ? "" : imgSrc;
    setSelectedImage(newImage);
    handleImageClick(newImage, "کف");
  }, [selectedImage, handleImageClick]);

  const selectGroupTwo = useCallback((option) => {
    setSelectedGroupTwo(prev => option === prev ? "" : option);
  }, []);

  const handleLengthChange = useCallback((e) => {
    setLengthValue(e.target.value);
  }, []);

  const handleWidthChange = useCallback((e) => {
    setWidthValue(e.target.value);
  }, []);

  return (
    <div className="mt-2 flex justify-center w-[38rem] pr-16">
      <div className="p-2">
        <div className="grid grid-cols-2">
          <div>
            <div className="grid grid-cols-3 gap-3 w-[16rem] space-y-1">
              {cuffImages.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Cuff ${index + 1}`}
                  className={`h-16 p-2 cursor-pointer border border-gray-200 rounded-lg object-contain transition-all duration-300 bg-white ${
                    selectedImage === imgSrc ? "border-2 border-green-600" : ""
                  }`}
                  onClick={() => handleImageClickWrapper(imgSrc)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex gap-2 mb-1">
              <div>
                <select
                  className="w-[125px] p-1 text-sm text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  value={lengthValue}
                  onChange={handleLengthChange}
                >
                  <option value="">لمبائی</option>
                  <option value="6">6</option>
                  <option value="6x1/4">6x1/4</option>
                  <option value="6x1/2">6x1/2</option>
                  <option value="6x3/4">6x3/4</option>
                  <option value="7">7</option>
                </select>
              </div>
              <div>
                <select
                  className="w-[125px] p-1 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  value={widthValue}
                  onChange={handleWidthChange}
                >
                  <option value="">چوڑائی</option>
                  <option value="1/2">1/2</option>
                  <option value="3/4">3/4</option>
                  <option value="1">1</option>
                  <option value="1x1/4">1x1/4</option>
                  <option value="1x1/2">1x1/2</option>
                  <option value="1x3/4">1x3/4</option>
                  <option value="2">2</option>
                  <option value="2x1/4">2x1/4</option>
                  <option value="2x1/2">2x1/2</option>
                  <option value="2x3/4">2x3/4</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {groupOneLabels.map((label, index) => (
                <button
                  key={index}
                  onClick={() => toggleGroupOne(index)}
                  className={`w-full h-12 border border-gray-200 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedGroupOne[index]
                      ? "bg-green-100 text-black border-green-600"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center text-base font-semibold text-gray-800 pb-1">
          Select One
        </div>
        <div className="grid grid-cols-2 gap-2">
          {groupTwoOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => selectGroupTwo(option)}
              className={`w-full h-12 border border-gray-200 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedGroupTwo === option
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cuff;