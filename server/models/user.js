const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {PrescriptionSchema} = require('./prescription');
const {AppointmentSchema, Appointment} = require('./appointment');

let user = Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    type: { type: String, enum: ['patient', 'doctor', 'admin'], default: "patient"},
    prescriptions: [PrescriptionSchema],
    patients: [String],
    appointments: [{
      type: Schema.Types.ObjectId,
      ref: 'Appointment'
    }],
    permissions: { type: Array},
    createTime: { type: Date, default: Date.now},
    active: {type: Boolean, default: true}
});

module.exports = {
  'UserSchema': user,
  'User': mongoose.model('User', user)
};
