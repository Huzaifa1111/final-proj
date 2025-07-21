import User from "../models/User.js";

// Add a new karigar
export const addKarigar = async (req, res) => {
  try {
    console.log("Received addKarigar request:", req.body, "Session ID:", req.session.userId);

    const { name, phone, karigarType } = req.body;

    // Validate input
    if (!name || !name.trim()) {
      console.log("Validation failed: Name is required");
      return res.status(400).json({ message: "Name is required" });
    }
    if (!phone || !phone.trim()) {
      console.log("Validation failed: Phone number is required");
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!Array.isArray(karigarType) || karigarType.length === 0) {
      console.log("Validation failed: At least one karigar type is required");
      return res.status(400).json({ message: "At least one karigar type is required" });
    }

    // Validate session
    if (!req.session.userId) {
      console.log("Session validation failed: No user ID in session");
      return res.status(401).json({ message: "Unauthorized: No active session" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("User not found for ID:", req.session.userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Generate karigar ID
    const nameInitial = name.charAt(0).toUpperCase();
    const sameInitialCount = user.karigars.filter((k) => 
      k.name && k.name.charAt(0).toUpperCase() === nameInitial
    ).length;
    const karigarId = `${nameInitial}-${(sameInitialCount + 1).toString().padStart(3, '0')}`;

    // Validate karigarType
    const validTypes = ["Shalwaar Kameez", "Coat", "Waist Coat", "Pant", "Shirt", "Kurta"];
    const invalidTypes = karigarType.filter(type => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      console.log("Validation failed: Invalid karigar types:", invalidTypes);
      return res.status(400).json({ message: `Invalid karigar types: ${invalidTypes.join(", ")}` });
    }

    const newKarigar = {
      name: name.trim(),
      phone: phone.trim(),
      karigarType,
      karigarId,
      dateCreated: new Date()
    };

    console.log("Attempting to save karigar:", newKarigar);
    user.karigars.push(newKarigar);
    await user.save();
    console.log("Karigar saved successfully:", newKarigar);

    res.status(201).json({ message: "Karigar added successfully", karigar: newKarigar });
  } catch (error) {
    console.error("Error in addKarigar:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      userId: req.session.userId
    });
    res.status(500).json({ message: "Server error adding karigar", error: error.message });
  }
};

// Get all karigars
export const getKarigars = async (req, res) => {
  try {
    console.log("Fetching karigars for user:", req.session.userId);
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("User not found for ID:", req.session.userId);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    res.json(user.karigars);
  } catch (error) {
    console.error("Error fetching karigars:", {
      message: error.message,
      stack: error.stack,
      userId: req.session.userId
    });
    res.status(500).json({ message: "Error fetching karigars", error: error.message });
  }
};

// Search karigars
export const searchKarigars = async (req, res) => {
  try {
    console.log(
      "Searching karigars with term:",
      req.query.searchTerm,
      "for user:",
      req.session.userId
    );
    const { searchTerm = "" } = req.query;
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("User not found for ID:", req.session.userId);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const lowerTerm = searchTerm.toLowerCase();
    const filteredKarigars = user.karigars.filter((karigar) => {
      const name = karigar.name || "";
      return name.toLowerCase().startsWith(lowerTerm);
    });

    res.json(filteredKarigars);
  } catch (error) {
    console.error("Error searching karigars:", {
      message: error.message,
      stack: error.stack,
      userId: req.session.userId,
      searchTerm: req.query.searchTerm
    });
    res.status(500).json({
      message: "Error searching karigars",
      error: error.message,
    });
  }
};

// Update karigar
export const updateKarigar = async (req, res) => {
  try {
    console.log("Updating karigar:", req.params.id, "with data:", req.body, "for user:", req.session.userId);
    const { id } = req.params;
    const { name, phone, karigarType } = req.body;

    // Validate input
    if (!name || !name.trim()) {
      console.log("Validation failed: Name is required");
      return res.status(400).json({ message: "Name is required" });
    }
    if (!phone || !phone.trim()) {
      console.log("Validation failed: Phone number is required");
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!Array.isArray(karigarType) || karigarType.length === 0) {
      console.log("Validation failed: At least one karigar type is required");
      return res.status(400).json({ message: "At least one karigar type is required" });
    }

    // Validate session
    if (!req.session.userId) {
      console.log("Session validation failed: No user ID in session");
      return res.status(401).json({ message: "Unauthorized: No active session" });
    }

    // Validate user
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("User not found for ID:", req.session.userId);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Find karigar
    const karigarIndex = user.karigars.findIndex((k) => k.karigarId === id);
    if (karigarIndex === -1) {
      console.log("Karigar not found for ID:", id);
      return res.status(404).json({ message: "Karigar not found" });
    }

    // Validate karigarType
    const validTypes = ["Shalwaar Kameez", "Coat", "Waist Coat", "Pant", "Shirt", "Kurta"];
    const invalidTypes = karigarType.filter(type => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      console.log("Validation failed: Invalid karigar types:", invalidTypes);
      return res.status(400).json({ message: `Invalid karigar types: ${invalidTypes.join(", ")}` });
    }

    // Update karigar
   user.karigars[karigarIndex] = {
  karigarId: user.karigars[karigarIndex].karigarId, // Keep the original karigarId
  name: name.trim(),
  phone: phone.trim(),
  karigarType,
  assignedOrders: user.karigars[karigarIndex].assignedOrders || [], // Keep assignedOrders
  dateCreated: user.karigars[karigarIndex].dateCreated // Keep dateCreated
};
user.markModified('karigars'); // Tell Mongoose the karigars array has changed
await user.save();
    // Save to database with validation///
    try {
      await user.save();
      console.log("Karigar updated successfully:", user.karigars[karigarIndex]);
      res.json({ message: "Karigar updated successfully", karigar: user.karigars[karigarIndex] });
    } catch (dbError) {
      console.error("Database error saving karigar:", {
        message: dbError.message,
        stack: dbError.stack,
        karigarId: id,
        userId: req.session.userId,
        updatedData: req.body,
        karigarBeforeUpdate: user.karigars[karigarIndex]
      });
      return res.status(500).json({ message: "Database error updating karigar", error: dbError.message });
    }
  } catch (error) {
    console.error("Error updating karigar:", {
      message: error.message,
      stack: error.stack,
      karigarId: req.params.id,
      userId: req.session.userId,
      requestBody: req.body
    });
    res.status(500).json({ message: "Error updating karigar", error: error.message });
  }
};

// Delete karigar
export const deleteKarigar = async (req, res) => {
  try {
    console.log("Deleting karigar:", req.params.id);
    const { id } = req.params;
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("User not found for ID:", req.session.userId);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const karigarIndex = user.karigars.findIndex((k) => k.karigarId === id);
    if (karigarIndex === -1) {
      console.log("Karigar not found for ID:", id);
      return res.status(404).json({ message: "Karigar not found" });
    }

    user.karigars.splice(karigarIndex, 1);
    await user.save();
    console.log("Karigar deleted successfully:", id);
    res.json({ message: "Karigar deleted successfully" });
  } catch (error) {
    console.error("Error deleting karigar:", {
      message: error.message,
      stack: error.stack,
      karigarId: req.params.id,
      userId: req.session.userId
    });
    res.status(500).json({ message: "Error deleting karigar", error: error.message });
  }
};