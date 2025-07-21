import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

// Orders Component
const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders from the backend
 const fetchOrders = useCallback(async (query = "") => {
  setIsLoading(true);
  setError(null);
  try {
    const url = query
      ? `http://localhost:8000/api/orders/search?customerName=${encodeURIComponent(query)}`
      : "http://localhost:8000/api/orders";
    console.log(`Fetching orders from: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched orders:", data);
    const formattedOrders = data.map((order) => ({
      _id: order._id,
      bookingNo: order.bookingNo,
      subId: order.subId, // Use the backend-provided subId (e.g., PT-I-001)
      customerId: {
        _id: order.customerId._id,
        customerId: order.customerId.customerId,
        name: order.customerId.name,
        phone: order.customerId.phone || "",
        cnic: order.customerId.cnic || "",
        bookNo: order.customerId.bookNo || "",
      },
      customer: order.customerId.name,
      category: order.type,
      status: order.details?.status || "Pending",
      bookingDate: order.createdAt ? new Date(order.createdAt).toISOString().split("T")[0] : "",
      deliveryDate: order.details?.deliveryDate || "",
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
      karigar: order.karigar || null,
      isSubOrder: order.isSubOrder || false,
      parentOrderId: order.parentOrderId || null,
      pdfData: order.pdfData || "",
      subOrders: (order.subOrders || []).map((subOrder) => ({
        _id: subOrder._id,
        bookingNo: subOrder.bookingNo,
        subId: subOrder.subId, // Use backend-provided subId
        customerId: {
          _id: order.customerId._id,
          customerId: order.customerId.customerId,
          name: order.customerId.name,
          phone: order.customerId.phone || "",
          cnic: order.customerId.cnic || "",
          bookNo: order.customerId.bookNo || "",
        },
        customer: order.customerId.name,
        category: subOrder.type,
        status: subOrder.details?.status || "Pending",
        bookingDate: subOrder.createdAt ? new Date(subOrder.createdAt).toISOString().split("T")[0] : "",
        deliveryDate: subOrder.details?.deliveryDate || "",
        measurements: subOrder.measurements || {},
        selectedImages: subOrder.selectedImages || [],
        details: subOrder.details || {},
        collar: subOrder.collar || {},
        patti: subOrder.patti || {},
        cuff: subOrder.cuff || {},
        pocket: subOrder.pocket || {},
        shalwar: subOrder.shalwar || {},
        silai: subOrder.silai || {},
        button: subOrder.button || {},
        cutter: subOrder.cutter || {},
        karigar: subOrder.karigar || null,
        isSubOrder: true,
        parentOrderId: order._id,
        pdfData: subOrder.pdfData || "",
      })),
    }));
    // Apply category and status filters to the fetched data
    const filtered = formattedOrders.filter(
      (order) =>
        (categoryFilter ? order.category === categoryFilter : true) &&
        (statusFilter ? order.status === statusFilter : true)
    );
    setOrders(formattedOrders);
    setFilteredOrders(filtered);
    setCurrentPage(1);
  } catch (error) {
    console.error("Error fetching orders:", error);
    setError(error.message);
    setFilteredOrders([]);
  } finally {
    setIsLoading(false);
  }
}, [categoryFilter, statusFilter]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(`Search term changed: "${searchTerm}"`);
      fetchOrders(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchOrders]);

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      // Refetch orders to ensure UI reflects the latest state
      await fetchOrders(searchTerm);
      alert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      setError(error.message);
      alert("Failed to delete order: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEditOrder = (order) => {
    const completeOrderData = {
      _id: order._id,
      bookingNo: order.bookingNo,
      subId: order.subId,
      type: order.category,
      customerDetails: {
        _id: order.customerId._id,
        name: order.customerId.name,
        phone: order.customerId.phone || "",
        cnic: order.customerId.cnic || "",
        bookNo: order.customerId.bookNo || "",
        customerId: order.customerId.customerId,
      },
      measurements: order.measurements || {},
      selectedImages: order.selectedImages || [],
      details: {
        status: order.status || "Pending",
        bookingDate: order.bookingDate || "",
        deliveryDate: order.deliveryDate || "",
        total: order.details?.total || "",
        advanced: order.details?.advanced || "",
        remaining: order.details?.remaining || "",
        discount: order.details?.discount || "",
        quantity: order.details?.quantity || "",
        address: order.details?.address || "",
        ...order.details,
      },
      collar: {
        selectedMeasurement: order.collar?.selectedMeasurement || "",
        collarPosition: order.collar?.collarPosition || "",
        ...order.collar,
      },
      patti: {
        design: order.patti?.design || "",
        length: order.patti?.length || "",
        width: order.patti?.width || "",
        buttons: order.patti?.buttons || "",
        selectedImage: order.patti?.selectedImage || "",
        ...order.patti,
      },
      cuff: {
        lengthValue: order.cuff?.lengthValue || "",
        selectedDropdownCuff: order.cuff?.selectedDropdownCuff || "",
        styleSelections: order.cuff?.styleSelections || [],
        selectedGroupTwo: order.cuff?.selectedGroupTwo || "",
        cuffImages: order.cuff?.cuffImages || [],
        ...order.cuff,
      },
      pocket: {
        noOfPockets: order.pocket?.noOfPockets || "",
        pocketSize: order.pocket?.pocketSize || "",
        kandeSeJaib: order.pocket?.kandeSeJaib || "",
        selectedButton: order.pocket?.selectedButton || "",
        styleSelections: order.pocket?.styleSelections || [],
        pocketImages: order.pocket?.pocketImages || [],
        homeSidePocketImages: order.pocket?.homeSidePocketImages || [],
        ...order.pocket,
      },
      shalwar: {
        panchaChorai: order.shalwar?.panchaChorai || "",
        selectedImage: order.shalwar?.selectedImage || "",
        styleSelections: order.shalwar?.styleSelections || [],
        measurement: order.shalwar?.measurement || "",
        ...order.shalwar,
      },
      silai: {
        selectedButton: order.silai?.selectedButton || "",
        ...order.silai,
      },
      button: {
        selectedButton: order.button?.selectedButton || "",
        ...order.button,
      },
      cutter: {
        selectedButtons: order.cutter?.selectedButtons || [],
        ...order.cutter,
      },
      karigar: order.karigar
        ? {
            _id: order.karigar._id || order.karigar.id,
            name: order.karigar.name || "",
            karigarId: order.karigar.karigarId || "",
          }
        : null,
      measurementHistory: order.measurementHistory || {},
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || new Date().toISOString(),
      isSubOrder: order.isSubOrder || false,
      parentOrderId: order.parentOrderId || null,
      pdfData: order.pdfData || "",
    };

    navigate("/createorder", {
      state: {
        order: completeOrderData,
        isEditing: true,
        orderId: order._id,
      },
    });
  };

  // Handle create order button click
  const handleCreateOrder = () => {
    navigate("/createorder");
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle status filter
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex justify-center pt-[25px]">
      <div className="md:mb-6 mb-3 p-6 rounded-xl space-y-1 w-[90%] md:w-[60rem] bg-cardBg border shadow-lg border-gradient">
        <div className="space-x-3 float-right">
          <button className="px-2 py-1 text-sm text-white bg-btnBg rounded-xl">Export</button>
          <button className="px-2 py-1 text-sm text-white bg-btnBg rounded-xl">Import</button>
          <button
            className="px-2 py-1 text-sm text-white bg-btnBg rounded-xl"
            onClick={handleCreateOrder}
            disabled={isLoading}
          >
            Create Order
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-left text-heading">Orders List</h1>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-btnBg mx-auto"></div>
            <p>Loading...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-4 text-red-500">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative flex justify-center mb-4">
          <svg
            className="absolute left-[10px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Customer Name"
            className="w-[20rem] md:w-[31rem] pl-10 pr-4 py-2 border-customBorder bg-inputBg rounded-xl text-black border border-borderColor input-custom"
           
          />
        </div>

        {/* No Results Message */}
        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>No orders found</p>
          </div>
        )}

        {/* Pagination and Filters Row */}
        <div className="flex justify-between items-center mb-6 bg-gray-100 p-3 rounded-lg">
          <div className="flex space-x-2 items-center">
            <h1>Show</h1>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-2 rounded-lg text-sm bg-gray-200"
              disabled={isLoading}
            >
              {[25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <label>Category</label>
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="p-2 rounded-lg bg-gray-200 text-sm"
              disabled={isLoading}
            >
              <option value="">All</option>
              {["Pant", "Coat", "Shalwaarkameez", "Shirt", "Pant-Coat", "Waistcoat"].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="p-2 rounded-lg bg-gray-200 text-sm"
              disabled={isLoading}
            >
              <option value="">All</option>
              {["Completed", "Pending", "In Process"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-1 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              <svg
                className="w-[19px] h-[22px] text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-[6px] py-[3px] rounded-lg ${
                  currentPage === page ? "bg-btnBg text-white" : "bg-gray-200"
                }`}
                disabled={isLoading}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
              className="p-1 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              <svg
                className="w-[19px] h-[22px] text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>

        {/* Table with Scrollable Container */}
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-0 bg-gray-200">
              <tr>
                <th className="p-2 border">Order No</th>
                <th className="p-2 border">Customer ID</th>
                <th className="p-2 border">Customer Name</th>
                <th className="p-2 border">Booking Date</th>
                <th className="p-2 border">Delivery Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-b bg-gray-50">
                    <td className="p-2 border">{order.subId}</td>
                    <td className="p-2 border">{order.customerId.customerId}</td>
                    <td className="p-2 border">{order.customer}</td>
                    <td className="p-2 border">{order.bookingDate}</td>
                    <td className="p-2 border">{order.deliveryDate}</td>
                    <td className="p-2 border flex space-x-2 justify-center">
                      <button onClick={() => handleEditOrder(order)}>
                        <FaEdit className="text-blue-500" />
                      </button>
                      <button onClick={() => handleDeleteOrder(order._id)}>
                        <FaTrash className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                  {order.subOrders && order.subOrders.length > 0 && order.subOrders.map((subOrder) => (
                    <tr key={subOrder._id} className="border-b bg-gray-100">
                      <td className="p-2 border pl-8">↳ {subOrder.subId}</td>
                      <td className="p-2 border">{order.customerId.customerId}</td>
                      <td className="p-2 border">{order.customer}</td>
                      <td className="p-2 border">{subOrder.bookingDate}</td>
                      <td className="p-2 border">{subOrder.deliveryDate}</td>
                      <td className="p-2 border flex space-x-2 justify-center">
                        <button onClick={() => handleEditOrder(subOrder)}>
                          <FaEdit className="text-blue-500" />
                        </button>
                        <button onClick={() => handleDeleteOrder(subOrder._id)}>
                          <FaTrash className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;