const User = require('./User');
const Advertiser = require('./Advertiser');
const Affiliate = require('./Affiliate');
const Offer = require('./Offer');
const Campaign = require('./Campaign');
const Creative = require('./Creative');
const Conversion = require('./Conversion');
const Postback = require('./Postback');
const sequelize = require('../config/database');

// Set up model associations
User.hasOne(Advertiser, {
  foreignKey: 'userId',
  as: 'advertiser'
});

User.hasOne(Affiliate, {
  foreignKey: 'userId',
  as: 'affiliate'
});

Advertiser.hasMany(Offer, {
  foreignKey: 'advertiserId',
  as: 'offers'
});

Advertiser.hasMany(Campaign, {
  foreignKey: 'advertiserId',
  as: 'campaigns'
});

Offer.belongsTo(Advertiser, {
  foreignKey: 'advertiserId',
  as: 'advertiser'
});

Offer.hasMany(Postback, {
  foreignKey: 'offerId',
  as: 'postbacks'
});

Campaign.belongsTo(Advertiser, {
  foreignKey: 'advertiserId',
  as: 'advertiser'
});

Campaign.hasMany(Creative, {
  foreignKey: 'campaignId',
  as: 'creatives'
});

Creative.belongsTo(Campaign, {
  foreignKey: 'campaignId',
  as: 'campaign'
});

Affiliate.hasMany(Postback, {
  foreignKey: 'affiliateId',
  as: 'postbacks'
});

Postback.belongsTo(Affiliate, {
  foreignKey: 'affiliateId',
  as: 'affiliate'
});

Postback.belongsTo(Offer, {
  foreignKey: 'offerId',
  as: 'offer'
});

Offer.hasMany(Conversion, {
  foreignKey: 'offerId',
  as: 'conversions'
});

Affiliate.hasMany(Conversion, {
  foreignKey: 'affiliateId',
  as: 'conversions'
});

Campaign.hasMany(Conversion, {
  foreignKey: 'campaignId',
  as: 'conversions'
});

Conversion.belongsTo(Offer, {
  foreignKey: 'offerId',
  as: 'offer'
});

Conversion.belongsTo(Affiliate, {
  foreignKey: 'affiliateId',
  as: 'affiliate'
});

Conversion.belongsTo(Campaign, {
  foreignKey: 'campaignId',
  as: 'campaign'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Advertiser,
  Affiliate,
  Offer,
  Campaign,
  Creative,
  Conversion,
  Postback
};