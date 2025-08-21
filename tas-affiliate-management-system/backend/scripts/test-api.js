#!/usr/bin/env node

/**
 * API testing script for TAS Affiliate Management System
 * This script tests the main API endpoints to ensure they're working correctly
 */

const axios = require('axios');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// API configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = 5000;

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

// Log functions
const log = {
  info: (msg) => console.log(`${colors.cyan}INFO:${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}SUCCESS:${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}WARN:${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}ERROR:${colors.reset} ${msg}`)
};

// Test user credentials (for testing purposes only)
const testUser = {
  email: 'test@example.com',
  password: 'TestPass123!',
  firstName: 'Test',
  lastName: 'User',
  role: 'advertiser'
};

// Axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to test API health endpoint
async function testHealthEndpoint() {
  log.info('Testing health endpoint...');
  
  try {
    const response = await api.get('/health');
    
    if (response.status === 200 && response.data.status === 'OK') {
      log.success('Health endpoint is working correctly');
      return true;
    } else {
      log.error('Health endpoint returned unexpected response');
      return false;
    }
  } catch (error) {
    log.error(`Health endpoint test failed: ${error.message}`);
    return false;
  }
}

// Function to test user registration
async function testUserRegistration() {
  log.info('Testing user registration...');
  
  try {
    const response = await api.post('/api/auth/register', testUser);
    
    if (response.status === 201 && response.data.status === 'success') {
      log.success('User registration successful');
      return response.data.data.token; // Return token for subsequent tests
    } else {
      log.error('User registration returned unexpected response');
      return null;
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log.warn('User may already exist, trying login instead');
      return null;
    } else {
      log.error(`User registration failed: ${error.message}`);
      return null;
    }
  }
}

// Function to test user login
async function testUserLogin() {
  log.info('Testing user login...');
  
  try {
    const response = await api.post('/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.status === 200 && response.data.status === 'success') {
      log.success('User login successful');
      return response.data.data.token; // Return token for subsequent tests
    } else {
      log.error('User login returned unexpected response');
      return null;
    }
  } catch (error) {
    log.error(`User login failed: ${error.message}`);
    return null;
  }
}

// Function to test user profile retrieval
async function testUserProfile(token) {
  log.info('Testing user profile retrieval...');
  
  try {
    const response = await api.get('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200 && response.data.status === 'success') {
      log.success('User profile retrieval successful');
      return true;
    } else {
      log.error('User profile retrieval returned unexpected response');
      return false;
    }
  } catch (error) {
    log.error(`User profile retrieval failed: ${error.message}`);
    return false;
  }
}

// Function to run all tests
async function runAllTests() {
  log.info('Starting API tests for TAS Affiliate Management System...');
  
  // Test 1: Health endpoint
  const healthOk = await testHealthEndpoint();
  if (!healthOk) {
    log.error('API tests failed: Health endpoint not responding');
    process.exit(1);
  }
  
  // Test 2: User registration or login
  let token = await testUserRegistration();
  if (!token) {
    token = await testUserLogin();
  }
  
  if (!token) {
    log.warn('Could not obtain authentication token, skipping authenticated tests');
  } else {
    // Test 3: User profile retrieval
    await testUserProfile(token);
  }
  
  log.success('API tests completed');
}

// Main function
async function main() {
  try {
    await runAllTests();
    log.info('All API tests passed!');
  } catch (error) {
    log.error(`API tests failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  main().catch((error) => {
    log.error(`Test script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testHealthEndpoint,
  testUserRegistration,
  testUserLogin,
  testUserProfile,
  runAllTests
};