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
  }
}, {
  timestamps: true,
  tableName: 'postbacks'
});

module.exports = Postback;