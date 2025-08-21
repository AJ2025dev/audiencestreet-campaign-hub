const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Creative = sequelize.define('Creative', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('image', 'video', 'html'),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isAIgenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  generationPrompt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'archived'),
    defaultValue: 'draft'
  }
}, {
  timestamps: true,
  tableName: 'creatives',
  indexes: [
    {
      fields: ['campaignId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['isAIgenerated']
    }
  ]
});

module.exports = Creative;