const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Affiliate = sequelize.define('Affiliate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  websiteUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  affiliateNetwork: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'affiliates',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['companyName']
    }
  ]
});

module.exports = Affiliate;