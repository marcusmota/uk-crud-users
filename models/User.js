const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  email:  {type: String},
  givenName:  {type: String},
  familyName:  {type: String},
  created: {type: Date, default: Date.now },  
  updated: {type: Date, default: Date.now },
}, { timestamps: { createdAt: 'created', updatedAt : 'updated' } });

schema.virtual('id').get(function(){
  return this._id.toHexString();
});

schema.set('toJSON', {
  virtuals: true
});

schema.pre('save', (next) => {
  this.updated = new Date();
  next();
});

module.exports = mongoose.model('users', schema);
