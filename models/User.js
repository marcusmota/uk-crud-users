const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  email:  {type: String},
  givenName:  {type: String},
  familyName:  {type: String},
  created: {type: Date, default: Date.now },
  updated: {type: Date, default: Date.now },
}, { timestamps: { createdAt: 'created', updatedAt : 'updated' } });

module.exports = mongoose.model('users', schema);
