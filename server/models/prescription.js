const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let prescription = Schema({
  name: String,
  for: String,
  duration: String,
  type: {type: String, enum: ['liquid', 'tablet', 'capsule', 'topical', 'suppository', 'drop', 'injection', 'inhaler', 'patch'], required: true},
  dosage: Number,
  createTime: { type: Date, default: Date.now},
});

module.exports = {
  'PrescriptionSchema': prescription,
  'Prescription': mongoose.model('Prescription', prescription)
};
