import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Search from "../components/Search";
import Layout from "../components/Layout";
import CustomerDetails from "../components/CustomerDetails";
import VarietySelector from "./VarietySelector";
import SubCategorySelector from "./subcategoryselector/SubCategorySelector";
import MeasurementForm from "../components/MeasurementForm";
import Details from "../components/Details";
import { CustomerDetails1, Measurements, SelectedImages, Details1 } from "../components/pdf/newpdf";
import html2pdf from "html2pdf.js";

function OrderForm({
  formState: initialFormState = {},
  setFormState: setParentFormState,
  customers,
  setCustomers,
  onSaveOrder,
  onCreateOrder,
  onAddCustomer,
  isEditing: propIsEditing,
  orderId: propOrderId,
  searchCustomers: propSearchCustomers,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const { order: editOrder, isEditing: stateIsEditing, orderId: stateOrderId } = location.state || {};
  const isEditing = propIsEditing || stateIsEditing || false;
  const orderId = propOrderId || stateOrderId;

  const searchCustomers = async (query) => {
    if (!query.trim()) return [];
    try {
      console.log(`Fetching customers from /api/customers/search?query=${query}`);
      const response = await fetch(`/api/customers/search?query=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API response:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error in searchCustomers:", error);
      throw error;
    }
  };

  const effectiveSearchCustomers = propSearchCustomers || searchCustomers;

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

  const initialState = editOrder || initialFormState || {};
  const [formState, setLocalFormState] = useState({
    customerDetails: initialState.customerDetails || {},
    bookingNo: initialState.bookingNo || `B-${Date.now().toString().slice(-5)}`,
    type: initialState.type || "Pant",
    subId: initialState.subId || "",
    measurement: initialState.measurements || initialState.measurement || {},
    selectedImages: initialState.selectedImages || [],
    measurementHistory: initialState.measurementHistory || {},
    details: initialState.details || {},
    collar: initialState.collar || {},
    patti: initialState.patti || {},
    cuff: initialState.cuff || initialState.کف || {},
    pocket: {
      noOfPockets: initialState.pocket?.noOfPockets || "",
      pocketSize: initialState.pocket?.pocketSize || "",
      kandeSeJaib: initialState.pocket?.kandeSeJaib || "",
      selectedButton: initialState.pocket?.selectedButton || "",
      styleSelections: initialState.pocket?.styleSelections || [],
      pocketImages: initialState.pocket?.pocketImages || [],
    },
    shalwar: initialState.shalwar || initialState.شلوار || {},
    silai: initialState.silai || {},
    button: initialState.button || {},
    cutter: initialState.cutter || initialState.کٹر || { selectedButtons: [] },
    karigar: initialState.karigar || null,
    isSubOrder: initialState.isSubOrder || false,
    parentOrderId: initialState.parentOrderId || null,
    pdfData: initialState.pdfData || "",
  });

  const [selectedVariety, setSelectedVariety] = useState(initialState.type || "Pant");
  const [selectedVarietyHeading, setSelectedVarietyHeading] = useState(`Enter ${initialState.type || "Pant"} Measurements`);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialState.collar ? "کالر" : "کالر");
  const [editCustomer, setEditCustomer] = useState(null);
  const [details, setDetails] = useState(initialState.details || {});
  const [currentSubId, setCurrentSubId] = useState(initialState.subId || "");
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const [subOrders, setSubOrders] = useState({
    Pant: [],
    Pantcoat: [],
    Waistcoat: [],
    Coat: [],
    Shalwaarkameez: [],
    Shirt: [],
  });

  const measurementFormRef = useRef(null);
  const printRef = useRef(null);

  useEffect(() => {
    if (editOrder) {
      const normalizedType = normalizeVariety(editOrder.type || "Pant");
      const pattiData = editOrder.patti || {};
      const pattiInitialState = {
        design: pattiData.design || "",
        length: pattiData.length || "",
        width: pattiData.width || "",
        buttons: pattiData.buttons || "",
        selectedImage: pattiData.selectedImage || ""
      };

      setLocalFormState({
        customerDetails: editOrder.customerDetails || {},
        bookingNo: editOrder.bookingNo || `B-${Date.now().toString().slice(-5)}`,
        type: normalizedType,
        subId: editOrder.subId || "",
        measurement: editOrder.measurements || editOrder.measurement || {},
        selectedImages: [
          ...(editOrder.selectedImages || []),
          ...(editOrder.pocket?.pocketImages || []).map((img) => ({
            imgSrc: img.imgSrc,
            buttonName: img.buttonName || "جیب",
            pocketSize: img.pocketSize || editOrder.pocket?.pocketSize || "",
            kandeSeJaib: img.kandeSeJaib || editOrder.pocket?.kandeSeJaib || "",
            noOfPockets: img.noOfPockets || editOrder.pocket?.noOfPockets || "",
          })),
        ],
        measurementHistory: editOrder.measurementHistory || {},
        details: editOrder.details || {},
        collar: editOrder.collar || {},
        patti: pattiInitialState,
        cuff: editOrder.cuff || {},
        pocket: {
          noOfPockets: editOrder.pocket?.noOfPockets || "",
          pocketSize: editOrder.pocket?.pocketSize || "",
          kandeSeJaib: editOrder.pocket?.kandeSeJaib || "",
          selectedButton: editOrder.pocket?.selectedButton || "",
          styleSelections: editOrder.pocket?.styleSelections || [],
          pocketImages: editOrder.pocket?.pocketImages || [],
        },
        shalwar: editOrder.shalwar || {},
        silai: editOrder.silai || {},
        button: editOrder.button || {},
        cutter: editOrder.cutter || { selectedButtons: [] },
        karigar: editOrder.karigar || null,
        isSubOrder: editOrder.isSubOrder || false,
        parentOrderId: editOrder.parentOrderId || null,
        pdfData: editOrder.pdfData || "",
      });
      setSelectedVariety(normalizedType);
      setSelectedVarietyHeading(`Enter ${normalizedType} Measurements`);
      setCurrentSubId(editOrder.subId || "");
      setDetails(editOrder.details || {});
      setSelectedSubCategory(editOrder.collar ? "کالر" : "کالر");
      setSelectedSubOrder(editOrder.isSubOrder ? editOrder : null);
    }
  }, [editOrder]);

  useEffect(() => {
    if (initialFormState && !editOrder) {
      const normalizedType = normalizeVariety(initialFormState.type || "Pant");
      setLocalFormState({
        customerDetails: initialFormState.customerDetails || {},
        bookingNo: initialFormState.bookingNo || `B-${Date.now().toString().slice(-5)}`,
        type: normalizedType,
        subId: initialFormState.subId || "",
        measurement: initialFormState.measurement || {},
        selectedImages: initialFormState.selectedImages || [],
        measurementHistory: initialFormState.measurementHistory || {},
        details: initialFormState.details || {},
        collar: initialFormState.collar || {},
        patti: initialFormState.patti || {},
        cuff: initialFormState.cuff || {},
        pocket: {
          noOfPockets: initialFormState.pocket?.noOfPockets || "",
          pocketSize: initialFormState.pocket?.pocketSize || "",
          kandeSeJaib: initialFormState.pocket?.kandeSeJaib || "",
          selectedButton: initialFormState.pocket?.selectedButton || "",
          styleSelections: initialFormState.pocket?.styleSelections || [],
          pocketImages: initialFormState.pocket?.pocketImages || [],
        },
        shalwar: initialFormState.shalwar || {},
        silai: initialFormState.silai || {},
        button: initialFormState.button || {},
        cutter: initialFormState.cutter || { selectedButtons: [] },
        karigar: initialFormState.karigar || null,
        isSubOrder: false,
        parentOrderId: null,
        pdfData: initialFormState.pdfData || "",
      });
      setSelectedVariety(normalizedType);
      setSelectedVarietyHeading(`Enter ${normalizedType} Measurements`);
      setCurrentSubId(initialFormState.subId || "");
      setDetails(initialFormState.details || {});
    }
  }, [initialFormState, editOrder]);

  useEffect(() => {
    if (formState.customerDetails?._id && !isEditing) {
      const updateSubId = async () => {
        const subId = await generateSubId("Pant", formState.customerDetails.name);
        setLocalFormState((prev) => ({
          ...prev,
          type: "Pant",
          subId,
          measurement: {},
          selectedImages: [],
          details: {},
          collar: {},
          patti: {},
          cuff: {},
          pocket: {
            noOfPockets: "",
            pocketSize: "",
            kandeSeJaib: "",
            selectedButton: "",
            styleSelections: [],
            pocketImages: [],
          },
          shalwar: {},
          silai: {},
          button: {},
          cutter: {},
          isSubOrder: false,
          parentOrderId: null,
        }));
        setSelectedVariety("Pant");
        setSelectedVarietyHeading("Enter Pant Measurements");
        setCurrentSubId(subId);
        setSelectedSubOrder(null);
      };
      updateSubId();
    }
  }, [formState.customerDetails?._id, isEditing]);

  const updateViewOrder = useCallback((data) => {
    setLocalFormState((prev) => {
      const newCollar = { ...prev.collar, ...data };
      if (JSON.stringify(newCollar) === JSON.stringify(prev.collar)) {
        return prev;
      }
      return { ...prev, collar: newCollar };
    });
  }, []);

  const updateViewOrderPatti = useCallback((data) => {
    setLocalFormState((prev) => {
      const newPatti = { ...prev.patti, ...data };
      if (JSON.stringify(newPatti) === JSON.stringify(prev.patti)) {
        return prev;
      }
      return { ...prev, patti: newPatti };
    });
  }, []);

  const scrollToForm = () => measurementFormRef.current?.scrollIntoView({ behavior: "smooth" });

  const normalizeVariety = (variety) => {
    return variety === "Shalwaar_Kameez" ? "Shalwaarkameez" : variety;
  };

 // OrderForm.jsx - Update the handleSubOrderSelect function
const handleSubOrderSelect = async (subOrder) => {
  if (!subOrder) {
      // Handle new sub-order creation
    const subId = await generateSubId(selectedVariety, formState.customerDetails?.name);
    setLocalFormState((prev) => ({
      ...prev,
      subId,
      measurement: {},
      selectedImages: [],
      details: {},
      collar: {},
      patti: {},
      cuff: {},
      pocket: {
        noOfPockets: "",
        pocketSize: "",
        kandeSeJaib: "",
        selectedButton: "",
        styleSelections: [],
        pocketImages: [],
      },
      shalwar: {},
      silai: {},
      button: {},
      cutter: { selectedButtons: [] },
      isSubOrder: false,
      parentOrderId: null,
    }));
    setSelectedSubOrder(null);
    setCurrentSubId(subId);
    setDetails({});
    return;
  }

    // Handle existing sub-order selection
  setSelectedSubOrder(subOrder);
  setLocalFormState({
    customerDetails: formState.customerDetails,
    bookingNo: subOrder.bookingNo,
    type: subOrder.type,
    subId: subOrder.subId,
    measurement: subOrder.measurements || {},
    selectedImages: [
      ...(subOrder.selectedImages || []),
      ...(subOrder.pocket?.pocketImages || []).map((img) => ({
        imgSrc: img.imgSrc,
        buttonName: img.buttonName || "جیب",
        pocketSize: img.pocketSize || subOrder.pocket?.pocketSize || "",
        kandeSeJaib: img.kandeSeJaib || subOrder.pocket?.kandeSeJaib || "",
        noOfPockets: img.noOfPockets || subOrder.pocket?.noOfPockets || "",
      })),
    ],
    details: subOrder.details || {},
    measurementHistory: subOrder.measurementHistory || {},
    collar: subOrder.collar || {},
    patti: subOrder.patti || {},
    cuff: subOrder.cuff || {},
    pocket: {
      noOfPockets: subOrder.pocket?.noOfPockets || "",
      pocketSize: subOrder.pocket?.pocketSize || "",
      kandeSeJaib: subOrder.pocket?.kandeSeJaib || "",
      selectedButton: subOrder.pocket?.selectedButton || "",
      styleSelections: subOrder.pocket?.styleSelections || [],
      pocketImages: subOrder.pocket?.pocketImages || [],
    },
    shalwar: subOrder.shalwar || {},
    silai: subOrder.silai || {},
    button: subOrder.button || {},
    cutter: subOrder.cutter || { selectedButtons: [] },
    karigar: subOrder.karigar || null,
    isSubOrder: subOrder.isSubOrder || false,
    parentOrderId: subOrder.parentOrderId || null,
    pdfData: subOrder.pdfData || "",
  });
  setDetails(subOrder.details || {});
  setCurrentSubId(subOrder.subId);
  setSelectedVariety(subOrder.type);
  setSelectedVarietyHeading(`Enter ${subOrder.type} Measurements`);
};

  const handleVarietyClick = async (variety) => {
    const normalizedVariety = normalizeVariety(variety);
    console.log(`Switching to variety: ${normalizedVariety}`);
    const subId = await generateSubId(normalizedVariety, formState.customerDetails?.name);
    
    setLocalFormState((prev) => ({
      ...prev,
      type: normalizedVariety,
      subId,
      measurement: {},
      selectedImages: [],
      details: {},
      collar: {},
      patti: {},
      cuff: {},
      pocket: {
        noOfPockets: "",
        pocketSize: "",
        kandeSeJaib: "",
        selectedButton: "",
        styleSelections: [],
        pocketImages: [],
      },
      shalwar: {},
      silai: {},
      button: {},
      cutter: { selectedButtons: [] },
      isSubOrder: false,
      parentOrderId: null,
    }));
    
    setSelectedVariety(normalizedVariety);
    setSelectedVarietyHeading(`Enter ${normalizedVariety} Measurements`);
    setCurrentSubId(subId);
    setDetails({});
    setSelectedSubOrder(null);
    scrollToForm();
  };

  const handleImageClick = useCallback((selection, buttonName) => {
    setLocalFormState((prev) => {
      const filteredImages = prev.selectedImages.filter((i) => i.buttonName !== buttonName);
      const entry = { imgSrc: selection, buttonName };
      if (buttonName === "جیب" || buttonName === "ہوم سائیڈ جیب") {
        entry.pocketSize = prev.pocket.pocketSize || "";
        entry.kandeSeJaib = prev.pocket.kandeSeJaib || "";
        entry.noOfPockets = prev.pocket.noOfPockets || "";
      }
      const duplicateExists = filteredImages.some(
        (img) => img.imgSrc === selection && img.buttonName === buttonName
      );
      if (duplicateExists) {
        console.log(`Image for ${buttonName} already selected, skipping update`);
        return prev;
      }
      return {
        ...prev,
        selectedImages: [...filteredImages, entry],
      };
    });
  }, []);

  const handleSaveOrder = async () => {
    const orderData = {
      ...formState,
      subId: currentSubId,
      details,
      _id: orderId,
      isSubOrder: !!selectedSubOrder || false,
      parentOrderId: selectedSubOrder?.parentOrderId || null,
      karigar: formState.karigar
        ? {
            _id: formState.karigar._id,
            name: formState.karigar.name,
            karigarId: formState.karigar.karigarId,
          }
        : null,
      pocket: {
        noOfPockets: formState.pocket.noOfPockets || "",
        pocketSize: formState.pocket.pocketSize || "",
        kandeSeJaib: formState.pocket.kandeSeJaib || "",
        selectedButton: formState.pocket.selectedButton || "",
        styleSelections: formState.pocket.styleSelections || [],
        pocketImages: formState.pocket.pocketImages || [],
      },
    };
    console.log("orderData before saving:", JSON.stringify(orderData, null, 2));
    try {
      await onSaveOrder(orderData);
      alert(isEditing ? "Order updated successfully" : "Order saved successfully");
      if (!isEditing) {
        setLocalFormState((prev) => ({
          ...prev,
          subId: generateSubId(prev.type, prev.customerDetails?.name),
          measurement: {},
          selectedImages: [],
          details: {},
          collar: {},
          patti: {},
          cuff: {},
          pocket: {
            noOfPockets: "",
            pocketSize: "",
            kandeSeJaib: "",
            selectedButton: "",
            styleSelections: [],
            pocketImages: [],
          },
          shalwar: {},
          silai: {},
          button: {},
          cutter: {},
          isSubOrder: false,
          parentOrderId: null,
        }));
        setSelectedSubOrder(null);
        setCurrentSubId(await generateSubId(selectedVariety, formState.customerDetails?.name));
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert(`Failed to save order: ${error.message}`);
    }
  };

  const handlePrintOrder = () => {
    const element = printRef.current;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `order-${formState.bookingNo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .outputPdf("bloburl")
      .then((url) => window.open(url));
  };

  const handleEditCustomer = async (updatedCustomer) => {
    try {
      const response = await fetch(`http://localhost:8000/api/customers/${updatedCustomer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update customer");
      }
      setLocalFormState((prev) => ({
        ...prev,
        customerDetails: data.customer,
      }));
      setEditCustomer(null);
      setCustomers((prev) => prev.map((c) => (c._id === data.customer._id ? data.customer : c)));
    } catch (error) {
      console.error("Error updating customer:", error);
      alert(`Failed to update customer: ${error.message}`);
    }
  };

  const handleEditClick = (customer) => {
    setEditCustomer({ ...customer });
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/customers/${customerId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete customer");
      }
      setLocalFormState((prev) => ({
        ...prev,
        customerDetails: prev.customerDetails._id === customerId ? {} : prev.customerDetails,
      }));
      setCustomers((prev) => prev.filter((c) => c._id !== customerId));
      setEditCustomer(null);
      alert("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(`Failed to delete customer: ${error.message}`);
    }
  };

  const handleKarigarSelect = (karigar) => {
    setLocalFormState((prev) => ({
      ...prev,
      karigar: karigar
        ? { _id: karigar._id, name: karigar.name, karigarId: karigar.karigarId }
        : null,
    }));
  };

  const handleCreateOrder = async (customer) => {
    console.log("Creating order for customer:", customer);
    const subId = await generateSubId("Pant", customer.name);
    setLocalFormState((prev) => ({
      ...prev,
      customerDetails: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        cnic: customer.cnic,
        bookNo: customer.bookNo,
        customerId: customer.customerId,
      },
      subId,
    }));
    onCreateOrder(customer);
  };

 // OrderForm.jsx - Update the printOrderData memo
const printOrderData = useMemo(() => {
  return {
    ...formState,
    details,
    subId: currentSubId,
    pocketImages: formState.pocket?.pocketImages || [],
    pocketDropdowns: {
      noOfPockets: formState.pocket?.noOfPockets || "غیز منتخب",
      pocketSize: formState.pocket?.pocketSize || "غیز منتخب",
      kandeSeJaib: formState.pocket?.kandeSeJaib || "غیز منتخب",
      styleSelections: formState.pocket?.styleSelections || [],
      selectedButton: formState.pocket?.selectedButton || "غیز منتخب",
    },
    pattiOptions: {
      design: formState.patti?.design || "",
      length: formState.patti?.length || "",
      width: formState.patti?.width || "",
      buttons: formState.patti?.buttons || "",
    }
  };
}, [formState, details, currentSubId]);

  const groupedMeasurements = useMemo(() => {
    const measurements = Object.entries(printOrderData.measurement || {}).reduce((acc, [k, v]) => {
      if (!v) return acc;
      const [cat, ...rest] = k.split("_");
      const normalizedCat = cat.replace("Shalwaar_Kameez", "Shalwaarkameez");
      acc[normalizedCat] = acc[normalizedCat] || {};
      acc[normalizedCat][rest.join("_")] = v;
      return acc;
    }, {});

    if (printOrderData.shalwar?.measurement) {
      measurements["Shalwaarkameez"] = measurements["Shalwaarkameez"] || {};
      measurements["Shalwaarkameez"]["شلوار_پانچا_چوڑائی"] = printOrderData.shalwar.measurement;
    }
    if (printOrderData.collar?.selectedMeasurement) {
      measurements["Shalwaarkameez"] = measurements["Shalwaarkameez"] || {};
      measurements["Shalwaarkameez"]["کالر_چوڑائی"] = printOrderData.collar.selectedMeasurement;
    }

    console.log("Grouped measurements:", measurements);
    return measurements;
  }, [printOrderData.measurement, printOrderData.shalwar, printOrderData.collar]);

  const selectedDropdown = printOrderData.collar?.selectedMeasurement || "";
  const buttonSelection = useMemo(() => {
    const collarPosition = printOrderData.collar?.collarPosition;
    if (!collarPosition) return "";
    switch (collarPosition) {
      case "above":
        return "کالر پر بٹن";
      case "center":
        return "کالر پر ڈیزائن";
      case "below":
        return "کالر پر کڑھائی";
      default:
        return "";
    }
  }, [printOrderData.collar?.collarPosition]);

  const pocketButtonSelection = useMemo(() => {
    return (
      printOrderData.pocket?.selectedButton ||
      (printOrderData.pocket?.styleSelections?.[0] &&
      !printOrderData.pocket.styleSelections[0].toLowerCase().includes("لنبائی") &&
      !printOrderData.pocket.styleSelections[0].toLowerCase().includes("چوڑائی")
        ? printOrderData.pocket.styleSelections[0]
        : "غیز منتخب")
    );
  }, [printOrderData.pocket]);

  const pattiOptions = useMemo(
    () => ({
      design: printOrderData.patti?.design || "",
      length: printOrderData.patti?.length || "",
      width: printOrderData.patti?.width || "",
      buttons: printOrderData.patti?.buttons || "",
    }),
    [printOrderData.patti]
  );

  const pattiImages = useMemo(() => {
    const selectedImage = printOrderData.patti?.selectedImage;
    return selectedImage ? [{
      imgSrc: selectedImage,
      buttonName: "پٹی",
      length: printOrderData.patti?.length || "",
      width: printOrderData.patti?.width || "",
      buttons: printOrderData.patti?.buttons || "",
      design: printOrderData.patti?.design || ""
    }] : [];
  }, [printOrderData.patti]);

  const cuffImages = useMemo(() => {
    const images =
      printOrderData.cuff?.cuffImages?.slice(0, 1).map((img) => ({
        imgSrc: img.imgSrc || "/fallback-cuff.jpg",
        buttonName: img.buttonName || "کف",
        length: printOrderData.cuff?.lengthValue || "",
        width: printOrderData.cuff?.selectedDropdownCuff || "",
      })) || [];
    return images;
  }, [printOrderData.cuff]);

  const selectedDropdownCuff = printOrderData.cuff?.selectedDropdownCuff || "";
  const cuffStyleSelections = useMemo(() => {
    return [
      ...(printOrderData.cuff?.styleSelections || []).filter(
        (style) =>
          !style.toLowerCase().includes("لنبائی") &&
          !style.toLowerCase().includes("چوڑائی") &&
          !style.toLowerCase().includes("length") &&
          !style.toLowerCase().includes("width")
      ),
      ...(printOrderData.cuff?.selectedGroupTwo ? [printOrderData.cuff.selectedGroupTwo] : []),
    ];
  }, [printOrderData.cuff]);

  const pocketImages = useMemo(() => {
    return (formState.pocket?.pocketImages || []).map((img) => ({
      imgSrc: img.imgSrc || "/fallback-pocket.jpg",
      buttonName: img.buttonName || "جیب",
      pocketSize: img.pocketSize || formState.pocket?.pocketSize || "غیز منتخب",
      kandeSeJaib: img.kandeSeJaib || formState.pocket?.kandeSeJaib || "غیز منتخب",
      noOfPockets: img.noOfPockets || formState.pocket?.noOfPockets || "غیز منتخب",
    }));
  }, [formState.pocket]);

  const pocketDropdowns = useMemo(
    () => ({
      noOfPockets: formState.pocket?.noOfPockets || "غیز منتخب",
      pocketSize: formState.pocket?.pocketSize || "غیز منتخب",
      kandeSeJaib: formState.pocket?.kandeSeJaib || "غیز منتخب",
      styleSelections: formState.pocket?.styleSelections || [],
      selectedButton: formState.pocket?.selectedButton || "غیز منتخب",
    }),
    [formState.pocket]
  );

  const shalwaarImage = useMemo(() => {
    const selectedImage = formState.shalwar?.selectedImage;
    return selectedImage ? [{ imgSrc: selectedImage, buttonName: "شلوار" }] : [];
  }, [formState.shalwar]);

  const collarImages = useMemo(() => {
    return formState.selectedImages
      .filter((img) => img.buttonName === "کالر")
      .map((img) => ({
        imgSrc: img.imgSrc || "/fallback-collar.jpg",
        buttonName: "کالر",
      }));
  }, [formState.selectedImages]);

  const shalwaarOptions = useMemo(
    () => ({
      panchaChorai: formState.shalwar?.panchaChorai || "غیز منتخب",
    }),
    [formState.shalwar]
  );

  const collarOptions = useMemo(
    () => ({
      selectedMeasurement: formState.collar?.selectedMeasurement || "",
      collarPosition: formState.collar?.collarPosition || "",
    }),
    [formState.collar]
  );

  const silaiSelection = useMemo(() => printOrderData.silai?.selectedButton || "غیز منتخب", [printOrderData.silai]);
  const buttonSelectionNew = useMemo(() => printOrderData.button?.selectedButton || "غیز منتخب", [printOrderData.button]);
  const cutterSelections = useMemo(() => printOrderData.cutter?.selectedButtons || [], [printOrderData.cutter]);

  const allStyleSelections = useMemo(
    () => [...cuffStyleSelections, ...(formState.pocket?.styleSelections || []), ...(formState.shalwar?.styleSelections || [])],
    [cuffStyleSelections, formState.pocket, formState.shalwar]
  );

  const buttonSelections = useMemo(() => {
    const selections = [];
    if (buttonSelection) selections.push(buttonSelection);
    if (silaiSelection !== "غیز منتخب") selections.push(`سلائی: ${silaiSelection}`);
    if (buttonSelectionNew !== "غیز منتخب") selections.push(`بٹن: ${buttonSelectionNew}`);
    cutterSelections.forEach((selection) => selections.push(`کٹر: ${selection}`));
    formState.shalwar?.styleSelections?.forEach((selection) => selections.push(`شلوار: ${selection}`));
    cuffStyleSelections.forEach((selection) => selections.push(`کف: ${selection}`));
    formState.pocket?.styleSelections?.forEach((selection) => selections.push(`جیب: ${selection}`));
    return selections;
  }, [buttonSelection, silaiSelection, buttonSelectionNew, cutterSelections, formState.shalwar, cuffStyleSelections, formState.pocket]);

  const filteredSelectedImages = useMemo(() => printOrderData.selectedImages, [printOrderData.selectedImages]);

  return (
    <Layout handleVarietyClick={handleVarietyClick} selectedVariety={selectedVariety} hideSidebar>
      <div className="mb-1 sm:mb-2">
        <Search
          customers={customers}
          setCustomers={setCustomers}
          onCreateOrder={handleCreateOrder}
          onAddCustomer={onAddCustomer}
          searchCustomers={effectiveSearchCustomers}
        />
      </div>
      <div className="pl-1 sm:pl-2 md:pl-[69px] space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex flex-col md:flex-row md:pr-6 space-y-4 md:space-y-0 md:space-x-0">
          <CustomerDetails
            formState={formState}
            setFormState={setLocalFormState}
            editCustomer={editCustomer}
            setEditCustomer={setEditCustomer}
            handleEditCustomer={handleEditCustomer}
            handleEditClick={handleEditClick}
            handleDeleteCustomer={handleDeleteCustomer}
          />
          <div className="flex flex-col space-y-4">
            <VarietySelector
              selectedVariety={selectedVariety}
              handleVarietyClick={(variety) => {
                console.log("Variety selected:", variety);
                handleVarietyClick(variety);
              }}
              scrollToForm={scrollToForm}
              customerId={formState.customerDetails?._id}
              subOrders={subOrders}
              setSubOrders={setSubOrders}
            />
            {formState.customerDetails?._id && subOrders[selectedVariety]?.length > 0 && (
              <div className="md:p-[21px] p-[12px] rounded-xl bg-cardBg md:w-[611px] w-[318px] border shadow-xl font-font">
                <h3 className="text-lg font-bold text-left text-heading">Select Sub-Order</h3>
                <select
                  value={selectedSubOrder?._id || ""}
                  onChange={(e) => {
                    const selected = subOrders[selectedVariety]?.find((o) => o._id === e.target.value) || null;
                    console.log("Selected sub-order:", selected);
                    handleSubOrderSelect(selected);
                    scrollToForm();
                  }}
                  className="w-full p-2 mt-2 text-sm bg-white text-black rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">New {selectedVariety} Order</option>
                  {subOrders[selectedVariety]?.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.subId} - {new Date(order.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        {selectedVariety && (
          <div ref={measurementFormRef} className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 sm:space-x-3">
            <SubCategorySelector
              subCategoryImages={{}}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              handleImageClick={handleImageClick}
              selectedImages={formState.selectedImages}
              updateViewOrder={updateViewOrder}
              updateViewOrderPatti={updateViewOrderPatti}
              setFormState={setLocalFormState}
              formState={formState}
            />
            <MeasurementForm
              selectedVarietyHeading={selectedVarietyHeading}
              selectedVariety={selectedVariety}
              formState={formState}
              setFormState={setLocalFormState}
              currentSubId={currentSubId}
              onKarigarSelect={handleKarigarSelect}
            >
              <Details details={details} onDetailsChange={setDetails} />
            </MeasurementForm>
          </div>
        )}
      </div>
  
      <div ref={printRef} className="mx-auto w-full max-w-[90vw] sm:w-[620px] border border-gray-300 rounded-xl shadow-lg bg-gray-50 font-nastaliq">
        <div className="w-full max-w-[90vw] sm:max-w-[620px] mx-auto">
          <CustomerDetails1
            customerDetails={printOrderData.customerDetails}
            details={{
              bookingDate: printOrderData.details?.bookingDate,
              deliveryDate: printOrderData.details?.deliveryDate,
              subId: currentSubId,
            }}
            karigar={printOrderData.karigar?.name || "N/A"}
          />
        </div>
        <div className="w-full max-w-[90vw] sm:max-w-[620px] mx-auto flex flex-col sm:flex-row print:flex-row">
          <div className="w-full sm:w-[310px]">
            <SelectedImages
              selectedImages={filteredSelectedImages}
              selectedDropdown={collarOptions.selectedMeasurement}
              buttonSelections={buttonSelections}
              pattiOptions={pattiOptions}
              selectedDropdownCuff={selectedDropdownCuff}
              cuffImages={cuffImages}
              pocketImages={pocketImages}
              pocketDropdowns={pocketDropdowns}
              pattiImages={pattiImages}
              shalwaarImage={shalwaarImage}
              shalwaarOptions={shalwaarOptions}
              buttonSelectionNew={buttonSelectionNew}
              pattiButtons={pattiOptions.buttons}
              noOfPockets={pocketDropdowns.noOfPockets}
              pattiDesign={pattiOptions.design}
              cutterSelections={cutterSelections}
              silaiSelection={silaiSelection}
              styleSelections={allStyleSelections}
            />
          </div>
          <div className="w-full sm:w-[110px] mt-2 sm:mt-0">
            <Measurements
              groupedMeasurements={groupedMeasurements}
              buttonSelections={buttonSelections}
              selectedVariety={selectedVariety}
            />
          </div>
        </div>
        <div className="w-full max-w-[90vw] sm:max-w-[620px] mx-auto">
          <Details1
            details={{
              customerName: printOrderData.customerDetails?.name,
              customerId: printOrderData.customerDetails?.customerId,
              bookingDate: printOrderData.details?.bookingDate,
              deliveryDate: printOrderData.details?.deliveryDate,
              total: printOrderData.details?.total,
              advanced: printOrderData.details?.advanced,
              remaining: printOrderData.details?.remaining,
              discount: printOrderData.details?.discount,
              quantity: printOrderData.details?.quantity,
              address: printOrderData.details?.address,
              subId: currentSubId,
            }}
          />
        </div>
      </div>
      {selectedVariety && (
        <div className="flex justify-center w-full font-nastaliq mt-4 space-x-2 sm:space-x-4">
          <button
            onClick={handleSaveOrder}
            className="btn bg-btnBg text-white rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          >
            {isEditing ? "Update Order" : "Save Order"}
          </button>
          <button
            onClick={handlePrintOrder}
            className="btn bg-btnBg text-white rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          >
            Print Order
          </button>
        </div>
      )}
    </Layout>
  );
}

export default OrderForm;