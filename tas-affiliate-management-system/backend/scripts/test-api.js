#!/usr/bin/env node

const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:3000';
  const api = axios.create({
    baseURL,
    timeout: 5000,
  });

  console.log('Testing TAS Affiliate Management System API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await api.get('/health');
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Message: ${healthResponse.data.message}\n`);

    // Test auth endpoints
    console.log('2. Testing auth endpoints...');
    
    // Test register endpoint
    try {
      const registerResponse = await api.post('/api/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        role: 'advertiser',
        firstName: 'Test',
        lastName: 'User'
      });
      console.log(`   Register Status: ${registerResponse.status}`);
      console.log(`   Register Message: ${registerResponse.data.message}\n`);
    } catch (error) {
      if (error.response) {
        console.log(`   Register Status: ${error.response.status}`);
        console.log(`   Register Error: ${error.response.data.message || error.response.data}\n`);
      } else {
        console.log(`   Register Error: ${error.message}\n`);
      }
    }

    // Test login endpoint
    try {
      const loginResponse = await api.post('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log(`   Login Status: ${loginResponse.status}`);
      console.log(`   Login Message: ${loginResponse.data.message}\n`);
    } catch (error) {
      if (error.response) {
        console.log(`   Login Status: ${error.response.status}`);
        console.log(`   Login Error: ${error.response.data.message || error.response.data}\n`);
      } else {
        console.log(`   Login Error: ${error.message}\n`);
      }
    }

    console.log('API tests completed!');
  } catch (error) {
    console.error('Error testing API:', error.message);
    process.exit(1);
  }
}

// Run the test function
testAPI();