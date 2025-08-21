const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversion = sequelize.define('Conversion', {
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
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  conversionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payoutAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isDuplicate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fraudScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true
  },
  conversionTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  referringUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'conversions',
  indexes: [
    {
      fields: ['affiliateId']
    },
    {
      fields: ['offerId']
    },
    {
      fields: ['campaignId']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['conversionTime']
    }
  ]
});

module.exports = Conversion;