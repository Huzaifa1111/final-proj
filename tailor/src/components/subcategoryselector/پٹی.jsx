
import React, { useState, useEffect, useRef, memo } from "react";
import { HiChevronDown } from "react-icons/hi";
import PropTypes from "prop-types";

const translations = {
  imageNotAvailable: "تصویر دستیاب نہیں",
  lengthLabel: "لمبائی",
  widthLabel: "چوڑائی",
  buttonsLabel: "بٹنوں کی تعداد",
};

const pattiImages = [
  "/assets/gol pati.svg",
  "/assets/gum pati 2.svg",
  "/assets/gum pati 3.svg",
  "/assets/gum pati final.svg",
  "/assets/gum pati.svg",
  "/assets/nok pato.svg",
  "/assets/lopi wai pati.svg",
];

function پٹی({
  selectedImages = [],
  handleImageClick,
  selectedSubCategory,
  updateViewOrderPatti,
  formState = {},
}) {
  console.log("پٹی formState:", formState);

  const lengthOptions = [
    "5", "5 1/2", "6", "6 1/2", "7", "7 1/2", "8", "8 1/2", "9", "9 1/2",
    "10", "10 1/2", "11", "11 1/2", "12", "12 1/2", "13", "13 1/2",
    "14", "14 1/2", "15", "15 1/2", "16", "16 1/2", "17", "17 1/2",
    "18", "18 1/2", "19", "19 1/2", "20"
  ];

  const widthOptions = ["1/2", "3/4", "1", "1 1/4", "1 1/2", "1 3/4", "2"];
  const buttonCountOptions = ["4", "5", "6", "7", "8", "9", "10", "11"];
  const buttonOptions = ["پٹی پر ڈیزائن", "پٹی پر کڑھائی"];

  const [dropdownStates, setDropdownStates] = useState({
    length: false,
    width: false,
    buttons: false,
  });

 const [selectedValues, setSelectedValues] = useState(() => {
  const initialValues = {
    design: formState?.design || "",
    length: formState?.length || "",
    width: formState?.width || "",
    buttons: formState?.buttons || "",
  };
  console.log("پٹی initial selectedValues:", initialValues);
  return initialValues;
});

const [selectedImage, setSelectedImage] = useState(() => {
  const initialImage = formState?.selectedImage || selectedImages.find(img => img.buttonName === "پٹی")?.imgSrc || "";
  console.log("پٹی initial selectedImage:", initialImage);
  return initialImage;
});

  const dropdownRefs = {
    length: useRef(null),
    width: useRef(null),
    buttons: useRef(null),
  };

  // پٹی.jsx - Update the useEffect that handles data updates
useEffect(() => {
  const data = {
    selectedImage,
    design: selectedValues.design,
    length: selectedValues.length,
    width: selectedValues.width,
    buttons: selectedValues.buttons,
  };

  console.log("پٹی updateData:", data);
  updateViewOrderPatti(data);
    if (
      selectedImage !== (formState.patti?.selectedImage || "") ||
      selectedValues.design !== (formState.patti?.design || "") ||
      selectedValues.length !== (formState.patti?.length || "") ||
      selectedValues.width !== (formState.patti?.width || "") ||
      selectedValues.buttons !== (formState.patti?.buttons || "")
    ) {
      updateViewOrderPatti(data);
     if (selectedImage) {
    handleImageClick(selectedImage, "پٹی");
    }
  }
}, [selectedValues, selectedImage, updateViewOrderPatti, handleImageClick]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newStates = { ...dropdownStates };
      let shouldUpdate = false;

      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          dropdownStates[key]
        ) {
          newStates[key] = false;
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setDropdownStates(newStates);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownStates]);

  const toggleDropdown = (dropdown) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleSelect = (dropdown, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [dropdown]: value,
    }));
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: false,
    }));
  };

  const handleDesignOptionChange = (option) => {
    setSelectedValues((prev) => ({
      ...prev,
      design: option === prev.design ? "" : option,
    }));
  };

  const handleImageClickWrapper = (imgSrc) => {
    const newImage = selectedImage === imgSrc ? "" : imgSrc;
    setSelectedImage(newImage);
    handleImageClick(newImage, "پٹی");
  };

  const Dropdown = memo(({ label, options, dropdownKey }) => (
    <div ref={dropdownRefs[dropdownKey]} className="relative w-full">
      <button
        type="button"
        onClick={() => toggleDropdown(dropdownKey)}
        aria-expanded={dropdownStates[dropdownKey]}
        aria-controls={`dropdown-${dropdownKey}`}
        aria-haspopup="true"
        className="flex justify-between items-center w-full h-[3.3rem] px-3 bg-white text-black border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-600"
      >
        <span>{selectedValues[dropdownKey] || label}</span>
        <HiChevronDown
          className={`w-4 h-4 transition-transform ${
            dropdownStates[dropdownKey] ? "rotate-180" : ""
          }`}
        />
      </button>

      {dropdownStates[dropdownKey] && (
        <div
          id={`dropdown-${dropdownKey}`}
          className="absolute mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto z-50"
        >
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(dropdownKey, option)}
              className="block w-full px-4 py-2 text-right text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <div className="patti-component mt-8 font-nastaliq relative z-0">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-96">
            {pattiImages.map((imgSrc, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={imgSrc}
                  alt={`پٹی ڈیزائن ${index + 1}`}
                  className={`w-36 h-24 p-3 cursor-pointer rounded-3xl object-contain duration-300 bg-white border transition-colors ${
                    selectedImage === imgSrc ? "border-green-600 border-2" : "border-gray-200"
                  }`}
                  onClick={() => handleImageClickWrapper(imgSrc)}
                  onError={(e) => {
                    e.target.src = "/fallback-image.jpg";
                    e.target.alt = translations.imageNotAvailable;
                  }}
                />
                {selectedImage === imgSrc && (
                  <div className="mt-2 text-center text-sm text-gray-600">
                    {selectedValues.length && (
                      <p>
                        لمبائی: <strong>{selectedValues.length}</strong>
                      </p>
                    )}
                    {selectedValues.width && (
                      <p>
                        چوڑائی: <strong>{selectedValues.width}</strong>
                      </p>
                    )}
                    {selectedValues.buttons && (
                      <p>
                        بٹنوں کی تعداد: <strong>{selectedValues.buttons}</strong>
                      </p>
                    )}
                    {selectedValues.design && (
                      <p>
                        ڈیزائن: <strong>{selectedValues.design}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Dropdown
            label={translations.lengthLabel}
            options={lengthOptions}
            dropdownKey="length"
          />
          <Dropdown
            label={translations.widthLabel}
            options={widthOptions}
            dropdownKey="width"
          />
          <Dropdown
            label={translations.buttonsLabel}
            options={buttonCountOptions}
            dropdownKey="buttons"
          />
          <fieldset>
            <legend className="sr-only">ڈیزائن آپشن</legend>
            <div className="flex flex-col space-y-2 mt-2">
              {buttonOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <input
                    type="radio"
                    name="designOption"
                    value={option}
                    checked={selectedValues.design === option}
                    onChange={() => handleDesignOptionChange(option)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

پٹی.propTypes = {
  selectedImages: PropTypes.arrayOf(
    PropTypes.shape({
      imgSrc: PropTypes.string,
      buttonName: PropTypes.string,
    })
  ),
  handleImageClick: PropTypes.func.isRequired,
  selectedSubCategory: PropTypes.string.isRequired,
  updateViewOrderPatti: PropTypes.func.isRequired,
  formState: PropTypes.object,
};

export default پٹی;