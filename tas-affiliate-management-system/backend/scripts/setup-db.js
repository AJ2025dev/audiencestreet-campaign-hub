#!/usr/bin/env node

const { sequelize } = require('../src/models');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Sync all models to the database
    await sequelize.sync({ alter: true });
    
    console.log('Database setup completed successfully!');
    console.log('Tables created:');
    console.log('- users');
    console.log('- advertisers');
    console.log('- affiliates');
    console.log('- offers');
    console.log('- campaigns');
    console.log('- creatives');
    console.log('- conversions');
    console.log('- postbacks');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup function
setupDatabase();