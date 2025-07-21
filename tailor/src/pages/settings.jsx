import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState({});
  const [values, setValues] = useState({});
  const [shopImage, setShopImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/check-session",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.isLoggedIn) {
          console.log("No active session, redirecting to login");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/");
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/settings", {
          credentials: "include",
        });
        const data = await response.json();
        if (data) {
          setValues({
            Pant: data.pantPrice || "",
            "Pant coat": data.pantCoatPrice || "",
            "Waist coat": data.waistCoatPrice || "",
            Coat: data.coatPrice || "",
            "Shalwar Kameez": data.shalwarKameezPrice || "",
            Shirt: data.shirtPrice || "",
            "Shop address": data.shopAddress || "",
            "Shop phone number": data.shopPhoneNumber || "",
            "Shop name": data.shopName || "",
            "Terms and condition": data.termsAndCondition || "",
          });
          setShopImage(data.shopImage || null);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setMessage("Error loading settings");
      }
    };

    checkSession();
    fetchSettings();
  }, [navigate]);

  const handleFocus = (field) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setFocused((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("pantPrice", values["Pant"] || "");
    formData.append("pantCoatPrice", values["Pant coat"] || "");
    formData.append("waistCoatPrice", values["Waist coat"] || "");
    formData.append("coatPrice", values["Coat"] || "");
    formData.append("shalwarKameezPrice", values["Shalwar Kameez"] || "");
    formData.append("shirtPrice", values["Shirt"] || "");
    formData.append("shopAddress", values["Shop address"] || "");
    formData.append("shopPhoneNumber", values["Shop phone number"] || "");
    formData.append("shopName", values["Shop name"] || "");
    formData.append("termsAndCondition", values["Terms and condition"] || "");

    const fileInput = document.getElementById("shop-image-upload");
    if (fileInput.files[0]) {
      formData.append("shopImage", fileInput.files[0]);
    }

    try {
      const response = await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Settings saved successfully!");
        setShopImage(null);
        setTimeout(() => {
          setMessage("");
          navigate("/dashboard", { state: { refreshPrices: true } });
        }, 3000);
      } else {
        console.error("Error saving settings:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        setMessage(
          `Error saving settings: ${data.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error saving settings:", {
        message: error.message,
        stack: error.stack,
      });
      setMessage(`Error saving settings: ${error.message}`);
    }
  };

  const fields = [
    "Pant",
    "Pant coat",
    "Waist coat",
    "Coat",
    "Shalwar Kameez",
    "Shirt",
    "Shop address",
    "Shop phone number",
    "Shop name",
    "Terms and condition",
  ];

  const firstColumnFields = fields.slice(0, 5);
  const secondColumnFields = fields.slice(5, 10);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2 sm:p-3 md:p-4">
      <div className="fixed top-1 xs:top-2 sm:top-3 md:top-4 right-1 xs:right-2 sm:right-3 md:right-4 z-10">
  <div className="flex flex-row space-x-1 xs:space-x-2 sm:space-x-3 bg-gray-100 border rounded-2xl shadow-lg p-1 xs:p-2 sm:p-3">
    <button className="hover:scale-105 transition-all duration-300 ease-in-out">
      <svg className="w-3 xs:w-4 sm:w-5 md:w-6 h-3 xs:h-4 sm:h-5 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
    </button>
    <div className="h-4 xs:h-5 sm:h-6 w-px bg-gray-300"></div>
    <div className="flex items-center hover:scale-105 transition-all duration-300 ease-in-out">
      <img src="/assets/img28.PNG" alt="Profile" className="w-4 xs:w-5 sm:w-6 md:w-8 h-4 xs:h-5 sm:h-6 md:h-8 rounded-full mr-0.5 xs:mr-1 sm:mr-2" />
      <span className="text-[0.65rem] xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700">Phi horizon</span>
    </div>
    <div className="h-4 xs:h-5 sm:h-6 w-px bg-gray-300"></div>
    <button className="hover:scale-105 transition-all duration-300 ease-in-out">
      <svg className="w-3 xs:w-4 sm:w-5 md:w-6 h-3 xs:h-4 sm:h-5 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
    </button>
  </div>
</div>
      <div className="w-[95%] sm:w-[90%] md:max-w-3xl bg-gray-100 border rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 mt-16 sm:mt-20 md:mt-24">
        {message && (
          <div
            className={`p-2 mb-3 sm:mb-4 text-center text-xs sm:text-sm md:text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 bg-blue-200 rounded-full flex items-center justify-center relative">
            <label htmlFor="shop-image-upload" className="cursor-pointer">
              {shopImage ? (
                <img
                  src={shopImage}
                  alt="Shop"
                  className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 rounded-full object-cover"
                  onError={() => setShopImage(null)}
                />
              ) : (
                <svg
                  className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </label>
            <input
              id="shop-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-medium mt-1 sm:mt-2">
            Upload Image
          </h3>
          <svg
            className="w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 text-gray-400 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542-7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <form
          className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2 md:gap-4"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2 sm:space-y-3 md:space-y-3">
            {firstColumnFields.map((label) => (
              <div key={label} className="relative">
                <input
                  type={label === "Terms and condition" ? "text" : "text"}
                  value={values[label] || ""}
                  onChange={(e) => handleChange(label, e.target.value)}
                  onFocus={() => handleFocus(label)}
                  onBlur={() => handleBlur(label, values[label])}
                  className={`w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-xl bg-inputBg focus:outline-none focus:border-blue-500 transition-all duration-200 text-xs sm:text-sm md:text-sm peer`}
                  placeholder=" "
                  style={{
                    minHeight:
                      label === "Terms and condition" ? "60px sm:80px" : "auto",
                  }}
                />
                <label
                  className={`absolute left-2 sm:left-3 md:left-3 top-1/2 -translate-y-1/2 text-gray-600 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500 ${
                    focused[label] || values[label]
                      ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                      : ""
                  }`}
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-3">
            {secondColumnFields.map((label) => (
              <div key={label} className="relative">
                <input
                  type={label === "Terms and condition" ? "text" : "text"}
                  value={values[label] || ""}
                  onChange={(e) => handleChange(label, e.target.value)}
                  onFocus={() => handleFocus(label)}
                  onBlur={() => handleBlur(label, values[label])}
                  className={`w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-xl bg-inputBg focus:outline-none focus:border-blue-500 transition-all duration-200 text-xs sm:text-sm md:text-sm peer`}
                  placeholder=" "
                  style={{
                    minHeight:
                      label === "Terms and condition" ? "60px sm:80px" : "auto",
                  }}
                />
                <label
                  className={`absolute left-2 sm:left-3 md:left-3 top-1/2 -translate-y-1/2 text-gray-600 bg-gray-100 px-1 transition-all duration-200 text-xs sm:text-sm md:text-sm peer-focus:top-[-8px] peer-focus:text-xs sm:peer-focus:text-xs md:peer-focus:text-xs peer-focus:text-blue-500 ${
                    focused[label] || values[label]
                      ? "top-[-8px] text-xs sm:text-xs md:text-xs"
                      : ""
                  }`}
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
          <div className="col-span-1 flex justify-center mt-2 sm:mt-3 md:col-span-2 md:mt-4">
            <button
              type="submit"
              className="w-full max-w-[8rem] sm:max-w-[10rem] md:max-w-[12rem] bg-btnBg text-white py-2 sm:py-2 md:py-2 rounded-xl hover:scale-105 transition-all duration-300 ease-in-out text-xs sm:text-sm md:text-sm"
            >
              Save and continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
