import React, { useState, useMemo } from "react";

const urduLabels = {
  design: "ڈیزائن",
  stitching: "سلائی",
  button: "بٹن",
  cutter: "کٹنگ",
  frontPocket: "سامنه کی جیب",
  collar: "کالر",
  cuff: "کف",
  patti: "پٹی",
  shalwar: "شلوار",
  silai: "سلائی",
  extra: "اضافی معلومات",
  color: "رنگ",
  fabric: "کپڑا",
  sNo: "سیریل نمبر",
  orderDetails: "آرڈر کی تفصیلات",
  amount: "رقم",
  total: "کل",
  advanced: "ایڈوانس",
  aeros: "باقی",
  discount: "رعایت",
  address: "پتہ",
  quantity: "مقدار",
};

const measurementFields = {
  Coat: ["سینہ", "کندھا", "آستین", "لمبائی", "کمر"],
  Pant: ["کمر", "لمبائی", "ران", "پائنچہ"],
  Pantcoat: ["سینہ", "کندھا", "آستین", "لمبائی"],
  Waistcoat: ["سینہ", "کندھا", "کمر", "لمبائی"],
  Shalwaarkameez: ["سینہ", "کندھا", "آستین", "لمبائی", "شلوار کی لمبائی"],
  Shirt: ["سینہ", "کندھا", "آستین", "لمبائی", "کمر"],
};

const Measurements = ({ groupedMeasurements, buttonSelections = [], selectedVariety }) => {
  const normalizedVariety = selectedVariety.replace("ShalwaarKameez", "Shalwaarkameez");
  const varietyMeasurements = groupedMeasurements[normalizedVariety] || {};

  if (!measurementFields[normalizedVariety]) {
    console.warn(`No measurement fields defined for ${normalizedVariety}`);
    return null;
  }

  const additionalFields = [
    "کالر_چوڑائی",
    "شلوار_پانچا_چوڑائی",
    "",
    "",
   
  ];

  const allFields = [
    ...measurementFields[normalizedVariety],
    ...additionalFields,
  ];

  return (
    <div className="w-full sm:w-[210px] font-urdu sm:ml-[99px] mt-2 sm:mt-0">
      <div className="text-xs h-auto bg-white border border-gray-200">
        <h4 className="text-[10px] sm:text-xs font-semibold text-gray-800 text-right border-b pb-2 pt-3 px-1 sm:px-2">
          {normalizedVariety === "Shalwaarkameez"
            ? "شلوار قمیض پیمائش"
            : `${normalizedVariety} پیمائش`}
        </h4>
        <div>
          {allFields.map((label, index) => {
            const fieldKey = label.replace(/\s+/g, "_");
            const displayLabel = label
              .replace("شلوار_پانچا_چوڑائی", "پانچا چوڑائی")
              .replace("کالر_چوڑائی", "کالر چوڑائی");

            return (
              <div
                key={index}
                className="flex items-center border-b border-gray-300 last:border-b-0"
              >
                <div className="w-1/2 sm:w-24 p-1 sm:p-2 bg-white border-r border-gray-300 text-[10px] sm:text-xs text-gray-600 text-right">
                  {varietyMeasurements[fieldKey] || "-"}
                </div>
                <div className="w-1/2 sm:w-24 p-1 sm:p-2 bg-white text-[10px] sm:text-xs text-gray-800 text-right">
                  {displayLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SelectedImages = ({
  selectedImages = [],
  selectedDropdown = "",
  buttonSelections = [],
  pattiOptions = {},
  selectedDropdownCuff = "",
  cuffImages = [],
  pocketImages = [],
  pocketDropdowns = {},
  pattiImages = [],
  shalwaarImage = [],
  shalwaarOptions = {},
  silaiSelection = "غیز منتخب",
  buttonSelectionNew = "غیز منتخب",
  cutterSelections = [],
  noOfPockets = "غیز منتخب",
  pattiDesign = "",
  pattiButtons = "",
  styleSelections = [],
}) => {
  const [extraDetails, setExtraDetails] = useState("");

  // newpdf.jsx - Update the groupedImages logic for patti
// newpdf.jsx - Update the groupedImages logic
const groupedImages = useMemo(() => {
  const grouped = {};
  const addedImages = new Set();

  const addToGroup = (img, groupName, extra = {}) => {
    if (!img?.imgSrc || !img?.buttonName) return;
    const uniqueKey = `${groupName}-${img.imgSrc}-${img.buttonName}`;
    if (addedImages.has(uniqueKey)) return;
    grouped[groupName] = grouped[groupName] || [];
    grouped[groupName].push({ ...img, ...extra });
    addedImages.add(uniqueKey);
  };
 // Handle patti images with data
  pattiImages.forEach((img) => {
    addToGroup(img, "پٹی", {
      length: img.length || pattiOptions.length || "",
      width: img.width || pattiOptions.width || "",
      buttons: img.buttons || pattiOptions.buttons || "",
      design: img.design || pattiOptions.design || ""
    });
  });


   // Handle pocket images (both front and side)
  pocketImages.forEach((img) => {
    addToGroup(img, img.buttonName.includes("ہوم سائیڈ") ? "ہوم سائیڈ جیب" : "جیب", {
      pocketSize: img.pocketSize || pocketDropdowns.pocketSize || "",
      kandeSeJaib: img.kandeSeJaib || pocketDropdowns.kandeSeJaib || "",
      noOfPockets: img.noOfPockets || pocketDropdowns.noOfPockets || "",
    });
  });


    selectedImages.forEach((img) => {
      if (img.buttonName === "کالر") {
        addToGroup(img, "کالر", { width: selectedDropdown || "" });
      } else if (img.buttonName === "کف") {
        addToGroup(img, "کف", {
          length: selectedDropdownCuff || "",
          width: cuffImages[0]?.width || ""
        });
      } else if (img.buttonName === "شلوار") {
        addToGroup(img, "شلوار", {
          width: shalwaarOptions.panchaChorai || ""
        });
      }
    });

    return grouped;
 }, [
  selectedImages, 
  pattiImages, 
  pocketImages, 
  pattiOptions, 
  pocketDropdowns, 
  selectedDropdown, 
  selectedDropdownCuff, 
  cuffImages, 
  shalwaarOptions
]);

  const baseLabels = useMemo(() => {
    const list = [
      ...(noOfPockets !== "غیز منتخب"
        ? [{ key: "noOfPockets", label: `  ${noOfPockets}` }]
        : []),
      ...(pattiDesign ? [{ key: "pattiDesign", label: `  ${pattiDesign}` }] : []),
      ...(pattiButtons
        ? [{ key: "pattiButtons", label: `بٹنوں کی تعداد: ${pattiButtons}` }]
        : []),
      ...(silaiSelection !== "غیز منتخب"
        ? [{ key: "silaiSelection", label: ` ${silaiSelection}` }]
        : []),
      ...(buttonSelectionNew !== "غیز منتخب"
        ? [{ key: "buttonSelectionNew", label: ` ${buttonSelectionNew}` }]
        : []),
      ...cutterSelections.map((selection, idx) => ({
        key: `cutter-${idx}`,
        label: ` ${selection}`,
      })),
      ...styleSelections.map((selection, idx) => ({
        key: `style-${idx}`,
        label: selection,
      })),
    ];
    return list;
  }, [
    noOfPockets,
    pattiDesign,
    pattiButtons,
    silaiSelection,
    buttonSelectionNew,
    cutterSelections,
    styleSelections,
  ]);

  const orderedLabels = useMemo(() => baseLabels, [baseLabels]);

  return (
    <div className="w-full sm:w-[410px] font-urdu">
      <div className="grid grid-cols-1 sm:grid-cols-2 bg-white">
        {Object.entries(groupedImages).map(([groupName, images]) => (
          <div key={groupName} className="border border-gray-200 bg-white p-1 sm:p-2">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-start mb-2 justify-between">
                <div className="flex-1 text-[9px] sm:text-[10px] text-gray-800 text-right pr-1 sm:pr-2">
                  <p>
                    {img.buttonName.includes("ہوم سائیڈ")
                      ? "ہوم سائیڈ جیب"
                      : img.buttonName.includes("مربع")
                      ? "مربع جیب"
                      : img.buttonName}
                  </p>
                  {groupName === "پٹی" && (
                    <>
                      {img.length && <p>لمبائی: {img.length}</p>}
                      {img.width && <p>چوڑائی: {img.width}</p>}
                      {img.buttons && <p>بٹن: {img.buttons}</p>}
                      {img.design && <p>ڈیزائن: {img.design}</p>}
                    </>
                  )}
                  {groupName.includes("جیب") && (
                    <>
                      {img.pocketSize && <p>سائز: {img.pocketSize}</p>}
                      {img.kandeSeJaib && <p>کندھے سے جیب: {img.kandeSeJaib}</p>}
                      {img.noOfPockets && <p>تعداد: {img.noOfPockets}</p>}
                      {img.pocketPosition && <p>پوزیشن: {img.pocketPosition}</p>}
                      {img.pocketShape && <p>شکل: {img.pocketShape}</p>}
                    </>
                  )}
                  {img.length && !groupName.includes("پٹی") && <p>لمبائی: {img.length}</p>}
                  {img.width && !groupName.includes("پٹی") && <p>چوڑائی: {img.width}</p>}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 ml-1 sm:ml-2 overflow-hidden">
                  <img
                    src={img.imgSrc}
                    alt={img.buttonName}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-image.jpg";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col p-1 sm:p-2 bg-white border border-gray-200">
        <h4 className="text-[10px] sm:text-xs font-semibold text-gray-800 text-right border-b border-gray-200 pb-1 mb-2">
          دیگر تفصیلات
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-1 sm:gap-x-4 gap-y-1 sm:gap-y-2">
          {orderedLabels.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center text-[9px] sm:text-[10px] text-gray-600"
            >
              <span className="break-words">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[618px] p-1 sm:p-2 bg-white border border-gray-50">
        <input
          type="text"
          value={extraDetails}
          onChange={(e) => setExtraDetails(e.target.value)}
          className="w-full p-1 sm:p-2 py-1 sm:py-2 rounded text-[10px] sm:text-xs font-urdu text-right"
          placeholder="Extra Details"
        />
      </div>
    </div>
  );
};

const Details1 = ({
  details = {},
  tailorName = "ADIL GENTS AND TAILOR",
  logoSrc = "/assets/img28.PNG",
}) => {
  const orderItems = [
    {
      item: "Shalwar kameez",
      quantity: details.quantity || 1,
      rate: details.total && details.quantity ? Math.round(details.total / details.quantity) : 1500,
      total: details.total || 1500,
    },
  ];

  return (
    <div className="w-full max-w-[90vw] sm:w-[618px] p-2 sm:p-4 border-t border-dashed font-sans text-sm bg-white text-black mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start border border-gray-200 pb-2">
        <div className="flex items-center space-x-2 flex-wrap">
          <img src={logoSrc} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
          <h1 className="text-sm sm:text-base font-bold break-words">{tailorName}</h1>
        </div>
        <div className="text-xs sm:text-sm mt-2 sm:mt-0">
          <strong>Order no:</strong> {details.subId || "N/A"}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        <div className="border border-gray-200 p-1 flex justify-between">
          <span>Customer No</span>
          <span>{details.customerId || "N/A"}</span>
        </div>
        <div className="border border-gray-200 p-1 flex justify-between">
          <span>Booking date</span>
          <span>{details.bookingDate || "N/A"}</span>
        </div>
        <div className="border border-gray-200 p-1 flex justify-between">
          <span>Customer Name</span>
          <span>{details.customerName || "N/A"}</span>
        </div>
        <div className="border border-gray-200 p-1 flex justify-between">
          <span>Delivery date</span>
          <span>{details.deliveryDate || "N/A"}</span>
        </div>
      </div>
      <div className="mt-3 border border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 font-semibold border border-gray-200 text-center bg-gray-100">
          <div className="border border-gray-100 py-1">Order details</div>
          <div className="border border-gray-100 py-1">QTY</div>
          <div className="border border-gray-100 py-1 hidden sm:block">Rate</div>
          <div className="border border-gray-100 py-1 hidden sm:block">Total</div>
        </div>
        {orderItems.map((item, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-4 text-center">
            <div className="border border-gray-100 py-1">{item.item}</div>
            <div className="border border-gray-100 py-1">{item.quantity}</div>
            <div className="border border-gray-100 py-1 hidden sm:block">{item.rate}</div>
            <div className="border border-gray-100 py-1 hidden sm:block">{item.total}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-2">
        <div className="border border-gray-100 p-1 flex justify-between font-medium">
          <span>Advance</span>
          <span>{details.advanced || "N/A"}</span>
        </div>
        <div className="border border-gray-100 p-1 flex justify-between font-medium">
          <span>R.amount</span>
          <span>{details.remaining || "N/A"}</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border border-gray-100 text-xs flex flex-col sm:flex-row justify-between items-center">
        <p className="break-words">
          <strong>Address:</strong> {details.address || "N/A"}
        </p>
        <span className="text-[10px] italic">Developed by Phi Horizon - 03113330151</span>
      </div>
    </div>
  );
};

const CustomerDetails1 = ({ customerDetails = {}, details = {}, karigar }) => {
  const { name, customerId, bookNo, cnic, phone } = customerDetails;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[90vw] sm:max-w-4xl sm:w-[620px] border border-gray-50 mt-2 overflow-hidden font-nastaliq text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start px-2 sm:px-4 bg-white">
          <div className="flex items-center flex-wrap">
            <img
              src="/assets/img28.PNG"
              alt="Adil Gents and Tailor Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain mr-2 mt-2 sm:mt-3"
            />
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
              ADIL GENTS AND TAILOR
            </h2>
          </div>
          <div className="flex flex-col mt-2 sm:mt-0">
            <div className="flex justify-between items-center p-1 sm:p-2 border-l border-b border-gray-300">
              <strong>B.date:</strong>
              <span className="text-gray-600">{details.bookingDate || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center p-1 sm:p-2 border-l border-gray-300">
              <strong>D.date:</strong>
              <span className="text-gray-600">{details.deliveryDate || "N/A"}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-4 grid-rows-4 sm:grid-rows-2 text-left bg-white">
          <div className="p-2 sm:p-3 border-r border-b border-gray-300 bg-gray-100">
            <strong>Customer No</strong>
          </div>
          <div className="p-2 sm:p-3 border-r border-b border-gray-300">{customerId || bookNo || "N/A"}</div>
          <div className="p-2 sm:p-3 border-r border-b border-gray-300 bg-gray-100">
            <strong>Order No</strong>
          </div>
          <div className="p-2 sm:p-3 border-b border-gray-300">{details.subId || "N/A"}</div>
          <div className="p-2 sm:p-3 border-r border-b sm:border-b-0 border-gray-300 bg-gray-100">
            <strong>Customer Name</strong>
          </div>
          <div className="p-2 sm:p-3 border-r border-b sm:border-b-0 border-gray-300">{name || "N/A"}</div>
          <div className="p-2 sm:p-3 border-r border-gray-300 bg-gray-100">
            <strong>Karigar Names</strong>
          </div>
          <div className="p-2 sm:p-3 border-gray-300">{karigar || "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export { Measurements, SelectedImages, Details1, CustomerDetails1 };