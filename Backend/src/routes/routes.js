import express from "express";

import bcrypt from "bcrypt";

import User from "../models/User.js";

import { saveSettings, getSettings } from "../controllers/settingsController.js";

import { addCustomer, searchCustomers, updateCustomer, getCustomers, deleteCustomer } from "../controllers/customerController.js";

import { addKarigar, searchKarigars, updateKarigar, getKarigars, deleteKarigar } from "../controllers/karigarController.js";

import { createOrder, getOrders, updateOrder, deleteOrder, getSubOrders, searchOrders } from "../controllers/orderController.js";

import multer from "multer";

import fs from "fs";

import path from "path";

import { isAuthenticated } from "../middlewares/middleware.js";



const router = express.Router();



const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const uploadDir = path.join(process.cwd(), 'Uploads/');

    if (!fs.existsSync(uploadDir)) {

      fs.mkdirSync(uploadDir, { recursive: true });

    }

    cb(null, uploadDir);

  },

  filename: (req, file, cb) => {

    cb(null, `${Date.now()}-${file.originalname}`);

  },

});



const upload = multer({

  storage,

  fileFilter: (req, file, cb) => {

    const filetypes = /jpeg|jpg|png/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {

      cb(null, true);

    } else {

      console.error('File upload rejected:', { originalname: file.originalname, mimetype: file.mimetype });

      cb(new Error('Only JPEG/PNG images are allowed!'), false);

    }

  },

});



// Login or Register

router.post("/login", async (req, res) => {

  const { username, password, saveCredentials } = req.body;

  try {

    // Validate input

    if (!username || !password) {

      return res.status(400).json({ message: "Username and password are required" });

    }



    let user = await User.findOne({ username });

    if (user) {

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {

        return res.status(401).json({ message: "Incorrect password" });

      }

      req.session.userId = user._id;

      // Update only specific fields to avoid validating the entire document

      await User.updateOne(

        { _id: user._id },

        {

          $set: {

            saveCredentials: saveCredentials || false,

            savedUsername: saveCredentials ? username : null,

            savedPlainPassword: saveCredentials ? password : null,

          },

        }

      );

      return res.json({ message: "Logged in successfully", isLoggedIn: true });

    }



    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ 

      username, 

      password: hashedPassword,

      saveCredentials: saveCredentials || false,

      savedUsername: saveCredentials ? username : null,

      savedPlainPassword: saveCredentials ? password : null

    });

    await user.save();

    req.session.userId = user._id;

    res.json({ message: "User created and logged in successfully", isLoggedIn: true });

  } catch (error) {

    console.error('Login error:', {

      message: error.message,

      stack: error.stack,

      username,

      saveCredentials

    });

    if (error.code === 11000) {

      return res.status(400).json({ message: "Email already in use" });

    }

    res.status(500).json({ 

      message: "Server error during login", 

      error: error.message,

      stack: error.stack // Remove in production

    });

  }

});



// Check session

router.get("/check-session", (req, res) => {

  if (req.session.userId) {

    res.json({ isLoggedIn: true });

  } else {

    res.json({ isLoggedIn: false });

  }

});



// Logout

router.post("/logout", async (req, res) => {

  try {

    const user = await User.findById(req.session.userId);

    if (user && !user.saveCredentials) {

      await User.updateOne(

        { _id: user._id },

        {

          $set: {

            savedUsername: null,

            savedPlainPassword: null,

          },

        }

      );

    }

    req.session.destroy();

    res.json({ message: "Logged out successfully", isLoggedIn: false });

  } catch (error) {

    console.error('Logout error:', {

      message: error.message,

      stack: error.stack

    });

    res.status(500).json({ 

      message: "Error logging out", 

      error: error.message,

      stack: error.stack // Remove in production

    });

  }

});



// Get saved credentials by username (for non-logged-in users)

router.post("/get-saved-credentials", async (req, res) => {

  try {

    const { username } = req.body;

    const user = await User.findOne({ username });

    if (user && user.saveCredentials && user.savedUsername) {

      res.json({ 

        savedUsername: user.savedUsername,

        savedPlainPassword: user.savedPlainPassword,

        hasSavedCredentials: true

      });

    } else {

      res.json({ hasSavedCredentials: false });

    }

  } catch (error) {

    console.error('Get saved credentials error:', {

      message: error.message,

      stack: error.stack

    });

    res.status(500).json({ 

      message: "Server error fetching saved credentials", 

      error: error.message,

      stack: error.stack // Remove in production

    });

  }

});



// Customer routes

router.post("/customers", isAuthenticated, addCustomer);

router.get("/customers", isAuthenticated, getCustomers);

router.get("/customers/search", isAuthenticated, searchCustomers);

router.put("/customers/:id", isAuthenticated, updateCustomer);

router.delete("/customers/:id", isAuthenticated, deleteCustomer);



// Karigar routes

router.post("/karigars", isAuthenticated, addKarigar);

router.get("/karigars", isAuthenticated, getKarigars);

router.get("/karigars/search", isAuthenticated, searchKarigars);

router.put("/karigars/:id", isAuthenticated, updateKarigar);

router.delete("/karigars/:id", isAuthenticated, deleteKarigar);



// Order routes

router.post("/orders", isAuthenticated, createOrder);

router.get("/orders", isAuthenticated, getOrders);

router.get("/orders/search", isAuthenticated, searchOrders); // Added search route

router.put("/orders/:id", isAuthenticated, updateOrder);

router.delete("/orders/:id", isAuthenticated, deleteOrder);

router.get("/orders/suborders", isAuthenticated, getSubOrders);



// Routes for settings

router.post("/settings", isAuthenticated, upload.single("shopImage"), saveSettings);

router.get("/settings", isAuthenticated, getSettings);



// Dashboard route

router.get("/dashboard", isAuthenticated, (req, res) => {

  res.json({ message: "Welcome to the dashboard!" });

});



export default router;