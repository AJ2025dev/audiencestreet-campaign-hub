const { User, Advertiser, Affiliate } = require('../models');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

/**
 * Register a new user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, companyDetails } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await User.create({
      email,
      passwordHash,
      role,
      firstName,
      lastName
    });
    
    // Create role-specific profile
    if (role === 'advertiser' && companyDetails) {
      await Advertiser.create({
        userId: user.id,
        companyName: companyDetails.companyName,
        websiteUrl: companyDetails.websiteUrl,
        contactEmail: email,
        contactPhone: companyDetails.contactPhone,
        billingAddress: companyDetails.billingAddress
      });
    } else if (role === 'affiliate' && companyDetails) {
      await Affiliate.create({
        userId: user.id,
        companyName: companyDetails.companyName,
        websiteUrl: companyDetails.websiteUrl,
        contactEmail: email,
        contactPhone: companyDetails.contactPhone,
        paymentDetails: companyDetails.paymentDetails
      });
    }
    
    // Generate token
    const token = generateToken({ id: user.id, role: user.role });
    
    // Return user data without password hash
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Login user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken({ id: user.id, role: user.role });
    
    // Return user data without password hash
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get current user profile
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    // Get user with associated profile based on role
    let user;
    if (req.user.role === 'advertiser') {
      user = await User.findByPk(req.user.id, {
        include: [{
          model: Advertiser,
          as: 'advertiser'
        }]
      });
    } else if (req.user.role === 'affiliate') {
      user = await User.findByPk(req.user.id, {
        include: [{
          model: Affiliate,
          as: 'affiliate'
        }]
      });
    } else {
      user = await User.findByPk(req.user.id);
    }
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Remove password hash from response
    const userData = user.toJSON();
    delete userData.passwordHash;
    
    res.status(200).json({
      status: 'success',
      data: {
        user: userData
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};