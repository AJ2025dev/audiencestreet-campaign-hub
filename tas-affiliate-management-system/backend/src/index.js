const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database and models
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for uploaded assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TAS Affiliate Management System Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
// Additional routes will be added here as they are implemented
// app.use('/api/advertisers', require('./routes/advertisers'));
// app.use('/api/affiliates', require('./routes/affiliates'));
// app.use('/api/offers', require('./routes/offers'));
// app.use('/api/campaigns', require('./routes/campaigns'));
// app.use('/api/creatives', require('./routes/creatives'));
// app.use('/api/conversions', require('./routes/conversions'));
// app.use('/api/postbacks', require('./routes/postbacks'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors.map(e => e.message)
    });
  }
  
  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate entry',
      errors: err.errors.map(e => e.message)
    });
  }
  
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

module.exports = app;