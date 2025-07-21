import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

export const saveSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found in session' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      pantPrice,
      pantCoatPrice,
      waistCoatPrice,
      coatPrice,
      shalwarKameezPrice,
      shirtPrice,
      shopAddress,
      shopPhoneNumber,
      shopName,
      termsAndCondition,
    } = req.body;

    let shopImagePath = user.settings?.shopImage || null;
    if (req.file) {
      if (user.settings?.shopImage) {
        const oldImagePath = path.join(process.cwd(), user.settings.shopImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      shopImagePath = `/uploads/${req.file.filename}`;
    }

    user.settings = {
      pantPrice: pantPrice || user.settings?.pantPrice || '',
      pantCoatPrice: pantCoatPrice || user.settings?.pantCoatPrice || '',
      waistCoatPrice: waistCoatPrice || user.settings?.waistCoatPrice || '',
      coatPrice: coatPrice || user.settings?.coatPrice || '',
      shalwarKameezPrice: shalwarKameezPrice || user.settings?.shalwarKameezPrice || '',
      shirtPrice: shirtPrice || user.settings?.shirtPrice || '',
      shopAddress: shopAddress || user.settings?.shopAddress || '',
      shopPhoneNumber: shopPhoneNumber || user.settings?.shopPhoneNumber || '',
      shopName: shopName || user.settings?.shopName || '',
      termsAndCondition: termsAndCondition || user.settings?.termsAndCondition || '',
      shopImage: shopImagePath,
    };

    await user.save();
    res.status(200).json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error in saveSettings:', {
      message: error.message,
      stack: error.stack,
    });
    if (error.message.includes('Only JPEG/PNG images are allowed')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error saving settings', error: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found in session' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure the image path is a full URL
    const settings = user.settings || {};
    if (settings.shopImage) {
      settings.shopImage = `${req.protocol}://${req.get('host')}${settings.shopImage}`;
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error in getSettings:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error retrieving settings', error: error.message });
  }
};