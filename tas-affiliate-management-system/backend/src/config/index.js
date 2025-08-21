// Environment-based configuration
require('dotenv').config();

const config = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || 'tas_affiliate_dev',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      dialect: 'postgres'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'tas_affiliate_jwt_secret_dev',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    server: {
      port: process.env.PORT || 3000
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || null
    },
    email: {
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      user: process.env.EMAIL_USER || 'user@example.com',
      password: process.env.EMAIL_PASSWORD || 'password'
    },
    api: {
      baseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },
  test: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || 'tas_affiliate_test',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      dialect: 'postgres'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'tas_affiliate_jwt_secret_test',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    },
    server: {
      port: process.env.PORT || 3001
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || null
    },
    email: {
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      user: process.env.EMAIL_USER || 'user@example.com',
      password: process.env.EMAIL_PASSWORD || 'password'
    },
    api: {
      baseUrl: process.env.API_BASE_URL || 'http://localhost:3001'
    }
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    server: {
      port: process.env.PORT || 3000
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD || null
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD
    },
    api: {
      baseUrl: process.env.API_BASE_URL
    }
  }
};

// Export configuration based on environment
module.exports = config[process.env.NODE_ENV || 'development'];