import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Search from "../components/Search";
import OrderForm from "../components/OrderForm";

function CreateOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const generateSubId = async (variety, customerName) => {
    const varietyMap = {
      Pant: "PT",
      Pantcoat: "PC",
      Waistcoat: "WC",
      Coat: "CT",
      Shalwaarkameez: "SK",
      Shirt: "ST",
    };
    const prefix = varietyMap[variety] || "O";
    const nameInitial = customerName ? customerName.charAt(0).toUpperCase() : "X";

    try {
      // Fetch existing orders for this customer and variety
      const response = await fetch(
        `http://localhost:8000/api/orders/suborders?customerId=${encodeURIComponent(
          formState.customerDetails?._id
        )}&variety=${encodeURIComponent(variety)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const subOrders = await response.json();
      const count = subOrders.filter((order) => order.type === variety).length + 1;
      return `${prefix}-${nameInitial}-${count.toString().padStart(3, "0")}`;
    } catch (error) {
      console.error("Error generating subId:", error);
      return `${prefix}-${nameInitial}-${Date.now().toString().slice(-3)}`;
    }
  };

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formState, setFormState] = useState({
    customerDetails: null,
    bookingNo: `B-${Date.now().toString().slice(-5)}`,
    type: "",
    subId: "",
    measurements: {},
    selectedImages: [],
    details: {},
    measurementHistory: {},
    collar: {},
    patti: {},
    cuff: {},
    pocket: {},
    shalwar: {},
    silai: {},
    button: {},
    cutter: {},
    karigar: null,
    isSubOrder: false,
    parentOrderId: null,
  });
  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (location.state?.order && location.state?.isEditing) {
      const order = location.state.order;
      setIsEditing(true);
      setOrderId(order._id);
      setFormState({
        customerDetails: {
          _id: order.customerDetails._id,
          name: order.customerDetails.name,
          phone: order.customerDetails.phone || "",
          cnic: order.customerDetails.cnic || "",
          customerId: order.customerDetails.customerId,
          bookNo: order.customerDetails.bookNo || "",
        },
        bookingNo: order.bookingNo,
        type: order.type,
        subId: order.subId,
        measurements: order.measurements || {},
        selectedImages: [
          ...(order.selectedImages || []),
          ...(order.pocket?.pocketImages || []).map((img) => ({
            imgSrc: img.imgSrc,
            buttonName: img.buttonName || "جیب",
          })),
        ],
        details: order.details || {},
        measurementHistory: order.measurementHistory || {},
        collar: order.collar || {},
        patti: order.patti || {},
        cuff: order.cuff || {},
        pocket: {
          noOfPockets: order.pocket?.noOfPockets || "",
          pocketSize: order.pocket?.pocketSize || "",
          kandeSeJaib: order.pocket?.kandeSeJaib || "",
          selectedButton: order.pocket?.selectedButton || "",
          styleSelections: order.pocket?.styleSelections || [],
          pocketImages: order.pocket?.pocketImages || [],
        },
        shalwar: order.shalwar || {},
        silai: order.silai || {},
        button: order.button || {},
        cutter: order.cutter || {},
        karigar: order.karigar || null,
        isSubOrder: order.isSubOrder || false,
        parentOrderId: order.parentOrderId || null,
      });
      setShowOrderForm(true);
    }
  }, [location.state]);

  const searchCustomers = async (query) => {
    if (!query || query.trim() === "") return [];
    try {
      const response = await fetch(
        `http://localhost:8000/api/customers/search?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to search customers");
      const filteredResults = data.filter(
        (customer) =>
          (customer.name && customer.name.toLowerCase().startsWith(query.toLowerCase())) ||
          (customer.phone && customer.phone.startsWith(query))
      );
      const sortedResults = filteredResults.sort((a, b) =>
        a.name && b.name ? a.name.localeCompare(b.name) : 0
      );
      return sortedResults;
    } catch (error) {
      console.error("Error searching customers:", error);
      return [];
    }
  };

  const handleCreateOrder = async (customer) => {
    const subId = await generateSubId("Pant", customer.name);
    setFormState({
      customerDetails: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        cnic: customer.cnic,
        customerId: customer.customerId,
        bookNo: customer.bookNo || "",
      },
      bookingNo: `B-${Date.now().toString().slice(-5)}`,
      type: "Pant",
      subId,
      measurements: {},
      selectedImages: [],
      details: {},
      measurementHistory: {},
      collar: {},
      patti: {},
      cuff: {},
      pocket: {},
      shalwar: {},
      silai: {},
      button: {},
      cutter: {},
      karigar: null,
      isSubOrder: false,
      parentOrderId: null,
    });
    setShowOrderForm(true);
    setIsEditing(false);
    setOrderId(null);
  };

  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await fetch("http://localhost:8000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add customer");
      setCustomers((prev) => [...prev, data.customer]);
      return data.customer;
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer");
      return null;
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      console.log("Sending order data:", orderData);
      const payload = {
        customerId: orderData.customerDetails?._id,
        bookingNo: orderData.bookingNo,
        subId: orderData.subId,
        type: orderData.type,
        measurements: orderData.measurement || orderData.measurements || {},
        selectedImages: orderData.selectedImages || [],
        details: orderData.details,
        collar: orderData.collar,
        patti: orderData.patti,
        cuff: orderData.cuff,
        pocket: {
          ...orderData.pocket,
          pocketImages: orderData.selectedImages
            .filter((img) => img.buttonName === "جیب")
            .map((img) => ({ imgSrc: img.imgSrc, buttonName: img.buttonName })),
        },
        shalwar: orderData.shalwar,
        silai: orderData.silai,
        button: orderData.button,
        cutter: orderData.cutter,
        karigarId: orderData.karigar?._id || null,
        isSubOrder: orderData.isSubOrder || false,
        parentOrderId: orderData.parentOrderId || null,
      };

      let response;
      if (isEditing && orderId) {
        response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
      } else {
        response = await fetch("http://localhost:8000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save order");
      console.log("Order saved:", data.order);
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
      alert(`Failed to save order: ${error.message}`);
    }
  };

  return (
    <div className="bg-cardBg h-full">
      {!showOrderForm ? (
        <Search
          searchCustomers={searchCustomers}
          onAddCustomer={handleAddCustomer}
          onCreateOrder={handleCreateOrder}
          customers={customers}
          setCustomers={setCustomers}
        />
      ) : (
        <OrderForm
          formState={formState}
          setFormState={setFormState}
          customers={customers}
          setCustomers={setCustomers}
          onSaveOrder={handleSaveOrder}
          onCreateOrder={handleCreateOrder}
          onAddCustomer={handleAddCustomer}
          isEditing={isEditing}
          orderId={orderId}
        />
      )}
    </div>
  );
}

export default CreateOrder;