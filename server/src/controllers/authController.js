const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ContractorProfile = require('../models/ContractorProfile');
const { ROLES, CONTRACTOR_STATUS } = require('../config/constants');
const { logActivity } = require('../services/auditService');

// Helper to generate JWT token and cookie
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_banwao_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token, // Also return token for clients using Bearer header
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
};

// @desc    Register Customer
// @route   POST /api/v1/auth/register-customer
// @access  Public
exports.registerCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: ROLES.CUSTOMER
    });

    await logActivity({
      actorId: user._id,
      actorRole: user.role,
      action: 'CUSTOMER_REGISTERED',
      entityType: 'User',
      entityId: user._id
    });

    sendTokenResponse(user, 201, res, 'Customer account registered successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Register Contractor
// @route   POST /api/v1/auth/register-contractor
// @access  Public
exports.registerContractor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      businessName,
      experienceYears,
      skills,
      categories,
      serviceAreas,
      description
    } = req.body;

    if (!name || !email || !phone || !password || !businessName || experienceYears === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields including business name and experience' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: ROLES.CONTRACTOR
    });

    // Create associated contractor profile in pending state
    const profile = await ContractorProfile.create({
      userId: user._id,
      businessName,
      experienceYears: Number(experienceYears),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      categories: Array.isArray(categories) ? categories : [],
      serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : (serviceAreas ? serviceAreas.split(',').map(s => s.trim()) : ['Noida', 'Greater Noida']),
      description: description || '',
      verificationStatus: CONTRACTOR_STATUS.PENDING
    });

    await logActivity({
      actorId: user._id,
      actorRole: user.role,
      action: 'CONTRACTOR_REGISTERED',
      entityType: 'ContractorProfile',
      entityId: profile._id
    });

    sendTokenResponse(user, 201, res, 'Contractor registration submitted for admin approval');
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get Current User Profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let contractorProfile = null;

    if (user.role === ROLES.CONTRACTOR) {
      contractorProfile = await ContractorProfile.findOne({ userId: user._id })
        .populate('categories');
    }

    res.status(200).json({
      success: true,
      user,
      contractorProfile
    });
  } catch (error) {
    next(error);
  }
};
