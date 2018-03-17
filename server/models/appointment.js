const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let appointment = Schema({
    doctor: String,
    patient: String,
    time: {type: Date },
    duration: Number,
    createTime: { type: Date, default: Date.now }
});

module.exports = {
  'AppointmentSchema': appointment,
  'Appointment': mongoose.model('Appointment', appointment)
};
