import User from '../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      customerId,
      bookingNo,
      subId,
      type,
      measurements,
      selectedImages,
      details,
      collar,
      patti,
      cuff,
      pocket,
      shalwar,
      silai,
      button,
      cutter,
      karigarId,
      isSubOrder,
      parentOrderId,
      pdfData,
    } = req.body;

    console.log("Received order data:", { measurements, customerId, bookingNo, subId, type, pdfData: pdfData ? "PDF included" : "No PDF" });

    // Validate required fields
    const missingFields = [];
    if (!customerId) missingFields.push('customerId');
    if (!bookingNo) missingFields.push('bookingNo');
    if (!subId) missingFields.push('subId');
    if (!type) missingFields.push('type');
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate customer exists
    const customer = user.customers.id(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate subId uniqueness
    const existingOrder = user.orders.find((order) => order.subId === subId) ||
                         user.orders.some((order) => order.subOrders.find((subOrder) => subOrder.subId === subId));
    if (existingOrder) {
      return res.status(400).json({ message: `Order with subId ${subId} already exists` });
    }

    // Validate karigar if provided
    let karigar = null;
    if (karigarId) {
      karigar = user.karigars.id(karigarId);
      if (!karigar) {
        return res.status(404).json({ message: 'Karigar not found' });
      }
    }

    const newOrder = {
      customerId,
      bookingNo,
      subId,
      type,
      measurements: measurements || {},
      selectedImages: selectedImages || [],
      details: { ...details, status: details?.status || 'Pending' },
      collar: collar || {},
      patti: patti || {},
      cuff: cuff || {},
      pocket: pocket || {},
      shalwar: shalwar || {},
      silai: silai || {},
      button: button || {},
      cutter: cutter || {},
      karigarId: karigarId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isSubOrder: isSubOrder || false,
      parentOrderId: parentOrderId || null,
      pdfData: pdfData || "",
    };

    let addedOrder;
    if (isSubOrder && parentOrderId) {
      const parentOrder = user.orders.id(parentOrderId);
      if (!parentOrder) {
        return res.status(404).json({ message: `Parent order with ID ${parentOrderId} not found` });
      }
      parentOrder.subOrders.push(newOrder);
      user.markModified('orders');
      await user.save();
      addedOrder = parentOrder.subOrders[parentOrder.subOrders.length - 1];
    } else {
      user.orders.push(newOrder);
      await user.save();
      addedOrder = user.orders[user.orders.length - 1];
    }

    // Update karigar's assignedOrders if provided
    if (karigar) {
      karigar.assignedOrders = karigar.assignedOrders || [];
      karigar.assignedOrders.push(addedOrder._id);
      user.markModified('karigars');
      await user.save();
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        ...addedOrder.toObject(),
        customerId: {
          _id: customer._id,
          customerId: customer.customerId,
          name: customer.name,
          phone: customer.phone,
          cnic: customer.cnic,
          bookNo: customer.bookNo,
        },
        karigar: karigar
          ? {
              _id: karigar._id,
              name: karigar.name,
              karigarId: karigar.karigarId,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error in createOrder:', {
      message: error.message,
      stack: error.stack,
      userId,
      body: JSON.stringify(req.body, null, 2),
    });
    res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ordersWithDetails = user.orders.map((order) => {
      const customer = user.customers.find((cust) => cust._id.equals(order.customerId));
      const karigar = order.karigarId ? user.karigars.find((kar) => kar._id.equals(order.karigarId)) : null;

      return {
        _id: order._id,
        subId: order.subId,
        bookingNo: order.bookingNo,
        type: order.type,
        isSubOrder: order.isSubOrder || false,
        parentOrderId: order.parentOrderId || null,
        pdfData: order.pdfData || "",
        subOrders: order.subOrders.map((subOrder) => ({
          _id: subOrder._id,
          subId: subOrder.subId,
          bookingNo: subOrder.bookingNo,
          type: subOrder.type,
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
          karigar: subOrder.karigarId
            ? {
                _id: karigar?._id || subOrder.karigarId,
                name: karigar?.name || '',
                karigarId: karigar?.karigarId || '',
              }
            : null,
          createdAt: subOrder.createdAt,
          updatedAt: subOrder.updatedAt,
          pdfData: subOrder.pdfData || "",
        })),
        customerId: {
          _id: customer?._id,
          customerId: customer?.customerId || 'N/A',
          name: customer?.name || 'Unknown',
          phone: customer?.phone || '',
          cnic: customer?.cnic || '',
          bookNo: customer?.bookNo || '',
        },
        measurements: order.measurements || {},
        selectedImages: order.selectedImages || [],
        details: {
          status: order.details?.status || 'Pending',
          bookingDate: order.details?.bookingDate || '',
          deliveryDate: order.details?.deliveryDate || '',
          total: order.details?.total || '',
          advanced: order.details?.advanced || '',
          remaining: order.details?.remaining || '',
          discount: order.details?.discount || '',
          quantity: order.details?.quantity || '',
          address: order.details?.address || '',
          ...order.details,
        },
        collar: {
          selectedMeasurement: order.collar?.selectedMeasurement || '',
          collarPosition: order.collar?.collarPosition || '',
          cuffImages: order.cuff?.cuffImages || [],
          ...order.collar,
        },
        patti: {
          design: order.patti?.design || '',
          length: order.patti?.length || '',
          width: order.patti?.width || '',
          buttons: order.patti?.buttons || '',
          selectedImage: order.patti?.selectedImage || '',
          ...order.patti,
        },
        cuff: {
          lengthValue: order.cuff?.lengthValue || '',
          selectedDropdownCuff: order.cuff?.selectedDropdownCuff || '',
          styleSelections: order.cuff?.styleSelections || [],
          selectedGroupTwo: order.cuff?.selectedGroupTwo || '',
          cuffImages: order.cuff?.cuffImages || [],
          ...order.cuff,
        },
        pocket: {
          noOfPockets: order.pocket?.noOfPockets || '',
          pocketSize: order.pocket?.pocketSize || '',
          kandeSeJaib: order.pocket?.kandeSeJaib || '',
          selectedButton: order.pocket?.selectedButton || '',
          styleSelections: order.pocket?.styleSelections || [],
          pocketImages: order.pocket?.pocketImages || [],
          ...order.pocket,
        },
        shalwar: {
          panchaChorai: order.shalwar?.panchaChorai || '',
          selectedImage: order.shalwar?.selectedImage || '',
          styleSelections: order.shalwar?.styleSelections || [],
          measurement: order.shalwar?.measurement || '',
          ...order.shalwar,
        },
        silai: {
          selectedButton: order.silai?.selectedButton || '',
          ...order.silai,
        },
        button: {
          selectedButton: order.button?.selectedButton || '',
          ...order.button,
        },
        cutter: {
          selectedButtons: order.cutter?.selectedButtons || [],
          ...order.cutter,
        },
        karigar: karigar
          ? {
              _id: karigar._id,
              name: karigar.name,
              karigarId: karigar.karigarId,
            }
          : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    const sortedOrders = ordersWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(sortedOrders);
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;
    const {
      customerId,
      bookingNo,
      subId,
      type,
      measurements,
      selectedImages,
      details,
      collar,
      patti,
      cuff,
      pocket,
      shalwar,
      silai,
      button,
      cutter,
      karigarId,
      isSubOrder,
      parentOrderId,
      pdfData,
    } = req.body;

    console.log("Updating order data:", {
      orderId,
      measurements,
      customerId,
      bookingNo,
      subId,
      type,
      pdfData: pdfData ? "PDF included" : "No PDF",
    });

    // Validate required fields
    const missingFields = [];
    if (!customerId) missingFields.push('customerId');
    if (!bookingNo) missingFields.push('bookingNo');
    if (!subId) missingFields.push('subId');
    if (!type) missingFields.push('type');
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let order;
    let parentOrder;

    // Check if updating a sub-order
    if (isSubOrder && parentOrderId) {
      parentOrder = user.orders.id(parentOrderId);
      if (!parentOrder) {
        return res.status(404).json({ message: 'Parent order not found' });
      }
      order = parentOrder.subOrders.id(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Sub-order not found' });
      }
    } else {
      order = user.orders.id(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    const customer = user.customers.id(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate subId uniqueness (excluding current order)
    const existingOrder = user.orders.find((o) => o.subId === subId && !o._id.equals(orderId)) ||
                         user.orders.some((o) => o.subOrders.find((so) => so.subId === subId && !so._id.equals(orderId)));
    if (existingOrder) {
      return res.status(400).json({ message: `Order with subId ${subId} already exists` });
    }

    // Update karigar's assigned orders
    if (order.karigarId && (!karigarId || karigarId !== order.karigarId.toString())) {
      const oldKarigar = user.karigars.id(order.karigarId);
      if (oldKarigar) {
        oldKarigar.assignedOrders = (oldKarigar.assignedOrders || []).filter((id) => !id.equals(orderId));
        user.markModified('karigars');
      }
    }

    if (karigarId) {
      const karigar = user.karigars.id(karigarId);
      if (!karigar) {
        return res.status(404).json({ message: 'Karigar not found' });
      }
      karigar.assignedOrders = karigar.assignedOrders || [];
      if (!karigar.assignedOrders.some((id) => id.equals(orderId))) {
        karigar.assignedOrders.push(orderId);
        user.markModified('karigars');
      }
    }

    // Update order fields
    order.customerId = customerId;
    order.bookingNo = bookingNo;
    order.subId = subId;
    order.type = type;
    order.measurements = measurements || order.measurements || {};
    order.selectedImages = selectedImages || order.selectedImages || [];
    order.details = { ...details, status: details?.status || order.details?.status || 'Pending' };
    order.collar = collar || order.collar || {};
    order.patti = patti || order.patti || {};
    order.cuff = cuff || order.cuff || {};
    order.pocket = pocket || order.pocket || {};
    order.shalwar = shalwar || order.shalwar || {};
    order.silai = silai || order.silai || {};
    order.button = button || order.button || {};
    order.cutter = cutter || order.cutter || {};
    order.karigarId = karigarId || null;
    order.isSubOrder = isSubOrder || false;
    order.parentOrderId = parentOrderId || null;
    order.updatedAt = new Date();
    order.pdfData = pdfData || order.pdfData || "";

    await user.save();
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error in updateOrder:', {
      message: error.message,
      stack: error.stack,
      orderId: req.params.id,
      userId: req.user._id,
      body: JSON.stringify(req.body, null, 2),
    });
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate subId detected' });
    }
    res.status(500).json({ message: 'Server error updating order', error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let order;
    let parentOrder;

    // Check if the order is a sub-order
    for (const ord of user.orders) {
      const subOrder = ord.subOrders.id(orderId);
      if (subOrder) {
        parentOrder = ord;
        order = subOrder;
        break;
      }
    }

    if (!order) {
      order = user.orders.id(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    // Remove order from karigar's assigned orders if exists
    if (order.karigarId) {
      const karigar = user.karigars.id(order.karigarId);
      if (karigar) {
        karigar.assignedOrders = (karigar.assignedOrders || []).filter((id) => !id.equals(orderId));
        user.markModified('karigars');
      }
    }

    // Remove the order
    if (parentOrder) {
      parentOrder.subOrders = parentOrder.subOrders.filter((o) => !o._id.equals(orderId));
      user.markModified('orders');
    } else {
      user.orders = user.orders.filter((o) => !o._id.equals(orderId));
    }

    await user.save();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({ message: 'Server error deleting order', error: error.message });
  }
};

export const searchOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { customerName } = req.query;

    if (!customerName) {
      return res.status(400).json({ message: 'Customer name query parameter is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ordersWithDetails = user.orders
      .filter((order) => {
        const customer = user.customers.find((cust) => cust._id.equals(order.customerId));
        return customer?.name.toLowerCase().startsWith(customerName.toLowerCase());
      })
      .map((order) => {
        const customer = user.customers.find((cust) => cust._id.equals(order.customerId));
        const karigar = order.karigarId ? user.karigars.find((kar) => kar._id.equals(order.karigarId)) : null;

        return {
          _id: order._id,
          subId: order.subId,
          bookingNo: order.bookingNo,
          type: order.type,
          isSubOrder: order.isSubOrder || false,
          parentOrderId: order.parentOrderId || null,
          pdfData: order.pdfData || "",
          subOrders: order.subOrders.map((subOrder) => ({
            _id: subOrder._id,
            subId: subOrder.subId,
            bookingNo: subOrder.bookingNo,
            type: subOrder.type,
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
            karigar: subOrder.karigarId
              ? {
                  _id: karigar?._id || subOrder.karigarId,
                  name: karigar?.name || '',
                  karigarId: karigar?.karigarId || '',
                }
              : null,
            createdAt: subOrder.createdAt,
            updatedAt: subOrder.updatedAt,
            pdfData: subOrder.pdfData || "",
          })),
          customerId: {
            _id: customer?._id,
            customerId: customer?.customerId || 'N/A',
            name: customer?.name || 'Unknown',
            phone: customer?.phone || '',
            cnic: customer?.cnic || '',
            bookNo: customer?.bookNo || '',
          },
          measurements: order.measurements || {},
          selectedImages: order.selectedImages || [],
          details: {
            status: order.details?.status || 'Pending',
            bookingDate: order.details?.bookingDate || '',
            deliveryDate: order.details?.deliveryDate || '',
            total: order.details?.total || '',
            advanced: order.details?.advanced || '',
            remaining: order.details?.remaining || '',
            discount: order.details?.discount || '',
            quantity: order.details?.quantity || '',
            address: order.details?.address || '',
            ...order.details,
          },
          collar: {
            selectedMeasurement: order.collar?.selectedMeasurement || '',
            collarPosition: order.collar?.collarPosition || '',
            ...order.collar,
          },
          patti: {
            design: order.patti?.design || '',
            length: order.patti?.length || '',
            width: order.patti?.width || '',
            buttons: order.patti?.buttons || '',
            selectedImage: order.patti?.selectedImage || '',
            ...order.patti,
          },
          cuff: {
            lengthValue: order.cuff?.lengthValue || '',
            selectedDropdownCuff: order.cuff?.selectedDropdownCuff || '',
            styleSelections: order.cuff?.styleSelections || [],
            selectedGroupTwo: order.cuff?.selectedGroupTwo || '',
            cuffImages: order.cuff?.cuffImages || [],
            ...order.cuff,
          },
          pocket: {
            noOfPockets: order.pocket?.noOfPockets || '',
            pocketSize: order.pocket?.pocketSize || '',
            kandeSeJaib: order.pocket?.kandeSeJaib || '',
            selectedButton: order.pocket?.selectedButton || '',
            styleSelections: order.pocket?.styleSelections || [],
            pocketImages: order.pocket?.pocketImages || [],
            ...order.pocket,
          },
          shalwar: {
            panchaChorai: order.shalwar?.panchaChorai || '',
            selectedImage: order.shalwar?.selectedImage || '',
            styleSelections: order.shalwar?.styleSelections || [],
            measurement: order.shalwar?.measurement || '',
            ...order.shalwar,
          },
          silai: {
            selectedButton: order.silai?.selectedButton || '',
            ...order.silai,
          },
          button: {
            selectedButton: order.button?.selectedButton || '',
            ...order.button,
          },
          cutter: {
            selectedButtons: order.cutter?.selectedButtons || [],
            ...order.cutter,
          },
          karigar: karigar
            ? {
                _id: karigar._id,
                name: karigar.name,
                karigarId: karigar.karigarId,
              }
            : null,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });

    const sortedOrders = ordersWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(sortedOrders);
  } catch (error) {
    console.error('Error in searchOrders:', error);
    res.status(500).json({ message: 'Server error searching orders', error: error.message });
  }
};

export const getSubOrders = async (req, res) => {
  try {
    const { customerId, variety } = req.query;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!customerId) {
      return res.status(400).json({ message: 'customerId query parameter is required' });
    }

    const subOrders = [];
    user.orders.forEach((order) => {
      const matchesCustomer = order.customerId.equals(customerId);
      const matchesVariety = variety ? order.type === variety : true;
      if (matchesCustomer && matchesVariety) {
        subOrders.push({
          _id: order._id,
          subId: order.subId,
          bookingNo: order.bookingNo,
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
          karigarId: order.karigarId || null,
          createdAt: order.createdAt,
          isSubOrder: order.isSubOrder || false,
          parentOrderId: order.parentOrderId || null,
          pdfData: order.pdfData || "",
        });
      }
      if (order.subOrders && order.subOrders.length > 0) {
        order.subOrders.forEach((subOrder) => {
          if (variety ? subOrder.type === variety : true) {
            subOrders.push({
              _id: subOrder._id,
              subId: subOrder.subId,
              bookingNo: subOrder.bookingNo,
              type: subOrder.type,
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
              karigarId: subOrder.karigarId || null,
              createdAt: subOrder.createdAt,
              isSubOrder: true,
              parentOrderId: order._id,
              pdfData: subOrder.pdfData || "",
            });
          }
        });
      }
    });

    res.status(200).json(subOrders);
  } catch (error) {
    console.error('Error in getSubOrders:', error);
    res.status(500).json({ message: 'Server error fetching sub-orders', error: error.message });
  }
};