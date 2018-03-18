const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const morgan = require('morgan');
const {Appointment} = require('../models/appointment');
mongoose.Promise = bluebird;
const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

let config = {};

try {
  config = yaml.safeLoad(fs.readFileSync('../config/app.yml', 'utf-8'));
} catch (e) {
  console.log(e);
}

app.use( (req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin',null);
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type');
  next();
});

try {
  mongoose.connect(config.database.uri, {autoIndex: false});
  console.log(`Mongo Connection Success: ${config.database.uri}`);
} catch(e){
  console.log('Failed to connect to DB', e);
}

app.post('/appointment', (req, res) => {
  let appointment = new Appointment(req.body);
  appointment.save(function(err) {
    if (err)
      return res.status(500);
    return res.json({_id: appointment._id});
  });
});

app.set('port', process.env.APPOINTMENT_PORT || config.ports.appointment);

app.listen(app.get('port'), function(){
  console.log(`Listening on port: ${app.get('port')}`);
});
