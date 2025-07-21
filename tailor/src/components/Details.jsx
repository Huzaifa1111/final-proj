import React, { useState } from "react";

const urduLabels = {

  deliveryDate: "ترسیل کی تاریخ",
  bookingDate: "بکنگ کی تاریخ",
  total: "کل",
  advanced: "ایڈوانس",
  remaining: "باقی",
  discount: "رعایت",
  address: "پتہ",
  quantity: "مقدار",
};

const Details = ({ details, onDetailsChange }) => {
  const [error, setError] = useState("");

  const numericFields = [
  
    
    "total",
    "advanced",
    "remaining",
    "discount",
    "quantity",
  ];

  const stringFields = ["customerName", "address"];

  const fields = [
   
    
    { id: "bookingDate", label: urduLabels.bookingDate, type: "date" },
    { id: "deliveryDate", label: urduLabels.deliveryDate, type: "date" },
    { id: "total", label: urduLabels.total, type: "text" },
    { id: "advanced", label: urduLabels.advanced, type: "text" },
    { id: "remaining", label: urduLabels.remaining, type: "text" },
    { id: "discount", label: urduLabels.discount, type: "text" },
    { id: "address", label: urduLabels.address, type: "text" },
    { id: "quantity", label: urduLabels.quantity, type: "text" },
  ];

  const handleDateChange = (id, value) => {
    // Validate dates
    if (id === "bookingDate" || id === "deliveryDate") {
      const bookingDate = id === "bookingDate" ? value : details.bookingDate || "";
      const deliveryDate = id === "deliveryDate" ? value : details.deliveryDate || "";

      if (bookingDate && deliveryDate) {
        const booking = new Date(bookingDate);
        const delivery = new Date(deliveryDate);
        if (delivery <= booking) {
          alert("Booking & delivery date is incorrect");
          setError("Give a valid date");
          return;
        }
      }
    }

    // Numeric fields validation
    if (numericFields.includes(id) && value && !/^\d+$/.test(value)) {
      setError("صرف نمبرز درج کریں");
      return;
    }

    // String fields validation
    if (stringFields.includes(id) && value && /\d/.test(value)) {
      setError("صرف حروف درج کریں");
      return;
    }

    setError("");
    const newDetails = { ...details, [id]: value };
    onDetailsChange(newDetails);
  };

  return (
    <div className="md:p-6 p-4 rounded-xl border md:w-[320px] w-[280px] shadow-lg font-nastaliq">
      <h3 className="text-lg font-bold text-heading mb-4">تفصیلات</h3>
      {error && (
        <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
      )}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {fields.map((field) => (
          <div key={field.id} className="relative">
            <input
              type={field.type}
              id={field.id}
              value={details[field.id] || ""}
              placeholder=" "
              required
              onChange={(e) => handleDateChange(field.id, e.target.value)}
              className="peer text-sm block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor={field.id}
              className="
                absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500
                pointer-events-none transition-all duration-200 bg-gray-100 px-1
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm 
                peer-focus:top-0 peer-focus:left-2 peer-focus:text-sm
                peer-valid:top-0 peer-valid:left-2 peer-valid:text-sm
              "
            >
              {field.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
