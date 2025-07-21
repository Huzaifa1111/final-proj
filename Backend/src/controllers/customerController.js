import User from '../models/User.js';

export const addCustomer = async (req, res) => {
  try {
    const { name, phone, cnic, bookNo } = req.body;
    const userId = req.user._id;

    if (!name || !phone || !cnic) {
      return res.status(400).json({ message: 'Name, phone, and CNIC are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingCustomer = user.customers.find((c) => c.cnic === cnic);
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this CNIC already exists' });
    }

    // Generate customer ID
    const nameInitial = name.charAt(0).toUpperCase();
    const sameInitialCount = user.customers.filter((c) => 
      c.name && c.name.charAt(0).toUpperCase() === nameInitial
    ).length;
    const customerId = `${nameInitial}-${(sameInitialCount + 1).toString().padStart(3, '0')}`;

    const newCustomer = {
      name,
      phone,
      cnic,
      bookNo: bookNo || '',
      customerId,
      selectedImages: [],
    };

    user.customers.push(newCustomer);
    await user.save();

    const addedCustomer = user.customers[user.customers.length - 1];
    res.status(201).json({ message: 'Customer added successfully', customer: addedCustomer });
  } catch (error) {
    console.error('Error in addCustomer:', error);
    res.status(500).json({ message: 'Server error adding customer', error: error.message });
  }
};

export const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const customers = user.customers
      .filter((customer) => 
        customer.name && 
        typeof customer.name === 'string' && 
        customer.name.toLowerCase().startsWith(query.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error in searchCustomers:', error);
    res.status(500).json({ message: 'Server error searching customers', error: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, cnic, bookNo } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const customer = user.customers.id(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if name has changed and update customerId if necessary
    let updatedCustomerId = customer.customerId;
    if (name && name !== customer.name) {
      const newInitial = name.charAt(0).toUpperCase();
      if (newInitial !== customer.customerId.charAt(0)) {
        const sameInitialCount = user.customers.filter((c) => 
          c.name && c.name.charAt(0).toUpperCase() === newInitial && c._id.toString() !== id
        ).length;
        updatedCustomerId = `${newInitial}-${(sameInitialCount + 1).toString().padStart(3, '0')}`;
      }
    }

    customer.name = name || customer.name;
    customer.phone = phone || customer.phone;
    customer.cnic = cnic || customer.cnic;
    customer.bookNo = bookNo || customer.bookNo;
    customer.customerId = updatedCustomerId;

    await user.save();
    res.status(200).json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    res.status(500).json({ message: 'Server error updating customer', error: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out invalid customers and sort by name
    const sortedCustomers = user.customers
      .filter(customer => customer.name && typeof customer.name === 'string')
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log('Fetched customers:', sortedCustomers);
    res.status(200).json(sortedCustomers);
  } catch (error) {
    console.error('Error in getCustomers:', error);
    res.status(500).json({ message: 'Server error fetching customers', error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const customerIndex = user.customers.findIndex((customer) => customer._id.toString() === id);
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    user.customers.splice(customerIndex, 1);
    await user.save();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    res.status(500).json({ message: 'Server error deleting customer', error: error.message });
  }
};