const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token invalidation)
 * @access Private
 */
router.post('/logout', authenticate, (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  // Server-side we could add the token to a blacklist if needed
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh JWT token
 * @access Private
 */
router.post('/refresh', authenticate, (req, res) => {
  // Generate new token with extended expiration
  const newToken = require('../utils/auth').generateToken({
    id: req.user.id,
    role: req.user.role
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      token: newToken
    }
  });
});

module.exports = router;