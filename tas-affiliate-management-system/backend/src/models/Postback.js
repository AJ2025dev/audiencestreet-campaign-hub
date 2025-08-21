const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Postback = sequelize.define('Postback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  affiliateId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'affiliates',
      key: 'id'
    }
  },
  offerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'offers',
      key: 'id'
    }
  },
  postbackUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('GET', 'POST'),
    defaultValue: 'GET'
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: true
  },
  parameters: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastSuccess: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failureCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxRetries: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  timeout: {
    type: DataTypes.INTEGER,
    defaultValue: 30 // seconds
  },
  customParameters: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'postbacks',
  indexes: [
    {
      fields: ['affiliateId']
    },
    {
      fields: ['offerId']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Postback;