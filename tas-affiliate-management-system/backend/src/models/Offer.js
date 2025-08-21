const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  advertiserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'advertisers',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  payoutType: {
    type: DataTypes.ENUM('cpc', 'cpa', 'cpl', 'cps'),
    allowNull: false
  },
  payoutAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'archived'),
    defaultValue: 'draft'
  },
  trackingUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  previewUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  conversionPixel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cookieDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 30 // days
  }
}, {
  timestamps: true,
  tableName: 'offers',
  indexes: [
    {
      fields: ['advertiserId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Offer;