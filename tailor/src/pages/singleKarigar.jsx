import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SingleKarigar = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { karigar } = state || {};
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [karigars, setKarigars] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (karigar && karigar.karigarId) {
      fetchAssignedOrders();
      fetchUnassignedOrders();
      fetchDeliveredOrders();
      fetchKarigars();
    }
  }, [karigar]);

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const orders = await response.json();
      const filteredOrders = orders
        .filter(
          (order) =>
            order.karigar &&
            order.karigar.karigarId === karigar.karigarId &&
            order.details?.status !== "Delivered"
        )
        .map((order) => ({
          ...order,
          status: "Assigned",
        }));
      setAssignedOrders(filteredOrders);
      setError("");
    } catch (err) {
      console.error("Error fetching assigned orders:", err);
      setError("Failed to load assigned orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const orders = await response.json();
      const filteredOrders = orders.filter(
        (order) => !order.karigar && order.details?.status !== "Delivered"
      );
      setUnassignedOrders(filteredOrders);
      setError("");
    } catch (err) {
      console.error("Error fetching unassigned orders:", err);
      setError("Failed to load unassigned orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const orders = await response.json();
      const filteredOrders = orders
        .filter(
          (order) =>
            order.karigar &&
            order.karigar.karigarId === karigar.karigarId &&
            order.details?.status === "Delivered"
        )
        .map((order) => ({
          ...order,
          status: "Delivered",
        }));
      setDeliveredOrders(filteredOrders);
      setError("");
    } catch (err) {
      console.error("Error fetching delivered orders:", err);
      setError("Failed to load delivered orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchKarigars = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/karigars", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const karigarsData = await response.json();
      setKarigars(karigarsData);
      setError("");
    } catch (err) {
      console.error("Error fetching karigars:", err);
      setError("Failed to load karigars.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignKarigar = async (orderId) => {
    try {
      const order = unassignedOrders.find((o) => o._id === orderId);
      if (!order) {
        setError("Order not found.");
        return;
      }

      const missingFields = [];
      if (!order.customerId?._id) missingFields.push("customerId");
      if (!order.bookingNo) missingFields.push("bookingNo");
      if (!order.subId) missingFields.push("subId");
      if (!order.type) missingFields.push("type");
      if (!order.customerId?.bookNo) missingFields.push("bookNo");
      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      console.log("Assign karigar request body:", {
        karigar: {
          _id: karigar._id,
          name: karigar.name,
          karigarId: karigar.karigarId,
        },
        customerDetails: {
          _id: order.customerId._id,
          name: order.customerId.name,
          phone: order.customerId.phone,
          cnic: order.customerId.cnic,
          bookNo: order.customerId.bookNo,
          customerId: order.customerId.customerId,
        },
        bookingNo: order.bookingNo,
        subId: order.subId,
        type: order.type,
      });

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          karigar: {
            _id: karigar._id,
            name: karigar.name,
            karigarId: karigar.karigarId,
          },
          customerDetails: {
            _id: order.customerId._id,
            name: order.customerId.name || "",
            phone: order.customerId.phone || "",
            cnic: order.customerId.cnic || "",
            bookNo: order.customerId.bookNo || "N/A",
            customerId: order.customerId.customerId || "",
          },
          bookingNo: order.bookingNo,
          subId: order.subId,
          type: order.type,
          measurement: order.measurements || {},
          selectedImages: order.selectedImages || [],
          details: order.details || {},
          collar: order.collar || {},
          patti: order.patti || {},
          cuff: order.cuff || {},
          pocket: order.pocket || {},
          shalwar: order.shalwar || {},
          silai: order.silai || {},
          button: order.button || {},
          cutter: order.cutter || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      setUnassignedOrders(unassignedOrders.filter((o) => o._id !== orderId));
      await fetchAssignedOrders();
      setError("");
    } catch (err) {
      console.error("Error assigning karigar:", err);
      setError(`Failed to assign karigar: ${err.message}`);
    }
  };

  const handleUnassignKarigar = async (orderId) => {
  try {
    // Find the order from assignedOrders
    const order = assignedOrders.find((o) => o._id === orderId);
    if (!order) {
      setError("Order not found.");
      return;
    }

    // Validate required fields
    const missingFields = [];
    if (!order.customerId?._id) missingFields.push("customerId");
    if (!order.bookingNo) missingFields.push("bookingNo");
    if (!order.subId) missingFields.push("subId");
    if (!order.type) missingFields.push("type");
    if (!order.customerId?.bookNo) missingFields.push("bookNo");
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    console.log('Unassign karigar request body:', {
      karigar: null,
      customerDetails: order.customerId,
      bookingNo: order.bookingNo,
      subId: order.subId,
      type: order.type,
      measurements: order.measurements || {},
      selectedImages: order.selectedImages || [],
      details: order.details || {},
      collar: order.collar || {},
      patti: order.patti || {},
      cuff: order.cuff || {},
      pocket: order.pocket || {},
      shalwar: order.shalwar || {},
      silai: order.silai || {},
      button: order.button || {},
      cutter: order.cutter || {},
    });

    const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        karigar: null,
        customerDetails: {
          _id: order.customerId._id,
          name: order.customerId.name || "",
          phone: order.customerId.phone || "",
          cnic: order.customerId.cnic || "",
          bookNo: order.customerId.bookNo || "N/A",
          customerId: order.customerId.customerId || "",
        },
        bookingNo: order.bookingNo,
        subId: order.subId,
        type: order.type,
        measurements: order.measurements || {},
        selectedImages: order.selectedImages || [],
        details: order.details || {},
        collar: order.collar || {},
        patti: order.patti || {},
        cuff: order.cuff || {},
        pocket: order.pocket || {},
        shalwar: order.shalwar || {},
        silai: order.silai || {},
        button: order.button || {},
        cutter: order.cutter || {},
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    setAssignedOrders(assignedOrders.filter((o) => o._id !== orderId));
    await fetchUnassignedOrders();
    setError("");
  } catch (err) {
    console.error("Error unassigning karigar:", err);
    setError(`Failed to unassign karigar: ${err.message}`);
  }
};

  const handleMarkDelivered = async (orderId) => {
    try {
      const order = assignedOrders.find((o) => o._id === orderId);
      if (!order) {
        setError("Order not found.");
        return;
      }

      const missingFields = [];
      if (!order.customerId?._id) missingFields.push("customerId");
      if (!order.bookingNo) missingFields.push("bookingNo");
      if (!order.subId) missingFields.push("subId");
      if (!order.type) missingFields.push("type");
      if (!order.customerId?.bookNo) missingFields.push("bookNo");
      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      const karigarData = order.karigar
        ? {
            _id: order.karigar._id,
            name: order.karigar.name,
            karigarId: order.karigar.karigarId,
          }
        : null;

      console.log("Order data:", order);
      console.log("Customer data:", order.customerId);
      console.log("Mark delivered request body:", {
        karigar: karigarData,
        customerDetails: {
          _id: order.customerId._id,
          name: order.customerId.name,
          phone: order.customerId.phone,
          cnic: order.customerId.cnic,
          bookNo: order.customerId.bookNo,
          customerId: order.customerId.customerId,
        },
        bookingNo: order.bookingNo,
        subId: order.subId,
        type: order.type,
        details: { ...order.details, status: "Delivered" },
      });

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          karigar: karigarData,
          customerDetails: {
            _id: order.customerId._id,
            name: order.customerId.name || "",
            phone: order.customerId.phone || "",
            cnic: order.customerId.cnic || "",
            bookNo: order.customerId.bookNo || "N/A",
            customerId: order.customerId.customerId || "",
          },
          bookingNo: order.bookingNo,
          subId: order.subId,
          type: order.type,
          measurement: order.measurements || {},
          selectedImages: order.selectedImages || [],
          details: { ...order.details, status: "Delivered" },
          collar: order.collar || {},
          patti: order.patti || {},
          cuff: order.cuff || {},
          pocket: order.pocket || {},
          shalwar: order.shalwar || {},
          silai: order.silai || {},
          button: order.button || {},
          cutter: order.cutter || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      setAssignedOrders(assignedOrders.filter((o) => o._id !== orderId));
      await fetchDeliveredOrders();
      setError("");
    } catch (err) {
      console.error("Error marking order as delivered:", err);
      setError(`Failed to mark order as delivered: ${err.message}`);
    }
  };

  const handleCancelDelivered = async (orderId) => {
    try {
      const order = deliveredOrders.find((o) => o._id === orderId);
      if (!order) { 
        setError("Order not found");
        return;
      }

      const missingFields = [];
      if (!order.customerId?._id) missingFields.push("customerId");
      if (!order.bookingNo) missingFields.push("bookingNo");
      if (!order.subId) missingFields.push("subId");
      if (!order.type) missingFields.push("type");
       if (!order.customerId?.bookNo) missingFields.push("bookNo");
       if (missingFields.length > 0) {
        setError(`Missing fields required: ${missingFields.join(", ")}`);
        return;
       }
       
       const karigarData = order.karigar
       ? {
        _id: order.karigar._id,
        name: order.karigar.name,
        karigarId: order.karigar.karigarId,
       }
       : null;

       const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json",
        
        },
        credentials:"include",
        body: JSON.stringify({
          karigar: karigarData,
          customerDetails :{
            _id: order.customerId._id,
            name: order.customerId.name || "",
            phone: order.customerId.phone || "",
          cnic: order.customerId.cnic || "",
          bookNo: order.customerId.bookNo || "N/A",
          customerId: order.customerId.customerId || "",
          },
          bookingNo: order.bookingNo,
        subId: order.subId,
        type: order.type,
        measurement: order.measurements || {},
        selectedImages: order.selectedImages || [],
        details: { ...order.details, status: "Assigned" },
        collar: order.collar || {},
        patti: order.patti || {},
        cuff: order.cuff || {},
        pocket: order.pocket || {},
        shalwar: order.shalwar || {},
        silai: order.silai || {},
        button: order.button || {},
        cutter: order.cutter || {},
        }),
       });

       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `http error! Status: ${response.status}, Message: ${
            errorData.message || "unkniwn error"
          }`
        );
       }
 
       setDeliveredOrders(deliveredOrders.filter((o) => o._id !== orderId));
    await fetchAssignedOrders();
    setError("");
  } catch (err) {
    console.error("Error cancelling delivered order:", err);
    setError(`Failed to cancel delivered order: ${err.message}`);
  }

    };
  

  if (!karigar) {
    return <div className="text-center mt-10">No Karigar Data Available</div>;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center pt-[25px] font-font min-h-screen">
      <div className="md:mb-6 mb-3 p-6 rounded-xl space-y-6 w-[90%] md:w-[60rem] bg-cardBg border shadow-lg border-gradient">
        <div className="flex justify-start">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 text-sm text-white bg-btnBg rounded-2xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-heading mb-4">Karigar Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  id="ID"
                  type="text"
                  value={karigar.karigarId}
                  disabled
                  className="input-custom w-[100%] px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="ID"
                  className="absolute left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 top-[-8px] text-xs"
                >
                  Karigar ID
                </label>
              </div>
              <div className="relative">
                <input
                  id="Name"
                  type="text"
                  value={karigar.name}
                  disabled
                  className="input-custom w-[100%] px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="Name"
                  className="absolute left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 top-[-8px] text-xs"
                >
                  Name
                </label>
              </div>
              <div className="relative">
                <input
                  id="Phone"
                  type="text"
                  value={karigar.phone}
                  disabled
                  className="input-custom w-[100%] px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="Phone"
                  className="absolute left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 top-[-8px] text-xs"
                >
                  Phone
                </label>
              </div>
              <div className="relative">
                <input
                  id="KarigarType"
                  type="text"
                  value={karigar.karigarType.join(", ")}
                  disabled
                  className="input-custom w-[100%] px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="KarigarType"
                  className="absolute left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 top-[-8px] text-xs"
                >
                  Karigar Type
                </label>
              </div>
              <div className="relative">
                <input
                  id="DateCreated"
                  type="date"
                  value={karigar.dateCreated?.split("T")[0]}
                  disabled
                  className="input-custom w-[100%] px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="DateCreated"
                  className="absolute left-4 text-gray-500 bg-gray-100 px-1 transition-all duration-200 top-[-8px] text-xs"
                >
                  Date Created
                </label>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-heading mb-4">
              Unassigned Orders
            </h2>
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : unassignedOrders.length === 0 ? (
              <div className="text-center text-gray-500">
                No unassigned orders available.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 bg-gray-200">
                    <tr>
                      <th className="p-2 border">Order No</th>
                      <th className="p-2 border">Customer Name</th>
                      <th className="p-2 border">Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassignedOrders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="p-2 border">{order.subId}</td>
                        <td className="p-2 border">
                          {order.customerId?.name || "Unknown"}
                        </td>
                        <td className="p-2 border">
                          <input
                            type="checkbox"
                            onChange={() => handleAssignKarigar(order._id)}
                            className="mr-2"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-heading">Assigned Orders</h2>
              <button
                className="px-4 py-2 text-sm text-white bg-btnBg rounded-2xl hover:scale-105 transition-all duration-300 ease-in-out"
                onClick={() => fetchUnassignedOrders()}
              >
                Refresh
              </button>
            </div>
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : assignedOrders.length === 0 ? (
              <div className="text-center text-gray-500">
                No orders assigned to this karigar yet.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 bg-gray-200">
                    <tr>
                      <th className="p-2 border">Order No</th>
                      <th className="p-2 border">Customer Name</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Delivered</th>
                      <th className="p-2 border">Unassign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedOrders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="p-2 border">{order.subId}</td>
                        <td className="p-2 border">
                          {order.customerId?.name || "Unknown"}
                        </td>
                        <td className="p-2 border">{order.status}</td>
                        <td className="p-2 border">
                          <input
                            type="checkbox"
                            onChange={() => handleMarkDelivered(order._id)}
                            className="mr-2"
                          />
                        </td>
                        <td className="p-2 border">
                          <button
                            onClick={() => handleUnassignKarigar(order._id)}
                            className="px-2 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600"
                          >
                            Unassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-heading">Completed Orders</h2>
              <button
                onClick={() => fetchDeliveredOrders()}
                className="px-4 py-2 text-sm text-white bg-btnBg rounded-2xl hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Refresh 
              </button>
            </div>
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : deliveredOrders.length === 0 ? (
              <div className="text-center text-gray-500">
                No delivered orders for this karigar yet.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 bg-gray-200">
                    <tr>
                      <th className="p-2 border">Order No</th>
                      <th className="p-2 border">Customer Name</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Cancel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveredOrders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="p-2 border">{order.subId}</td>
                        <td className="p-2 border">
                          {order.customerId?.name || "Unknown"}
                        </td>
                        <td className="p-2 border">{order.status}</td>
                        <td className="p-2 border">
                          <button 
                          onClick={() => handleCancelDelivered(order._id)}
                          className="px-2 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600">
                            Cancel
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleKarigar;