const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const { Schema } = mongoose;

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  email: { type: String },
  givenName: { type: String },
  familyName: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } });

schema.virtual('id').get(function () {
  return this._id;
});

schema.set('toJSON', {
  virtuals: true,
});

schema.pre('save', (next) => {
  this.updated = new Date();
  next();
});

module.exports = mongoose.model('users', schema);
