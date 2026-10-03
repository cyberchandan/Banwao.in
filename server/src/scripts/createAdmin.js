require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES } = require('../config/constants');
const connectDB = require('../config/db');

const createAdmin = async () => {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Banwao Super Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@banwao.in';
  const password = process.env.ADMIN_PASSWORD || 'AdminPass123!';
  const phone = process.env.ADMIN_PHONE || '+919876543210';

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Admin account '${email}' already exists.`);
      process.exit(0);
    }

    const passwordHash = await User.hashPassword(password);
    const admin = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: ROLES.ADMIN
    });

    console.log(`✅ Admin account created successfully!`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Admin creation failed: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
