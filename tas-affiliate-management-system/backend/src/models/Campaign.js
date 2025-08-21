const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
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
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'completed'),
    defaultValue: 'draft'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  budget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  dailyBudget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  targeting: {
    type: DataTypes.JSON,
    allowNull: true
  },
  biddingStrategy: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'campaigns',
  indexes: [
    {
      fields: ['advertiserId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['startDate', 'endDate']
    }
  ]
});

module.exports = Campaign;