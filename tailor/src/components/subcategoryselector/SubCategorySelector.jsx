import React, { useState, useEffect, useCallback, useMemo } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import کالر from "./کالر";
import پٹی from "./پٹی";
import کف from "./کف";
import جیب from "./جیب";
import شلوار from "./شلوار";
import سلائی from "./سلائی";
import کٹر from "./کٹر";
import بٹن from "./بٹن";

const mapping = {
  "شلوار": { component: شلوار, key: "shalwar" },
  "کف": { component: کف, key: "cuff" },
  "جیب": { component: جیب, key: "pocket" },
  "کالر": { component: کالر, key: "collar" },
  "بٹن": { component: بٹن, key: "button" },
  "سلائی": { component: سلائی, key: "silai" },
  "پٹی": { component: پٹی, key: "patti" },
  "کٹر": { component: کٹر, key: "cutter" },
};

function SubCategorySelector({
  subCategoryImages = {},
  selectedSubCategory: externalSelectedSubCategory,
  handleImageClick = () => {},
  handleButtonClick = () => {},
  setSelectedSubCategory,
  selectedImages = [],
  updateViewOrder = () => {},
  updateViewOrderPatti = () => {},
  setFormState,
  formState: parentFormState = {},
}) {
  console.log("SubCategorySelector parentFormState:", parentFormState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSubCategory, setLocalSelectedSubCategory] = useState(
    externalSelectedSubCategory || Object.keys(mapping)[0]
  );
  const [formState, setLocalFormState] = useState({
    کالر: { measurement: "", collarPosition: "", selectedButton: "" },
    پٹی: { design: "", length: "", width: "", buttons: "", selectedImage: "" },
    کف: {
      cuffImages: [],
      selectedDropdownCuff: "",
      styleSelections: [],
      topImage: "",
      bottomImage: "",
      lengthValue: "",
    },
    جیب: {
      pocketImages: [],
      noOfPockets: "",
      pocketSize: "",
      kandeSeJaib: "",
      styleSelections: [],
      selectedButton: "",
    },
    شلوار: { selectedImage: "", panchaChorai: "", styleSelections: [], measurement: "" },
    سلائی: { selectedButton: "" },
    بٹن: { selectedButton: "" },
    کٹر: { selectedButtons: [] },
  });
  const [hoverIndex, setHoverIndex] = useState(null);
  const [completedTabs, setCompletedTabs] = useState({});

  const orderedSubCategories = [
    "کالر",
    "پٹی",
    "کف",
    "جیب",
    "شلوار",
    "سلائی",
    "بٹن",
    "کٹر",
  ];

  // Sync local formState with parentFormState
  useEffect(() => {
    console.log("Syncing local formState with parentFormState:", parentFormState);
    setLocalFormState({
      کالر: parentFormState.collar || { measurement: "", collarPosition: "", selectedButton: "" },
      پٹی: parentFormState.patti || { design: "", length: "", width: "", buttons: "", selectedImage: "" },
      کف: parentFormState.cuff || {
        cuffImages: [],
        selectedDropdownCuff: "",
        styleSelections: [],
        topImage: "",
        bottomImage: "",
        lengthValue: "",
      },
      جیب: parentFormState.pocket || {
        pocketImages: [],
        noOfPockets: "",
        pocketSize: "",
        kandeSeJaib: "",
        styleSelections: [],
        selectedButton: "",
      },
      شلوار: parentFormState.shalwar || { selectedImage: "", panchaChorai: "", styleSelections: [], measurement: "" },
      سلائی: parentFormState.silai || { selectedButton: "" },
      بٹن: parentFormState.button || { selectedButton: "" },
      کٹر: parentFormState.cutter || { selectedButtons: [] },
    });
  }, [parentFormState]);

  // Sync external selectedSubCategory
  useEffect(() => {
    if (externalSelectedSubCategory && externalSelectedSubCategory !== selectedSubCategory) {
      setLocalSelectedSubCategory(externalSelectedSubCategory);
    }
  }, [externalSelectedSubCategory]);

  // Memoize props to prevent unnecessary re-renders
  const memoizedSelectedImages = useMemo(() => selectedImages, [selectedImages]);
  const memoizedUpdateViewOrderPatti = useCallback(
    (data) => {
      console.log("updateViewOrderPatti called with:", data);
      setLocalFormState((prev) => {
        const newState = { ...prev, پٹی: { ...prev.پٹی, ...data } };
        console.log("New localFormState (patti):", newState);
        return newState;
      });
      setFormState((prev) => {
        const newState = { ...prev, patti: { ...prev.patti, ...data } };
        console.log("New parentFormState (patti):", newState);
        return newState;
      });
      updateViewOrderPatti(data);
    },
    [updateViewOrderPatti, setFormState]
  );

  // Update data handler
  const updateData = useCallback(
    (key, data) => {
      const formStateKey = Object.values(mapping).find((item) => item.key === key)?.key;
      if (!formStateKey) {
        console.error(`No formStateKey found for key: ${key}`);
        return;
      }
      console.log(`updateData called with key: ${key}, data:`, data);
      setLocalFormState((prev) => {
        const currentData = prev[formStateKey] || {};
        const newState = {
          ...prev,
          [formStateKey]: { ...currentData, ...data },
        };
        console.log(`New localFormState (${formStateKey}):`, newState);
        return newState;
      });
      setFormState((prev) => {
        const currentData = prev[formStateKey] || {};
        const newState = {
          ...prev,
          [formStateKey]: { ...currentData, ...data },
        };
        console.log(`New parentFormState (${formStateKey}):`, newState);
        return newState;
      });
    },
    [setFormState]
  );

  // Handlers for collar and measurement
  const handleMeasurementChange = useCallback(
    (subCategory, value) => {
      updateData(subCategory, { measurement: value });
    },
    [updateData]
  );

  const handleCollarPosition = useCallback(
    (position) => {
      updateData("collar", { collarPosition: position });
    },
    [updateData]
  );

  // Track completed tabs
  useEffect(() => {
    const newCompletedTabs = {};
    orderedSubCategories.forEach((subCategory) => {
      let isCompleted = false;
      const formStateKey = mapping[subCategory].key;
      const data = formState[subCategory];
      if (subCategory === "کٹر") {
        isCompleted = Array.isArray(data?.selectedButtons) && data.selectedButtons.length > 0;
      } else if (subCategory === "سلائی" || subCategory === "بٹن") {
        isCompleted = !!data?.selectedButton;
      } else if (subCategory === "جیب") {
        isCompleted =
          (data?.pocketImages?.length || 0) > 0 ||
          !!data?.noOfPockets ||
          !!data?.pocketSize ||
          !!data?.kandeSeJaib ||
          (data?.styleSelections?.length || 0) > 0 ||
          !!data?.selectedButton;
      } else if (subCategory === "کف") {
        isCompleted =
          (data?.cuffImages?.length || 0) > 0 ||
          !!data?.selectedDropdownCuff ||
          (data?.styleSelections?.length || 0) > 0 ||
          !!data?.lengthValue;
      } else if (subCategory === "شلوار") {
        isCompleted =
          !!data?.selectedImage ||
          !!data?.panchaChorai ||
          (data?.styleSelections?.length || 0) > 0 ||
          !!data?.measurement;
      } else if (subCategory === "پٹی") {
        isCompleted =
          !!data?.selectedImage ||
          !!data?.design ||
          !!data?.length ||
          !!data?.width ||
          !!data?.buttons;
      } else if (subCategory === "کالر") {
        isCompleted = !!data?.measurement || !!data?.collarPosition || !!data?.selectedButton;
      }
      newCompletedTabs[subCategory] = isCompleted;
      console.log(`Completed status for ${subCategory}:`, isCompleted);
    });
    setCompletedTabs(newCompletedTabs);
  }, [formState, orderedSubCategories]);

  // Slider positions for desktop nav
  const activeIndex = orderedSubCategories.findIndex(
    (cat) => cat === selectedSubCategory
  );
  const sliderIndex = hoverIndex !== null ? hoverIndex : activeIndex >= 0 ? activeIndex : 0;
  const col = sliderIndex % 4;
  const row = Math.floor(sliderIndex / 4);
  const sliderX = col * 100;
  const sliderY = row * 52;

  // Handle subcategory selection
  const handleSubCategoryClick = useCallback(
    (category) => {
      setLocalSelectedSubCategory(category);
      setSelectedSubCategory(category);
      setDropdownOpen(false);
    },
    [setSelectedSubCategory]
  );

  return (
    <div className="p-8 rounded-xl bg-cardBg border shadow-lg w-[20rem] ml-3 md:ml-6 md:w-[595px] mx-0 font-nastaliq relative z-0">
      <h3 className="text-lg font-bold text-heading mb-4">
        ذیلی زمرہ منتخب کریں
      </h3>

      {/* Mobile Dropdown */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <button
          className="text-2xl"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen((prev) => !prev);
          }}
        >
          <HiMenuAlt3 />
        </button>
        <h4 className="text-lg font-bold">ذیلی زمرہ جات</h4>
      </div>
      {dropdownOpen && (
        <div className="flex flex-col space-y-4 md:hidden z-10">
          {orderedSubCategories.map((category) => (
            <button
              key={category}
              className={`btn px-4 rounded-lg w-full text-right ${
                selectedSubCategory === category
                  ? "bg-black text-white"
                  : completedTabs[category]
                  ? "bg-green-500 text-white"
                  : "bg-btnBg text-white"
              } transition-all duration-300 transform hover:scale-105`}
              onClick={() => handleSubCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Desktop Grid */}
      <div className="hidden md:block border rounded-xl relative z-0 py-[8px] px-[8px]">
        <div className="subcat-grid relative">
          {orderedSubCategories.map((category, idx) => {
            const radioId = `subcategory-${idx}`;
            const isActive = category === selectedSubCategory;
            return (
              <React.Fragment key={category}>
                <input
                  type="radio"
                  id={radioId}
                  name="subcategory"
                  className="hidden"
                  checked={isActive}
                  onChange={() => handleSubCategoryClick(category)}
                />
                <label
                  htmlFor={radioId}
                  className={`subcat-label ${
                    completedTabs[category]
                      ? "bg-green-400 text-white"
                      : "bg-btnBg text-white"
                  } ${isActive ? "animate-borderPulse bg-black text-white" : ""}`}
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {category}
                </label>
              </React.Fragment>
            );
          })}
          <div
            className="subcat-slidebar"
            style={{ transform: `translate(${sliderX}%, ${sliderY}px)` }}
          />
        </div>
      </div>

      {/* Render all subcategory components */}
      <div className="subcategory-content mt-4">
        {orderedSubCategories.map((category) => (
          <div
            key={category}
            className={`subcategory-panel ${
              selectedSubCategory === category
                ? "opacity-100 visible"
                : "opacity-0 invisible h-0 overflow-hidden"
            } transition-opacity duration-300`}
          >
            {category === "کالر" && (
              <کالر
                subCategoryImages={subCategoryImages}
                selectedImages={memoizedSelectedImages}
                handleImageClick={handleImageClick}
                selectedMeasurement={formState.کالر.measurement}
                handleMeasurementChange={(value) =>
                  handleMeasurementChange("collar", value)
                }
                collarPosition={formState.کالر.collarPosition}
                handleCollarPosition={handleCollarPosition}
                selectedSubCategory={selectedSubCategory}
                updateViewOrder={updateViewOrder}
                updateData={updateData}
                formState={formState.کالر}
              />
            )}
            {category === "پٹی" && (
              <پٹی
                selectedImages={memoizedSelectedImages}
                handleImageClick={handleImageClick}
                selectedSubCategory={selectedSubCategory}
                updateViewOrderPatti={memoizedUpdateViewOrderPatti}
                formState={formState.پٹی}
              />
            )}
            {category === "کف" && (
              <کف
                subCategoryImages={subCategoryImages}
                selectedSubCategory={selectedSubCategory}
                handleImageClick={handleImageClick}
                updateData={updateData}
                formState={formState.کف}
              />
            )}
            {category === "جیب" && (
              <جیب
                subCategoryImages={subCategoryImages}
                selectedSubCategory={selectedSubCategory}
                handleImageClick={handleImageClick}
                formState={formState.جیب}
                updateData={updateData}
                handleButtonClick={handleButtonClick}
              />
            )}
            {category === "شلوار" && (
              <شلوار
                subCategoryImages={subCategoryImages}
                selectedSubCategory={selectedSubCategory}
                handleImageClick={handleImageClick}
                formState={formState.شلوار}
                updateData={updateData}
              />
            )}
            {category === "سلائی" && (
              <سلائی
                selectedSubCategory={selectedSubCategory}
                handleButtonClick={handleButtonClick}
                formState={formState.سلائی}
                updateData={updateData}
              />
            )}
            {category === "بٹن" && (
              <بٹن
                selectedSubCategory={selectedSubCategory}
                handleButtonClick={handleButtonClick}
                formState={formState.بٹن}
                updateData={updateData}
              />
            )}
            {category === "کٹر" && (
              <کٹر
                selectedSubCategory={selectedSubCategory}
                formState={formState.کٹر}
                updateData={updateData}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubCategorySelector;