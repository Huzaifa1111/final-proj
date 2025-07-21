import express from 'express';

import { saveSettings, getSettings } from '../controllers/settingsController.js';

import multer from 'multer';

import fs from 'fs';

import path from 'path';



const router = express.Router();



// Configure multer for file uploads

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const uploadDir = path.join(process.cwd(), 'uploads/');

    // Ensure upload directory exists

    if (!fs.existsSync(uploadDir)) {

      fs.mkdirSync(uploadDir, { recursive: true });

    }

    cb(null, uploadDir);

  },

  filename: (req, file, cb) => {

    // Generate unique filename with timestamp

    cb(null, `${Date.now()}-${file.originalname}`);

  },

});



const upload = multer({

  storage,

  fileFilter: (req, file, cb) => {

    // Optional: Validate file type (e.g., images only)

    const filetypes = /jpeg|jpg|png/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {

      cb(null, true);

    } else {

      cb(new Error('Only JPEG/PNG images are allowed!'), false);

    }

  },

});



// Routes for settings (now interacting with User model's settings subdocument)

router.post('/settings', upload.single('shopImage'), saveSettings); // Save user settings

router.get('/settings', getSettings); // Retrieve user settings



export { router };