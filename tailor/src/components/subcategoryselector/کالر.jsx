import React, { useEffect } from "react";

function کالر({
  selectedImages,
  handleImageClick,
  selectedMeasurement,
  handleMeasurementChange,
  collarPosition,
  handleCollarPosition,
  selectedSubCategory,
  updateViewOrder,
  updateData,
}) {
  const collarImages = [
    "/assets/maghzi gala.svg",
    "/assets/gol colar.svg",
    "/assets/fc1.svg",
    "/assets/full ban gol.svg",
    "/assets/half ben gol.svg",
    "/assets/full ban choras.svg",
    "/assets/half ben choras.svg",
  ];

  const positionOptions = [
    { label: "کالر پر بٹن", value: "above" },
    { label: "کالر پر ڈیزائن", value: "center" },
    { label: "کالر پر کڑھائی", value: "below" },
  ];

  useEffect(() => {
    const data = {
      selectedMeasurement,
      collarPosition,
    };
    updateViewOrder(data);
    updateData("کالر", data);
  }, [selectedMeasurement, collarPosition, updateViewOrder, updateData]);

  const handleSelection = (imgSrc) => {
    handleImageClick(imgSrc, selectedSubCategory);
  };

  const onMeasurementChange = (e) => {
    const val = e.target.value;
    handleMeasurementChange(val);
  };

  const onPositionClick = (option) => {
    handleCollarPosition(option.value);
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 font-nastaliq">
      <div className="flex flex-col md:flex-row md:gap-4 gap-3 sm:gap-3">
        {/* Images */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full md:w-[23rem]">
            {collarImages.map((imgSrc, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={imgSrc}
                  alt={`کالر ${idx + 1}`}
                  className={`w-24 sm:w-28 md:w-32 h-20 sm:h-22 md:h-24 p-2 sm:p-2.5 md:p-3 cursor-pointer border rounded-3xl object-contain transition-all duration-300 bg-white ${
                    selectedImages.some((img) => img.imgSrc === imgSrc)
                      ? "border-2 border-green-600"
                      : "border border-white"
                  }`}
                  onClick={() => handleSelection(imgSrc)}
                  onError={(e) => {
                    e.target.src = "/fallback-image.jpg";
                    e.target.alt = "تصویر دستیاب نہیں";
                  }}
                />
                {selectedImages.some((img) => img.imgSrc === imgSrc) && (
                  <div className="mt-1 sm:mt-1.5 md:mt-2 text-center text-xs sm:text-sm md:text-sm text-gray-600">
                    {selectedMeasurement && (
                      <p>
                        چوڑائی: <strong>{selectedMeasurement}</strong>
                      </p>
                    )}
                    {collarPosition && (
                      <p>
                        پوزیشن: <strong>
                          {positionOptions.find((opt) => opt.value === collarPosition)?.label || collarPosition}
                        </strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown + Buttons */}
        <div className="w-full md:w-[134px] flex flex-col gap-2 sm:gap-3 md:gap-4 mt-3 md:mt-0">
          <select
            id="measurement"
            value={selectedMeasurement || ""}
            onChange={onMeasurementChange}
            className="w-full h-10 sm:h-11 md:h-12 px-2 sm:px-2.5 md:px-3 text-sm sm:text-base md:text-lg bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="" disabled>چوڑائی</option>
            {["1/2", "3/4", "1", "1x1/4", "1x1/2", "1x3/4", "2", "2x1/4", "2x1/2", "2x3/4", "3"].map(
              (val) => (
                <option key={val} value={val}>{val}</option>
              )
            )}
          </select>

          <div className="grid gap-1 sm:gap-1.5 md:gap-2">
            {positionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onPositionClick(opt)}
                className={`h-10 sm:h-11 md:h-12 px-3 sm:px-3.5 md:px-4 text-sm sm:text-base md:text-lg rounded-xl bg-white border transition ${
                  collarPosition === opt.value
                    ? "border-green-600 font-semibold bg-green-50"
                    : "border-gray-300 hover:shadow-sm"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default کالر;