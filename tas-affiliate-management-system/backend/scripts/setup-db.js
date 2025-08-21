#!/usr/bin/env node

/**
 * Database setup script for TAS Affiliate Management System
 * This script creates the database and runs initial migrations
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  name: process.env.DB_NAME || 'tas_affiliate_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
};

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

// Function to execute shell commands
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: options.stdio || 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    if (!options.ignoreErrors) {
      throw error;
    }
    return null;
  }
}

// Function to check if PostgreSQL is installed
function checkPostgres() {
  try {
    execCommand('which psql', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check if database exists
async function databaseExists() {
  try {
    const command = `PGPASSWORD=${dbConfig.password} psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbConfig.name}'"`;
    const result = execCommand(command, { stdio: 'pipe' });
    return result.toString().trim() === '1';
  } catch (error) {
    return false;
  }
}

// Function to create database
async function createDatabase() {
  log.info(`Creating database ${dbConfig.name}...`);
  
  try {
    // Connect to postgres database to create new database
    const command = `PGPASSWORD=${dbConfig.password} psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d postgres -c "CREATE DATABASE ${dbConfig.name};"`;
    execCommand(command);
    log.success(`Database ${dbConfig.name} created successfully`);
  } catch (error) {
    log.error(`Failed to create database: ${error.message}`);
    process.exit(1);
  }
}

// Function to run migrations
async function runMigrations() {
  log.info('Running database migrations...');
  
  try {
    // Change to backend directory
    const backendDir = path.resolve(__dirname, '..');
    process.chdir(backendDir);
    
    // Run Sequelize migrations
    execCommand('npx sequelize-cli db:migrate');
    log.success('Database migrations completed successfully');
  } catch (error) {
    log.error(`Failed to run migrations: ${error.message}`);
    process.exit(1);
  }
}

// Function to seed database
async function seedDatabase() {
  log.info('Seeding database with initial data...');
  
  try {
    // Change to backend directory
    const backendDir = path.resolve(__dirname, '..');
    process.chdir(backendDir);
    
    // Run Sequelize seeders
    execCommand('npx sequelize-cli db:seed:all');
    log.success('Database seeding completed successfully');
  } catch (error) {
    log.error(`Failed to seed database: ${error.message}`);
    process.exit(1);
  }
}

// Main setup function
async function main() {
  log.info('Starting TAS Affiliate Management System database setup...');
  
  // Check if PostgreSQL is installed
  if (!checkPostgres()) {
    log.error('PostgreSQL is not installed or not in PATH');
    process.exit(1);
  }
  
  // Check if database already exists
  const exists = await databaseExists();
  if (exists) {
    log.warn(`Database ${dbConfig.name} already exists`);
  } else {
    await createDatabase();
  }
  
  // Run migrations
  await runMigrations();
  
  // Seed database
  await seedDatabase();
  
  log.success('Database setup completed successfully!');
  log.info('You can now start the application with: npm run dev');
}

// Run the setup
if (require.main === module) {
  main().catch((error) => {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  databaseExists,
  createDatabase,
  runMigrations,
  seedDatabase
};