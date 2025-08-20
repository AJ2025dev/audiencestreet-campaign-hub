// Environment-based configuration
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
      secret: process.env.JWT_SECRET || 'tas_affiliate_jwt_secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    server: {
      port: process.env.PORT || 3000
    }
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: 'postgres'
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    server: {
      port: process.env.PORT || 3000
    }
  }
};

// Export configuration based on environment
module.exports = config[process.env.NODE_ENV || 'development'];