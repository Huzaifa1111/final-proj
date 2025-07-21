import React, { useState, useEffect } from "react";
import { PiPantsThin } from "react-icons/pi";
import { GiPoloShirt, GiPirateCoat, GiSleevelessJacket, GiClothes, GiLabCoat } from "react-icons/gi";

function VarietySelector({ 
  selectedVariety, 
  handleVarietyClick, 
  scrollToForm,
  customerId,
  subOrders,
  setSubOrders
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Customer ID changed:", customerId);
    if (customerId) {
      fetchSubOrders();
    } else {
      setSubOrders({
        Pant: [],
        Pantcoat: [],
        Waistcoat: [],
        Coat: [],
        Shalwaarkameez: [],
        Shirt: [],
      });
    }
  }, [customerId]);

  const fetchSubOrders = async () => {
    console.log("Fetching sub-orders for customer:", customerId);
    setLoading(true);
    try {
      const varieties = ["Pant", "Pantcoat", "Waistcoat", "Coat", "Shalwaarkameez", "Shirt"];
      const subOrdersByVariety = {
        Pant: [],
        Pantcoat: [],
        Waistcoat: [],
        Coat: [],
        Shalwaarkameez: [],
        Shirt: [],
      };

      for (const variety of varieties) {
        const response = await fetch(
          `/api/orders/suborders?customerId=${customerId}&variety=${encodeURIComponent(variety)}`,
          {
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(`Response status for ${variety}:`, response.status);
        const data = await response.json();
        console.log(`Received sub-orders for ${variety}:`, data);

        subOrdersByVariety[variety] = Array.isArray(data) ? data : [];
      }

      console.log("Final subOrdersByVariety:", subOrdersByVariety);
      setSubOrders(subOrdersByVariety);
    } catch (error) {
      console.error("Error fetching sub-orders:", error);
      setSubOrders({
        Pant: [],
        Pantcoat: [],
        Waistcoat: [],
        Coat: [],
        Shalwaarkameez: [],
        Shirt: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const varietyIcons = {
    Pant: <PiPantsThin className="w-6 h-6 md:w-8 md:h-8" />,
    Pantcoat: <GiLabCoat className="w-6 h-6 md:w-8 md:h-8" />,
    Waistcoat: <GiSleevelessJacket className="w-5 h-6 md:w-7 md:h-8" />,
    Coat: <GiPirateCoat className="w-6 h-6 md:w-8 md:h-8" />,
    Shalwaarkameez: <GiClothes className="w-9 h-6 md:w-11 md:h-8" />,
    Shirt: <GiPoloShirt className="w-9 h-6 md:w-11 md:h-8" />,
  };

  return (
    <div className="md:p-[21px] p-[12px] ml-3 md:ml-1 space-x-2 rounded-xl bg-cardBg md:w-[611px] w-[318px] border shadow-xl font-font">
      <h3 className="text-lg font-bold text-left text-heading">Select Variety</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {Object.keys(varietyIcons).map((variety) => (
          <div key={variety} className="relative">
            <button
              onClick={() => {
                handleVarietyClick(variety);
                scrollToForm();
              }}
              className={`btn w-[8rem] md:w-[9rem] h-[70px] md:h-[99px] flex flex-col items-center justify-center px-2 rounded-3xl ${
                selectedVariety === variety ? "bg-black text-white" : "bg-btnBg text-white"
              } transition-all duration-300`}
            >
              <span className="flex items-center mb-1 md:mb-2">
                {varietyIcons[variety]}
              </span>
              <span className="text-xs md:text-sm text-white truncate">{variety}</span>
            </button>
          </div>
        ))}
      </div>
      {loading && <div className="text-center mt-2">Loading sub-orders...</div>}
    </div>
  );
}

export default VarietySelector;