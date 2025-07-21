import React from "react";
import MeasurementManager from "./MeasurementManager";
import KarigarSearch from "./KarigarSearch";

function MeasurementForm({
  selectedVarietyHeading,
  selectedVariety,
  formState,
  setFormState,
  children,
  extraData,
  updateExtraData,
  currentSubId,
  onKarigarSelect,
}) {
  const measurementFields = {
    Coat: ["سینہ", "کندھا", "آستین", "لمبائی", "کمر"],
    Pant: ["کمر", "لمبائی", "ران", "پائنچہ"],
    Pantcoat: ["سینہ", "کندھا", "آستین", "لمبائی"],
    Waistcoat: ["سینہ", "کندھا", "کمر", "لمبائی"],
    Shalwaarkameez: ["سینہ", "کندھا", "آستین", "لمبائی", "شلوار کی لمبائی"],
    Shirt: ["سینہ", "کندھا", "آستین", "لمبائی", "کمر"],
  };

  const getUniqueFieldId = (category, field) =>
    `${category.replace(/\s+/g, "_")}_${field.replace(/\s+/g, "_")}`;

  const handleInputChange = (uniqueFieldId, value) => {
  console.log(`Updating measurement: ${uniqueFieldId} = ${value}`);
  setFormState((prevState) => {
    const updatedMeasurement = {
      ...prevState.measurement,
      [uniqueFieldId]: value,
    };
    console.log("Updated formState.measurement:", updatedMeasurement);
    return {
      ...prevState,
      measurement: updatedMeasurement,
    };
  });
};

  const handleKarigarSelect = (karigar) => {
    setFormState((prevState) => ({
      ...prevState,
      karigar: karigar ? { _id: karigar._id, name: karigar.name, karigarId: karigar.karigarId } : null,
    }));
    if (onKarigarSelect) {
      onKarigarSelect(karigar);
    }
  };

  

  return (
   

<div className="p-2 m-2 sm:p-4 sm:m-4 md:p-[25px] md:m-0 rounded-xl bg-cardBg w-full max-w-[80vw] sm:max-w-[95vw] md:w-[611px] shadow-lg border font-font text-black relative">
  <div className="flex justify-between items-center mb-2 sm:mb-4">
    <div>
      <h3 className="text-base sm:text-lg font-bold text-heading">{selectedVarietyHeading}</h3>
      {currentSubId && (
        <p className="text-[10px] sm:text-xs text-gray-600">Sub ID: {currentSubId}</p>
      )}
    </div>
  </div>

  {formState.customerDetails?.id && (
    <MeasurementManager
      customer={formState.customerDetails}
      selectedVariety={selectedVariety}
      formState={formState}
      onMeasurementSelect={(measurementData, baseSubId, versionIndex) => {
        if (!measurementData) {
          console.log("Clearing measurements");
          setFormState((prev) => ({
            ...prev,
            measurement: {},
            selectedImages: [],
          }));
          if (updateExtraData) updateExtraData({});
          return;
        }
        console.log("Selecting measurement:", measurementData);
        setFormState((prev) => {
          const newHistory = { ...prev.measurementHistory };
          if (newHistory[baseSubId]) {
            newHistory[baseSubId].activeVersionIndex = versionIndex;
          }
          return {
            ...prev,
            measurement: measurementData.measurements,
            selectedImages: measurementData.selectedImages || [],
            measurementHistory: newHistory,
          };
        });
        if (updateExtraData && measurementData.extraData) {
          updateExtraData(measurementData.extraData);
        }
      }}
    />
  )}

  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:gap-8 md:w-[27rem]">
    <div className="p-2 sm:p-4 rounded-xl border shadow-lg bg-cardBg order-1">
      {measurementFields[selectedVariety]?.map((field) => {
        const uniqueFieldId = getUniqueFieldId(selectedVariety, field);
        return (
          <div key={uniqueFieldId} className="relative mb-2 sm:mb-4">
            <input
              type="number"
              id={uniqueFieldId}
              value={formState.measurement?.[uniqueFieldId] ?? ""}
              onChange={(e) => handleInputChange(uniqueFieldId, e.target.value)}
              placeholder=" "
              className="peer w-full px-2 sm:px-4 pt-4 sm:pt-6 pb-1 sm:pb-2 border rounded-xl bg-inputBg text-black text-[10px] sm:text-sm focus:outline-none focus:ring-blue-500"
              required
            />
            <label
              htmlFor={uniqueFieldId}
              className="absolute left-2 sm:left-4 top-2 sm:top-3 z-10 bg-cardBg px-1 text-[10px] sm:text-sm transition-all duration-200 
                         peer-placeholder-shown:top-2 sm:peer-placeholder-shown:top-3 peer-placeholder-shown:text-[10px] sm:peer-placeholder-shown:text-sm 
                         peer-focus:top-0 peer-focus:left-1 sm:peer-focus:left-2 peer-focus:text-[8px] sm:peer-focus:text-xs 
                         peer-valid:top-0 peer-valid:left-1 sm:peer-valid:left-2 peer-valid:text-[8px] sm:peer-valid:text-xs"
              style={{ whiteSpace: "nowrap" }}
            >
              {field}
            </label>
          </div>
        );
      })}
    </div>
   <div className="order-2 ">
  {children}
  <KarigarSearch 
    onKarigarSelect={handleKarigarSelect} 
    selectedKarigar={formState.karigar}
  />
</div>
  </div>
</div>


  );
}

export default MeasurementForm;